export interface UserState {
  username: string;
  setUsername: (username: string) => void;
  token: string;
  setToken: (token: string) => void;
  userId: number;
  setUserId: (id: number) => void;
}
