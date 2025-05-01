const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: false, // Disabled credentials
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "API is running",
    env: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/store", require("./src/routes/store.route"));
app.use("/user", require("./src/routes/user.route"));
app.use("/item", require("./src/routes/item.route"));
app.use("/transaction", require("./src/routes/transaction.route"));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error encountered:", err);

  // More detailed logging for non-production environments
  if (process.env.NODE_ENV !== "production") {
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      code: err.code,
    });
  }

  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "production"
        ? {}
        : {
            message: err.message,
            code: err.code,
          },
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Application continues running despite unhandled promise rejections
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
