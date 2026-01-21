import {
    Box,
  Button,
  Container,
  IconButton,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { DashboardProps } from "./Dashboard";
import { ArrowBack } from "@mui/icons-material";
import { fetchPost } from "../helpers/fetchers";

export default function AddTopic(props: DashboardProps) {
  const { onLogout } = props;
  const params = useParams<{topic: string, postId: string}>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
        id: parseInt(params.postId || ''),
        title: title,
        body: body,
    }
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_API_URL + "/editpost",
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
        navigate("/t/" + params.topic + "/p/" + params.postId);
      } else {
        setIsError(true);
        setErrorMessage(
          data || "Failed to submit the post. Please try again."
        );
      }
    } catch {
      setIsError(true);
      setErrorMessage("Failed to submit the post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

    useEffect(() => {
        const loadData = async () => {
            const postData = await fetchPost(params.postId || "");
            setTitle(postData.title);
            setBody(postData.body);
        };
        loadData();
    }, [params.postId]);

    const tooLong = body?.split(/\r?\n|\r|\n/g).length > 10;

  return (
    <Container sx={{ display: "flex", minHeight: "100vh" }}>
      <NavBar onLogout={onLogout} window={window} />
      <Container
        sx={{
          p: {
              md: 4,
              xs: 2
          },
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          flexGrow: 1,
          gap: 2,
        }}
      >
        <Toolbar />
        
        <form onSubmit={handleSubmit} style={{ display: "contents" }}>
          <Paper
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: {
                  xs: "80%",
                  md: 400
              },
              margin: "0 auto",
            }}
          >
            <Box sx={{ height: 20, position: 'absolute', ml: -3, mt: -3}}>
                <IconButton onClick={() => navigate('/t/' + params.topic + '/p/' + params.postId)}>
                <ArrowBack />
                </IconButton>
            </Box>
            <Typography variant="h6" align="left" sx={{mt: 3}}>
              Edit your post in <Box fontWeight={700} display="inline">t/{params.topic}</Box>
            </Typography>
            <TextField
                key="title"
                label="Title"
                variant="outlined"
                value={title}
                onChange={(e) => {setTitle(e.target.value); setIsError(false); setErrorMessage("");}}
                required
            ></TextField>
            <TextField
                key="body"
                label="Body"
                variant="outlined"
                multiline
                rows = {4}
                value={body}
                error={tooLong}
                helperText={tooLong ? "Body cannot exceed 10 lines." : ""}
                onChange={(e) => {setBody(e.target.value); setIsError(false); setErrorMessage("");}}
            ></TextField>

            {isError && (
              <Typography variant="body2" color="error">
                {errorMessage}
              </Typography>
            )}

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
              disabled={tooLong}
              loading={isSubmitting}
            >
              Submit
            </Button>
          </Paper>
        </form>
      </Container>
    </Container>
  );
}
