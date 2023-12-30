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
  Grid,
  Stack,
  Typography,
  IconButton,
} from "../node_modules/@mui/material/index";
import Confetti from "react-confetti";
import WorkIcon from "@mui/icons-material/Work";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import SecurityIcon from "@mui/icons-material/Security";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import ReactAudioPlayer from "react-audio-player";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import PublicIcon from "@mui/icons-material/Public";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import SynagogueIcon from "@mui/icons-material/Synagogue";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import DiamondIcon from "@mui/icons-material/Diamond";
import SportsHockeyIcon from "@mui/icons-material/SportsHockey";
import CastleIcon from "@mui/icons-material/Castle";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import DoneIcon from "@mui/icons-material/Done";
import "./App.css";
const darkTheme: any = createTheme({
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

const cardStyle = {
  background: "#121212",
  padding: 0,
  // height: "auto",
  boxShadow: "none",
};

type AnswersForm = {
  regular: null | Answer;
  extra: null | Answer;
};

function QuestionCard({
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
      <Card>
        <CardContent>
          <CardMedia
            component="img"
            height={240}
            alt="Question image."
            image={question.image}
            sx={{ objectFit: "contain" }}
          />
          <Typography variant="caption">{question.date}</Typography>
          <Typography variant="body1" color="text.secondary">
            {question.question}
          </Typography>
          {question.media ? (
            <ReactAudioPlayer src={question.media} controls />
          ) : null}
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

type AllAnswers = {
  [key: number]: AnswersForm;
};

function App() {
  const [allAnswers, setAllAnswers] = useState<AllAnswers>({});
  const windowSize = useRef([window.innerWidth, window.innerHeight]);
  const [showResult, setShowResult] = useState<number | null>(null);
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
  }, [allAnswers]);

  const handleSetShowResult = () => {
    let points = 0;
    for (const [_, value] of Object.entries(allAnswers)) {
      for (const [_, answer] of Object.entries(value)) {
        if (answer && answer.correct) {
          points += 1;
        }
      }
    }
    setShowResult(points);
    handleScroll("result-card");
  };

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
      handleSetShowResult();
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
            <Card>
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
                  {showResult && showResult >= 10 ? (
                    <EmojiEventsIcon />
                  ) : showResult && showResult >= 7 ? (
                    <EmojiEmotionsIcon />
                  ) : showResult && showResult >= 4 ? (
                    <SentimentNeutralIcon />
                  ) : (
                    <SentimentVeryDissatisfiedIcon />
                  )}
                  <Typography variant="caption">Ditt resultat</Typography>
                  <Typography variant="h1">
                    {showResult ? showResult.toString() : 0}
                  </Typography>
                </Stack>
                {showResult && showResult >= 10 ? (
                  <Confetti
                    width={windowSize.current[0]}
                    height={windowSize.current[1]}
                  />
                ) : null}
              </CardContent>
            </Card>
          </Stack>
        </VerticalTimelineElement>
      </VerticalTimeline>
    </ThemeProvider>
  );
}

export default App;

type Answer = { value: string; correct: boolean };

type Question = {
  question: string;
  answers: Answer[];
  extra?: Answer[];
  date: string;
  icon: any;
  image: string;
  media?: string;
};

const questions: Question[] = [
  {
    question:
      "19 januari döms han av Stockholms tingsrätt till livstids fängelse för grovt spioneri och obehörig befattning med hemlig uppgift. Enligt domen ska han ha skaffat hemliga dokument medan han var anställd på SÄPO och MUST. Vad heter han?",
    answers: [
      { value: "Peyman Kia", correct: true },
      { value: "Payam Kia", correct: false },
      { value: "Said Mahmoudi", correct: false },
      { value: "Milad Alami", correct: false },
    ].sort(() => Math.random() - 0.5),
    image:
      "https://svd.vgc.no/v2/images/3c220f70-a7df-4868-8288-9eeb69f56295?fit=crop&h=551&q=80&upscale=true&w=980&s=da8040c537176a3bcaf721d7b30e4d5d120eb557",
    date: "Januari 2023",
    icon: <SecurityIcon />,
  },
  {
    question:
      "6 februari annonserar Google att de ska släppa AI-textroboten Bard, en huvudkonkurrent till den uppmärksammade ChatGPT. Både Bard och ChatGPT är baserade på en teknik som förkortas LLM. Vad står LLM för (i denna kontext)?",
    answers: [
      { value: "Large Language Model", correct: true },
      { value: "Linear Logic Module", correct: false },
      { value: "Laser Light Modulation", correct: false },
      { value: "Localized Learning Machine", correct: false },
    ].sort(() => Math.random() - 0.5),
    image:
      "https://image.cnbcfm.com/api/v1/image/107256765-1686764019856-gettyimages-1258586433-pekiaridis-notitle230610_npH7H.jpeg?v=1689231661",
    date: "Februari 2023",
    icon: <SmartToyIcon />,
  },
  {
    question:
      "12 mars hölls den 95:e upplagan av Oscarsgalan. Kanske mest uppmärksammad blev denna film som tilldelades hela 7 priser, inklusive priset för 'bästa film'. Vad heter filmen?",
    answers: [
      { value: "Everything Everywhere All at Once", correct: true },
      { value: "All Quiet on the Western Front", correct: false },
      { value: "The Boy, the Mole, the Fox and the Horse", correct: false },
      { value: "Once Upon a Time in Hollywood", correct: false },
    ].sort(() => Math.random() - 0.5),
    image:
      "https://deseret.brightspotcdn.com/dims4/default/3222a44/2147483647/strip/true/crop/800x533+0+222/resize/740x493!/quality/90/?url=https%3A%2F%2Fcdn.vox-cdn.com%2Fthumbor%2FoTPztPSLyPRPpcgrISdBqxxXsxY%3D%2F0x360%3A800x1121%2F800x761%2Ffilters%3Afocal%28410x848%3A411x849%29%2Fcdn.vox-cdn.com%2Fuploads%2Fchorus_asset%2Ffile%2F23387790%2FEEAAO_BY_JAMESJEAN_FINAL_Compressed_220301_161017.jpeg",
    date: "Mars 2023",
    icon: <LocalMoviesIcon />,
  },
  {
    question:
      "15 april utbryter en storskalig väpnad konflikt mellan Sudans militär och den paramilitära gruppen Rapid Support Forces (RFS) och leder till sammandrabbningar över hela landet, huvudsakligen i Sudans huvustad och regionen Darfur. Vad heter huvudstaden i Sudan?",
    answers: [
      { value: "Khartoum", correct: true },
      { value: "Bahir dar", correct: false },
      { value: "Juba", correct: false },
      { value: "Asmara", correct: false },
    ].sort(() => Math.random() - 0.5),
    image:
      "https://assets.thenewhumanitarian.org/s3fs-public/2023-05/sudan-protests-00.jpg",
    date: "April 2023",
    icon: <PublicIcon />,
  },
  {
    question:
      "13 Maj hölls den 67:e upplagan av Eurovision Song Contest 2023 i Liverpool, Storbrittanien. Vinnare, blev Loreen med låten Tattoo. En annan som vunnit ESC är denna artist. Vad heter hon och för vilket land tävlade hon? 1p per rätt svar",
    answers: [
      { value: "Celine Dion", correct: true },
      { value: "Cher", correct: false },
      { value: "Toni Braxton", correct: false },
      { value: "Whitney Houston", correct: false },
    ].sort(() => Math.random() - 0.5),
    extra: [
      { value: "Schweiz", correct: true },
      { value: "Belgien", correct: false },
      { value: "Frankrike", correct: false },
      { value: "Luxemburg", correct: false },
    ].sort(() => Math.random() - 0.5),
    image:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Eurovision_Song_Contest_2023_logo.svg/500px-Eurovision_Song_Contest_2023_logo.svg.png",
    date: "Maj 2023",
    icon: <MusicNoteIcon />,
    media: "./videoplayback.mp4",
  },
  {
    question:
      "2 juni avgår Ilija Batljan som VD för detta bolag efter att bolagets aktie rasat kraftigt under maj månad. Vilket är bolaget?",
    answers: [
      { value: "Samhällsbyggnadsbolaget", correct: true },
      { value: "Oscar Properties", correct: false },
      { value: "SAS", correct: false },
      { value: "Viaplay", correct: false },
    ].sort(() => Math.random() - 0.5),
    image:
      "https://www.byggvarlden.se/wp-content/uploads/2023/06/ilija-batljan-scaled-768x1152-1.jpg",
    date: "Juni 2023",
    icon: <WorkIcon />,
  },
  {
    question:
      "3 juli genomför israelisk militär en omfattande militärräd i Jenin på den ockuperade Västbanken. Attacken resulterar i minst 12 döda palestinier och ett hundratal skadade. Vad är det officiella namnet på israels försvarsmakt (engelska)?",
    answers: [
      { value: "Israel Defence Forces", correct: true },
      { value: "Magen Yisrael Defense Corps", correct: false },
      { value: "Zahal Israel Security Forces", correct: false },
      { value: "Israel National Guard", correct: false },
    ].sort(() => Math.random() - 0.5),
    image:
      "https://universitetslararen.se/wp-content/uploads/2023/10/gaza-israel-map560x350-1024x640.jpg",
    date: "Juli 2023",
    icon: <SynagogueIcon />,
  },
  {
    question:
      "23 Augusti omkommer 10 personer i en flygkrasch utanför Tver i Ryssland, däribland Wagnergruppens ledare Jevgenij Prigozjin och Dmitrij Utkin. Jevgenij Prigozjin har ibland refererats med ett smeknamn, vilket?",
    answers: [
      { value: "Putins kock", correct: true },
      { value: "Tysta finansiären", correct: false },
      { value: "Skugg-generalen", correct: false },
      { value: "Kremls kurir", correct: false },
    ].sort(() => Math.random() - 0.5),
    image:
      "https://cached-images.bonnier.news/cfcdn-screen9/img/G/p/Gp7ny0LGhuClF0Et5HqUIg_image/image.jpg?interpolation=lanczos-none&fit=around%7C480:270&crop=480:h;center,top&output-quality=80",
    date: "Augusti 2023",
    icon: <FlightLandIcon />,
  },
  {
    question:
      "15 september hade Kung Carl XVI jubileum för att ha suttit ett antal år som Sveriges regent. Hur många år?",
    answers: [
      { value: "50 år", correct: true },
      { value: "40 år", correct: false },
      { value: "45 år", correct: false },
      { value: "55 år", correct: false },
    ].sort(() => Math.random() - 0.5),
    image:
      "https://www.kungahuset.se/images/200.53910c0d187220f8087a9c/1679909845398/4%20HMK%20hero%201380x920.jpg",
    date: "September 2023",
    icon: <WorkIcon />,
  },
  {
    question:
      "2 oktober meddelas att Katalin Karikó och Drew Weissman ska tilldelas årets nobelpris i fysiologi eller medicin för 2023. Nobelförsamlingen vid Karolinska Institutet skriver följande i sitt pressmeddelande: De belönade upptäckterna blev avgörande för utvecklingen av effektiva mRNA-vacciner mot covid-19. Vad står m:et för i mRNA-vacciner?",
    answers: [
      { value: "Messenger", correct: true },
      { value: "Molecular", correct: false },
      { value: "Mature", correct: false },
      { value: "Medical", correct: false },
    ].sort(() => Math.random() - 0.5),
    image:
      "https://cdn.thecollector.com/wp-content/uploads/2023/06/what-is-the-nobel-prize-coin-award.jpg",
    date: "Oktober 2023",
    icon: <DiamondIcon />,
  },
  {
    question:
      "14 november blir Henrik Lundqvist invald som åttonde svensk i NHL:s Hockey Hall of Fame. Vilket hockey-lag är Henrik Lundqvist mest känd för att ha spelat i?",
    answers: [
      { value: "New York Rangers", correct: true },
      { value: "Pittsburgh Penguins", correct: false },
      { value: "Toronto Maple Leafs", correct: false },
      { value: "Detroit Red Wings", correct: false },
    ].sort(() => Math.random() - 0.5),
    image:
      "https://media.gq.com/photos/64398a2692b71bd35e95a87d/master/w_1600%2Cc_limit/henrik%2520stick.jpg",
    date: "November 2023",
    icon: <SportsHockeyIcon />,
  },
  {
    question:
      "(SISTA FRÅGAN) 10 december tillträder Javier Milei posten som Argentinas president. Hans politiska framgång anses bygga på ett stort missnöje hos argentinska väljare med utbredd korruption och det politiska etablissemangets misslyckade hantering av ekonomin som resulterat i djup ekonomisk kris. Argentinas presidenter har en särskild byggnad som officiell arbetsplats, vad kallas den byggnaden?",
    answers: [
      { value: "Casa Rosada", correct: true },
      { value: "Palacio del Congreso", correct: false },
      { value: "Quinta de Olivos", correct: false },
      { value: "Torre Monumental", correct: false },
    ].sort(() => Math.random() - 0.5),
    image:
      "https://polarjournal.ch/wp-content/uploads/2023/12/Javier_Milei_y_Victoria_Villarruel.jpg",
    date: "December 2023",
    icon: <CastleIcon />,
  },
];
