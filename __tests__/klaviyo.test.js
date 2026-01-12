import { createOrUpdateProfile, trackVideoActivity } from '../src/lib/klaviyo';

global.fetch = jest.fn();

describe('Klaviyo Library', () => {
  beforeEach(() => {
    fetch.mockClear();
    process.env.KLAVIYO_API_KEY = 'test-key';
  });

  describe('createOrUpdateProfile', () => {
    it('should throw error if email is missing', async () => {
      await expect(createOrUpdateProfile({})).rejects.toThrow('User email is required');
    });

    it('should create new profile if not found', async () => {
      // Mock search response: empty list
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });
      // Mock create response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { id: 'new-id' } }),
      });

      const user = { email: 'test@example.com', uid: '123' };
      await createOrUpdateProfile(user);

      expect(fetch).toHaveBeenCalledTimes(2);
      // Check create call
      expect(fetch).toHaveBeenNthCalledWith(2, expect.stringContaining('/profiles'), expect.objectContaining({
        method: 'POST'
      }));
    });

    it('should update profile if found', async () => {
        // Mock search response: found
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [{ id: 'existing-id' }] }),
        });
        // Mock update response
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { id: 'existing-id' } }),
        });
  
        const user = { email: 'test@example.com', uid: '123' };
        await createOrUpdateProfile(user);
  
        expect(fetch).toHaveBeenCalledTimes(2);
        // Check update call
        expect(fetch).toHaveBeenNthCalledWith(2, expect.stringContaining('/profiles/existing-id'), expect.objectContaining({
          method: 'PATCH'
        }));
      });
  });

  describe('trackVideoActivity', () => {
      it('should track event', async () => {
          fetch.mockResolvedValueOnce({
              ok: true,
              text: async () => 'Accepted'
          });

          await trackVideoActivity({
              email: 'test@example.com',
              metricName: 'Started Video',
              properties: { VideoID: '1' }
          });

          expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/events'), expect.objectContaining({
              method: 'POST',
              body: expect.stringContaining('Started Video')
          }));
      });
  });
});
