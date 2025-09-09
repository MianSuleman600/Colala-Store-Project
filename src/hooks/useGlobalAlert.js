import { useEffect, useState } from 'react';

export const useGlobalAlert = () => {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const handler = (e) => setAlert(e.detail);
    window.addEventListener('SHOW_ALERT', handler);
    return () => window.removeEventListener('SHOW_ALERT', handler);
  }, []);

  return alert;
};
