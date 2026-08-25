import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
    loginSchema,
} from "schemas";

import { useAuth } from "../auth/AuthProvider";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                    Enter your email and password to continue.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button type="submit" className="w-full">
                        Login
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/signup" className="underline underline-offset-4">
                            Sign up
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
