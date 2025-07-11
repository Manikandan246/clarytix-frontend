import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import LogoutButton from './LogoutButton';

function StudentDashboard() {
    const studentName = localStorage.getItem('username') || 'Student';
    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const studentId = localStorage.getItem('userId');
    const [availableQuizzes, setAvailableQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch(`https://clarytix-backend.onrender.com/student/quizzes?studentId=${studentId}`);
                const data = await response.json();
                if (data.success && Array.isArray(data.availableQuizzes)) {
                    setAvailableQuizzes(data.availableQuizzes);
                } else {
                    setAvailableQuizzes([]);
                    console.warn('No available quizzes found');
                }
            } catch (error) {
                console.error('Error fetching quizzes:', error);
                setAvailableQuizzes([]);
            }
        };
        fetchQuizzes();
    }, [studentId]);

    return (
        <div className="dashboard">
            <header>
                <img src={schoolLogo} alt="School Logo" className="school-logo" />
                <h1>Available Quizzes</h1>
                <button onClick={() => navigate('/old-quizzes')} className="secondary-button">
                    Access Old Quizzes
                </button>
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
                    {availableQuizzes.length === 0 ? (
                        <tr><td colSpan="4">No quizzes available.</td></tr>
                    ) : (
                        availableQuizzes.map((quiz, index) => (
                            <tr key={index}>
                                <td>{quiz.class}</td>
                                <td>{quiz.subject}</td>
                                <td>{quiz.topic}</td>
                                <td>
                                    <button onClick={() => navigate(`/quiz?topicId=${quiz.topic_id}`)}>Start Quiz</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default StudentDashboard;
