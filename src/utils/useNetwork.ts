// src/hooks/useNetwork.js
import { useState, useEffect } from "react";

function getNetworkConnection(): any {
  return navigator.connection || null;
}

function getNetworkConnectionInfo() {
  const connection = getNetworkConnection();
  if (!connection) return {};
  return {
    rtt: connection?.rtt,
    type: connection?.type,
    saveData: connection.saveData,
    downLink: connection?.downlink,
    downLinkMax: connection?.downlinkMax,
    effectiveType: connection?.effectiveType,
  };
}

function useNetwork() {
  const [state, setState] = useState(() => ({
    since: undefined,
    online: navigator.onLine,
    ...getNetworkConnectionInfo(),
  }));

  useEffect(() => {
    const handleOnline = () => {
      setState((prev: any) => ({
        ...prev,
        online: true,
        since: new Date().toString(),
      }));
    };

    const handleOffline = () => {
      setState((prev: any) => ({
        ...prev,
        online: false,
        since: new Date().toString(),
      }));
    };

    const handleConnectionChange = () => {
      setState((prev) => ({
        ...prev,
        ...getNetworkConnectionInfo(),
      }));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const connection = getNetworkConnection();
    connection?.addEventListener?.("change", handleConnectionChange);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      connection?.removeEventListener?.("change", handleConnectionChange);
    };
  }, []);

  return state;
}

export default useNetwork;