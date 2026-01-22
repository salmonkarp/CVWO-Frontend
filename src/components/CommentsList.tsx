import { Box, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { fetchComments } from "../helpers/fetchers";
import CommentCard from "./CommentCard";
import type { Comment } from "../types";

export default function CommentsList(props: {topic: string; postId: string, ownUsername: string, refreshTrigger?: number}) {
    const postId = props.postId;
    const [comments, setComments] = useState<Comment[]>([]);

    const loadData = useCallback(async () => {
        handleCommentTree(await fetchComments(postId) || []); 
    }, [postId])

    useEffect(() => {
        loadData();
    }, [postId, props.refreshTrigger, loadData])

    const handleCommentTree = (commentsData: Comment[] = []) => {
        const commentMap: {[key: number]: Comment & { children: Comment[] }} = {};
        const rootComments: (Comment & { children: Comment[] })[] = [];
        commentsData.forEach((comment) => {
            const idNum = typeof comment.id === 'string' ? parseInt(comment.id) : (comment.id as number);
            commentMap[idNum] = { ...comment, children: [] };
        });
        commentsData.forEach((comment) => {
            const idNum = typeof comment.id === 'string' ? parseInt(comment.id) : (comment.id as number);
            if (comment.parent !== undefined && comment.parent !== null) {
                const parentId = typeof comment.parent === 'string' ? parseInt(comment.parent) : (comment.parent as number);
                if (commentMap[parentId]) {
                    commentMap[parentId].children.push(commentMap[idNum]);
                }
            } else {
                rootComments.push(commentMap[idNum]);
            }
        });
        setComments(rootComments);
    };

    return (
        <Box sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
        }}>
            <Box sx={{ flexGrow: 1, width: "100%" }}>
                {comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} ownUsername={props.ownUsername} onCommentUpdate={loadData} isReply={false}></CommentCard>
                ))}
                {
                    comments.length === 0 && (
                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography variant="h6">No replies yet. Create one now!</Typography>
                        </Box>
                    )
                }
            </Box>
        </Box>
    );
}