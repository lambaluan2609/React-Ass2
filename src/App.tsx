import React from 'react';
import './css/App.css';
import { QuizzesPage } from './components/QuizzesPage';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { QuizDetailPage } from './components/QuizDetailPage';
import { QuizResult } from './components/QuizResult';
const App = () => {
  return (
    <div className="App">
      <div className="container">
        <h1 className="app-title" style={{ color: 'orange' }}>
          QUIZZES FPT
        </h1>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<QuizzesPage />} />
            <Route path="/quiz/:id" element={<QuizDetailPage />} />
            <Route path="/quiz-result" element={<QuizResult />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
