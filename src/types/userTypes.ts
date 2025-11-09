// src/types/userTypes.ts

export interface UserState {
	username: string | null;
	token: string | null; // Add token to the interface
	id: string;
	setUsername: (username: string) => void;
	setToken: (token: string) => void; // Add setToken function
	setId: (id: string) => void;
  }
  
