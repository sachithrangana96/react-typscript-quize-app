import React, { useState } from 'react';
import { GlobalStyle,Wrapper } from './App.styles';

//comonents
import QuestionCard from './components/QuestionCard';
import { fetchQuizQuestions } from './API';

//enum
import { QuestionsState, Difficulty } from './API';

export type AnswerObject = {
   question:string;
   answer:string;
   correct:boolean;
   correctAnswer:string;
}

const TOTAL_QUESTIONS = 10;

const  App = () => {
  const [loading,setLoading] = useState(false);
  const [questions,setQuestions] = useState<QuestionsState[]>([]);
  const [number,setNumber] = useState(0);
  const [userAnswers,setUserAnswers] = useState<AnswerObject[]>([]);
  const [score,setScore] = useState(0);
  const [gameOver,setGameOver] = useState(true);

  const startTrivia =async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    ); 

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  }

  console.log(questions)

  const checkAnswer = (e:React.MouseEvent<HTMLButtonElement>) => {

    if(!gameOver){
      const answer = e.currentTarget.value;
      const correct = questions[number]?.correct_answer === answer;

      if(correct) setScore(prev => prev + 1);

      const answerObject = {
        question: questions[number]?.question,
        answer,
        correct,
        correctAnswer:questions[number].correct_answer,
      };
      setUserAnswers(prev=> [...prev,answerObject]);

    }
  }

  const nextQuestion = () => {
    const nextQuestion = number + 1;

    if(nextQuestion === TOTAL_QUESTIONS){
      setGameOver(true);

    }else{
      setNumber(nextQuestion);
    }
  }

  return (
    <>
      <GlobalStyle />
      <Wrapper>
      <h1>QUIZ</h1>
      {
        gameOver || userAnswers?.length === TOTAL_QUESTIONS ?   (
          <button className='start' onClick={startTrivia}>
            Start
          </button>
           
        ) : null
      }
      {
        !gameOver ? (
          <p className='score'>Score : {score} </p>

        ) : null
      }

      {
        loading ? (
          <p>Loading Questions</p>
        ) : null
      }

      {
        !loading && !gameOver && ( 
          <QuestionCard
          questionNr={number + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
        )
      }
     
     {
      !loading &&  !gameOver && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS -1 ? (

        <button className='next' onClick={nextQuestion}>
        Next Question
      </button>
      ) : null

     }
       </Wrapper>
    </>
  );
}

export default App;
