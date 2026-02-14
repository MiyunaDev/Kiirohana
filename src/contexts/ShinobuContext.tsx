import {
  createContext,
  useEffect,
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
};

export const ShinobuContext =
  createContext<ShinobuContextValue | null>(null);

export const ShinobuProvider = () => {
  const { shinobuid } = useParams<{ shinobuid: string }>();

  // 🔑 scoped navigator → BASE = /shinobu/:shinobuid
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shinobuid) {
      navigate("..", { replace: true });
      return;
    }

    const current = services.shinobu.find(
      (s) => s.id === shinobuid
    );

    if (!current) {
      navigate("..", { replace: true });
      return;
    }

    setService(current);

    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);

        // inject credential
        localStorage.setItem(
          `${current.id}-x-app-key`,
          current.accessKey!
        );
        localStorage.setItem(
          `${current.id}-x-app-secret`,
          current.secretKey!
        );

        const token = localStorage.getItem(
          `${current.id}-auth-token`
        );

        if (!token) {
          // ✅ RELATIVE
          navigate("login", { replace: true });
          return;
        }

        const userData =
          await shinobuFetch<ShinobuUser>(
            `/${current.version?.endpoint}/user/me/profile`,
            {
              baseUrl: current.url,
              localId: current.id,
            }
          );

        if (!cancelled) {
          setUser(userData);
        }
      } catch {
        localStorage.removeItem(
          `${current.id}-auth-token`
        );

        // ✅ RELATIVE
        navigate("login", { replace: true });
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [shinobuid, services.shinobu]);

  return (
    <ShinobuContext.Provider
      value={{ service, user, loading }}
    >
      <Outlet />
    </ShinobuContext.Provider>
  );
};