// // import * as React from "react";
// // import { AppProvider } from "@toolpad/core/AppProvider";
// // import { SignInPage } from "@toolpad/core/SignInPage";
// // import { useTheme } from "@mui/material/styles";

// // const providers = [{ id: "credentials", name: "Credentials" }];

// // const BRANDING = {
// //   logo: (
// //     <img
// //       src="https://mui.com/static/logo.svg"
// //       alt="MUI logo"
// //       style={{ height: 24 }}
// //     />
// //   ),
// //   title: "MUI",
// // };
// // const API_URL = "http://localhost:8080/api/user/login";

// // const signIn = async (provider, credentials) => {
// //   console.log("Sending request:", credentials);

// //   try {
// //     const response = await fetch(API_URL, {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify(credentials),
// //     });

// //     console.log("Response status:", response.status);

// //     if (!response.ok) {
// //       const errorText = await response.text(); // Read the actual error message
// //       console.error("Login failed:", errorText);
// //       throw new Error(errorText);
// //     }

// //     const data = await response.json();
// //     console.log("Login successful:", data);

// //     // ✅ Store the token if returned
// //     if (data.token) {
// //       localStorage.setItem("token", data.token);
// //     }

// //     return data;
// //   } catch (error) {
// //     console.error("Login failed:", error.message);
// //     throw error;
// //   }
// // };


// // // // ✅ Replace with your actual backend API URL
// // // const API_URL = "http://localhost:8080/api/user/";

// // // const signIn = async (provider, credentials) => {
// // //   try {
// // //     const response = await fetch(API_URL, {
// // //       method: "POST",
// // //       headers: {
// // //         "Content-Type": "application/json",
// // //       },
// // //       body: JSON.stringify(credentials),
// // //     });

// // //     if (!response.ok) {
// // //       throw new Error("Invalid credentials");
// // //     }

// // //     const data = await response.json();
// // //     console.log("Login successful:", data);

// // //     // ✅ If your API returns a token, store it
// // //     localStorage.setItem("token", data.token);

// // //     return data;
// // //   } catch (error) {
// // //     console.error("Login failed:", error.message);
// // //     throw error;
// // //   }
// // // };

// // export default function BrandingSignInPage() {
// //   const theme = useTheme();

// //   return (
// //     <AppProvider branding={BRANDING} theme={theme}>
// //       <SignInPage
// //         signIn={(provider, credentials) => signIn(provider, credentials)}
// //         providers={providers}
// //         slotProps={{
// //           emailField: { autoFocus: false },
// //           form: { noValidate: true },
// //         }}
// //       />
// //     </AppProvider>
// //   );
// // }


import React, { useState } from "react";
import axios from "axios";
import { AvatarGenerator } from 'random-avatar-generator';
import { AppProvider } from "@toolpad/core/AppProvider";
import { useTheme } from "@mui/material/styles";
import { TextField, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {login} from "../feature/userSlice.jsx"; // Adjust the import path as necessary



const API_URL = "http://localhost:8080/api/user/login";

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
        {message && <Typography variant="body2" color="error">{message}</Typography>}
      </Container>
    </AppProvider>
  );
};

export default Login;
