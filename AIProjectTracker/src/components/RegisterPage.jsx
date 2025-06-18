import React from 'react'
import { useState } from 'react';


export const RegisterPage = () => {
const [formData, setFormData] = useState({
  username: '',
  password: '',
});

const [message , setMessage] = useState('');
 const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

const handlesubmit = async (e) =>{
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessage(data.message || 'Registration successful');
      // Optionally, redirect to login or home page
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('Registration failed. Please try again.');
    }
  }


  return (
    // <div>RegisterPage</div>
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handlesubmit}>
       
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        /><br /><br /> 
        {/* <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        /><br /><br /> */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br /><br />
        <button type="submit">Register</button>
      </form>
     
    </div>
  
  )
}
