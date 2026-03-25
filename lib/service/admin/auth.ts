"use server"

import { prisma } from "@/lib/prisma";

export async function loginAction(username: string, password: string) {
  try {
    // 1. Find the user in your Postgres DB
    const user = await prisma.user.findUnique({
      where: { username: username,
                password: password

       },
       select: { id: true } // Only select the ID for security
    });
    console.log("user?.id:", user?.id);
    

    if (!user) {
      return { error: "Invalid username or password" };
    }

    // 2. Return the ID to the frontend
    // Note: In a real app, you'd check a hashed password here too!
    return { success: true, userId: user.id };
  } catch (e) {
    return { error: "Database connection failed" };
  }
}
export async function checkAuthAction(userId: string) {
  try {
    // 1. Check if the user ID exists in the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    console.log(user?.id);
    
    if (!user) {
      return { authenticated: false };
    }

    return { authenticated: true, userId: user.id };
  } catch (e) {
    return { authenticated: false };
  }
}