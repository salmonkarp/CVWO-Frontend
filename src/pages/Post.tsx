import {
  Container,
  Fade,
  Box,
  Toolbar,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  Avatar,
  Skeleton,
  Fab,
  CardActions,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { ArrowBack } from "@mui/icons-material";
import { getTimeElapsed } from "../helpers/helpers";
import ReplyIcon from "@mui/icons-material/Reply";
import { fetchPost, fetchTopic, fetchUser } from "../helpers/fetchers";
import CommentsList from "../components/CommentsList";
import ReplyInput from "../components/ReplyInput";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

export default function Topic(props: {
  username: string;
  onLogout: () => void;
}) {
  const { username: ownUsername, onLogout } = props;
  const { topic, postId } = useParams<{ topic: string; postId: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [postDetails, setPostDetails] = useState<any>(null);
  const [postImage, setPostImage] = useState<string>("");
  const [postImageUpdatedAt, setPostImageUpdatedAt] = useState<string>("");
  const [postUsername, setPostUsername] = useState<string>("");
  const [postScore, setPostScore] = useState<number>(0);
  const [selfVote, setSelfVote] = useState<number>(0);
  const [topicDetails, setTopicDetails] = useState<any>(null);
  const [commentsRefreshTrigger, setCommentsRefreshTrigger] =
    useState<number>(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMainReplyFocused, setIsMainReplyFocused] = useState(false);
  const navigate = useNavigate();

  const loadUserData = async (postData: any) => {
    const userData = await fetchUser(postData.creator || "");
    if (userData) setPostUsername(userData.username);
    if (userData.imageUrl)
      setPostImage(import.meta.env.VITE_BACKEND_API_URL + userData.imageUrl);
    setPostImageUpdatedAt(userData.imageUpdatedAt);
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    const payload = {
      id: parseInt(postId || ""),
    };
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_API_URL + "/deletepost",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("token") || "").token
            }`,
          },
          body: JSON.stringify(payload),
        },
      );
      await response.text();
      if (response.ok) {
        navigate("/t/" + topic);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const topicData = await fetchTopic(topic || "");
      setTopicDetails(topicData);
      const postData = await fetchPost(postId || "");
      setPostDetails(postData);
      if (postData) await loadUserData(postData);
      setPostScore(postData.score || 0);
      setSelfVote(postData.user_vote || 0);
      setIsLoading(false);
      setHasLoaded(true);
    };
    loadData();
  }, [topic, postId]);

  const vote = async (v: number) => {
    const newSelf = selfVote === v ? 0 : v;
    const delta = newSelf - selfVote;
    
    const payload = {
      post_id: parseInt(postId || ''),
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
        alert(data || "Failed to submit vote. Please try again.");
      }
    } catch {
      alert("Failed to submit vote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container sx={{ display: "flex", minHeight: "100vh" }}>
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete post?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This is permanent and cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            autoFocus
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={() => handleDelete()} disabled={isSubmitting}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <NavBar onLogout={onLogout} window={window} />
      <Fade in={!isLoading} timeout={500}>
        <Box
          sx={{
            p: {
              md: 4,
              xs: 2,
            },
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            gap: 2,
          }}
        >
          <Toolbar />
          <Box sx={{ height: 20, mb: 2, ml: -1 }}>
            <IconButton onClick={() => navigate("/t/" + topic)}>
              <ArrowBack />
            </IconButton>
          </Box>
          <Card
            sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
          >
            {!hasLoaded ? (
              <CardContent sx={{ flex: 1 }}>
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
                <Skeleton
                  variant="text"
                  width="80%"
                  height={30}
                  sx={{ mb: 1 }}
                />
                <Skeleton variant="text" width="80%" height={20} />
              </CardContent>
            ) : (
              <CardContent sx={{ flex: 1 }}>
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
                  <Typography variant="subtitle1" color="text.secondary">
                    Posted by u/{postUsername} in t/{topic}{" "}
                    {postDetails.is_edited ? "(edited)" : ""} -{" "}
                    {getTimeElapsed(postDetails.created_at)}
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {postDetails?.title}
                </Typography>
                <Typography
                  variant="body1"
                  marginTop={1}
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {postDetails?.body}
                </Typography>

                <CardActions
                  sx={{ display: "flex", justifyContent: "end", p: 0, mt: 2 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, backgroundColor: "background.paper", border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 1 }}>
                    <IconButton size="small" onClick={() => vote(1)} color={selfVote === 1 ? "primary" : "default"}>
                      <ArrowUpwardIcon />
                    </IconButton>
                    <Typography fontWeight={700} color="text.primary">{postScore}</Typography>
                    <IconButton size="small" onClick={() => vote(-1)} color={selfVote === -1 ? "primary" : "default"}>
                      <ArrowDownwardIcon />
                    </IconButton>
                  </Box>
                  {ownUsername == postUsername && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        onClick={() =>
                          navigate("/t/" + topic + "/p/" + postId + "/edit")
                        }
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => setIsDeleteDialogOpen(true)}
                        color="secondary"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </CardActions>
              </CardContent>
            )}
            <CardMedia
              sx={{
                width: { xs: "100%", md: 200 },
                height: { xs: "auto", md: "100%" },
                flexShrink: 0,
                minHeight: { xs: 200, md: 140 },
              }}
              image={
                topicDetails?.imageUrl && hasLoaded
                  ? import.meta.env.VITE_BACKEND_API_URL +
                    topicDetails.imageUrl +
                    `?v=${topicDetails.imageUpdatedAt || Date.now()}`
                  : ""
              }
              title={topicDetails?.name}
            />
          </Card>
          <ReplyInput
            onCommentAdded={() => setCommentsRefreshTrigger((prev) => prev + 1)}
            isFocused={isMainReplyFocused}
            setIsFocused={setIsMainReplyFocused}
          ></ReplyInput>
          <Typography variant="h6">Replies</Typography>
          <CommentsList
            topic={topic || ""}
            ownUsername={ownUsername}
            postId={postId || ""}
            refreshTrigger={commentsRefreshTrigger}
          ></CommentsList>
          <Fab
            color="secondary"
            aria-label="Reply"
            size="large"
            sx={{
              position: "fixed",
              bottom: 32,
              right: 32,
            }}
            onClick={() => {
              setIsMainReplyFocused(true);
            }}
          >
            <ReplyIcon></ReplyIcon>
          </Fab>
        </Box>
      </Fade>
    </Container>
  );
}
