export interface User {
  id: number;
  username: string;
  imageUrl?: string;
  imageUpdatedAt?: string;
}

export interface Topic {
  name: string;
  imageUrl?: string;
  imageUpdatedAt?: string;
  description: string;
}

export interface Post {
  id: number;
  creator: number;
  score?: number;
  user_vote?: number;
  title: string;
  body: string;
  topic: string;
  is_edited: boolean;
  created_at: string;
}

export interface Comment {
  id: number;
  post: number;
  parent: number | null;
  body: string;
  children?: Comment[];
  creator: number;
  is_edited: boolean;
  created_at: string;
}
