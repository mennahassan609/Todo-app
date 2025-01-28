import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditTodo() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Pending');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:3001/todo/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((response) => {
      const todo = response.data;
      setTitle(todo.title);
      setDescription(todo.description);
      setDueDate(todo.dueDate);
      setStatus(todo.status);
    })
    .catch((error) => console.error('Error fetching todo:', error));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(`http://localhost:3001/todo/${id}`, {
        title,
        description,
        dueDate,
        status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Todo updated:', response.data);
      navigate('/todo');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Edit Todo</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit">Update Todo</button>
      </form>
    </div>
  );
}

export default EditTodo;
