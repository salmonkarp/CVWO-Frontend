import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
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

  useEffect(() => {
    const loadData = async () => {
      setTopicDetails(await fetchTopic(topic || ""));
    };
    loadData().then(() => setIsLoading(false));
  }, [topic]);

  return (
    <Container sx={{ display: "flex", minHeight: "100vh" }}>
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
                  <IconButton color="secondary">
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
