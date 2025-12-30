export type Payload = {
  title: string;
  description?: string | null;
  category_id: number;
  max_participants?: number | null;
  visibility: "public" | "private";
  rule?: string;
  comments_enabled: boolean;
  start_time: string;
  end_time: string;
  timezone: string;
  image_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
};