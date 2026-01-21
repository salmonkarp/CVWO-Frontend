import { TextField, InputAdornment, IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useParams } from "react-router-dom";

export default function ReplyInput(props: { onCommentAdded?: () => void, isFocused?: boolean, setIsFocused?: (focused: boolean) => void }) {
    const params = useParams<{postId: string}>();
    const [replyContent, setReplyContent] = useState("");
    const [localIsFocused, setLocalIsFocused] = useState(props.isFocused || false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (props.isFocused) {
      setLocalIsFocused(true);
      inputRef.current?.focus();
    } else {
      setLocalIsFocused(false);
    }
  }, [props.isFocused]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            post: parseInt(params.postId || ''), 
            body: replyContent
        }

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
                }
            );
            const data = await response.text();
            if (!response.ok) {
                setIsError(true);
                setErrorMessage(
                data || "Failed to submit the comment. Please try again."
                );
            } else {
                setReplyContent('');
                props.onCommentAdded?.();
            }
        } catch {
            setIsError(true);
            setErrorMessage("Failed to submit the comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
        <TextField
            fullWidth
            variant="outlined"
            label="Reply to the post here..."
            onFocus={() => {
              setLocalIsFocused(true);
              props.setIsFocused?.(true);
            }}
            onBlur={() => {
              setLocalIsFocused(false);
              props.setIsFocused?.(false);
            }}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            disabled={isSubmitting}
            error={isError}
            helperText={errorMessage}
            focused={props.isFocused ?? localIsFocused}
            inputRef={inputRef}
            slotProps={{
              input: {
                endAdornment: ((props.isFocused ?? localIsFocused) || replyContent) && (
                  <InputAdornment position="end">
                    <IconButton color="primary" type="submit" disabled={isSubmitting}>
                      <SendIcon></SendIcon>
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </form>
    )
}