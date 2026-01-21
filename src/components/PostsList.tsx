import { Box, Grid, Pagination, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { fetchPosts } from "../helpers/fetchers";

const POSTS_PER_PAGE = 6;

export default function PostsList(props: {
  topic: string;
  ownUsername: string;
}) {
  const topic = props.topic;
  const [posts, setPosts] = useState<Array<any>>([]);
  const [page, setPage] = useState(1);

  const handlePageChange = (value: number) => {
    setPage(value);
  };

  useEffect(() => {
    const loadData = async () => {
      setPosts(await fetchPosts(topic || ""));
    };
    loadData();
  }, [topic]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ flexGrow: 1, width: "100%" }}>
        <Grid container spacing={2}>
        {posts
          .slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)
          .map((post) => (
            <PostCard post={post} ownUsername={props.ownUsername}></PostCard>
          ))}
        {posts.length === 0 && (
          <Box sx={{ mt: 4, textAlign: "center", width: "100%" }}>
            <Typography variant="h6">No posts yet. Create one now!</Typography>
          </Box>
        )}
        </Grid>
      </Box>

      <Box sx={{ mt: "auto", display: "flex", justifyContent: "center" }}>
        <Pagination
          count={Math.ceil(posts.length / POSTS_PER_PAGE)}
          page={page}
          onChange={(_event, value) => handlePageChange(value)}
        />
      </Box>
    </Box>
  );
}
