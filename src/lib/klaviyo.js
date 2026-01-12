const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY;
const KLAVIYO_BASE_URL = 'https://a.klaviyo.com/api';

/**
 * Creates or updates a Klaviyo profile.
 * @param {Object} user - The user object containing email, id, and other properties.
 * @returns {Promise<Object>} The response from Klaviyo.
 */
export async function createOrUpdateProfile(user) {
  if (!user || !user.email) {
    throw new Error('User email is required');
  }

  // Common properties payload
  const profileAttributes = {
    email: user.email,
    external_id: user.uid, // Firebase UID
    properties: {
      ...user.properties // Any extra properties
    }
  };

  try {
    // 1. Check if profile exists by email
    const searchParams = new URLSearchParams({
       'filter': `equals(email,"${user.email}")`
    });
    
    const searchResponse = await fetch(`${KLAVIYO_BASE_URL}/profiles?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        'accept': 'application/json',
        'revision': '2024-02-15'
      }
    });

    if (!searchResponse.ok) {
       const errorText = await searchResponse.text();
       console.error('Klaviyo Search Error:', errorText);
       throw new Error(`Klaviyo Search Failed: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    const existingProfile = searchData.data && searchData.data[0];

    if (existingProfile) {
      // 2. Update existing profile
      const profileId = existingProfile.id;
      const updatePayload = {
        data: {
          type: 'profile',
          id: profileId,
          attributes: profileAttributes
        }
      };
      
      const updateResponse = await fetch(`${KLAVIYO_BASE_URL}/profiles/${profileId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
          'accept': 'application/json',
          'content-type': 'application/json',
          'revision': '2024-02-15'
        },
        body: JSON.stringify(updatePayload)
      });
      
      if (!updateResponse.ok) {
         const errorText = await updateResponse.text();
         console.error('Klaviyo Update Error:', errorText);
         throw new Error(`Klaviyo Update Failed: ${updateResponse.status}`);
      }
      return await updateResponse.json();

    } else {
      // 3. Create new profile
      const createPayload = {
        data: {
          type: 'profile',
          attributes: profileAttributes
        }
      };

      const createResponse = await fetch(`${KLAVIYO_BASE_URL}/profiles`, {
        method: 'POST',
        headers: {
          'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
          'accept': 'application/json',
          'content-type': 'application/json',
          'revision': '2024-02-15'
        },
        body: JSON.stringify(createPayload)
      });

      if (!createResponse.ok) {
         const errorText = await createResponse.text();
         console.error('Klaviyo Create Error:', errorText);
         throw new Error(`Klaviyo Create Failed: ${createResponse.status}`);
      }
      return await createResponse.json();
    }

  } catch (error) {
    console.error('Error syncing Klaviyo profile:', error);
    throw error;
  }
}

/**
 * Tracks a video activity event.
 * @param {Object} eventData - The event data.
 * @param {string} eventData.email - User email.
 * @param {string} eventData.metricName - 'Started Video', 'Watched 50%', 'Completed Video'.
 * @param {Object} eventData.properties - Video properties (title, id, duration, etc).
 */
export async function trackVideoActivity({ email, metricName, properties }) {
   if (!email || !metricName) {
     throw new Error('Email and metric name are required');
   }
   
   const payload = {
     data: {
       type: 'event',
       attributes: {
         properties: properties,
         metric: {
           data: {
             type: 'metric',
             attributes: {
               name: metricName
             }
           }
         },
         profile: {
           data: {
             type: 'profile',
             attributes: {
               email: email
             }
           }
         }
       }
     }
   };

   try {
     const response = await fetch(`${KLAVIYO_BASE_URL}/events`, {
       method: 'POST',
        headers: {
          'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
          'accept': 'application/json',
          'content-type': 'application/json',
          'revision': '2024-02-15'
        },
        body: JSON.stringify(payload)
     });
     
     if (!response.ok) {
        const txt = await response.text();
        console.error('Klaviyo Event Error:', txt);
        throw new Error(`Klaviyo Event Track Failed: ${response.status}`);
     }
     
     // 202 Accepted is the typical response for queued events
     return true;
     
   } catch (error) {
     console.error('Error tracking video activity:', error);
     throw error;
   }
}
