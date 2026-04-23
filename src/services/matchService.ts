export const matchService = {
  sendMatchResponse: async (userId: string, response: string): Promise<{ success: boolean }> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 800); // 800ms simulated network latency
    });
  }
};
