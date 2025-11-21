import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../feature/userSlice.jsx';
import { AvatarGenerator } from 'random-avatar-generator';


const GOOGLE_REGISTER_API_URL = "http://localhost:8080/api/auth/google-register";
const generator = new AvatarGenerator();

export const RegisterPage = () => {
const [formData, setFormData] = useState({
  username: '',
  password: '',
});

const [message , setMessage] = useState('');
const navigate = useNavigate();
const dispatch = useDispatch();
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
      if (data.message && data.message.includes('successful')) {
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('Registration failed. Please try again.');
    }
  }

  // Google Sign-up handler - using GoogleLogin component to get id_token
  const handleGoogleSignUpSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      console.log("Google Success Callback Fired:", credentialResponse);
      console.log("ID Token:", idToken);
      
      if (!idToken) {
        setMessage("Failed to get Google token. Please try again.");
        return;
      }

      // Decode the JWT to get user info
      const base64Url = idToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const googleUser = JSON.parse(jsonPayload);
      
      console.log("Google User from token:", googleUser);
      const avatar = generator.generateRandomAvatar();
      
      // Send Google id_token to your backend for registration
      const response = await axios.post(GOOGLE_REGISTER_API_URL, {
        token: idToken,
        // email: googleUser.email,
        // name: googleUser.name,
        // picture: googleUser.picture,
      });
      console.log("Response:", response);

      // If registration successful, also log them in
      if (response.data.jwt) {
        console.log("Response data:", response.data);
        localStorage.setItem("token", response.data.jwt);
        localStorage.setItem("username", googleUser.name || googleUser.email);
        localStorage.setItem("avatar", googleUser.picture || avatar);
        
        dispatch(
          login({
            username: googleUser.name || googleUser.email,
            token: response.data.jwt,
            loggedIn: true,
            avatar: googleUser.picture || avatar,
            email: googleUser.email,
          })
        );
        
        setMessage("Registration and login successful");
        navigate("/home");
      } else {
        setMessage(response.data.message || "Registration successful");
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error) {
      console.error("Google sign-up failed:", error);
      setMessage(error.response?.data?.message || "Google sign-up failed. Please try again.");
    }
  };

  const handleGoogleSignUpError = () => {
    console.error("Google sign-up error");
    setMessage("Google sign-up failed. Please try again.");
  };


  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Register</h2>
      {message && (
        <p style={{ 
          color: message.includes('successful') ? 'green' : 'red',
          marginBottom: '15px'
        }}>
          {message}
        </p>
      )}
      <form onSubmit={handlesubmit} style={{ marginBottom: '20px' }}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }}
        />
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Register
        </button>
      </form>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        margin: '20px 0',
        textAlign: 'center'
      }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
        <span style={{ padding: '0 10px', color: '#666' }}>OR</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          onSuccess={handleGoogleSignUpSuccess}
          onError={handleGoogleSignUpError}
          useOneTap={false}
          theme="outline"
          size="large"
          text="signup_with"
          shape="rectangular"
        />
      </div>
    </div>
  )
}
