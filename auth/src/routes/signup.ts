import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "@debirapid-ticket/common";
import { User } from "../models/user";
import { jwtCreateAndAssign } from "../services/jwt-generate";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").notEmpty().isEmail().withMessage("Email must be valid").trim().toLowerCase(),
    body("password")
      .notEmpty()
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 - 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email is already in use!");
    }

    let user = User.build({ email, password });
    user = await user.save();

    // // Generate JWT
    // const userJWT = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);

    // // Store it on session object
    // req.session = { jwt: userJWT };
    jwtCreateAndAssign(user, req);

    res.status(201).json({ status: 201, data: user });
  }
);

export { router as signupRouter };
