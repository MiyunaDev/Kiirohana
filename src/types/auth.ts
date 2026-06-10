// Type definitions for Soriya auth responses.
// Expand as more service types are added.

export interface UserProfile {
  _id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  refreshToken: string;
  accounts: UserProfile[];
  message: string;
}

export interface SelectProfileResponse {
  accessToken: string;
  user: UserProfile;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface SoriyaError {
  message: string;
  status: number;
  data?: unknown;
}
