import { useEffect, useState } from "react";
import { VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import { Answer, Question } from "../questions";
import ReactAudioPlayer from "react-audio-player";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export const cardStyle = {
  background: "none",
  padding: 0,
  boxShadow: "none",
};

export type AnswersForm = {
  regular: null | Answer;
  extra: null | Answer;
};

function AnswerButton({
  answer,
  prefix,
  onClickButton,
  clicked,
  extra = false,
}: {
  answer: Answer;
  prefix: string;
  onClickButton: (answer: Answer) => void;
  clicked: boolean;
  extra?: boolean;
}) {
  return (
    <Button
      color={!extra ? "primary" : "secondary"}
      variant={clicked ? "contained" : "outlined"}
      size="small"
      sx={{ width: "100%", height: "100%" }}
      onClick={() => {
        onClickButton(answer);
      }}
    >
      <Typography
        variant="caption"
        sx={{ width: "100%", wordWrap: "break-word" }}
      >
        {prefix}. {answer.value}
      </Typography>
    </Button>
  );
}

export default function QuestionCard({
  question,
  admin,
  onClick,
  onClickBack,
}: {
  question: Question;
  admin: boolean;
  onClick: (answers: AnswersForm) => void;
  onClickBack: () => void;
}) {
  const [answers, setAnswers] = useState<AnswersForm>({
    regular: null,
    extra: null,
  });

  const handleSetAnswer = (answer: Answer, extra: boolean = false) => {
    console.debug("Set answer");
    if (extra) {
      console.debug("extra");
      setAnswers((prev) => {
        return { ...prev, extra: answer };
      });
    } else {
      console.debug("regular");
      setAnswers((prev) => {
        return { ...prev, regular: answer };
      });
    }
  };

  useEffect(() => {
    console.debug({ answers });
  }, [answers]);

  return (
    <VerticalTimelineElement
      id={question.date}
      className="vertical-timeline-element--work"
      contentStyle={{ ...cardStyle, marginBottom: 450 }}
      contentArrowStyle={{
        borderRight: "7px solid #1E1E1E",
      }}
      iconStyle={{ background: "#121212", color: "#fff", cursor: "pointer" }}
      icon={question.icon}
      iconOnClick={() => onClick(answers)}
    >
      <Card sx={{ maxHeight: "95vh", overflow: "scroll" }}>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <CardMedia
              component="img"
              height={240}
              alt="Question image."
              image={question.image}
              sx={{ objectFit: "contain" }}
            />
            {question.media ? (
              <ReactAudioPlayer
                src={question.media}
                controls
                style={{ width: "15rem", height: "2rem" }}
              />
            ) : null}
            <Typography variant="caption">{question.date}</Typography>
            <Typography variant="body1" color="text.secondary">
              {question.question}
            </Typography>
          </Stack>

          <Grid container spacing={2} mt={2}>
            {question.answers.map((answer, idx) => {
              return (
                <Grid item xs={6} key={`answer-button-${answer.value}`}>
                  <AnswerButton
                    onClickButton={(answer: Answer) =>
                      handleSetAnswer(answer, false)
                    }
                    clicked={
                      !!answers.regular &&
                      answers.regular.value === answer.value
                    }
                    answer={answer}
                    prefix={["A", "B", "C", "D"][idx]}
                  />
                </Grid>
              );
            })}
            {question.extra
              ? question.extra.map((answer, idx) => {
                  return (
                    <Grid
                      item
                      xs={6}
                      key={`extra-answer-button-${answer.value}`}
                    >
                      <AnswerButton
                        onClickButton={(answer: Answer) => {
                          handleSetAnswer(answer, true);
                        }}
                        clicked={
                          !!answers.extra &&
                          answers.extra.value === answer.value
                        }
                        answer={answer}
                        prefix={["E", "F", "G", "H"][idx]}
                        extra
                      />
                    </Grid>
                  );
                })
              : null}
            <Grid item xs={6}>
              <IconButton onClick={onClickBack}>
                <ArrowBackIosIcon />
              </IconButton>
            </Grid>
            <Grid item xs={6}>
              <IconButton
                onClick={() => onClick(answers)}
                disabled={
                  !admin &&
                  ((question.extra && !answers.extra) || !answers.regular)
                }
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </VerticalTimelineElement>
  );
}
