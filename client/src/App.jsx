import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

// Components
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import Profile from "./components/Profile";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/tasks"
            element={
              <Layout>
                <TaskList />
              </Layout>
            }
          />
          <Route
            path="/tasks/new"
            element={
              <Layout>
                <TaskForm />
              </Layout>
            }
          />
          <Route
            path="/tasks/:id/edit"
            element={
              <Layout>
                <TaskForm />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
