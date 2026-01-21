import { Box, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { fetchComments } from "../helpers/fetchers";
import CommentCard from "./CommentCard";

export default function CommentsList(props: {topic: string; postId: string, ownUsername: string, refreshTrigger?: number}) {
    const postId = props.postId;
    const [comments, setComments] = useState<Array<any>>([]);

    const loadData = useCallback(async () => {
        handleCommentTree(await fetchComments(postId || '')); 
    }, [postId])

    useEffect(() => {
        loadData();
    }, [postId, props.refreshTrigger, loadData])

    const handleCommentTree = (commentsData: any[]) => {
        const commentMap: {[key: number]: any} = {};
        const rootComments: any[] = [];
        commentsData.forEach(comment => {
            commentMap[comment.id] = {...comment, children: []};
        });
        commentsData.forEach(comment => {
            if (comment.parent) {
                const parentId = parseInt(comment.parent);
                if (commentMap[parentId]) {
                    commentMap[parentId].children.push(commentMap[comment.id]);
                }
            } else {
                rootComments.push(commentMap[comment.id]);
            }
        });
        setComments(rootComments);
    }

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