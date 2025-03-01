import { useState, useEffect } from 'react';
import config from '../config';

const useServerIPs = () => {
  const [serverips, setServerips] = useState([]);

  useEffect(() => {
    const fetchServerIPs = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/api/serverips`);
        if (response.ok) {
          const data = await response.json();
          // Assume the API returns an object like: { serverips: ["ip1", "ip2", ...] }
          setServerips(data.serverips || []);
        } else {
          console.error('Error fetching server IPs:', response.status);
        }
      } catch (error) {
        console.error('Error fetching server IPs:', error);
      }
    };

    fetchServerIPs();
  }, []);

  return { serverips };
};

export default useServerIPs;
