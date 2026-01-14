import { Avatar, Box, Button, Container, Paper, styled, TextField, Toolbar, Typography } from "@mui/material";
import NavBar from "../components/NavBar";
import type { DashboardProps } from "./Dashboard";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useEffect, useState } from "react";
import { fetchUserData } from "../helpers/fetchers";

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

    const { username, onLogout } = props;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        const loadUserData = async () => {
            const userData = await fetchUserData(username || '');
            if (userData.imageUrl) {
                setFile(import.meta.env.VITE_BACKEND_API_URL + userData.imageUrl);
            }
        };
        loadUserData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setIsError(false);
        setErrorMessage("");

        
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsError(false);
        setErrorMessage("");
        // TODO: Enforce file size limit on backend as well
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
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          flexGrow: 1,
          gap: 2,
        }}
      >
        <Toolbar />
        
        <form onSubmit={handleSubmit} style={{display: "contents"}}>
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
                    <Avatar src={file ? URL.createObjectURL(file) : undefined}></Avatar>
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
        </form>
        </Container>
    </Container>
  );
}