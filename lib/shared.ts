import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

/**
 * TweakCN-OpenAI local stub — the stubbed auth layer always returns a
 * fixed "local-user" session, so getCurrentUserId / getCurrentUser never
 * throw UnauthorizedError here. Kept around for call-site compatibility.
 */

export type LocalUser = {
  id: string;
  email: string;
  name: string;
  image: string | null;
  emailVerified: boolean;
};

export async function getCurrentUserId(_req?: NextRequest): Promise<string> {
  const session = await auth.api.getSession();
  return session.user.id;
}

export async function getCurrentUser(_req?: NextRequest): Promise<LocalUser> {
  const session = await auth.api.getSession();
  return session.user;
}

export function logError(error: Error, context?: Record<string, unknown>) {
  console.error("Action error:", error, context);
  if (error.name === "UnauthorizedError" || error.name === "ValidationError") {
    console.warn("Expected error:", { error: error.message, context });
  } else {
    console.error("Unexpected error:", {
      error: error.message,
      stack: error.stack,
      context,
    });
  }
}
