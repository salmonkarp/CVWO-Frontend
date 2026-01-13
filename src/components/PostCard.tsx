import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";

export default function PostCard(props: {post: any}) {
    const { post } = props;
    console.log("Rendering PostCard for post:", post);
    return (
        <Card sx={{flexGrow: 1}}>
            <CardContent>
                <Typography variant="h6">{post.title}</Typography>
                <Typography variant="body1">{post.body}</Typography>
            </CardContent>
            <CardActions sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button>View</Button>
            </CardActions>
        </Card>
    );
}