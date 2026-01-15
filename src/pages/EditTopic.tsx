import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  IconButton,
  Paper,
  styled,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import NavBar from "../components/NavBar";
import type { DashboardProps } from "./Dashboard";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ArrowBack } from "@mui/icons-material";
import { fetchTopic } from "../helpers/Fetchers";

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

export default function EditTopic(props: DashboardProps) {
    const { onLogout } = props;
    const params = useParams<{topic: string}>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageUpdatedAt, setImageUpdatedAt] = useState(0);
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    var payload;
    if (file== null) {
      payload = {
        name,
        description,
        image: null,
      }
    } else {
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      payload = {
        name,
        description,
        image: base64Image || null,
      }
    }
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_API_URL + "/edittopic",
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
        navigate("/t/" + name);
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

  useEffect(() => {
    const loadData = async () => {
      const topicData = await fetchTopic(params.topic || '');
      setName(topicData.name);
      setDescription(topicData.description);
      setImageUrl(topicData.imageUrl);
      setImageUpdatedAt(topicData.imageUpdatedAt);
    }
    loadData();
  }, [params]);

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
                  md: 400
              },
              margin: "0 auto",
            }}
          >
            <Box sx={{ height: 20, position: 'absolute', ml: -3, mt: -3}}>
                <IconButton onClick={() => navigate('/t/' + params.topic)}>
                <ArrowBack />
                </IconButton>
            </Box>
            <Typography variant="h5" align="left" sx={{mt: 3}}>
              Edit t/{params.topic}
            </Typography>
            <TextField
              key="name"
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => {setName(e.target.value); setIsError(false); setErrorMessage("");}}
              disabled
              required
            ></TextField>
            <TextField
              key="description"
              label="Description (optional)"
              variant="outlined"
              multiline
              rows={4}
              value={description}
              onChange={(e) => {setDescription(e.target.value); setIsError(false); setErrorMessage("");}}
            ></TextField>
            
            {
                !file && imageUrl && (
                    <>
                    <Typography variant="overline" sx={{mb: -2}}>Uploaded image:</Typography>
                    <Card>
                        <CardMedia 
                        image={import.meta.env.VITE_BACKEND_API_URL + imageUrl + `?v=${imageUpdatedAt || Date.now()}`}
                        sx={{height: 140}}
                        />  
                    </Card>
                    </>
                )
            }
            

            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{mt:2}}
            >
              Upload a Different Image
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
              fullWidth
              sx={{ mt: 1 }}
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
