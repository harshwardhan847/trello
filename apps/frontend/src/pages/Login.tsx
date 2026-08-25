import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    loginSchema,
} from "schemas";

import { useAuth } from "../auth/AuthProvider";

export default function Login() {
    const { login } = useAuth();

    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    async function handleSubmit(
        e: React.FormEvent,
    ) {
        e.preventDefault();

        setError("");

        const result =
            loginSchema.safeParse({
                email,
                password,
            });

        if (!result.success) {
            if (result?.error?.issues?.[0]?.message)
                setError(
                    result?.error?.issues?.[0]?.message,
                );

            return;
        }

        try {
            await login(result.data);

            navigate("/dashboard");
        } catch (error: any) {
            setError(
                error.response?.data?.message ??
                "Login failed",
            );
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />

            {error && <p>{error}</p>}

            <button type="submit">
                Login
            </button>
        </form>
    );
}