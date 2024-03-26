const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const courseRouter = require("./routes/course.route");
const userRouter = require("./routes/user.route");

const { pageNotFound, serverNotFound } = require("./middlewares/handleErrors");

// process.env ומכניס את ערכיו לתוך .env קורא את כל התוכן מהקובץ
require('dotenv').config();

// חיבור למסד נתונים
require('./config/db')

const app = express();

// middleware
app.use(express.json()); // req.body for json data
app.use(express.urlencoded({ extended: true })); // req.body for form-data (with files)

app.use(morgan("dev")); // הדפסת המידע של כל בקשה
// app.use(cors({origin:'http:// localhost:4200'})); // אפשור רק לכתובת מסוימת
app.use(cors()); // אפשור גישה לכל הכתובות

app.get("/", (req, res) => {
  res.send("wellcome");
});

app.use("/courses", courseRouter);
app.use("/users", userRouter);

// אם הגענו לכאן - ניתוב לא קיים
app.use(pageNotFound);
app.use(serverNotFound);

const port = process.env.PORT;
app.listen(port, () => {
  console.log("running at http://localhost:" + port);
});
