import {
  Button,
  Container,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import NavBar from "../components/NavBar";
import type { DashboardProps } from "./Dashboard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTopic(props: DashboardProps) {
  const { onLogout, username } = props;
  // TODO: Add image upload later
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_API_URL + "/addtopic",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("token") || "").token
            }`,
          },
          body: JSON.stringify({ name, description }),
        }
      );
      const data = await response.text();
      if (response.ok) {
        navigate("/topics");
      } else {
        setIsError(true);
        setErrorMessage(
          data || "Failed to submit the topic. Please try again."
        );
      }
    } catch {
      setIsError(true);
      setErrorMessage("Failed to submit the topic. Please try again.");
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
              width: 300,
              margin: "0 auto",
            }}
          >
            <Typography variant="h5" align="center">
              Add a new topic
            </Typography>
            <TextField
              key="name"
              label="Name"
              variant="standard"
              value={name}
              onChange={(e) => {setName(e.target.value); setIsError(false); setErrorMessage("");}}
              required
              error={isError}
              helperText={errorMessage}
            ></TextField>
            <TextField
              key="description"
              label="Description"
              variant="standard"
              multiline
              value={description}
              onChange={(e) => {setDescription(e.target.value); setIsError(false); setErrorMessage("");}}
            ></TextField>

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
