import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateUser() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }

        axios.get(`http://localhost:3001/getUser/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(result => {
            setName(result.data.name);
            setEmail(result.data.email);
            setPhone(result.data.phone);
        })
        .catch(err => {
            console.log(err);
            navigate('/login');
        });
    }, [id, navigate]);

    const Update = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        axios.put(`http://localhost:3001/updateUser/${id}`, { name, email, phone}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(result => {
            console.log(result);
            navigate('/users');
        })
        .catch(err => {
            console.log(err);
        });
    };

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <form onSubmit={Update}>
                    <h2>Update User</h2>
                    <div className="mb-2">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" placeholder="Enter Name" className="form-control" 
                            value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="Enter Email" className="form-control"
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="phone">Phone</label>
                        <input type="text" id="phone" placeholder="Enter Phone" className="form-control" 
                            value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    
                    <button type="submit" className="btn btn-success">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateUser;
