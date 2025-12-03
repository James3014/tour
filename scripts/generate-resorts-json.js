#!/usr/bin/env node

/**
 * 將 specs/resort-services/data 下的 YAML 匯出成
 * `lib/data/resorts.generated.json`，作為 Resort API 的離線 fallback。
 *
 * 使用方式：
 *   node scripts/generate-resorts-json.js
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function resolveDataDir() {
  if (process.env.RESORT_DATA_DIR) {
    return path.resolve(process.env.RESORT_DATA_DIR);
  }

  return path.resolve(__dirname, '..', '..', 'specs', 'resort-services', 'data');
}

function collectYamlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectYamlFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.yaml')) {
      files.push(fullPath);
    }
  }

  return files;
}

function toMetadata(payload) {
  return {
    resort_id: payload.resort_id,
    name: payload.names?.zh || payload.names?.en || payload.resort_id,
    region: payload.region || '',
    country_code: payload.country_code || '',
    timezone: payload.timezone || null,
    tagline: payload.description?.tagline || null,
  };
}

function main() {
  const dataDir = resolveDataDir();
  if (!fs.existsSync(dataDir)) {
    console.error(`[generate-resorts-json] 找不到資料目錄：${dataDir}`);
    process.exit(1);
  }

  const yamlFiles = collectYamlFiles(dataDir);
  if (yamlFiles.length === 0) {
    console.warn('[generate-resorts-json] 未找到任何 YAML 檔案');
  }

  const resorts = [];
  for (const file of yamlFiles) {
    const raw = fs.readFileSync(file, 'utf-8');
    const payload = yaml.load(raw);
    if (!payload?.resort_id) {
      continue;
    }
    resorts.push(toMetadata(payload));
  }

  resorts.sort((a, b) => a.resort_id.localeCompare(b.resort_id));

  const outDir = path.resolve(__dirname, '..', 'lib', 'data');
  const outFile = path.join(outDir, 'resorts.generated.json');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(resorts, null, 2));

  console.log(`[generate-resorts-json] 已輸出 ${resorts.length} 筆資料 -> ${path.relative(process.cwd(), outFile)}`);
}

main();
