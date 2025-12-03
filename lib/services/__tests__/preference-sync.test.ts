import { syncUserResortPreferences } from '@/lib/services/preference-sync';

jest.mock('@/lib/external/user-core-client', () => ({
  syncSkiPreferences: jest.fn(),
}));

const { syncSkiPreferences } = require('@/lib/external/user-core-client') as {
  syncSkiPreferences: jest.Mock;
};

describe('preference-sync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('skips syncing when trip has no resort ids', async () => {
    await syncUserResortPreferences({
      id: 'trip',
      template_id: 'tpl',
      user_id: 'user',
      title: 'Test',
      start_date: null,
      people_count: null,
      note: null,
      created_at: new Date(),
      updated_at: new Date(),
      days: [],
    } as any);

    expect(syncSkiPreferences).not.toHaveBeenCalled();
  });

  it('syncs preferences when resorts exist', async () => {
    await syncUserResortPreferences({
      id: 'trip',
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
          trip_id: 'trip',
          day_index: 1,
          label: 'Day1',
          city: null,
          is_ski_day: true,
          resort_id: 'hokkaido_niseko_moiwa',
          resort_name: 'Niseko',
          region: 'Hokkaido',
          items: [],
        },
      ],
    } as any);

    expect(syncSkiPreferences).toHaveBeenCalledWith({
      userId: 'user',
      resortIds: ['hokkaido_niseko_moiwa'],
      tripId: 'trip',
    });
  });
});
