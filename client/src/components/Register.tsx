import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../utils/api";
import Toast from "./Toast";

const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setLoading(true);

    try {
      const response = await fetch(api.register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);

        setToast({
          message: "Account created successfully!",
          type: "success",
        });

        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setToast({
          message: result.message || "Registration failed",
          type: "error",
        });
      }
    } catch {
      setToast({
        message: "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-2xl font-bold text-center">Register</h2>

        <div className="flex-column text-left">
          <label>Full Name</label>
        </div>
        <div className="inputForm">
          <input
            type="text"
            className="input"
            placeholder="Enter your Full Name"
            {...register("name")}
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}

        <div className="flex-column text-left">
          <label>Email</label>
        </div>
        <div className="inputForm">
          <input
            type="text"
            className="input"
            placeholder="Enter your Email"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}

        <div className="flex-column text-left">
          <label>Password</label>
        </div>
        <div className="inputForm">
          <input
            type="password"
            className="input"
            placeholder="Enter your Password"
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}

        <button className="button-submit" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="p">
          Already have an account?{" "}
          <Link to="/login" className="span">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
