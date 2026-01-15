import { Container, Fade, Box, Toolbar, Button, Card, CardActions, CardContent, CardMedia, IconButton, Typography, Avatar, Skeleton, Fab } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { ArrowBack } from "@mui/icons-material";
import { getTimeElapsed } from "../helpers/Helpers";
import ReplyIcon from '@mui/icons-material/Reply';
import { fetchPost, fetchTopic, fetchUser } from "../helpers/Fetchers";
import CommentsList from "../components/CommentsList";

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
            const topicData = await fetchTopic(topic || '');
            setTopicDetails(topicData);
            const postData = await fetchPost(postId || '');
            setPostDetails(postData);
            if (postData) {
                await loadUserData(postData);
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
                p: {
                    md: 4,
                    xs: 2
                },
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
                <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                    { !hasLoaded ? (
                    <CardContent sx={{ flex: 1 }}>
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
                    <CardContent sx={{ flex: 1 }}>
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
                            <Typography variant="subtitle1" color="text.secondary">
                            Posted by u/{postUsername} in t/{topic} -{" "}
                            {getTimeElapsed(postDetails.created_at)}
                            </Typography>
                        </Box>
                        <Typography variant="h5">{postDetails?.title}</Typography>
                        <Typography variant="body1">{postDetails?.body}</Typography>
                    </CardContent>
                    )}
                    <CardMedia 
                        sx={{ width: { xs: '100%', md: 200 }, height: { xs: 'auto', md: 140 }, flexShrink: 0, minHeight: { xs: 200, md: 140 } }}
                        image={topicDetails?.imageUrl ? import.meta.env.VITE_BACKEND_API_URL + topicDetails.imageUrl + `?v=${topicDetails.imageUpdatedAt || Date.now()}` : "https://placehold.net/9.png"}
                        title={topicDetails?.name}
                    />
                </Card>
                <Typography variant="h6">Replies</Typography>
                <CommentsList topic={topic || ''} ownUsername={username} postId={postId || ''}></CommentsList>
                <Fab color="secondary" aria-label="Reply" size="large" onClick={() => navigate("/t/" + topic + "/p/" + postId + "/reply")}
                sx={
                    {
                    position: "fixed",
                    bottom: 32,
                    right: 32
                }}>
                    <ReplyIcon></ReplyIcon>
                </Fab>
            </Box>
            </Fade>
        </Container>
    );
}
