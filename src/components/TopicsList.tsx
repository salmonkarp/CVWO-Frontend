import { Box, Fade, Grid, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import TopicCard from "./TopicCard";

const TOPICS_PER_PAGE = 6;

export default function TopicsList() {
    const [isLoading, setIsLoading] = useState(true);
    const [topics, setTopics] = useState<Array<any>>([]);
    const [page, setPage] = useState(1);
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setFadeIn(false);
        const id = setTimeout(() => setFadeIn(true), 0);
        return () => clearTimeout(id);
    }, [page, isLoading]);

    const fetchTopics = async () => {
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
                const topicsData = JSON.parse(data);
                const sortedTopics = topicsData.sort((a: any, b: any) => a.name.localeCompare(b.name));
                // TODO: Add sorting function later
                setTopics(sortedTopics);
            } else {
                console.error("Error fetching topics:", data);
            }
        } catch (error) {
            console.error("Failed to fetch topics:", error);
        } finally {
            await new Promise(resolve => setTimeout(resolve, 200));
            setIsLoading(false);
        }
    };

    const handlePageChange = (value: number) => {
        setPage(value);
    }

    useEffect(() => {
        fetchTopics();
    }, []);

    return (
        <Box sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
        }}>
            <Fade in={fadeIn} timeout={500} key={page}>
            <Box sx={{ flexGrow: 1, width: "100%" }}>
                <Grid container spacing={2}>
                    {topics.slice((page - 1) * TOPICS_PER_PAGE, page * TOPICS_PER_PAGE).map((topic) => (
                        <TopicCard topic={topic}></TopicCard>
                    ))}
                    {
                        topics.length === 0 && (
                            <Box sx={{ mt: 4, ml: 2 }}>
                                No topics yet. Create one now!
                            </Box>
                        )
                    }
                </Grid>
            </Box>
            </Fade>
            
            <Box sx={{ mt: "auto", display: "flex", justifyContent: "center" }}>
                <Pagination count={Math.ceil(topics.length / TOPICS_PER_PAGE)} page={page} onChange={(_event, value) => handlePageChange(value)} />
            </Box>
            
            
        </Box>
    );
}