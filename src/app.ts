import express from "express";
import bodyParser from "body-parser";
import connectDB from "./db";
import authRoutes from "./auth";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const app = express();
const swagger = YAML.load(path.join(__dirname, "../openapi.yaml"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/auth", authRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));
connectDB();
app.listen(5000, () => console.log(`Server running on port 5000`));