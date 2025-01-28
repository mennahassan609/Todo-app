import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddTodo() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('Pending');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://localhost:3001/todo', {
                title,
                description,
                dueDate,
                status,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('To-Do added:', response.data);

            navigate('/todo');
        } catch (error) {
            console.error('Error adding to-do:', error);
        }
    };

    return (
        <div>
            <h3>Add To-Do</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                </select>
                <button type="submit">Add To-Do</button>
            </form>
        </div>
    );
}

export default AddTodo;
