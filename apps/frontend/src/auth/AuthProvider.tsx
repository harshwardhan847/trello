import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    login as loginRequest,
    signup as signupRequest,
    logout as logoutRequest,
    refresh as refreshRequest,
    getCurrentUser,
} from "../api/auth";

import {
    setAccessToken,
} from "./token";

import type {
    LoginInput,
    SignupInput,
} from "schemas";

import type { User } from "./types";

type AuthContextType = {
    user: User | null;
    loading: boolean;

    login: (
        data: LoginInput,
    ) => Promise<void>;

    signup: (
        data: SignupInput,
    ) => Promise<void>;

    logout: () => Promise<void>;
};

const AuthContext =
    createContext<AuthContextType | null>(
        null,
    );

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        initializeAuth();
    }, []);

    async function initializeAuth() {
        try {
            const data =
                await refreshRequest();

            setAccessToken(
                data.accessToken,
            );

            const user =
                await getCurrentUser();

            setUser(user);
        } catch (error) {
            setAccessToken(null);
            setUser(null);
            // window.location.href = "/login";
            // return Promise.reject(error);
        } finally {
            setLoading(false);
        }
    }

    async function login(
        data: LoginInput,
    ) {
        const response =
            await loginRequest(data);

        setAccessToken(
            response.accessToken,
        );

        setUser(response.user);
    }

    async function signup(
        data: SignupInput,
    ) {
        const response =
            await signupRequest(data);

        setAccessToken(
            response.accessToken,
        );

        setUser(response.user);
    }

    async function logout() {
        try {
            await logoutRequest();
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider",
        );
    }

    return context;
}