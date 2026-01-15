import { Container, Fade, Box, Toolbar, Button, Card, CardActions, CardContent, CardMedia, IconButton, Typography, Avatar, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { ArrowBack } from "@mui/icons-material";
import { getTimeElapsed } from "../helpers/Helpers";
import { fetchPost, fetchTopic, fetchUser } from "../helpers/Fetchers";

export default function Topic(props: {username: string; onLogout: () => void}) {
    const { username, onLogout } = props;
    const { topic, postId } = useParams<{topic: string, postId: string}>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);
    const [postDetails, setPostDetails] = useState<any>(null);
    const [postImage, setPostImage] = useState<string>("");
    const [postUsername, setPostUsername] = useState<string>("");
    const [topicDetails, setTopicDetails] = useState<any>(null);
    const navigate = useNavigate();

    const loadUserData = async (postData: any) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        const userData = await fetchUser(postData.creator || "");
        if (userData)
            setPostUsername(userData.username);
        if (userData.imageUrl)
            setPostImage(import.meta.env.VITE_BACKEND_API_URL + userData.imageUrl);
    }

    useEffect(() => {
        const loadData = async () => {
            setTopicDetails(await fetchTopic(topic || ''));
            setPostDetails(await fetchPost(postId || ''));
            if (postDetails) {
                await loadUserData(postDetails);
            }
            setIsLoading(false);
            setHasLoaded(true);
        };
        loadData();
    }, [topic, postId]);

    return (
        <Container sx={{display:'flex', minHeight: '100vh'}}>
            <NavBar onLogout={onLogout} window={window} />
            <Fade in={!isLoading} timeout={500}>
            <Box
                sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                gap: 2
                }}
            >
                <Toolbar />
                <Box sx={{ height: 20, mb: 2, ml: -1 }}>
                    <IconButton onClick={() => navigate('/t/' + topic)}>
                    <ArrowBack />
                    </IconButton>
                </Box>
                <Card>
                    <CardMedia 
                        sx={{ height: 140 }}
                        image={topicDetails?.imageUrl ? import.meta.env.VITE_BACKEND_API_URL + topicDetails.imageUrl + `?v=${topicDetails.imageUpdatedAt || Date.now()}` : "https://placehold.net/9.png"}
                        title={topicDetails?.name}
                    />
                    { !hasLoaded ? (
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
                            src={postImage}
                            sx={{
                                width: 32,
                                height: 32,
                                backgroundColor: "primary.main",
                            }}
                            >
                            {postUsername ? postUsername[0].toLocaleLowerCase() : ""}
                            </Avatar>
                            <Typography variant="subtitle2" color="text.secondary">
                            Posted by u/{postUsername} in t/{topic} -{" "}
                            {getTimeElapsed(postDetails.created_at)}
                            </Typography>
                        </Box>
                        <Typography variant="h5">{postDetails?.title}</Typography>
                        <Typography variant="body1">{postDetails?.body}</Typography>
                    </CardContent>
                    )}
                </Card>
            </Box>
            </Fade>
        </Container>
    );
}
