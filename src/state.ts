import { atom } from "recoil";

export interface Todo {
  id: string,
  name: string;
  completed: boolean;
}

const initialState: Todo[] = [];

export const todosState = atom({
  key: 'todos',
  default: initialState,
});


export interface Question {
  _id: string;
  quizId: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions: Question[]
}

const initialQuizzesState: Quiz[] = []

export const quizzesState = atom({
  key: 'quizzes',
  default: initialQuizzesState,
});


export interface Answer {
  questionId: string;
  answerIndex: number | null;
}

export interface QuizAnswer {
  quiz: Quiz | null;
  answers: Answer[];
}

const initialAnswer: QuizAnswer = {
  quiz: null,
  answers: []
};

export const answerState = atom({
  key: 'answer',
  default: initialAnswer
})
