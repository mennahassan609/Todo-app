import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './App.css'; 

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');

    // Fetch todos based on the status filter
    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get(`http://localhost:3001/todo?status=${filter}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => setTodos(response.data))
        .catch((error) => console.error('Error fetching todos:', error));
    }, [filter]);

    // Delete a todo item
    const deleteTodo = async (id) => {
        const token = localStorage.getItem('token');

        try {
            await axios.delete(`http://localhost:3001/todo/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const token = localStorage.getItem('token');
        const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';

        try {
            const response = await axios.put(`http://localhost:3001/todo/${id}`, {
                status: newStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTodos(todos.map(todo => 
                todo._id === id ? { ...todo, status: newStatus } : todo
            ));
        } catch (error) {
            console.error('Error updating todo status:', error);
        }
    };

    const filteredTodos = todos.filter(todo =>
        todo.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h2>Todo List</h2>

            <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div>
                <button onClick={() => setFilter('Pending')}>Show Pending</button>
                <button onClick={() => setFilter('Completed')}>Show Completed</button>
            </div>
            
            <div className="button-group">
                <Link to="/add-todo" className="btn btn-primary">Add New Todo</Link>
                <Link to="/" className="btn btn-secondary">Personal Details</Link>
            </div>
            
            <Link to="/logout" className="logout-button">
                Logout
            </Link>

            <ul>
                {filteredTodos.map(todo => (
                    <li key={todo._id}>
                        <h3>{todo.title}</h3>
                        <p>{todo.description}</p>
                        <p>Status: {todo.status}</p>
                        <p>Due Date: {new Date(todo.dueDate).toLocaleDateString()}</p>
                        
                        <button onClick={() => toggleStatus(todo._id, todo.status)}>
                            Mark as {todo.status === 'Pending' ? 'Completed' : 'Pending'}
                        </button> |

                        <Link to={`/edit/${todo._id}`} className="btn btn-warning">Edit</Link> |
                        <button onClick={() => deleteTodo(todo._id)} className="btn btn-danger">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;
