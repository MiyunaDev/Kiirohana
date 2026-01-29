import { ServiceInfo } from "../../interfaces/Service";
import normalizeUrl from "../normalizeUrl";

async function fetchServiceInfo(url: string): Promise<ServiceInfo> { 
    const base = normalizeUrl(url); 
    const res = await fetch(`${base}/info`); 
    if (!res.ok) throw new Error("Failed to fetch /info"); 
    return res.json(); 
}

export default fetchServiceInfo