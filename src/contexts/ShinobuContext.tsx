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

export const ShinobuContext = createContext<ShinobuContextValue | null>(
  null
);

export const ShinobuProvider = () => {
  const { shinobuid } = useParams();
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
    if (!shinobuid) return;

    const current = services.shinobu.find(
      (s) => s.id === shinobuid
    );

    if (!current) {
      navigate(`/shinobu/`);
      return;
    }

    setService(current)

    const run = async () => {
      try {
        setLoading(true);

        // inject credential sekali
        localStorage.setItem(
          `${current.id}-x-app-key`,
          current.accessKey!
        );
        localStorage.setItem(
          `${current.id}-x-app-secret`,
          current.secretKey!
        );

        const token =
          localStorage.getItem(`${current.id}-auth-token`);

        if (!token) {
          navigate(`/shinobu/${current.id}/login`);
          return;
        }

        // fetch user (recommended endpoint)
        const userData =
          await shinobuFetch<ShinobuUser>(
            `/${current.version?.endpoint}/user/me/profile`,
            { baseUrl: current.url, localId: current.id }
          );

        setUser(userData);
      } catch {
        localStorage.removeItem(`${current.id}-auth-token`);
        navigate(`/shinobu/${current.id}/login`);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [shinobuid]);

  return (
    <ShinobuContext.Provider
      value={{ service, user, loading }}
    >
      <Outlet />
    </ShinobuContext.Provider>
  );
};