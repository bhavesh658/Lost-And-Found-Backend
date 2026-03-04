const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const claimRoutes = require("./routes/claimRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running on Vercel 🚀");
});
 app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
}); 

module.exports = app ;