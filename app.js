require("dotenv/config");

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error.middleware");
const app = express();

app.use(express.json());
app.use(cookieParser({}));
app.use(fileUpload({}));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // dev uchun — barcha domenlarga ruxsat
    credentials: true, // cookie yuborish kerak bo'lsa
  })
);
app.use(express.static("public"));

app.use("/api/post", require("./router/post.route"));
app.use("/api/auth", require("./router/auth.route"));
app.use(errorMiddleware);
app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("db connected"))
    .catch((err) => console.log("errorrku", err));
  console.log("run", process.env.PORT);
});
