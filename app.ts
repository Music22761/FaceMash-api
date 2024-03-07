import express from "express";
import { router as index } from "./api/index";
import { router as user } from "./api/user";
import { router as picture } from "./api/picture";
import { router as vote } from "./api/vote"
import { router as image } from "./api/image"
import cors from "cors";

import bodyParser from "body-parser";

export const app = express();

// app.get("/", (req, res) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.send("Hello World!");
// });

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.text());
app.use(bodyParser.json());

app.use("/", index);
app.use("/user", user);
app.use("/picture", picture);
app.use("/vote",vote);
app.use("/image",image);
app.use("/uploads",express.static("uploads"));
