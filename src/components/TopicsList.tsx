import { Box, Grid, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import TopicCard from "./TopicCard";

const TOPICS_PER_PAGE = 9;

export default function TopicsList(props: {onLoadingComplete: () => void}) {

    const [topics, setTopics] = useState<Array<any>>([]);
    const [page, setPage] = useState(1);

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
            props.onLoadingComplete();
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
            <Box sx={{ flexGrow: 1, width: "100%" }}>
                <Grid container spacing={2}>
                    {topics.slice((page - 1) * TOPICS_PER_PAGE, page * TOPICS_PER_PAGE).map((topic) => (
                        <TopicCard topic={topic}></TopicCard>
                    ))}
                </Grid>
            </Box>
            
            <Box sx={{ mt: "auto", display: "flex", justifyContent: "center" }}>
                <Pagination count={Math.ceil(topics.length / TOPICS_PER_PAGE)} page={page} onChange={(_event, value) => handlePageChange(value)} />
            </Box>

        </Box>
    );
}