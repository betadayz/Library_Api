const path = require('path');
const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const colors = require("colors")
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error.js')
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

connectDB();

const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses')
const auth = require('./routes/auth');


// Body parser
const app = express();

// Cookie parser
app.use(express.json());

// Dev logging middleware
if(process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}

// File uploading
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use(express.json());
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue.bold)
    );
process.on("unhandledrejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold)
    server.close(() => process.exit(1))
})    