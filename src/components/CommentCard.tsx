import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchUser } from "../helpers/Fetchers";
import { getTimeElapsed } from "../helpers/Helpers";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

export default function CommentCard(props: {
  comment: any;
  ownUsername: string;
  onCommentUpdate?: () => void;
}) {
  const { ownUsername, comment, onCommentUpdate } = props;
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [commentUsername, setCommentUsername] = useState<string>("");
  const [commentImage, setCommentImage] = useState<string>("");
  const [commentImageUpdatedAt, setCommentImageUpdatedAt] = useState<string>("");
  const [commentBody, setCommentBody] = useState<string>("");
  const [originalCommentBody, setOriginalCommentBody] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
        id: comment.id,
        body: commentBody,
    }
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_API_URL + "/editcomment",
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
        setIsEditing(false);
        if (onCommentUpdate) {
          onCommentUpdate();
        }
      } else {
        alert("Failed to update comment: " + data);
      }
    } catch (error) {
      alert("Error updating comment: " + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_API_URL + "/deletecomment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("token") || "").token
            }`,
          },
          body: JSON.stringify({ id: comment.id }),
        }
      );
      const data = await response.text();
      if (response.ok) {
        if (onCommentUpdate) {
          onCommentUpdate();
        }
      } else {
        alert("Failed to delete comment: " + data);
      }
    } catch (error) {
      alert("Error deleting comment: " + error);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await fetchUser(comment.creator || "");
      if (userData) {
        setCommentUsername(userData.username);
      }
      if (userData.imageUrl) {
        setCommentImage(
          import.meta.env.VITE_BACKEND_API_URL + userData.imageUrl
        );
        setCommentImageUpdatedAt(userData.imageUpdatedAt);
      }
      setHasLoaded(true);
    };
    setCommentBody(comment.body);
    setOriginalCommentBody(comment.body);
    loadUserData();
  }, [comment.body]);

  return (
    <Card sx={{ flexGrow: 1, mb: 3, display: "flex", flexDirection: "column" }}>
      {!hasLoaded ? (
        <CardContent>
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
          <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="80%" height={20} />
        </CardContent>
      ) : (
        <CardContent>
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
              src={commentImage + `?v=${commentImageUpdatedAt || Date.now()}`}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: "primary.main",
              }}
            >
              {commentUsername ? commentUsername[0].toLocaleLowerCase() : ""}
            </Avatar>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0,
              }}
            >
              u/{commentUsername} - {getTimeElapsed(comment.created_at)}
            </Typography>
          </Box>
          <form onSubmit={handleSubmit} style={{ display: "contents" }}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {comment.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
                display={isEditing ? "none" : "block"}
              >
                {commentBody}
              </Typography>
              <TextField
                defaultValue={comment.body}
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                sx={{ display: !isEditing ? "none" : "block" }}
                size="small"
                required
                fullWidth
              />
            </Box>
            {ownUsername == commentUsername && (
              <Box sx={{ display: "flex", gap: 0.5}}>
                <IconButton size="small" onClick={() => setIsEditing(true)} sx={{ display: isEditing ? "none" : "block"}}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleDelete} sx={{ display: isEditing ? "none" : "block"}}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ display: !isEditing ? "none" : "block"}} onClick={() => {setIsEditing(false); setCommentBody(originalCommentBody);}}>
                  <CloseIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" type="submit" sx={{ display: !isEditing ? "none" : "block"}} disabled={isSubmitting}>
                  <CheckIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
