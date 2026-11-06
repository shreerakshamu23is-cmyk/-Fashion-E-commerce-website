import { useEffect, useState } from 'react';
import { apiUrl } from '../services/api';

export default function useSeriesList() {
  const [seriesList, setSeriesList] = useState([]);

  useEffect(() => {
    let active = true;
    let refreshing = false;

    const refresh = async () => {
      if (refreshing) return;
      refreshing = true;
      try {
        const response = await fetch(apiUrl('/series'), { cache: 'no-store' });
        if (!response.ok) throw new Error(`Series refresh failed (${response.status})`);
        const data = await response.json();
        if (active && Array.isArray(data)) {
          setSeriesList((current) =>
            JSON.stringify(current) === JSON.stringify(data) ? current : data
          );
        } else if (!Array.isArray(data)) {
          throw new Error('Series refresh returned an invalid response');
        }
      } catch (err) {
        console.error('Failed to refresh series list:', err);
      } finally {
        refreshing = false;
      }
    };

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };

    refresh();
    const intervalId = window.setInterval(refreshWhenVisible, 15000);
    window.addEventListener('focus', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener('focus', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, []);

  return seriesList;
}
