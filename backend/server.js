require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");


connectDB();
app.use("/api/admin", require("./src/routes/adminDashboard.route"));
app.use("/api/admin", require("./src/routes/admin.routes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

