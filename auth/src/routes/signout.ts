import { currentUser, requireAuth } from "@debirapid-ticket/common";
import express from "express";

const router = express.Router();

router.post("/api/users/signout", currentUser, requireAuth, (req, res) => {
  req.session = null;
  res.status(200).send({});
});

export { router as signoutRouter };
