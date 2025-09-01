import { prisma } from "../config/db.js";
import * as UserRequests from "../services/auth/schemas/request.js";

export const userRepo = {
  findByEmail: async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  },

  create: async (payload: UserRequests.SignUpPayload) => {
    const { email, password, name } = payload;
    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  },
};
