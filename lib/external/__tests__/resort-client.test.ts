import { resortClient } from '@/lib/external/resort-client';

describe('resort-client', () => {
  it('loads resort metadata from local dataset', async () => {
    const result = await resortClient.getResort('hokkaido_niseko_moiwa');
    expect(result).not.toBeNull();
    expect(result?.name).toBeTruthy();
  });

  it('searches resorts by keyword', async () => {
    const results = await resortClient.searchResorts({ q: 'hakuba' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.resort_id.includes('hakuba'))).toBe(true);
  });
});
