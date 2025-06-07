import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import Layout from "./layout/Layout";
import AdminRoute from "./components/AdminRoute";
import {
  AddProblem,
  HomePage,
  LoginPage,
  ProblemPage,
  SignUpPage,
  ProblemsListPage,
  Profile,
  EmailVerificationPage,
} from "./pages/index.js";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start ">
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route
            path="/problems"
            element={
              authUser ? <ProblemsListPage /> : <Navigate to={"/login"} />
            }
          />
          <Route
            path="/profile"
            element={authUser ? <Profile /> : <Navigate to={"/login"} />}
          />

          <Route element={<AdminRoute />}>
            <Route
              path="/add-problem"
              element={authUser ? <AddProblem /> : <Navigate to="/" />}
            />
          </Route>
        </Route>

        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />

        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/problem/:id"
          element={authUser ? <ProblemPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/email-verification/:token"
          element={<EmailVerificationPage />}
        />
      </Routes>
    </div>
  );
};

export default App;
