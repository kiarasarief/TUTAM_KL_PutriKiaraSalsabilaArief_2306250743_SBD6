const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || process.env.ALLOW_ORIGIN === "true") {
      try {
        const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS || "[]");
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      } catch (error) {
        callback(new Error("Invalid CORS configuration"));
      }
    } else {
      callback(null, true);
    }
  },
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://cs9-frontend-kiara.vercel.app/",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ test: "Welcome to the API" });
});

app.use("/store", require("./src/routes/store.route"));
app.use("/user", require("./src/routes/user.route"));
app.use("/item", require("./src/routes/item.route"));
app.use("/transaction", require("./src/routes/transaction.route"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
