import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Task Manager
          </h1>
          <p className="text-gray-600">Organize your tasks efficiently</p>
        </div>

        <div className="flex flex-col md:flex-row md:justify-center gap-4">
          <Link to="/login" className="btn btn-primary w-full sm:w-auto p-5 ">
            Sign In
          </Link>

          <Link
            to="/register"
            className="btn btn-secondary w-full sm:w-auto p-5"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Real-time task updates
            </li>
            <li className="flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Task assignment
            </li>
            <li className="flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Priority tracking
            </li>
            <li className="flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Dashboard with filtering
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
