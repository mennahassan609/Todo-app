import React from 'react'
import axios from 'axios'
import { useState } from 'react'
function CreateUser() {
  const[name,setName]=useState()
  const[email,setEmail]=useState()
  const[age,setAge]=useState()
  const Submit=(e)=>{
    e.preventDefault();

    try {
        const response = axios.post('http://localhost:3001/createUser', {
            name: name,
            email: email,
            age: age
        });

        console.log("User created:", response.data);
    } catch (error) {
        console.error("Error creating user:", error);
    }
};

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
    <div className="w-50 bg-white rounded p-3">
      <form onSubmit={Submit}>
        <h2>Add User</h2>
        <div className="mb-2">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" placeholder="Enter Name" className="form-control"
          onChange={(e)=>setName(e.target.value)}/>
        </div>
        <div className="mb-2">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Enter Email" className="form-control" 
          onChange={(e)=>setEmail(e.target.value)}/>
        </div>
        <div className="mb-2">
          <label htmlFor="age">Age</label>
          <input type="text" id="age" placeholder="Enter Age" className="form-control"
          onChange={(e)=>setAge(e.target.value)}/>
        </div>
        <button type="submit" className="btn btn-success">Submit</button>
      </form>
    </div>
  </div>
  )  
}

export default CreateUser
