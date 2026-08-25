import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
    signupSchema,
} from "schemas";

import { useAuth } from "../auth/AuthProvider";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Enter your details to get started.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="Jane Doe"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />
                    </div>

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
                        Create account
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="underline underline-offset-4">
                            Login
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
