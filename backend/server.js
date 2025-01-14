const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("./db");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// 路由
app.use("/api/user", require("./routes/user"));
app.use("/api/bookmark", require("./routes/bookmark"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
