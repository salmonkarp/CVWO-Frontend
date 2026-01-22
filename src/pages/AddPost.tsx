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
  const topic = useParams<{ topic: string }>();
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
      title: title,
      body: body,
      topic: topic.topic,
    };
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
        },
      );
      const data = await response.text();
      if (response.ok) {
        navigate("/t/" + topic.topic);
      } else {
        setIsError(true);
        setErrorMessage(data || "Failed to submit the post. Please try again.");
      }
    } catch {
      setIsError(true);
      setErrorMessage("Failed to submit the post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tooLong = body?.split(/\r?\n|\r|\n/g).length > 10;

  return (
    <Container sx={{ display: "flex", minHeight: "100vh" }}>
      <NavBar onLogout={onLogout} window={window} />
      <Container
        sx={{
          p: {
            md: 4,
            xs: 2,
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
                md: 400,
              },
              margin: "0 auto",
            }}
          >
            <Box sx={{ height: 20, position: "absolute", ml: -3, mt: -3 }}>
              <IconButton onClick={() => navigate("/t/" + topic.topic)}>
                <ArrowBack />
              </IconButton>
            </Box>
            <Typography variant="h6" align="left" sx={{ mt: 3 }}>
              Add a new post to{" "}
              <Box fontWeight={700} display="inline">
                t/{topic.topic}
              </Box>
            </Typography>
            <TextField
              key="title"
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setIsError(false);
                setErrorMessage("");
              }}
              required
            ></TextField>
            <TextField
              key="body"
              label="Body"
              variant="outlined"
              multiline
              rows={4}
              maxRows={5}
              value={body}
              error={tooLong}
              helperText={tooLong ? "Body cannot exceed 10 lines." : ""}
              onChange={(e) => {
                setBody(e.target.value);
                setIsError(false);
                setErrorMessage("");
              }}
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
