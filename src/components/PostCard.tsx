import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchUser } from "../helpers/Fetchers";
import { getTimeElapsed } from "../helpers/Helpers";
import { useNavigate, useParams } from "react-router-dom";

export default function PostCard(props: { post: any; ownUsername: string }) {
  const { post } = props;
  const { topic } = useParams<{ topic: string }>();
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [postUsername, setPostUsername] = useState<string>("");
  const [postImage, setPostImage] = useState<string>("");
  const [postImageUpdatedAt, setPostImageUpdatedAt] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      //   await new Promise(resolve => setTimeout(resolve, 500));
      const userData = await fetchUser(post.creator || "");
      if (userData) {
        setPostUsername(userData.username);
      }
      if (userData.imageUrl) {
        setPostImage(import.meta.env.VITE_BACKEND_API_URL + userData.imageUrl);
        setPostImageUpdatedAt(userData.imageUpdatedAt);
      }
      setHasLoaded(true);
    };
    loadUserData();
  }, []);

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
        <CardActionArea sx={{
          height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "flex-start",
        }} onClick={() => navigate('/t/' + topic + '/p/' + post.id)}>
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
              <Avatar
                src={postImage + `?v=${postImageUpdatedAt || Date.now()}`}
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
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                }}
              >
                Posted by u/{postUsername} in t/{post.topic} -{" "}
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
                mb: 2
              }}
            >
              {post.body}
            </Typography>
          </CardContent>
        )}
        </CardActionArea>
      </Card>
    </Grid>
  );
}
