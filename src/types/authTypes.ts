export interface LoginPayload {
	email: string;
	username: string | null;
	password: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  bio: string;
}


export interface LoginResponse {
	user: {
		id: number;
		name: string;
		email: string;
		username: string;
	};
}

export interface AuthResponse {
	user: {
		id: number;
		name: string;
		email: string;
		username: string;
	};
	token: string;
}