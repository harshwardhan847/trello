import { prisma } from "db/client";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { loginSchema, signupSchema } from "schemas";

import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../lib/jwt";

import { hashToken } from "../lib/token";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/v1/auth",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};
const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

export async function signup(req: Request, res: Response) {
  try {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: result.error.flatten(),
      });
    }
    const { email, password, name } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        name,
        passwordHash,
      },
    });
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user.id);
    await prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(refreshToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + refreshCookieOptions.maxAge),
      },
    });
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, refreshCookieOptions);

    return res.status(201).json({
      message: "User created Successfully",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
export async function login(req: Request, res: Response) {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
      });
    }
    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: {
        email: email?.trim()?.toLowerCase(),
      },
    });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(refreshToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 1000),
      },
    });
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, refreshCookieOptions);
    return res.json({
      message: "Login Successful",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
export async function refresh(req: Request, res: Response) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({
        message: "Refresh token missing",
      });
    }
    const payload = verifyRefreshToken(token);
    const tokenHash = hashToken(token);

    const [storedToken, user] = await Promise.all([
      prisma.refreshToken.findUnique({
        where: { tokenHash },
      }),
      prisma.user.findUnique({ where: { id: payload.sub } }),
    ]);

    if (
      !storedToken ||
      storedToken.revokedAt ||
      storedToken.expiresAt < new Date()
    ) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const newAccessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user.id);

    await Promise.all([
      prisma.refreshToken.update({
        where: {
          id: storedToken.id,
        },
        data: {
          revokedAt: new Date(),
        },
      }),
      prisma.refreshToken.create({
        data: {
          tokenHash: hashToken(newRefreshToken),
          userId: user.id,
          expiresAt: new Date(Date.now() + refreshCookieOptions.maxAge),
        },
      }),
    ]);

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      newRefreshToken,
      refreshCookieOptions,
    );

    return res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }
}
export async function logout(req: Request, res: Response) {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      await prisma.refreshToken.updateMany({
        where: {
          tokenHash: hashToken(token),
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });
    }
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, refreshCookieOptions);
    return res.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
