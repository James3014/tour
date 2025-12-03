import { enrichTripWithResorts, resolveResortMetadata } from '@/lib/services/resort-metadata';
import type { TripWithDetails } from '@/lib/types/template';

jest.mock('@/lib/external/resort-client', () => ({
  resortClient: {
    getResort: jest.fn(),
    getResorts: jest.fn(),
  },
}));

const { resortClient } = require('@/lib/external/resort-client') as {
  resortClient: {
    getResort: jest.Mock;
    getResorts: jest.Mock;
  };
};

describe('resort-metadata service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null fields when no resort id provided', async () => {
    await expect(resolveResortMetadata(null)).resolves.toEqual({
      resort_id: null,
      resort_name: null,
      region: null,
    });
    expect(resortClient.getResort).not.toHaveBeenCalled();
  });

  it('throws when resort cannot be resolved', async () => {
    resortClient.getResort.mockResolvedValue(null);
    await expect(resolveResortMetadata('unknown_id')).rejects.toThrow('Resort unknown_id not found');
  });

  it('enriches trip metadata using cached map', async () => {
    const mockTrip: TripWithDetails = {
      id: 'trip1',
      template_id: 'tpl',
      user_id: 'user',
      title: 'Test',
      start_date: null,
      people_count: null,
      note: null,
      created_at: new Date(),
      updated_at: new Date(),
      days: [
        {
          id: 'day1',
          trip_id: 'trip1',
          day_index: 1,
          label: 'Day 1',
          city: 'Sapporo',
          is_ski_day: true,
          resort_id: 'hokkaido_niseko_moiwa',
          resort_name: null,
          region: null,
          items: [
            {
              id: 'item1',
              day_id: 'day1',
              type: 'ski',
              title: '滑雪',
              date: null,
              time: null,
              time_hint: null,
              location: null,
              link: null,
              note: null,
              created_at: new Date(),
              resort_id: 'hokkaido_niseko_moiwa',
              resort_name: null,
              region: null,
            },
          ],
        },
      ],
    };

    resortClient.getResorts.mockResolvedValue({
      hokkaido_niseko_moiwa: {
        resort_id: 'hokkaido_niseko_moiwa',
        name: 'Niseko Moiwa',
        region: 'Hokkaido',
        country_code: 'JP',
        timezone: 'Asia/Tokyo',
        tagline: null,
      },
    });

    const enriched = await enrichTripWithResorts(mockTrip);
    expect(enriched.days[0].resort_name).toBe('Niseko Moiwa');
    expect(enriched.days[0].items[0].region).toBe('Hokkaido');
  });
});
