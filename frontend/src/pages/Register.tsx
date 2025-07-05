import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuthContext";
import { registerUser } from "../api/auth";
import { AxiosError } from "axios";
import { useState } from "react";


export function Register(){
    const { login } = useAuth();
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try{
            const data = await registerUser(form.name, form.email, form.password);
            login(data.user, data.token);
            navigate("/board");
        }
        catch (error: unknown) {
            if (error instanceof AxiosError) {
                setError(error.response?.data?.message || "Registration failed");
            } else {
                setError("Registration failed");
            }
        }
    }

    return (
        <>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
                <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required />
                <button type="submit">Register</button>
            </form>
            {error && <p>{error}</p>}
        </>
    )
}