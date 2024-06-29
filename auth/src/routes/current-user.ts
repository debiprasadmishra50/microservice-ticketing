import express from "express";
import { User } from "../models/user";
import { currentUser } from "@debirapid-ticket/common";

const router = express.Router();

// router.get("/api/users/me", currentUser, requireAuth, async (req, res) => {
router.get("/api/users/me", currentUser, async (req, res) => {
  // console.log(req.headers);

  const user = await User.findOne({ email: req.currentUser?.email });

  console.log(user);

  res.status(200).json({ status: 200, data: user });
  // return { status: 200, data: user };
});

// NOTE: Get All users
router.get("/api/users", currentUser, async (req, res) => {
  const users = await User.find();

  res.status(200).json({ status: 200, results: users.length, data: users });
});

export { router as meRouter };
