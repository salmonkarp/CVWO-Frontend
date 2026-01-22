import type { User, Topic, Post, Comment } from "../types";

export const fetchUser = async (username: number | string): Promise<User | null> => {
    try {
        const stored = localStorage.getItem("token");
        const token = stored ? JSON.parse(stored).token : null;
        const response = await fetch(import.meta.env.VITE_BACKEND_API_URL + `/user/${username}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.text();
        if (response.ok) {
            const parsedData: User = JSON.parse(data);
            return parsedData;
        } else {
            console.error("Error fetching user data:", data);
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};

export const fetchTopic = async (topic: string): Promise<Topic | null> => {
    try {
        const stored = localStorage.getItem("token");
        const token = stored ? JSON.parse(stored).token : null;
        const response = await fetch(import.meta.env.VITE_BACKEND_API_URL + `/topics/${topic}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.text();
        if (response.ok) {
            const parsedData: Topic = JSON.parse(data);
            return parsedData;
        } else {
            console.error("Error fetching topic details:", data);
            return null;
        }
    } catch (error) {
        console.error("Error fetching topic details:", error);
        return null;
    } 
};

export const fetchPost = async (postId: string): Promise<Post | null> => {
    try {
        const stored = localStorage.getItem("token");
        const token = stored ? JSON.parse(stored).token : null;
        const response = await fetch(import.meta.env.VITE_BACKEND_API_URL + '/posts/' + postId, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.text();
        if (response.ok) {
            const postData: Post = JSON.parse(data);
            return postData;
        } else {
            console.error("Error fetching posts:", data);
            return null;
        }
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return null;
    }
};

export const fetchTopics = async (): Promise<Topic[]> => {
    try {
        const stored = localStorage.getItem("token");
        const token = stored ? JSON.parse(stored).token : null;
        const response = await fetch(import.meta.env.VITE_BACKEND_API_URL + '/topics', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.text();
        if (response.ok) {
            const topicsData: Topic[] = JSON.parse(data);
            const sortedTopics = topicsData.sort((a: Topic, b: Topic) => a.name.localeCompare(b.name));
            return sortedTopics;
        } else {
            console.error("Error fetching topics:", data);
            return [];
        }
    } catch (error) {
        console.error("Failed to fetch topics:", error);
        return [];
    }
};


export const fetchPosts = async (topic: string): Promise<Post[]> => {
    try {
        const stored = localStorage.getItem("token");
        const token = stored ? JSON.parse(stored).token : null;
        const response = await fetch(import.meta.env.VITE_BACKEND_API_URL + '/topics/' + topic + '/posts', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.text();
        if (response.ok) {
            const postsData: Post[] = JSON.parse(data);
            console.log("Fetched posts:", postsData);
            return postsData;
        } else {
            console.error("Error fetching posts:", data);
            return [];
        }
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return [];
    }
};

export const fetchComments = async (postId: string): Promise<Comment[]> => {
    try {
        const stored = localStorage.getItem("token");
        const token = stored ? JSON.parse(stored).token : null;
        const response = await fetch(import.meta.env.VITE_BACKEND_API_URL + '/posts/' + postId + '/comments', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.text();
        if (response.ok) {
            const postsData: Comment[] = JSON.parse(data);
            return postsData;
        } else {
            console.error("Error fetching comments:", data);
            return [];
        }
    } catch (error) {
        console.error("Failed to fetch comments:", error);
        return [];
    }
};