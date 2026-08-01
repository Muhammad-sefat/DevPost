export interface ConnectionInfo {
  connected: boolean;
  username?: string | null;
  connectedAt?: string | null;
}

export interface ConnectionStatus {
  github: ConnectionInfo;
  wakatime: ConnectionInfo;
}
