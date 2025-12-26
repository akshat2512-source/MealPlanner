import React from 'react';
import useNetworkStatus from '../../hooks/useNetworkStatus.js';

function NetworkStatusBanner() {
  const isOnline = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="offline-banner" role="status" aria-live="polite">
      <span className="offline-dot" aria-hidden="true" />
      <span>
        You appear to be offline. We9ll use recipes, plans, and shopping lists saved on
        this device.
      </span>
    </div>
  );
}

export default NetworkStatusBanner;
