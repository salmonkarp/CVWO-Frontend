import { Box, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";

const POSTS_PER_PAGE = 10;

export default function PostsList(props: {topic: string; onLoadingComplete?: () => void}) {

    const [posts, setPosts] = useState<Array<any>>([]);
    const [page, setPage] = useState(1);

    const fetchPosts = async () => {
        try {
            const stored = localStorage.getItem("token");
            const token = stored ? JSON.parse(stored).token : null;
            const response = await fetch(import.meta.env.VITE_BACKEND_API_URL + '/topics/' + props.topic + '/posts', {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.text();
            if (response.ok) {
                const postsData = JSON.parse(data);
                setPosts(postsData);
            } else {
                console.error("Error fetching posts:", data);
            }
            props.onLoadingComplete?.();
        } catch (error) {
            console.error("Failed to fetch posts:", error);
            props.onLoadingComplete?.();
        }
    };

    const handlePageChange = (value: number) => {
        setPage(value);
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <Box sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
        }}>
            <Box sx={{ flexGrow: 1, width: "100%" }}>
                {posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE).map((post) => (
                    <PostCard post={post}></PostCard>
                ))}
            </Box>
            
            <Box sx={{ mt: "auto", display: "flex", justifyContent: "center" }}>
                <Pagination count={Math.ceil(posts.length / POSTS_PER_PAGE)} page={page} onChange={(_event, value) => handlePageChange(value)} />
            </Box>

        </Box>
    );
}