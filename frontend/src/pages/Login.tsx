import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../hooks/useAuthContext";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";
import './Auth.css'

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        const data = await loginUser(form.email, form.password);
        login(data.user, data.token);
        navigate("/board");
        } 
        catch (error: unknown) {
            if (error instanceof AxiosError) {
                setError(error.response?.data?.message || "Login failed");
            } else {
                setError("Login failed");
            }
        }
    };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "#007bff", textDecoration: "none", fontWeight: 500 }}>
          Register
        </Link>
      </p>
      {error && <p>{error}</p>}
    </div>
  );
}
