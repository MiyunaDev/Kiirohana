declare module 'soriya' {
  export class Soriya {
    constructor(config: { services: Record<string, string> });

    user: {
      register(data: Record<string, unknown>): Promise<unknown>;
      login(data: Record<string, unknown>): Promise<unknown>;
      selectProfile(profileId: string, method?: 'access' | 'refresh'): Promise<unknown>;
      logout(): Promise<void>;
      getUser(userId: string): Promise<unknown>;
      manageSecurityPhrase(action: 'create' | 'verify' | 'reset', phrase: string): Promise<void>;
    };
  }
}
