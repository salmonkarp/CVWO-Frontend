export const fetchUserData = async (username: string) => {
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