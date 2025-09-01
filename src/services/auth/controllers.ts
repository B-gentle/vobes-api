import { comparePasswords, hashPassword, signToken } from "../../middlewares/authMiddleware.js";
import { userRepo } from "../../repository/index.js";
import { APIException } from "../../utils/utils.js";
import * as UserRequests from "./schemas/request.js";

export const signUpUser = async (payload: UserRequests.SignUpPayload) => {
  const { email, password, name } = payload;
  const userExist = await userRepo.findByEmail(email);
  if (userExist) {
    throw new APIException(400, "User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await userRepo.create({
    email,
    password: hashedPassword,
    name,
  });

  if (user) {
    const token = await signToken({
      userId: user.id.toString(),
      role: (user as any).role ?? "user",
    });

    return {
      user,
      token,
    };
  } else {
    throw new APIException(500, "User creation failed");
  }
};

export const signInUser = async (payload: UserRequests.SignInPayload) => {
  const { email, password } = payload;

  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new APIException(401, "Invalid email or password");
  }

  const isValid = await comparePasswords(password, user.password as string);
  if (!isValid) {
    throw new APIException(401, "Invalid email or password");
  }

  const token = await signToken({
    userId: user.id.toString(),
    role: (user as any).role ?? "user",
  });

  return {
    user,
    token,
  };
};
