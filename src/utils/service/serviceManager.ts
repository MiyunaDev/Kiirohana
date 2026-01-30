import { ServiceItem } from "../../interfaces/Service";

const STORAGE_KEY = "services_provider";

export interface ServicesState {
  honoka?: ServiceItem;
  shinobu: ServiceItem[];
}

export function loadServices(): ServicesState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { shinobu: [] };
  } catch {
    return { shinobu: [] };
  }
}

export function saveServices(data: ServicesState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}