import path from 'path';
import { promises as fs } from 'fs';
import type { Dirent } from 'fs';
import yaml from 'js-yaml';
import type { ResortSummary } from '@/lib/types/resort';

export type ResortMetadata = ResortSummary;

interface CacheEntry {
  expiresAt: number;
  data: ResortMetadata | null;
}

/**
 * ResortClient
 *
 * - 先查記憶體快取（TTL）
 * - 有設定 RESORT_API_BASE_URL 時呼叫 FastAPI 服務
 * - 否則 fallback 到 specs/resort-services/data 的 YAML
 */
class ResortClient {
  private cache = new Map<string, CacheEntry>();
  private ttlMs = Number(process.env.RESORT_CACHE_TTL_MS ?? 5 * 60 * 1000);
  private localDataset: Map<string, ResortMetadata> | null = null;

  async getResorts(resortIds: string[]): Promise<Record<string, ResortMetadata>> {
    const deduped = Array.from(new Set(resortIds.filter((id): id is string => Boolean(id))));

    const result: Record<string, ResortMetadata> = {};
    for (const resortId of deduped) {
      const data = await this.getResort(resortId);
      if (data) {
        result[resortId] = data;
      }
    }
    return result;
  }

  async getResort(resortId: string): Promise<ResortMetadata | null> {
    if (!resortId) return null;

    const cached = this.cache.get(resortId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const data = await this.fetchResort(resortId);
    this.cache.set(resortId, { data, expiresAt: Date.now() + this.ttlMs });
    return data;
  }

  async searchResorts(params: { q?: string; region?: string; limit?: number } = {}): Promise<ResortMetadata[]> {
    const base = process.env.RESORT_API_BASE_URL;
    if (base) {
      const viaApi = await this.searchViaApi(base, params);
      if (viaApi) return viaApi;
    }

    return this.searchLocally(params);
  }

  private async fetchResort(resortId: string): Promise<ResortMetadata | null> {
    const fromApi = await this.fetchFromApi(resortId);
    if (fromApi) return fromApi;

    return this.fetchFromFilesystem(resortId);
  }

  private async fetchFromApi(resortId: string): Promise<ResortMetadata | null> {
    const base = process.env.RESORT_API_BASE_URL;
    if (!base) return null;

    try {
      const normalized = base.endsWith('/') ? base.slice(0, -1) : base;
      const res = await fetch(`${normalized}/resorts/${encodeURIComponent(resortId)}`, {
        headers: { 'Accept': 'application/json' },
      });

      if (res.status === 404) {
        return null;
      }

      if (!res.ok) {
        throw new Error(`Resort API error ${res.status}`);
      }

      const payload = await res.json();
      return this.toMetadata(payload);
    } catch (error) {
      console.warn(`[resort-client] Failed to fetch from API: ${(error as Error).message}`);
      return null;
    }
  }

  private async fetchFromFilesystem(resortId: string): Promise<ResortMetadata | null> {
    const dataset = await this.loadLocalDataset();
    return dataset.get(resortId) ?? null;
  }

  private async loadLocalDataset(): Promise<Map<string, ResortMetadata>> {
    if (this.localDataset) {
      return this.localDataset;
    }

    const dataDir = process.env.RESORT_DATA_DIR
      ? path.resolve(process.env.RESORT_DATA_DIR)
      : path.resolve(process.cwd(), '..', 'specs', 'resort-services', 'data');

    const dataset = new Map<string, ResortMetadata>();

    async function walk(dir: string) {
      let entries: Dirent[];
      try {
        entries = await fs.readdir(dir, { withFileTypes: true });
      } catch {
        return;
      }

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.yaml')) {
          const raw = await fs.readFile(fullPath, 'utf-8');
          const payload = yaml.load(raw) as any;
          if (payload?.resort_id) {
            dataset.set(payload.resort_id, {
              resort_id: payload.resort_id,
              name: payload.names?.zh ?? payload.names?.en ?? payload.resort_id,
              region: payload.region ?? '',
              country_code: payload.country_code ?? '',
              timezone: payload.timezone ?? null,
              tagline: payload.description?.tagline ?? null,
            });
          }
        }
      }
    }

    await walk(dataDir);
    this.localDataset = dataset;
    return dataset;
  }

  private async searchViaApi(base: string, params: { q?: string; region?: string; limit?: number }): Promise<ResortMetadata[] | null> {
    try {
      const normalized = base.endsWith('/') ? base.slice(0, -1) : base;
      const url = new URL(`${normalized}/resorts`);
      if (params.q) url.searchParams.set('q', params.q);
      if (params.region) url.searchParams.set('region', params.region);
      url.searchParams.set('limit', String(params.limit ?? 10));
      url.searchParams.set('offset', '0');

      const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
      if (!res.ok) {
        console.warn(`[resort-client] Resort list API error ${res.status}`);
        return null;
      }

      const payload = await res.json();
      if (!Array.isArray(payload?.items)) return null;

      return payload.items.map((item: any) => ({
        resort_id: item.resort_id,
        name: item.names?.zh ?? item.names?.en ?? item.resort_id,
        region: item.region ?? '',
        country_code: item.country_code ?? '',
        timezone: null,
        tagline: item.tagline ?? null,
      }));
    } catch (error) {
      console.warn(`[resort-client] Failed to search via API`, error);
      return null;
    }
  }

  private async searchLocally(params: { q?: string; region?: string; limit?: number }): Promise<ResortMetadata[]> {
    const dataset = await this.loadLocalDataset();
    let values = Array.from(dataset.values());

    if (params.region) {
      values = values.filter((r) => r.region.toLowerCase().includes(params.region!.toLowerCase()));
    }
    if (params.q) {
      const keyword = params.q.toLowerCase();
      values = values.filter(
        (r) =>
          r.name.toLowerCase().includes(keyword) ||
          r.region.toLowerCase().includes(keyword) ||
          r.resort_id.toLowerCase().includes(keyword)
      );
    }

    return values.slice(0, params.limit ?? 10);
  }

  private toMetadata(payload: any): ResortMetadata {
    return {
      resort_id: payload.resort_id,
      name: payload.names?.zh ?? payload.names?.en ?? payload.resort_id,
      region: payload.region ?? '',
      country_code: payload.country_code ?? '',
      timezone: payload.timezone ?? null,
      tagline: payload.description?.tagline ?? null,
    };
  }
}

export const resortClient = new ResortClient();
