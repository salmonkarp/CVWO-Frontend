import { Box, Card, CardContent, Grid, Pagination, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function TopicsList() {

    const [topics, setTopics] = useState<Array<any>>([]);
    const [page, setPage] = useState(1);

    const fetchTopics = async () => {
        try {
            const stored = localStorage.getItem("token");
            const token = stored ? JSON.parse(stored).token : null;
            const response = await fetch('http://localhost:8080/topics', {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.text();
            if (response.ok) {
                const topicsData = JSON.parse(data);
                setTopics(topicsData);
            } else {
                console.error("Error fetching topics:", data);
            }
        } catch (error) {
            console.error("Failed to fetch topics:", error);
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
                    {topics.slice((page - 1) * 3, page * 3).map((topic) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={topic.id} sx={{
                            display: 'flex'
                        }}>
                            <Card sx={{
                                flexGrow: 1
                            }}>
                                <CardContent>
                                    <Typography variant="h6">t/{topic.name}</Typography>
                                    <Typography>{topic.description}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            
            <Box sx={{ mt: "auto", display: "flex", justifyContent: "center" }}>
                <Pagination count={Math.ceil(topics.length / 3)} page={page} onChange={(_event, value) => handlePageChange(value)} />
            </Box>
        </Box>
    );
}