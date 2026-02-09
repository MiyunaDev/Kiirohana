export interface ServiceVersion {
    version: string;
    endpoint: string;
}

export interface ServiceInfo {
  name: string;
  description: string;
  versions: ServiceVersion[];
  logo: string; // relative path
}

export interface ServiceItem {
  id: string;
  kind: "shinobu" | "honoka";
  enabled: boolean;
  url: string;
  info?: ServiceInfo;
  version?: ServiceVersion;
  logoData?: any; // ⬅️ Lottie JSON cache
  error?: string;
  accessKey?: string,
  secretKey?: string
}