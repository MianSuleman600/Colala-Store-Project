// src/components/common/NotificationsButton.jsx
import React, { useEffect, useState } from 'react';
import { subscribeToPush, unsubscribeFromPush, getCurrentSubscription, isPushSupported } from '../../utils/pushNotifications';

const NotificationsButton = ({ brandColor = '#EF4444', contrastTextColor = '#fff' }) => {
  const [supported, setSupported] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setSupported(await isPushSupported());
      const sub = await getCurrentSubscription();
      setSubscribed(!!sub);
    })();
  }, []);

  const handleClick = async () => {
    try {
      setLoading(true);
      if (subscribed) {
        await unsubscribeFromPush();
        setSubscribed(false);
      } else {
        await subscribeToPush();
        setSubscribed(true);
      }
    } catch (e) {
      console.error(e);
      alert(e.message || 'Unable to update notification subscription.');
    } finally {
      setLoading(false);
    }
  };

  if (!supported) return null;
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-3 py-1 rounded-md text-sm"
      style={{ backgroundColor: brandColor, color: contrastTextColor, opacity: loading ? 0.7 : 1 }}
      title={subscribed ? 'Disable notifications' : 'Enable notifications'}
    >
      {loading ? 'Please wait...' : subscribed ? 'Disable Notifications' : 'Enable Notifications'}
    </button>
  );
};

export default NotificationsButton;