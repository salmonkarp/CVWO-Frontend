import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchUser } from "../helpers/fetchers";
import type { Post } from "../types";
import { getTimeElapsed } from "../helpers/helpers";
import { useNavigate, useParams } from "react-router-dom";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useSnackbar } from "../SnackbarContext";

export default function PostCard(props: { post: Post; ownUsername: string }) {
  const { post } = props;
  const { topic } = useParams<{ topic: string }>();
  const { showSnackbar } = useSnackbar();
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [postUsername, setPostUsername] = useState<string>("");
  const [postImage, setPostImage] = useState<string>("");
  const [postImageUpdatedAt, setPostImageUpdatedAt] = useState<string>("");
  const [postScore, setPostScore] = useState<number>(0);
  const [selfVote, setSelfVote] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await fetchUser(post.creator);
      if (userData) {
        setPostUsername(userData.username);
      }
      if (userData?.imageUrl) {
        setPostImage(import.meta.env.VITE_BACKEND_API_URL + userData.imageUrl);
        setPostImageUpdatedAt(userData.imageUpdatedAt || "");
      }
      setHasLoaded(true);
    };
    loadUserData();
    setPostScore(post.score || 0);
    setSelfVote(post.user_vote || 0);
    console.log(post.score, post.user_vote);
  }, []);

   const vote = async (v: number) => {
    const newSelf = selfVote === v ? 0 : v;
    const delta = newSelf - selfVote;
    
    const payload = {
      post_id: post.id,
      is_positive: newSelf == 0 ? null : newSelf == 1 ? true : false,
    }
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_API_URL + "/votepost",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("token") || "").token
            }`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.text();
      if (response.ok) {
        setSelfVote(newSelf);
        setPostScore((s) => s + delta);
      } else {
        showSnackbar("Failed to submit vote: " + data, "error");
      }
    } catch {
      showSnackbar("Error submitting vote", "error");
    }
  };


  return (
    <Grid
      size={{ xs: 12, sm: 6 }}
      key={post?.id}
      sx={{
        display: "flex",
      }}
    >
      <Card
        sx={{ flexGrow: 1, mb: 3, display: "flex", flexDirection: "column" }}
      >
        <CardActionArea
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "flex-start",
          }}
          onClick={() => navigate("/t/" + topic + "/p/" + post.id)}
        >
          {!hasLoaded ? (
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="text" width={150} height={20} />
              </Box>
              <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={20} />
            </CardContent>
          ) : (
            <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <Avatar
                  src={
                    postImage
                      ? postImage + `?v=${postImageUpdatedAt || Date.now()}`
                      : ""
                  }
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: "primary.main",
                  }}
                >
                  {postUsername ? postUsername[0].toLocaleLowerCase() : ""}
                </Avatar>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  Posted by u/{postUsername} in t/{post.topic}{" "}
                  {post.is_edited ? "(edited)" : ""} -{" "}
                  {getTimeElapsed(post.created_at)}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {post.title}
              </Typography>
              <Typography
                variant="body1"
                marginTop={1}
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  mb: 2,
                }}
              >
                {post.body}
              </Typography>
              <Box
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  backgroundColor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  px: 1,
                  mt: "auto",
                  alignSelf: "flex-end",
                  width: "fit-content",
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    vote(1);
                  }}
                  color={selfVote === 1 ? "primary" : "default"}
                >
                  <ArrowUpwardIcon />
                </IconButton>
                <Typography fontWeight={700} color="text.primary">
                  {postScore}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    vote(-1);
                  }}
                  color={selfVote === -1 ? "primary" : "default"}
                >
                  <ArrowDownwardIcon />
                </IconButton>
              </Box>
            </CardContent>
          )}
        </CardActionArea>
      </Card>
    </Grid>
  );
}
