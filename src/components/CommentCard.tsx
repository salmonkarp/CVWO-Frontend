import {
  Avatar,
  Box,
  Card,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchUser } from "../helpers/Fetchers";
import { getTimeElapsed } from "../helpers/Helpers";
import { useParams } from "react-router-dom";

export default function CommentCard(props: {
  comment: any;
  ownUsername: string;
}) {
  const { ownUsername, comment } = props;
  const { topic } = useParams<{ topic: string }>();
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [commentUsername, setCommentUsername] = useState<string>("");
  const [commentImage, setCommentImage] = useState<string>("");

  useEffect(() => {
    const loadUserData = async () => {
      //   await new Promise(resolve => setTimeout(resolve, 500));
      const userData = await fetchUser(comment.creator || "");
      if (userData) {
        setCommentUsername(userData.username);
      }
      if (userData.imageUrl) {
        setCommentImage(
          import.meta.env.VITE_BACKEND_API_URL + userData.imageUrl
        );
      }
      setHasLoaded(true);
    };
    loadUserData();
  }, []);

  return (
    <Card sx={{ flexGrow: 1, mb: 3, display: "flex", flexDirection: "column" }}>
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
              src={commentImage}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: "primary.main",
              }}
            >
              {commentUsername ? commentUsername[0].toLocaleLowerCase() : ""}
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
              u/{commentUsername} - {getTimeElapsed(comment.created_at)}
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {comment.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {comment.body}
          </Typography>
        </CardContent>
      )}
      {/* <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={() => navigate("/t/" + topic + "/p/" + comment.id)}>
          View
        </Button>
        <Button>Reply</Button>
      </CardActions> */}
    </Card>
  );
}
