import { Tables } from "@/database.types";
import { create } from "zustand";

export enum QuizStepState {
  INIT = 0,
  QUESTION = 1,
  STATISTIC = 2,
  END = 3,
}

interface QuizValues {
  state: Tables<"quizstate"> | null;
  question: Tables<"questions"> | null;
  answers: Tables<"answers">[];
  user: Tables<"users"> | null;
  users: Tables<"users">[];
  scores: Tables<"scores">[];
}

interface QuizActions {
  setState: (state: Tables<"quizstate"> | undefined) => void;
  setQuestion: (question: Tables<"questions"> | undefined) => void;
  setAnswers: (answers: Tables<"answers">[]) => void;
  setUser: (user: Tables<"users"> | undefined) => void;
  setUsers: (user: Tables<"users">[]) => void;
  updateUsers: (user: Tables<"users">) => void;
  setScores: (scores: Tables<"scores">[]) => void;
}

type QuizState = QuizActions & QuizValues;

const initValues: QuizValues = {
  state: null,
  question: null,
  answers: [],
  user: null,
  users: [],
  scores: [],
};

export const useQuizStore = create<QuizState>()((set) => ({
  state: initValues.state,
  question: initValues.question,
  answers: initValues.answers,
  user: initValues.user,
  users: initValues.users,
  scores: initValues.scores,
  setState: (state) => set(() => ({ state })),
  setQuestion: (question) => set(() => ({ question })),
  setAnswers: (answers) => set(() => ({ answers })),
  setUser: (user) => set(() => ({ user })),
  setUsers: (users) => set(() => ({ users })),
  updateUsers: (user) => set((state) => ({ users: [...state.users, user] })),
  setScores: (scores) => set(() => ({ scores })),
}));
