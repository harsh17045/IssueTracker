import express from "express";
import cors from "cors";
import employeeroutes from "./routes/employee.routes.js";
import adminroutes from "./routes/admin.routes.js"
import deptAdminroutes from "./routes/departmentalAdmin.routes.js"
import bodyParser from "body-parser";

const app = express();
/* app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
})); */

const allowedOrigins = [
  "https://issue-tracker-nk3c.vercel.app",    // Frontend #1
  "https://issue-tracker-omega-ochre.vercel.app", // Frontend #2
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE","PATCH", "OPTIONS"],
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/employees", employeeroutes); // base route for employees
app.use("/api/admin", adminroutes); // base route for admin
app.use("/api/dept-admin", deptAdminroutes); // base route for departmental admin

export default app;
