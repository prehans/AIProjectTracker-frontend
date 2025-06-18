// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import React, { use } from 'react';
import LoginPage from "./components/LoginPage.jsx";
import HomePage from "./components/HomePage.jsx";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from './feature/userSlice.jsx';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { RegisterPage } from './components/RegisterPage.jsx';

import { login } from './feature/userSlice.jsx'; // Adjust the import path as necessary
function App() {
  const user = useSelector(selectUser);
  console.log("User in App:", user);
  const dispatch = useDispatch();


  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token && username && !user) {
      dispatch(login({ username, token, loggedIn: true }));
    }
  }, [dispatch, user]);
  return (
    // <div>
    //   {user ? (
    //     <HomePage />
    //   ) : (
    //     <LoginPage />
    //   )}
    // </div>
  //    <Router>
  //    <Routes>
  //      <Route path="/" element={<LoginPage />} />
  //      <Route path="/home" element={<HomePage />} />
  //    </Routes>
  //  </Router>
  <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <LoginPage />} />
        <Route path="/home" element={user ? <HomePage /> : <Navigate to="/" />} />
         <Route path="/register" element={<RegisterPage/>}/>
      </Routes>
    </Router>
  )
}
 export default App
