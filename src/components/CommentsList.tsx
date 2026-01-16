import { Box, Pagination, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchComments } from "../helpers/Fetchers";
import CommentCard from "./CommentCard";

const COMMENTS_PER_PAGE = 10;

export default function CommentsList(props: {topic: string; postId: string, ownUsername: string, refreshTrigger?: number}) {
    const topic = props.topic;
    const postId = props.postId;
    const [comments, setComments] = useState<Array<any>>([]);
    const [page, setPage] = useState(1);

    const handlePageChange = (value: number) => {
        setPage(value);
    }

    useEffect(() => {
        const loadData = async () => {
            setComments(await fetchComments(postId || ''));
        }
        loadData();
    }, [topic, props.refreshTrigger]);

    return (
        <Box sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
        }}>
            <Box sx={{ flexGrow: 1, width: "100%" }}>
                {comments.slice((page - 1) * COMMENTS_PER_PAGE, page * COMMENTS_PER_PAGE).map((comment) => (
                    <CommentCard comment={comment} ownUsername={props.ownUsername}></CommentCard>
                ))}
                {
                    comments.length === 0 && (
                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography variant="h6">No replies yet. Create one now!</Typography>
                        </Box>
                    )
                }
            </Box>
            
            <Box sx={{ mt: "auto", display: "flex", justifyContent: "center" }}>
                <Pagination count={Math.ceil(comments.length / COMMENTS_PER_PAGE)} page={page} onChange={(_event, value) => handlePageChange(value)} />
            </Box>

        </Box>
    );
}