import { useState, useEffect, useRef } from 'react';
import config from '../config';

const useContainers = (pollingEnabled = false) => {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const pollingRef = useRef(null);

  // On initial page load, fetch from /api/containers/force
  useEffect(() => {
    const fetchForceContainers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.baseUrl}/api/containers/force`);
        if (response.ok) {
          const data = await response.json();
          setContainers(data.containers || []);
        } else {
          console.error('Error fetching containers force:', response.status);
        }
      } catch (error) {
        console.error('Error fetching containers force:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchForceContainers();
  }, []);

  // If pollingEnabled is true (e.g. after a server IP is selected), poll /api/containers every 5 seconds.
  useEffect(() => {
    if (pollingEnabled) {
      const fetchContainersPolling = async () => {
        try {
          const response = await fetch(`${config.baseUrl}/api/containers`);
          // If the status is 204, no update is needed.
          if (response.status === 204) {
            console.log('No changes in containers (204)');
          } else if (response.ok) {
            const data = await response.json();
            setContainers(data.containers || []);
          } else {
            console.error('Error fetching containers:', response.status);
          }
        } catch (error) {
          console.error('Error fetching containers:', error);
        }
      };

      // Initial call before starting the interval
      fetchContainersPolling();
      pollingRef.current = setInterval(fetchContainersPolling, 5000);
      return () => clearInterval(pollingRef.current);
    }
  }, [pollingEnabled]);

  // A manual fetch function (fetches /api/containers/force)
  const fetchContainers = async () => {
    try {
      const response = await fetch(`${config.baseUrl}/api/containers/force`);
      if (response.ok) {
        const data = await response.json();
        setContainers(data.containers || []);
      } else {
        console.error('Error fetching containers force:', response.status);
      }
    } catch (error) {
      console.error('Error fetching containers force:', error);
    }
  };

  return { containers, fetchContainers, loading };
};

export default useContainers;
