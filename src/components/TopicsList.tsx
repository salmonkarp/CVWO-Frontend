import { Box, Fade, Grid, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import TopicCard from "./TopicCard";
import { fetchTopics } from "../helpers/fetchers";

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

  const handlePageChange = (value: number) => {
    setPage(value);
  };

  useEffect(() => {
    const loadData = async () => {
      setTopics(await fetchTopics());
    };
    loadData().then(() => setIsLoading(false));
  }, []);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Fade in={fadeIn} timeout={500} key={page}>
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <Grid container spacing={2}>
            {topics
              .slice((page - 1) * TOPICS_PER_PAGE, page * TOPICS_PER_PAGE)
              .map((topic) => (
                <TopicCard topic={topic}></TopicCard>
              ))}
            {topics.length === 0 && (
              <Box sx={{ mt: 4, ml: 2 }}>No topics yet. Create one now!</Box>
            )}
          </Grid>
        </Box>
      </Fade>

      <Box sx={{ mt: "auto", display: "flex", justifyContent: "center" }}>
        <Pagination
          count={Math.ceil(topics.length / TOPICS_PER_PAGE)}
          page={page}
          onChange={(_event, value) => handlePageChange(value)}
        />
      </Box>
    </Box>
  );
}
