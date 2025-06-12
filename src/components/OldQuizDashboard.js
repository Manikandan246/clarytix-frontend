import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OldQuizDashboard.css';
import LogoutButton from './LogoutButton';

function OldQuizDashboard() {
    const studentName = localStorage.getItem('username') || 'Student';
    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const studentId = localStorage.getItem('userId');
    const [quizHistory, setQuizHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizHistory = async () => {
            try {
                const response = await fetch(`https://clarytix-backend.onrender.com/student/quiz-history?studentId=${studentId}`);
                const data = await response.json();
                if (data.success && Array.isArray(data.quizHistory)) {
                    setQuizHistory(data.quizHistory);
                } else {
                    setQuizHistory([]);
                    console.warn('No quiz history found');
                }
            } catch (error) {
                console.error('Error fetching quiz history:', error);
                setQuizHistory([]);
            }
        };
        fetchQuizHistory();
    }, [studentId]);

    return (
        <div className="dashboard">
            <header>
                <img src={schoolLogo} alt="School Logo" className="school-logo" />
                <h1>Quiz History</h1>
                <LogoutButton />
            </header>

            <table className="quiz-table">
                <thead>
                    <tr>
                        <th>Class</th>
                        <th>Subject</th>
                        <th>Topic</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {quizHistory.length === 0 ? (
                        <tr><td colSpan="4">No quizzes attempted yet.</td></tr>
                    ) : (
                        quizHistory.map((quiz, index) => (
                            <tr key={index}>
                                <td>{quiz.class}</td>
                                <td>{quiz.subject}</td>
                                <td>{quiz.topic}</td>
                                <td>
                                    <button onClick={() => navigate(`/quiz?topicId=${quiz.topic_id}`)}>Retake Quiz</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default OldQuizDashboard;
