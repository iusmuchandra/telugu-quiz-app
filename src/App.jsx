import React, { useState, useEffect } from 'react';
// --- NEW: Import our database instance and Firestore functions ---
import { db } from './firebase-config';
import { collection, getDocs } from "firebase/firestore";

// --- SVG Icons and other components (No changes) ---
const FilmIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg> );
const StarIcon = ({ className }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> );
const CheckCircleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> );
const XCircleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> );
const WelcomeScreen = ({ onStart, isLoading }) => ( <div className="text-center"><div className="flex justify-center items-center mb-6"><FilmIcon /><h1 className="text-4xl md:text-5xl font-bold text-yellow-300 tracking-wider">Tollywood Trivia</h1></div><p className="text-lg md:text-xl text-white mb-8">Test your knowledge of Telugu Cinema with high-quality questions!</p><button onClick={onStart} disabled={isLoading} className="bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 ease-in-out shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center">{isLoading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Loading Quiz...</>) : ('Start Quiz')}</button></div> );
const ResultScreen = ({ score, total, onRestart }) => { const percentage = Math.round((score / total) * 100); let feedback = {}; if (percentage >= 80) { feedback = { message: "Superstar Performance!", color: "text-green-400" }; } else if (percentage >= 50) { feedback = { message: "Blockbuster Hit!", color: "text-blue-400" }; } else { feedback = { message: "Needs a Re-watch!", color: "text-red-400" }; } return ( <div className="text-center bg-gray-800 bg-opacity-70 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto"><h2 className="text-3xl font-bold text-yellow-300 mb-4">Quiz Complete!</h2><p className={`text-2xl font-semibold mb-2 ${feedback.color}`}>{feedback.message}</p><p className="text-5xl font-bold text-white my-6">{score} <span className="text-2xl text-gray-400">/ {total}</span></p><div className="flex justify-center mb-8">{[...Array(total)].map((_, i) => ( <StarIcon key={i} className={`w-8 h-8 ${i < score ? 'text-yellow-400' : 'text-gray-600'}`} /> ))}</div><button onClick={onRestart} className="bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 ease-in-out shadow-lg">Play Again</button></div> ); };
const QuizScreen = ({ question, onAnswer, questionNumber, totalQuestions }) => { const [selectedOption, setSelectedOption] = useState(null); const [isAnswered, setIsAnswered] = useState(false); useEffect(() => { setSelectedOption(null); setIsAnswered(false); }, [question]); const handleOptionClick = (option) => { if (isAnswered) return; setIsAnswered(true); setSelectedOption(option); setTimeout(() => { onAnswer(option); }, 1200); }; const getButtonClass = (option) => { if (!isAnswered) return "bg-gray-700 hover:bg-gray-600"; if (option === question.correctAnswer) return "bg-green-600 animate-pulse"; if (option === selectedOption) return "bg-red-600"; return "bg-gray-700 opacity-60"; }; const getIcon = (option) => { if (!isAnswered) return null; if (option === question.correctAnswer) return <CheckCircleIcon />; if (option === selectedOption) return <XCircleIcon />; return null; }; return ( <div className="w-full max-w-2xl mx-auto"><div className="mb-6 text-center"><p className="text-yellow-300 font-semibold">Question {questionNumber} / {totalQuestions}</p><div className="w-full bg-gray-700 rounded-full h-2.5 mt-2"><div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}></div></div></div><div className="bg-gray-800 bg-opacity-70 p-6 md:p-8 rounded-2xl shadow-2xl"><h2 className="text-xl md:text-2xl font-semibold text-white mb-6 text-center">{question.question}</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{question.options.map((option, index) => ( <button key={index} onClick={() => handleOptionClick(option)} disabled={isAnswered} className={`w-full text-left p-4 rounded-lg font-medium text-white transition-all duration-300 ease-in-out transform ${getButtonClass(option)} ${!isAnswered ? 'hover:scale-105' : ''} flex justify-between items-center`}><span>{option}</span>{getIcon(option)}</button>))}</div></div></div> ); };


export default function App() {
    const [gameState, setGameState] = useState('welcome');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // We can remove the localStorage logic for now to keep this example simple
    // but you could add it back easily!

    const shuffleArray = (array) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    // --- NEW: This function now fetches all questions from your Firestore database ---
    const startNewQuiz = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Get all documents from the "questions" collection
            const querySnapshot = await getDocs(collection(db, "questions"));
            const allQuestions = querySnapshot.docs.map(doc => doc.data());

            if (allQuestions.length === 0) {
              throw new Error("No questions found in the database.");
            }

            // Shuffle the entire question database and pick the first 10
            const quizQuestions = shuffleArray(allQuestions).slice(0, 10);

            // Shuffle the options within each question
            const shuffledQuestions = quizQuestions.map(q => ({
                ...q,
                options: shuffleArray([...q.options])
            }));

            setQuestions(shuffledQuestions);
            setCurrentQuestionIndex(0);
            setScore(0);
            setGameState('quiz');
        } catch (e) {
            console.error("Failed to fetch questions from Firestore:", e);
            setError("Could not load questions from the database. Please try again.");
            setGameState('welcome');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswer = (selectedAnswer) => {
        if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
            setScore(prevScore => prevScore + 1);
        }
        const nextQuestionIndex = currentQuestionIndex + 1;
        if (nextQuestionIndex < questions.length) {
            setCurrentQuestionIndex(nextQuestionIndex);
        } else {
            setGameState('result');
        }
    };

    const restartGame = () => {
        setGameState('welcome');
        setQuestions([]);
        setError(null);
    };

    return (
        <main className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
            <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-yellow-400 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-purple-600 rounded-full opacity-10 blur-3xl"></div>
            <div className="z-10 w-full flex flex-col items-center">
                {error && <div className="bg-red-500 text-white p-4 rounded-lg mb-4 text-center">{error}</div>}

                {gameState === 'welcome' && <WelcomeScreen onStart={startNewQuiz} isLoading={isLoading} />}

                {gameState === 'quiz' && questions.length > 0 && (
                    <QuizScreen
                        question={questions[currentQuestionIndex]}
                        onAnswer={handleAnswer}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={questions.length}
                    />
                )}

                {gameState === 'result' && (
                    <ResultScreen
                        score={score}
                        total={questions.length}
                        onRestart={restartGame}
                    />
                )}
            </div>
        </main>
    );
}
