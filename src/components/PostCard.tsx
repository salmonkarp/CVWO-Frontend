import { Avatar, Box, Button, Card, CardActions, CardContent, Skeleton, Typography } from "@mui/material";
import { fetchUserData } from "../helpers/fetchers";
import { useEffect, useState } from "react";
import { getTimeElapsed } from "../helpers/helpers";

export default function PostCard(props: {post: any, ownUsername: string}) {
    const { ownUsername, post } = props;
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);
    const [postUsername, setPostUsername] = useState<string>('');
    const [image, setImage] = useState<string>('');

    useEffect(() => {
        const loadUserData = async () => {
            // await new Promise(resolve => setTimeout(resolve, 200));
            const userData = await fetchUserData(post.creator || '');
            if (userData) {
                setPostUsername(userData.username);
            }
            if (userData.imageUrl) {
                setImage(import.meta.env.VITE_BACKEND_API_URL + userData.imageUrl);
            }
            setHasLoaded(true);
        };
        loadUserData();
    }, []);

    return ( 
        
        <Card sx={{flexGrow: 1, mb: 3}}>
            {!hasLoaded ? (
                <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="text" width={150} height={20} />
                    </Box>
                    <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={20} />
                </CardContent>
            ) : (
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
                        {postUsername ? postUsername[0].toLocaleLowerCase() : ""}
                    </Avatar>
                    <Typography variant="subtitle2" color="text.secondary">
                        Posted by u/{postUsername} in t/{post.topic} - {getTimeElapsed(post.created_at)}
                    </Typography>
                </Box>
                <Typography variant="h6">{post.title}</Typography>
                <Typography variant="body1">{post.body}</Typography>
            </CardContent>
            )}
            <CardActions sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button>View</Button>
                <Button>Reply</Button>
                { ownUsername == postUsername && (
                    <Button>Delete</Button>
                )}
            </CardActions>
            
            
        </Card>
    );
}