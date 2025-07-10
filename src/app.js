const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
require("./cron/expireTokens");

//Routes
const roleRoute = require("./modules/User/routes/role.route");
const authRoute = require("./modules/Auth/routes/auth.route");
const userRoute = require("./modules/User/routes/user.route");
const bioRoute = require("./modules/User/routes/bio.route");
const projectRoute = require("./modules/Project/routes/project.route");
//==============================
//Middlewares
const errorMiddleware = require("./shared/middlewares/error.middleware");
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
app.use("/api/v1/bio", bioRoute);
app.use("/api/v1/project", projectRoute);

// Error handling middleware (luôn đặt cuối cùng)
app.use(errorMiddleware);
//==============================
module.exports = app;
