// src/types/userTypes.ts

export interface UserState {
	username: string | null;
	token: string | null; // Add token to the interface
	setUsername: (username: string) => void;
	setToken: (token: string) => void; // Add setToken function
  }
  
export  interface UserProfile {
    id: string;
    username: string;
    imagePath: string;
    bio: string;
    followersCount: number;
    followingCount: number;
    doneChallengesCount: number;
  }