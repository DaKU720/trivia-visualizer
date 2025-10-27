import React, { useEffect, useState } from 'react';
import './App.css';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from 'recharts';

function App() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        fetch('https://opentdb.com/api.php?amount=50')
            .then(response => response.json())
            .then(data => {
                if (data && data.results) {
                    setQuestions(data.results);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error while fetching data:', error);
                setLoading(false);
            });
    }, []);

    const getUniqueCategories = () => {
        const categories = questions.map(q => q.category);
        return [...new Set(categories)];
    };

    const getFilteredQuestions = () => {
        if (selectedCategory === 'all') return questions;
        return questions.filter(q => q.category === selectedCategory);
    };

    const getCategoryDistribution = () => {
        const counts = {};
        getFilteredQuestions().forEach(q => {
            counts[q.category] = (counts[q.category] || 0) + 1;
        });
        return Object.entries(counts).map(([category, count]) => ({
            category,
            count
        }));
    };

    const getDifficultyDistribution = () => {
        const counts = { easy: 0, medium: 0, hard: 0 };
        getFilteredQuestions().forEach(q => {
            counts[q.difficulty] = (counts[q.difficulty] || 0) + 1;
        });
        return Object.entries(counts).map(([difficulty, count]) => ({
            difficulty,
            count
        }));
    };

    return (
        <div className="container">
            <h1>Trivia Visualizer</h1>
            {loading ? (
                <p>Loading questions...</p>
            ) : (
                <>
                    <label htmlFor="category-select">Filter category: </label>
                    <select
                        id="category-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    >
                        <option value="all">All</option>
                        {getUniqueCategories().map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <h2>Questions by category</h2>
                    <ResponsiveContainer width="100%" height={500}>
                        <BarChart
                            data={getCategoryDistribution()}
                            margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="category"
                                tick={{ fontSize: 10 }}
                                interval={0}
                                angle={-45}
                                textAnchor="end"
                                height={150}
                            />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#e378fc" />
                        </BarChart>
                    </ResponsiveContainer>

                    <h2 style={{ marginTop: '40px' }}>Questions by difficulty</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={getDifficultyDistribution()}
                            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="difficulty"
                                tick={{ fontSize: 14 }}
                                interval={0}
                                angle={0}
                                textAnchor="middle"
                            />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#35a9dd" />
                        </BarChart>
                    </ResponsiveContainer>
                </>
            )}
        </div>
    );
}

export default App;