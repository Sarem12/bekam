import { prisma } from "../prisma";

export async function getUserById(userId: string) {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            first: true,
            last: true,
            email: true,
        }
    });
}