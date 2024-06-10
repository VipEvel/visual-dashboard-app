require("dotenv").config();
const express = require("express");
const { json, urlencoded } = require("express");
const appRoutes = require("./src/routes/index");
const connectMongoDB = require("./src/libs/mongodb");
const cors = require("cors");
const app = express();

// Enable CORS for all requests
app.use(cors());

const PORT = process.env.PORT || 3001;

app.use(json({ limit: "50mb" }));
app.use(urlencoded({ extended: true, limit: "50mb" }));

// Connect to MongoDB
connectMongoDB();

// Define routes
app.use("/dashboard", appRoutes.dashboard);

// Health check route
app.get("/health", (req, res) => {
  res.sendStatus(200);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
