import React, { useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Register from "./components/authentication/Register";
import Login from "./components/authentication/Login";
import NavbarComponent from "./components/Navbar";
import Dashboard from "./components/Dashboard";

import "./App.css";

import { useDispatch, useSelector } from "react-redux";
import { getUser, logoutUser } from "./redux/actionCreators/authActionCreators";

const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(getUser());
    }
    
    // Logout when the app closes
    window.addEventListener("beforeunload", () => {
      dispatch(logoutUser());
    });

    return () => {
      window.removeEventListener("beforeunload", () => {
        dispatch(logoutUser());
      });
    };
  }, [dispatch]);

  return (
    <div className="App">
      <ToastContainer position="bottom-right" />

      <Switch>
        <Route exact path="/">
          {isLoggedIn ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/signup" component={Register}></Route>
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </div>
  );
};

export default App;
