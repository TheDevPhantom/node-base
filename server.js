import express, { json } from "express";

import db from "./config/db.js";
import { config } from "dotenv";

import auth from "./routes/auth.js";
import users from "./routes/users.js";

import errorHandler from "./middleware/error.js";

config({ path: `./config/${process.env.NODE_ENV}.env` });

// Authenticate the database
db.authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Error: " + err));

// Create a new server instance on start
const app = express();

// ========================================
//                MIDDLEWARE
// ========================================
app.use(json());

// ========================================
//                  ROUTES
// ========================================
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);

// Catches all uncaught errors
app.use(errorHandler);

// Sync the database and if successful start the server
// else log error to the console
db.sync()
  .then((result) => {
    const port = process.env.port || 5000;

    const server = app.listen(port, () =>
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${port}`
      )
    );
  })
  .catch((err) => console.log(err));

export default app;
