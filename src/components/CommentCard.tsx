import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchUser } from "../helpers/fetchers";
import type { Comment } from "../types";
import { getTimeElapsed } from "../helpers/helpers";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import ReplyIcon from "@mui/icons-material/Reply";
import SendIcon from "@mui/icons-material/Send";
import { useSnackbar } from "../SnackbarContext";

export default function CommentCard(props: {
  comment: Comment;
  ownUsername: string;
  onCommentUpdate?: () => void;
  isReply?: boolean;
}) {
  const { showSnackbar } = useSnackbar();
  const { ownUsername, comment, onCommentUpdate } = props;
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [commentUsername, setCommentUsername] = useState<string>("");
  const [commentImage, setCommentImage] = useState<string>("");
  const [commentImageUpdatedAt, setCommentImageUpdatedAt] =
    useState<string>("");
  const [commentBody, setCommentBody] = useState<string>("");
  const [originalCommentBody, setOriginalCommentBody] = useState<string>("");
  const [commentChildren, setCommentChildren] = useState<Comment[]>([]);
  const [reply, setReply] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      id: comment.id,
      body: commentBody,
    };
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
        },
      );
      if (response.ok) {
        setIsEditing(false);
        if (onCommentUpdate) {
          onCommentUpdate();
        }
      } else {
        
      }
    } catch (error) {
      showSnackbar("Error submitting edit: " + error, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      post: comment.post,
      parent: comment.id,
      body: reply,
    };
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_API_URL + "/addcomment",
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
        setIsReplying(false);
        setReply("");
        if (onCommentUpdate) {
          onCommentUpdate();
        }
      } else {
        showSnackbar("Failed to submit reply: " + data, "error");
      }
    } catch (error) {
      showSnackbar("Error submitting reply: " + error, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
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
        },
      );
      const data = await response.text();
      if (response.ok) {
        if (onCommentUpdate) {
          onCommentUpdate();
        }
      } else {
        showSnackbar("Failed to delete comment: " + data, "error");
      }
    } catch (error) {
      showSnackbar("Error deleting comment: " + error, "error");
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await fetchUser(comment.creator);
      if (userData) {
        setCommentUsername(userData.username);
      }
      if (userData?.imageUrl) {
        setCommentImage(
          import.meta.env.VITE_BACKEND_API_URL + userData.imageUrl,
        );
        setCommentImageUpdatedAt(userData.imageUpdatedAt || "");
      }
      setHasLoaded(true);
    };

    setCommentBody(comment.body);
    setOriginalCommentBody(comment.body);
    setCommentChildren(comment.children as Comment[]);
    loadUserData();
  }, [comment]);

  return (
    <Card
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        p: props.isReply ? 0 : 1,
        mb: props.isReply ? 0 : 3,
      }}
      elevation={props.isReply ? 0 : 1}
    >
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete comment?</DialogTitle>
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
        <CardContent sx={{pr: 0}}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
              mb: 2,
              pr: 0, mr: 0,
            }}
          >
            <Avatar
              src={
                commentImage
                  ? commentImage + `?v=${commentImageUpdatedAt || Date.now()}`
                  : ""
              }
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
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              u/{commentUsername} {comment.is_edited ? "(edited) " : ""}-{" "}
              {getTimeElapsed(comment.created_at || "")}
            </Typography>
          </Box>
          <form onSubmit={handleSubmit} style={{ display: "contents" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: {sm: "row", xs: "column"},
                gap: 1,
                alignItems: {sm: "center", xs: "stretch"},
              }}
            >
              <Box sx={{ flex: 1 }}>
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
                  defaultValue={comment.body || ""}
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  sx={{ display: !isEditing ? "none" : "block" }}
                  size="small"
                  required
                  fullWidth
                />
              </Box>

              
                <Box sx={{ display: "flex", gap: 0.5, mr: 1, alignSelf: {sm: "flex-start", xs: "flex-end"} }}>
                  <IconButton
                    size="small"
                    onClick={() => setIsReplying(true)}
                    sx={{ display: isReplying || isEditing ? "none" : "block" }}
                  >
                    <ReplyIcon fontSize="small" />
                  </IconButton>
                  {ownUsername == commentUsername && (
                    <>
                  <IconButton
                    size="small"
                    onClick={() => setIsEditing(true)}
                    sx={{ display: isEditing || isReplying ? "none" : "block" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    sx={{ display: isEditing || isReplying ? "none" : "block" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ display: !isEditing ? "none" : "block" }}
                    onClick={() => {
                      setIsEditing(false);
                      setIsReplying(false);
                      setCommentBody(originalCommentBody);
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    type="submit"
                    sx={{ display: !isEditing ? "none" : "block" }}
                    disabled={isSubmitting}
                  >
                    <CheckIcon fontSize="small" />
                  </IconButton>
                  </>
                  )}
                </Box>
              
            </Box>
          </form>
          <form onSubmit={handleReplySubmit} style={{ display: "contents" }}>
            <Box
              sx={{
                gap: 1,
                alignItems: "center",
                mt: 2,
                display: !isReplying ? "none" : "flex",
              }}
            >
              <TextField
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                size="small"
                required
                fullWidth
                label="Write a reply..."
              />
              <IconButton
                size="small"
                onClick={() => {
                  setIsEditing(false);
                  setIsReplying(false);
                  setCommentBody(originalCommentBody);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" type="submit" disabled={isSubmitting}>
                <SendIcon fontSize="small" />
              </IconButton>
            </Box>
          </form>
          {commentChildren.length > 0 && (
            <Box
              sx={{
                mt: 2,
                pl: 1,
                borderLeft: "2px solid",
                borderColor: "divider",
              }}
            >
              {commentChildren.map((childComment) => (
                <CommentCard
                  key={childComment.id}
                  comment={childComment}
                  ownUsername={ownUsername}
                  onCommentUpdate={onCommentUpdate}
                  isReply={true}
                />
              ))}
            </Box>
          )}
        </CardContent>
      )}
    </Card>
  );
}
