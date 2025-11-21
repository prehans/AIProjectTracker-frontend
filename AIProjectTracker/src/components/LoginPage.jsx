


import React, { useState } from "react";
import axios from "axios";
import { AvatarGenerator } from 'random-avatar-generator';
import { AppProvider } from "@toolpad/core/AppProvider";
import { useTheme } from "@mui/material/styles";
import { TextField, Button, Typography, Container, Divider, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {login} from "../feature/userSlice.jsx"; // Adjust the import path as necessary
import { GoogleLogin } from '@react-oauth/google';



const API_URL = "http://localhost:8080/api/user/login";
const GOOGLE_LOGIN_API_URL = "http://localhost:8080/api/auth/google-login";

const BRANDING = {
  logo: (
    <img
      src="https://mui.com/static/logo.svg"
      alt="MUI logo"
      style={{ height: 24 }}
    />
  ),
  title: "MUI",
};

const generator = new AvatarGenerator();

const Login = () => {
  const dispatch = useDispatch();
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // const user = useSelector((state) => state.auth.user);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const theme = useTheme();
  const navigate = useNavigate();

  // Google Login handler - using GoogleLogin component to get id_token
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      console.log("ID Token:", idToken);
      
      if (!idToken) {
        setMessage("Failed to get Google token. Please try again.");
        return;
      }

      // Decode the JWT to get user info (optional, for display purposes)
      // You can also send just the id_token to backend and let it decode
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
      
      // Send Google id_token to your backend
      const response = await axios.post(GOOGLE_LOGIN_API_URL, {
        token: idToken,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      });

      // Store token and user info
      if (response.data.token) {
        localStorage.setItem("token", response.data.token.body || response.data.token);
        localStorage.setItem("username", googleUser.name || googleUser.email);
        localStorage.setItem("avatar", googleUser.picture || avatar);
        
        dispatch(
          login({
            username: googleUser.name || googleUser.email,
            token: response.data.token.body || response.data.token,
            loggedIn: true,
            avatar: googleUser.picture || avatar,
            email: googleUser.email,
          })
        );
        
        setMessage("Login successful");
        navigate("/home");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      setMessage(error.response?.data?.message || "Google login failed. Please try again.");
    }
  };

  const handleGoogleLoginError = () => {
    console.error("Google login error");
    setMessage("Google login failed. Please try again.");
  };
  const handleLogin = async (e) => {
   
    e.preventDefault();
    // dispatch(
    //     login({
    //      username: username,
    //     //  email: email,
    //      password: password,
    //      loggedIn: true,
    //     })
    //   );
    try {
      const response = await axios.post(API_URL, {
        username,
        password,
      });
      const avatar = generator.generateRandomAvatar();
      localStorage.setItem("token", response.data.token.body);
      localStorage.setItem("username", username);
       localStorage.setItem("avatar", avatar);
      setMessage("Login successful");
       dispatch(
        login({
         username: username,
         token: response.data.token.body,
         loggedIn: true,
         avatar: avatar,
        //  email: email,
        //  password: password,
        //  loggedIn: true,
        })
      );
      setMessage("Login successful");
      navigate("/home");
    //  const userData = {
    //     username: response.data.username};
    //     dispatch(login(userData));
    //   console.log("Response:", response.data);
    //   localStorage.setItem("token", response.data.token.body);
    //   localStorage.setItem("username", username);
    //   console.log("Token stored:", response.data.token.body);
    //   navigate("/home");
    } 
    catch (error) {
      setMessage("Login failed");
      console.error("Error:", error);
    }
  };

  return (
    <AppProvider branding={BRANDING} theme={theme}>
      <Container maxWidth="xs" style={{ marginTop: "50px", textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
        
        <Box sx={{ my: 2 }}>
          <Divider>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>
        </Box>
        
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            useOneTap
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
          />
        </Box>
        
        {message && (
          <Typography 
            variant="body2" 
            color={message.includes("successful") ? "success.main" : "error"}
            sx={{ mt: 1 }}
          >
            {message}
          </Typography>
        )}
      </Container>
    </AppProvider>
  );
};

export default Login;
