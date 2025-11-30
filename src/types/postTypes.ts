export interface CreatePostPayload {
	description: string;
	challengeID?: number|null;
	pictures?: string[];
}

export interface UpdatePostPayload {
    id: number;
	description: string;
	pictures?: string[];
}

export interface PostResponse {
  id: number;
  user_id: number;
  username: string;
  description: string;
  challenge_id: number | null;  
  pictures: string[];
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  created_at: string;  
  updated_at: string; 
}
