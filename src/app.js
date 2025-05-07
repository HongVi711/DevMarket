const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
require("./cron/expireTokens");

//Routes
const roleRoute = require("./routers/role.route");
const authRoute = require("./routers/auth.route");
const userRoute = require("./routers/user.route");
//==============================
//Middlewares
const errorMiddleware = require("./middlewares/error.middleware");
//==============================
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, "public")));
//Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/roles", roleRoute);
app.use("/api/v1/users", userRoute);

// Error handling middleware (luôn đặt cuối cùng)
app.use(errorMiddleware);
//==============================
module.exports = app;
