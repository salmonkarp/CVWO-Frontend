import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  CardActionArea,
} from "@mui/material";
import { useNavigate } from "react-router";

export default function TopicCard(props: { topic: any }) {
  const { topic } = props;
  const navigate = useNavigate();
  return (
    <Grid
      size={{ xs: 12, sm: 6, md: 4 }}
      key={topic.id}
      sx={{
        display: "flex",
      }}
    >
      <Card
        sx={{
          flexGrow: 1,
        }}
      >
        <CardActionArea
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "flex-start",
          }}
          onClick={() => navigate(`/t/${topic.name}`)}
        >
          <CardMedia
            sx={{ height: 140 }}
            image={
              topic.imageUrl
                ? import.meta.env.VITE_BACKEND_API_URL +
                  topic.imageUrl +
                  `?v=${topic.imageUpdatedAt || Date.now()}`
                : "https://placehold.net/9.png"
            }
            title={topic.name}
          />
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
              }}
            >
              t/{topic.name}
            </Typography>
            <Typography
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {topic.description}
            </Typography>
            {/* TODO: Limit description length in DB later or concat here */}
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
