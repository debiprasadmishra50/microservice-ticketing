import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@debirapid-ticket/common";
import { User } from "../models/user";
import { Password } from "../services/password";
import { jwtCreateAndAssign } from "../services/jwt-generate";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid").trim().toLowerCase(),
    body("password").notEmpty().trim().withMessage("Password can not be empty"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new BadRequestError("Invalid Credentials!!!");

    const passwordMatch = await Password.compare(existingUser.password, password);

    if (!passwordMatch) throw new BadRequestError("Invalid Credentials!!!");

    // // Generate JWT
    // const userJWT = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_KEY!);

    // // Store it on session object
    // req.session = { jwt: userJWT };
    jwtCreateAndAssign(existingUser, req);

    res.status(200).json({ status: 200, data: existingUser });
  }
);

export { router as signinRouter };
