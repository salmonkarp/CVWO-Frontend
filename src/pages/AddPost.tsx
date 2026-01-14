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
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { DashboardProps } from "./Dashboard";
import { ArrowBack } from "@mui/icons-material";

export default function AddTopic(props: DashboardProps) {
  const { onLogout } = props;
  const topic = useParams<{topic: string}>();
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
        name: title,
        description: body,
    }
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_API_URL + "/addpost",
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
        navigate("/topics");
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

  return (
    <Container sx={{ display: "flex", minHeight: "100vh" }}>
      <NavBar onLogout={onLogout} window={window} />
      <Container
        sx={{
          p: 4,
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
                  sm: 300
              },
              margin: "0 auto",
            }}
          >
            <Box sx={{ height: 20, position: 'absolute', ml: -3, mt: -3}}>
                <IconButton onClick={() => navigate('/t/' + topic.topic)}>
                <ArrowBack />
                </IconButton>
            </Box>
            <Typography variant="h5" align="center" sx={{mt: 2}}>
              Add a new post to t/{topic.topic}
            </Typography>
            <TextField
                key="title"
                label="Title"
                variant="standard"
                value={title}
                onChange={(e) => {setTitle(e.target.value); setIsError(false); setErrorMessage("");}}
                required
            ></TextField>
            <TextField
                key="body"
                label="Body"
                variant="standard"
                multiline
                value={body}
                onChange={(e) => {setBody(e.target.value); setIsError(false); setErrorMessage("");}}
                required
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
