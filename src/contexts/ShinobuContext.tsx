import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Outlet, useParams } from "react-router";
import { shinobuFetch } from "../utils/fetchShinobu";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { ServiceItem } from "../interfaces/Service";
import type { ShinobuUser } from "../interfaces/ShinobuSession";
import { useShiNavigate } from "../Shinobu/utils/shiNavigate";

type ServicesStorage = {
  honoka: ServiceItem | null;
  shinobu: ServiceItem[];
};

type ShinobuContextValue = {
  service: ServiceItem | null;
  user: ShinobuUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

export const ShinobuContext =
  createContext<ShinobuContextValue | null>(null);

export const ShinobuProvider = () => {
  const { shinobuid } = useParams<{ shinobuid: string }>();
  const navigate = useShiNavigate(shinobuid);

  const [services] =
    useLocalStorage<ServicesStorage>("services", {
      honoka: null,
      shinobu: [],
    });

  const [service, setService] =
    useState<ServiceItem | null>(null);
  const [user, setUser] =
    useState<ShinobuUser | null>(null);
  const [loading, setLoading] =
    useState(true);

  /**
   * 🔁 selalu resolve service terbaru dari storage
   */
  const resolvedService = useMemo(() => {
    if (!shinobuid) return null;
    return (
      services.shinobu.find(
        (s) => s.id === shinobuid
      ) ?? null
    );
  }, [shinobuid, services.shinobu]);

  /**
   * ⛔ service tidak valid → keluar
   */
  useEffect(() => {
    if (!shinobuid || !resolvedService) {
      setService(null);
      setUser(null);
      navigate("..", { replace: true });
      return;
    }

    setService(resolvedService);
  }, [resolvedService, shinobuid]);

  /**
   * 🔄 fetch user profile (reusable)
   */
  const refresh = async () => {
    if (!service) return;

    setLoading(true);

    try {
      // inject credential terbaru
      localStorage.setItem(
        `${service.id}-x-app-key`,
        service.accessKey!
      );
      localStorage.setItem(
        `${service.id}-x-app-secret`,
        service.secretKey!
      );

      const token = localStorage.getItem(
        `${service.id}-auth-token`
      );

      if (!token) {
        setUser(null);
        navigate("login", { replace: true });
        return;
      }

      const profile =
        await shinobuFetch<ShinobuUser>(
          `/${service.version?.endpoint}/user/me/profile`,
          {
            baseUrl: service.url,
            localId: service.id,
          }
        );

      setUser(profile);
    } catch {
      localStorage.removeItem(
        `${service.id}-auth-token`
      );
      setUser(null);
      navigate("login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🚀 auto refresh saat service berubah
   */
  useEffect(() => {
    if (service) refresh();
  }, [service]);

  /**
   * 🧠 sync antar tab (storage change)
   */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === "services" ||
        e.key?.includes("-auth-token")
      ) {
        refresh();
      }
    };

    window.addEventListener("storage", onStorage);
    return () =>
      window.removeEventListener(
        "storage",
        onStorage
      );
  }, [service]);

  return (
    <ShinobuContext.Provider
      value={{
        service,
        user,
        loading,
        refresh,
      }}
    >
      <Outlet />
    </ShinobuContext.Provider>
  );
};