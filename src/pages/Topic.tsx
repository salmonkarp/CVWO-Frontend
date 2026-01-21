import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Fade,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import NavBar from "../components/NavBar";
import { useNavigate, useParams } from "react-router";
import { ArrowBack } from "@mui/icons-material";
import { useEffect, useState } from "react";
import PostsList from "../components/PostsList";
import AddIcon from "@mui/icons-material/Add";
import { fetchTopic } from "../helpers/Fetchers";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function Topic(props: {
  username: string;
  onLogout: () => void;
}) {
  const { username, onLogout } = props;
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [topicDetails, setTopicDetails] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setTopicDetails(await fetchTopic(topic || ""));
    };
    loadData().then(() => setIsLoading(false));
  }, [topic]);

  const handleDelete = async () => {
    setIsSubmitting(true);
    const payload = {
      name: topic,
    };
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_API_URL + "/deletetopic",
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
      await response.text();
      if (response.ok) {
        navigate("/dashboard");
      }
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
            <IconButton onClick={() => navigate("/dashboard")}>
              <ArrowBack />
            </IconButton>
          </Box>
          {topicDetails && (
            <Card>
              <CardMedia
                sx={{ height: 140 }}
                image={
                  topicDetails?.imageUrl
                    ? import.meta.env.VITE_BACKEND_API_URL +
                      topicDetails.imageUrl +
                      `?v=${topicDetails.imageUpdatedAt || Date.now()}`
                    : "https://placehold.net/9.png"
                }
                title={topicDetails?.name}
              />
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  t/{topicDetails?.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {topicDetails?.description}
                </Typography>
              </CardContent>
              {username == "admin" && (
                <CardActions
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <IconButton onClick={() => navigate("/t/" + topic + "/edit")} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => setIsDeleteDialogOpen(true)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              )}
            </Card>
          )}
          <Typography variant="h6">Most Recent Posts</Typography>
          <PostsList topic={topic || ""} ownUsername={username}></PostsList>
          <Fab
            color="secondary"
            aria-label="Add post"
            size="large"
            onClick={() => navigate("/t/" + topic + "/create")}
            sx={{
              position: "fixed",
              bottom: 32,
              right: 32,
            }}
          >
            <AddIcon></AddIcon>
          </Fab>
        </Box>
      </Fade>
    </Container>
  );
}
