import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@debirapid-ticket/common";

import { createOrdersRouter } from "./routes/create-order";
import { findAllOrdersRouter } from "./routes/find-all-orders";
import { findOneOrdersRouter } from "./routes/find-order";
import { deleteOrdersRouter } from "./routes/patch-order";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test", httpOnly: true }));

app.use(currentUser); // To verify and add the currentUser to req from the jwt token

app.use(createOrdersRouter);
app.use(findAllOrdersRouter);
app.use(findOneOrdersRouter);
app.use(deleteOrdersRouter);

app.get("*", async (req, res, next) => {
  //   next(new NotFoundError());
  throw new NotFoundError("Request Not Found!");
});

app.use(errorHandler);

export default app;
