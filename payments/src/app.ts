import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@debirapid-ticket/common";
import { createChargeRouter } from "./routes/create-payment";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test", httpOnly: true }));

app.use(currentUser); // To verify and add the currentUser to req from the jwt token

// Place Routers
app.use(createChargeRouter);

app.get("*", async (req, res, next) => {
  //   next(new NotFoundError());
  throw new NotFoundError("Request Not Found!");
});

app.use(errorHandler);

export default app;
