import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { Box, Typography } from "../node_modules/@mui/material/index";
import WorkIcon from "@mui/icons-material/Work";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";

import "./App.css";

const cardStyle = {
  background: "#242424",
  height: "80vh",
  color: "#fff",
};

function QuestionCard({ question }: { question: Question }) {
  return (
    <VerticalTimelineElement
      id={question.date}
      className="vertical-timeline-element--work"
      contentStyle={cardStyle}
      contentArrowStyle={{
        borderRight: "7px solid  #242424",
      }}
      date={question.date}
      iconStyle={{ background: "#242424", color: "#fff", cursor: "pointer" }}
      icon={question.icon}
    >
      <Typography className="vertical-timeline-element-title" variant="h3">
        {question.question}
      </Typography>
      <Typography variant="h4">Miami, FL</Typography>
      <Typography variant="p">
        Creative Direction, User Experience, Visual Design, Project Management,
        Team Leading
      </Typography>
    </VerticalTimelineElement>
  );
}

function App() {
  console.log({ questions });

  return (
    <>
      <VerticalTimeline>
        {questions.map((question: Question, idx) => {
          return (
            <>
              {idx === 0 ? (
                <VerticalTimelineElement
                  contentStyle={{
                    ...cardStyle,
                    marginBottom: "40vh",
                    height: null,
                  }}
                  contentArrowStyle={{
                    borderRight: "7px solid  #242424",
                  }}
                  date=""
                  iconStyle={{
                    background: "#242424",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                  icon={
                    <PlayCircleFilledWhiteIcon
                      onClick={() => window.scrollTo(0, 650)}
                    />
                  }
                >
                  <Typography variant="h6">Nyårsquizzet 2024</Typography>
                  <Typography variant="p">
                    Ett quiz med frågor om året som gått. Totalt 12 frågor - en
                    fråga per månad.
                  </Typography>
                  <Box
                    component="img"
                    sx={{
                      height: 233,
                      width: 500,
                      maxHeight: { xs: 233, md: 167 },
                      maxWidth: { xs: 350, md: 250 },
                    }}
                    alt="The house from the offer."
                    src="https://static.vecteezy.com/system/resources/previews/013/270/791/original/year-2023-outlook-economic-forecast-or-future-vision-business-opportunity-or-challenge-ahead-year-review-or-analysis-concept-confidence-businessman-with-binoculars-climb-up-ladder-on-year-2023-vector.jpg"
                  />
                </VerticalTimelineElement>
              ) : null}
              <QuestionCard question={question} key={question.date} />
            </>
          );
        })}
      </VerticalTimeline>
    </>
  );
}

export default App;

type Question = {
  question: string;
  answers: string[];
  date: string;
  icon: any;
  image: string;
};

const questions: Question[] = [
  {
    question: "Vem är jag?",
    answers: ["Svar 1", "Svar 2", "Svar 3", "Svar 4"],
    image: "",
    date: "Januari 2023",
    icon: <WorkIcon onClick={() => console.log("hejehe")} />,
  },
  {
    question: "Vem är jag?",
    answers: ["Svar 1", "Svar 2", "Svar 3", "Svar 4"],
    image: "",
    date: "Februari 2023",
    icon: <WorkIcon />,
  },
  {
    question: "Vem är jag?",
    answers: ["Svar 1", "Svar 2", "Svar 3", "Svar 4"],
    image: "",
    date: "Mars 2023",
    icon: <WorkIcon />,
  },
  {
    question: "Vem är jag?",
    answers: ["Svar 1", "Svar 2", "Svar 3", "Svar 4"],
    image: "",
    date: "April 2023",
    icon: <WorkIcon />,
  },
  {
    question: "Vem är jag?",
    answers: ["Svar 1", "Svar 2", "Svar 3", "Svar 4"],
    image: "",
    date: "Maj 2023",
    icon: <WorkIcon />,
  },
  {
    question: "Vem är jag?",
    answers: ["Svar 1", "Svar 2", "Svar 3", "Svar 4"],
    image: "",
    date: "Juni 2023",
    icon: <WorkIcon />,
  },
  {
    question: "Vem är jag?",
    answers: ["Svar 1", "Svar 2", "Svar 3", "Svar 4"],
    image: "",
    date: "Juli 2023",
    icon: <WorkIcon />,
  },
  {
    question: "Vem är jag?",
    answers: ["Svar 1", "Svar 2", "Svar 3", "Svar 4"],
    image: "",
    date: "Augusti 2023",
    icon: <WorkIcon />,
  },
  {
    question: "Vem är jag?",
    answers: ["Svar 1", "Svar 2", "Svar 3", "Svar 4"],
    image: "",
    date: "September 2023",
    icon: <WorkIcon />,
  },
  {
    question: "Vem är jag?",
    answers: ["Svar 1", "Svar 2", "Svar 3", "Svar 4"],
    image: "",
    date: "Oktober 2023",
    icon: <WorkIcon />,
  },
  {
    question: "Vem är jag?",
    answers: ["Svar 1", "Svar 2", "Svar 3", "Svar 4"],
    image: "",
    date: "November 2023",
    icon: <WorkIcon />,
  },
  {
    question: "Vem är jag?",
    answers: ["Svar 1", "Svar 2", "Svar 3", "Svar 4"],
    image: "",
    date: "December 2023",
    icon: <WorkIcon />,
  },
];
