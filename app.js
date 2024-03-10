const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const courseRouter = require("./routes/course.route");
const { pageNotFound, serverNotFound } = require("./middlewares/handleErrors");
const { default: mongoose } = require("mongoose");
const config = require('./config');

const app = express();

// connect to db
mongoose.connect(config.DB_URL)
  .then(() => console.log('mongo db connected'))
  .catch(err => console.log(err));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // הדפסת המידע של כל בקשה
// app.use(cors({origin:'http:// localhost:4200'})); // אפשור רק לכתובת מסוימת
app.use(cors()); // אפשור גישה לכל הכתובות

app.get("/", (req, res) => {
  res.send("wellcome");
});

app.use("/courses", courseRouter);

// אם הגענו לכאן - ניתוב לא קיים
app.use(pageNotFound);
app.use(serverNotFound);

const port = 5000;
app.listen(port, () => {
  console.log("running at http://localhost:" + port);
});
