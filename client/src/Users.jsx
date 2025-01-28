import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Users() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

   
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }

        axios.get('http://localhost:3001/getUser/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(result => {
            setUser(result.data);
        })
        .catch(err => console.log(err));
    }, [navigate]);

    const handleEdit = () => {
        navigate(`/update/${user._id}`);
    };

    const goToTodoList = () => {
        navigate('/todo'); 
    };

    if (!user) {
        return <div>Loading...</div>; 
    }

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <h2>User Information</h2>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Age</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.age}</td>
                            <td>
                                <button className='btn btn-success' onClick={handleEdit}>Update</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button className='btn btn-primary' onClick={goToTodoList}>Go to Todo List</button>
            </div>
        </div>
    );
}

export default Users;
