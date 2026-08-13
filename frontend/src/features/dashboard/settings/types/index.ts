export interface ConnectionInfo {
  connected: boolean;
  username?: string | null;
  connectedAt?: string | null;
}

export interface ConnectionStatus {
  github: ConnectionInfo;
  wakatime: ConnectionInfo;
}

export interface NotificationSettings {
  id: string;
  userId: string;
  email: string;
  channel: string;
  notifyTime: string;
  telegramChatId: string | null;
}
