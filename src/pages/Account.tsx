import { Avatar, Box, Button, Container, Fade, Paper, styled, TextField, Toolbar, Typography } from "@mui/material";
import NavBar from "../components/NavBar";
import type { DashboardProps } from "./Dashboard";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useEffect, useState } from "react";
import { fetchUser } from "../helpers/fetchers";
import { useSnackbar } from "../SnackbarContext";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const maxFileSizeInBytes = 2 * 1024 * 1024;

export default function Account(props: DashboardProps) {
    const { showSnackbar } = useSnackbar();
    const { username, onLogout } = props;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [imageUpdatedAt, setImageUpdatedAt] = useState<string>("");
    const [fadeIn, setFadeIn] = useState(false);

    const loadUserData = async () => {
        const userData = await fetchUser(username || "");
        if (userData?.imageUrl) {
            setImageUrl(import.meta.env.VITE_BACKEND_API_URL + userData.imageUrl);
            setImageUpdatedAt(userData.imageUpdatedAt || '');
        }
        setFadeIn(true);
    };

    useEffect(() => {
        loadUserData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (file == null) return;
        setIsSubmitting(true);
        const base64Image = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
        const payload = {
            image: base64Image || null,
        }
        try {
            const response = await fetch(
                import.meta.env.VITE_BACKEND_API_URL + "/edituser",
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
                loadUserData();
                showSnackbar("Profile updated successfully.", "success");
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
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsError(false);
        setErrorMessage("");
        if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];
        if (selectedFile.size > maxFileSizeInBytes) {
            setIsError(true);
            setErrorMessage("File size exceeds 2MB limit.");
            return;
        }
        setFile(selectedFile);
    }
  };

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
        <form onSubmit={handleSubmit}>
          <Fade in={fadeIn} timeout={500}>
            <Paper
                sx={{
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: {
                        xs: "80%",
                        sm: 400
                    },
                    margin: "0 auto",
                }}
            >
                <Typography variant="h5" align="center">
                    Account Information
                </Typography>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    gap: 2,
                }}>
                    <Avatar src={file ? URL.createObjectURL(file) : imageUrl + `?v=${imageUpdatedAt || Date.now()}`}></Avatar>
                    <TextField
                        label="Name"
                        variant="standard"
                        value={username}
                        disabled
                        fullWidth
                    ></TextField>
                </Box>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    sx={{mt:2}}
                    >
                    Upload Image
                    <VisuallyHiddenInput
                        type="file"
                        onChange={handleFileChange}
                        multiple
                    />
                </Button>
                {file && <Typography variant="body2">Selected file: {file.name}</Typography>}

                {isError && (
                <Typography variant="body2" color="error">
                    {errorMessage}
                </Typography>
                )}

                <Button
                variant="contained"
                type="submit"
                sx={{ mt: 2, width: "30%", alignSelf: "end" }}
                loading={isSubmitting}
                >
                Save
                </Button>
                        </Paper>
                    </Fade>
                </form>
        </Container>
    </Container>
  );
}