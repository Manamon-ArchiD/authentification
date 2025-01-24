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
app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swagger));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
connectDB();
app.listen(5000, () => console.log(`Server running on port 5000`));