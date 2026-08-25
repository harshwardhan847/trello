import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    signupSchema,
} from "schemas";

import { useAuth } from "../auth/AuthProvider";

export default function Signup() {
    const { signup } = useAuth();

    const navigate = useNavigate();

    const [name, setName] =
        useState("");

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
            signupSchema.safeParse({
                name,
                email,
                password,
            });

        if (!result.success) {
            if (result.error.issues[0]?.message)
                setError(
                    result.error.issues[0].message,
                );

            return;
        }

        try {
            await signup(result.data);

            navigate("/dashboard");
        } catch (error: any) {
            setError(
                error.response?.data?.message ??
                "Signup failed",
            );
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                placeholder="Name"
                value={name}
                onChange={(e) =>
                    setName(e.target.value)
                }
            />

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
                Create account
            </button>
        </form>
    );
}