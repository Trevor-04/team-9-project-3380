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

// Initialize express
const app = express();

/*Database Connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error("Failed to connect to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});*/

// CORS Configuration
//app.use(cors({ origin: 'https://672d5d775e81d6982bc414bf--glowing-tiramisu-2436aa.netlify.app' }));
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
  

/*const allowedOrigins = ['https://uma-test-production.up.railway.app', ];

  app.use((req, res, next) => {
	console.log({
	  receivedOrigin: req.headers.origin,
	  allowedOrigins: allowedOrigins,
	  isAllowed: allowedOrigins.includes(req.headers.origin)
	});
	next();
  });



app.use(cors({
 origin: (origin, callback) => {
   if (allowedOrigins.includes(origin) || !origin) {
     callback(null, true);
   } else {
     callback(new Error('Not allowed by CORS'));
   }
 }
}));

const corsOptions = {
	origin: (origin, callback) => {
	  Allow requests with no origin (like curl requests or same-origin requests)
	  if (!origin || allowedOrigins.includes(origin)) {
		callback(null, true);
	  } else {
		callback(new Error('Not allowed by CORS'));
	  }
	}
  };
  
  app.use(cors(corsOptions));
  
// Middleware
// Error-handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    console.error("Stack:", err.stack);
    res.status(500).json({
      message: "An error occurred on the server",
      error: err.message
    });
});  */

app.use(express.json()); // Handle JSON payloads
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Handle URL-encoded payloads

// Stripe Payment Route
app.post("/payment", async (req, res) => {
  let { amount, id } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Zoo Donation",
      payment_method: id,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never"
      },
      return_url: `${process.env.REACT_APP_URL}/donations`
    });
    console.log("Payment", payment);
    res.json({
      message: "Payment successful",
      success: true
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Payment failed",
      success: false
    });
  }
});

// Grab functions
const notifications = require('./functions/notifications');

// Start polling for unsent notifications every 5 minutes
setInterval(notifications.sendNotifications, 300000); // 5 minutes

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
