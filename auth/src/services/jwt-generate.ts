import { Request } from "express";
import { UserDoc } from "../models/user";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface JWTPayload extends JwtPayload {
  id: string;
  email: string;
}

/**
 * Creates and assigns a JWT to a user.
 * @param existingUser - The existing user document.
 * @param req - The request object from Express.js.
 * @returns void
 */
export const jwtCreateAndAssign = (existingUser: UserDoc, req: Request): void => {
  // Create the payload for the JWT
  const payload: JWTPayload = { id: existingUser.id, email: existingUser.email };

  // Generate the JWT using the payload and the JWT key from environment variables
  const userJWT = jwt.sign(payload, process.env.JWT_KEY!);

  // Store the JWT on the session object in the request
  req.session = { jwt: userJWT };
};
