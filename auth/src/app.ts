import express from "express";
import "express-async-errors";

import cookieSession from "cookie-session";

import { meRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@debirapid-ticket/common";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test", httpOnly: true }));

app.use(meRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.get("*", async (req, res, next) => {
  //   next(new NotFoundError());
  throw new NotFoundError("Request Not Found!");
});

app.use(errorHandler);

export default app;
