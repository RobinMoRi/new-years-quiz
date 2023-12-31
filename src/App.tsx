import { useEffect, useRef, useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import { Question, questions } from "./questions";
import QuestionCard, {
  cardStyle,
  AnswersForm,
} from "./components/QuestionCard";
import Confetti from "react-confetti";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import DoneIcon from "@mui/icons-material/Done";
import "./App.css";
declare module "@mui/material/styles" {
  interface Theme {
    overrides: Object;
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    overrides: Object;
  }
}
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  overrides: {
    MuiCard: {
      root: {
        backgroundImage: "none",
        boxShadow: "none",
      },
    },
    MuiPaper: {
      root: {
        backgroundImage: "none",
        boxShadow: "none",
      },
    },
  },
});

type AllAnswers = {
  [key: number]: AnswersForm;
};

function App() {
  const [allAnswers, setAllAnswers] = useState<AllAnswers>({});
  const windowSize = useRef([window.innerWidth, window.innerHeight]);
  const [points, setPoints] = useState<number>(0);
  const [searchParams, _] = useSearchParams();

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const rect = element.getBoundingClientRect();
      const absoluteElementTop = rect.top + window.pageYOffset;
      window.scrollTo({
        top: absoluteElementTop - 20,
        behavior: "smooth", // for smooth scrolling
      });
    }
  };

  useEffect(() => {
    console.debug({ allAnswers });
    let newPoints = 0;
    for (const [_, value] of Object.entries(allAnswers)) {
      for (const [_, answer] of Object.entries(value)) {
        if (answer && answer.correct) {
          newPoints += 1;
        }
      }
    }
    setPoints(newPoints);
  }, [allAnswers]);

  const handleClickNext = (answersForm: AnswersForm, idx: number) => {
    console.log({ answersForm });
    setAllAnswers((prev) => {
      let newAllAnswers = { ...prev };
      newAllAnswers[idx] = answersForm;
      return newAllAnswers;
    });

    const nextId = questions[idx + 1]?.date;
    if (nextId) {
      // handleScroll("intro-card");
      handleScroll(nextId);
    } else {
      handleScroll("result-card");
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <VerticalTimeline layout="1-column-left" lineColor={"#A9A9A9"}>
        <VerticalTimelineElement
          id="intro-card"
          key="intro-card"
          style={{ background: "none" }}
          contentStyle={{
            ...cardStyle,
            marginBottom: windowSize.current[1] * 0.6,
            height: undefined,
          }}
          contentArrowStyle={{
            borderRight: "7px solid #1E1E1E",
          }}
          date=""
          iconStyle={{
            background: "#121212",
            color: "#fff",
            cursor: "pointer",
          }}
          iconOnClick={() => {
            const nextId = "Januari 2023";
            handleScroll(nextId);
          }}
          icon={<PlayCircleFilledWhiteIcon />}
        >
          <Stack spacing={2} alignItems="center">
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <CardMedia
                  component="img"
                  height={240}
                  alt="Question image."
                  image="https://static.vecteezy.com/system/resources/previews/013/270/791/original/year-2023-outlook-economic-forecast-or-future-vision-business-opportunity-or-challenge-ahead-year-review-or-analysis-concept-confidence-businessman-with-binoculars-climb-up-ladder-on-year-2023-vector.jpg"
                  sx={{ objectFit: "contain" }}
                />
                <Typography variant="caption">Nyårsquizzet 2024</Typography>
                <Typography variant="body1" color="text.secondary">
                  Ett quiz med frågor om året som gått. Totalt 12 frågor - en
                  fråga per månad. Varje fråga ger en poäng om inget annat
                  anges.
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    const nextId = "Januari 2023";
                    handleScroll(nextId);
                  }}
                >
                  Starta
                </Button>
              </CardActions>
            </Card>
          </Stack>
        </VerticalTimelineElement>
        {questions.map((question: Question, idx) => {
          return (
            <QuestionCard
              question={question}
              key={question.date}
              admin={searchParams.get("admin") === "True"}
              onClick={(answersForm: AnswersForm) =>
                handleClickNext(answersForm, idx)
              }
              onClickBack={() => {
                const prevId = questions[idx - 1]?.date;
                if (!prevId) {
                  handleScroll("intro-card");
                }
                handleScroll(prevId);
              }}
            />
          );
        })}

        <VerticalTimelineElement
          id="result-card"
          key="result-card"
          style={{ background: "none" }}
          contentStyle={{
            ...cardStyle,
            marginBottom: windowSize.current[1] * 0.6,
            height: undefined,
          }}
          contentArrowStyle={{
            borderRight: "7px solid #1E1E1E",
          }}
          date=""
          iconStyle={{
            background: "#121212",
            color: "#fff",
            cursor: "pointer",
          }}
          icon={<DoneIcon />}
        >
          <Stack spacing={2} alignItems="center">
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Stack alignItems="center" spacing={2}>
                  {points >= 10 ? (
                    <EmojiEventsIcon />
                  ) : points >= 7 ? (
                    <EmojiEmotionsIcon />
                  ) : points >= 4 ? (
                    <SentimentNeutralIcon />
                  ) : (
                    <SentimentVeryDissatisfiedIcon />
                  )}
                  <Typography variant="caption">Ditt resultat</Typography>
                  <Typography variant="h1">{points.toString()}</Typography>
                </Stack>
                {points >= 10 ? (
                  <Confetti
                    width={windowSize.current[0]}
                    height={windowSize.current[1]}
                  />
                ) : null}
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    const nextId = "intro-card";
                    handleScroll(nextId);
                  }}
                >
                  Starta om
                </Button>
              </CardActions>
            </Card>
          </Stack>
        </VerticalTimelineElement>
      </VerticalTimeline>
    </ThemeProvider>
  );
}

export default App;
