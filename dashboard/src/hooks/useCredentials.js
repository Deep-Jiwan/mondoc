import { useState, useEffect } from 'react';
import config from '../config';

const useCredentials = (containerId) => {
  const [credentials, setCredentials] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!containerId) return;
    const fetchCredentials = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${config.baseUrl}/api/credentials?containerId=${containerId}`);
        if (!response.ok) {
          console.error('Error fetching credentials:', response.status);
          setCredentials(null);
        } else {
          const data = await response.json();
          setCredentials(data);
        }
      } catch (err) {
        console.error('Error fetching credentials:', err);
        setCredentials(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
  }, [containerId]);

  return { credentials, loading };
};

export default useCredentials;
