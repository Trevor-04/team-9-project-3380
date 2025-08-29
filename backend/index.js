const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mysql = require("mysql2");
const db = require('./functions/database'); 

// Routes
const animalRoutes = require("./routes/animals");
const eventsRoutes = require("./routes/events");
const loginRoutes = require("./routes/login");
const exhibitsRoutes = require("./routes/exhibits");
const membersRoutes = require("./routes/members");
const reportsRoutes = require("./routes/reports");
const ticketsRoutes = require("./routes/tickets");
const inventoryRoutes = require("./routes/inventory");
const donationRoutes = require("./routes/donations");
const employeeRoutes = require('./routes/employeeRoutes');
const memberPlansRoutes = require('./routes/memberPlans');

const app = express();

const allowedOrigins = [
	'https://672d5d775e81d6982bc414bf--glowing-tiramisu-2436aa.netlify.app',
	'https://glowing-tiramisu-2436aa.netlify.app',
  ];
  
  const corsOptions = {
	origin: function (origin, callback) {
	  console.log('Origin:', origin); // Log the origin
	  if (allowedOrigins.includes(origin) || !origin) {
		callback(null, true);
	  } else {
		callback(new Error(`Not allowed by CORS: ${origin}`)); // Include origin in error message
	  }
	},
	credentials: true,
  };
  
  app.use(cors(corsOptions));

app.use(express.json()); // Handle JSON payloads
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Handle URL-encoded payloads

// Grab functions
const notifications = require('./functions/notifications');

// Start polling for unsent notifications every 5 minutes
setInterval(notifications.sendNotifications, 60000); 

app.use("/animals", animalRoutes);
app.use("/events", eventsRoutes);
app.use("/exhibits", exhibitsRoutes);
app.use("/login", loginRoutes);
app.use('/employees', employeeRoutes);
app.use("/members", membersRoutes);
app.use("/reports", reportsRoutes);
app.use("/tickets", ticketsRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/donations", donationRoutes);
app.use("/memberPlans", memberPlansRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    try {
        // Test database connection on startup
        await db.checkConnection();
        console.log(`Server is running on port ${PORT}`);
    } catch (err) {
        console.error('Failed to connect to database:', err);
        // Don't exit the process, as Railway will restart it
        // Just log the error and continue running the server
    }
});

// Database Connection
db.query('SELECT 1')
  .then(() => console.log('Database connected successfully'))
  .catch((error) => console.error('Database connection error:', error.message));
