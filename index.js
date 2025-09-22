const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// Connexion DB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cfaodb")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// Routes
app.use("/area", require("./routes/Area"));
app.use("/country", require("./routes/Country"));
app.use("/company", require("./routes/Company"));
app.use("/site", require("./routes/Site"));
app.use("/role", require("./routes/Role"));
app.use("/activity", require("./routes/Activity"));
app.use("/businessunit", require("./routes/BusinessUnit"));
app.use("/language", require("./routes/Language"));

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
