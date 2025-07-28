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

app.use(cors({
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/employees", employeeroutes); // base route for employees
app.use("/api/admin", adminroutes); // base route for admin
app.use("/api/dept-admin", deptAdminroutes); // base route for departmental admin

export default app;
