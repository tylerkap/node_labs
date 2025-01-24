const express = require("express");
const jwt = require("jsonwebtoken");
const { expressjwt } = require("express-jwt");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const courses = [
  {
    courseId: 1,
    courseName: "courseOne",
  },
  {
    courseId: 2,
    courseName: "courseTwo",
  },
];
const users = [
  {
    userId: "ctdalton",
    password: "asdf",
    firstName: "curtis",
    lastName: "dalton",
  },
  {
    userId: "kal",
    password: "password",
    firstName: "kaladin",
    lastName: "stormblessed",
  },
];

const secret = "mySecret";

app.post("/login", (req, res) => {
  const { userId, password } = req.body;
  console.log(req.body);
  console.log("AM I GETTING THIS FAR?");
  console.log(userId + " " + password);
  const user = users.find((currUser) => currUser.userId === userId);
  console.log(user);
  //console.log(`UserId: ${user.userId} | Password: ${user.password}`);
  if (!user || user.password !== password) {
    return res.status(401).json({ errorMessage: "Invalid Credentials" });
  }

  const token = jwt.sign({ userId: user.userId }, secret, {
    algorithm: "HS256",
    expiresIn: "5m",
  });

  res.json({ token: token });
});

app.get(
  "/courses",
  expressjwt({ secret: secret, algorithms: ["HS256"] }),
  (req, res) => {
    res.json({ courses: courses });
  }
);

app.get("/users/:userId", (req, res) => {
  const user = users.find((user) => user.userId === req.params.userId);
  res.json(user);
});

app.get("/users", (req, res) => {
  const user = users.find((curUser) => curUser.userId === req.query.userId);
  res.json(user);
});

app.post("/users/create", (req, res) => {
  const user = req.body;
  users.push(user);
  res.end(`User created: ${JSON.stringify(user)}`);
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});