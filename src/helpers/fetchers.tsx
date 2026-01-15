export const fetchUser = async (username: string) => {
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
            const parsedData = JSON.parse(data);
            return parsedData;
        } else {
            console.error("Error fetching user data:", data);
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};

export const fetchTopic = async (topic: string) => {
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
            const parsedData = JSON.parse(data);
            return parsedData;
        } else {
            console.error("Error fetching topic details:", data);
        }
    } catch (error) {
        console.error("Error fetching topic details:", error);
    } 
};

export const fetchPost = async (postId: string) => {
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
            const postData = JSON.parse(data);
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

