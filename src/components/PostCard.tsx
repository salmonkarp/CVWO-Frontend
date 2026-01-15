import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchUser } from "../helpers/Fetchers";
import { getTimeElapsed } from "../helpers/Helpers";
import { useNavigate, useParams } from "react-router-dom";

export default function PostCard(props: { post: any; ownUsername: string }) {
  const { ownUsername, post } = props;
  const { topic } = useParams<{ topic: string }>();
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [postUsername, setPostUsername] = useState<string>("");
  const [postImage, setPostImage] = useState<string>("");
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
      }
      setHasLoaded(true);
    };
    loadUserData();
  }, []);

  return (
    <Card sx={{ flexGrow: 1, mb: 3 }}>
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
              src={postImage}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: "primary.main",
              }}
            >
              {postUsername ? postUsername[0].toLocaleLowerCase() : ""}
            </Avatar>
            <Typography variant="subtitle2" color="text.secondary">
              Posted by u/{postUsername} in t/{post.topic} -{" "}
              {getTimeElapsed(post.created_at)}
            </Typography>
          </Box>
          <Typography variant="h6">{post.title}</Typography>
          <Typography variant="body1">{post.body}</Typography>
        </CardContent>
      )}
      <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={() => navigate("/t/" + topic + "/p/" + post.id)}>
          View
        </Button>
        <Button>Reply</Button>
      </CardActions>
    </Card>
  );
}
