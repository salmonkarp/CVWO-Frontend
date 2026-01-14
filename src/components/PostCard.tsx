import { Avatar, Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { fetchUserData } from "../helpers/fetchers";
import { useEffect, useState } from "react";

export default function PostCard(props: {post: any}) {
    const { post } = props;
    console.log(post);
    const [username, setUsername] = useState<string>('');
    const [image, setImage] = useState<string>('');

    useEffect(() => {
        const loadUserData = async () => {
            const userData = await fetchUserData(post.creator || '');
            if (userData) {
                setUsername(userData.username);
            }
            if (userData.imageUrl) {
                setImage(import.meta.env.VITE_BACKEND_API_URL + userData.imageUrl);
            }
        };
        loadUserData();
        console.log("Fetched user data for post creator:", username, image);
    }, []);

    return (
        <Card sx={{flexGrow: 1}}>
            <CardContent>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2
                }}>
                    <Avatar 
                        src={image} 
                        sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: 'primary.main'
                        }}
                    >
                        {username ? username[0].toLocaleLowerCase() : ""}
                    </Avatar>
                    <Typography variant="subtitle2" color="text.secondary">
                        Posted by u/{username} in t/{post.topic} - {new Date(post.created_at).toLocaleString()}
                    </Typography>
                </Box>
                <Typography variant="h6">{post.title}</Typography>
                <Typography variant="body1">{post.body}</Typography>
            </CardContent>
            <CardActions sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button>View</Button>
                <Button>Reply</Button>
            </CardActions>
        </Card>
    );
}