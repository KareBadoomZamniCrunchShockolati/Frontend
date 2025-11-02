export interface UserState {
	username: string | null;
	setUsername: (username: string) => void;
}
export interface FollowStats {
  followersCount: number;
  followingCount: number;
}

export interface UserSummary {
  id: string;
  fullName: string;
  avatarUrl?: string;
}
