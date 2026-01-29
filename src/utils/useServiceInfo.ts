import { useEffect, useRef } from "react";
import fetchServiceInfo from "./service/fetchServiceInfo";
import { ServiceItem } from "../interfaces/Service";

function useServiceInfo(
  service: ServiceItem | undefined,
  onUpdate: (s: ServiceItem | undefined) => void,
  onDelete?: () => void
) {
  const lastUrl = useRef("");

  useEffect(() => {
    if (!service) return;

    // AUTO DELETE kalau URL kosong
    if (!service.url.trim()) {
      onDelete?.();
      return;
    }

    if (service.url === lastUrl.current) return;
    lastUrl.current = service.url;

    fetchServiceInfo(service.url)
      .then((info) =>
        onUpdate({ ...service, info, error: undefined })
      )
      .catch((err) =>
        onUpdate({ ...service, info: undefined, error: err.message })
      );
  }, [service?.url]);
}

export default useServiceInfo