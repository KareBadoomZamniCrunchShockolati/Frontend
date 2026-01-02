export interface Challenge {
  id: number;
  title: string;
  description: string;
  recurrence_rule: string;
  category_name: string;
  creator_username: string;
  creator_id: number;
  creator_profile_picture?: string;
  creator_avatar_url?: string;
  visibility: "private" | "public";
  image_url: string;
  cover_image?: string;
  max_participants: number;
  current_participants: number;
  like_count: number;
  comment_count: number;
  start_time: string;
  end_time: string;
  timezone: string;
  created_at: string;
  is_user_participating: boolean;
  is_user_liked: boolean;
  mutualFollowers: any[]; // 
  mutual_participants: any; 
}
export interface LikeRequest {
  entity_type: string;
  entity_id: number;
}

export interface ChallengeCoverUploadResponse {
  data: {
    cover_image: string;
  };
  message: string;
  status: number;
}
