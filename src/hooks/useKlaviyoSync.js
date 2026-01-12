import { useEffect } from 'react';

// Mock Firebase Auth Hook (In a real app, this would come from a context or library)
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '../lib/firebase';

/**
 * Custom hook to sync user to Klaviyo on login.
 * @param {Object} user - The Firebase user object (or null).
 */
export function useKlaviyoSync(user) {
  useEffect(() => {
    if (user && user.email) {
      const syncUser = async () => {
        try {
          // Construct the payload based on what we want to send to Klaviyo
          const payload = {
            user: {
              email: user.email,
              uid: user.uid,
              properties: {
                 // Add any extra properties if available
                 displayName: user.displayName,
                 lastLogin: new Date().toISOString()
              }
            }
          };

          const response = await fetch('/api/klaviyo/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            console.error('Failed to sync user with Klaviyo');
          } else {
            console.log('User synced with Klaviyo successfully');
          }
        } catch (error) {
          console.error('Error in useKlaviyoSync:', error);
        }
      };

      syncUser();
    }
  }, [user]); // Re-run when user object changes (e.g. login)
}
