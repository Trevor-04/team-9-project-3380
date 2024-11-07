const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const database = require("./functions/database");

/*
const { url, port } = require("../src/config.json");
const config = require("../src/config.json");
const environment = process.env.NODE_ENV || 'development';
const { url, port } = config[process.env.NODE_ENV];
*/

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

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', process.env.REACT_APP_URL],
    credentials: true
}));


/*app.use(cors({ 
	origin: [config.development.url, config.production.url, `http://localhost:${Number(config.development.port)+1}`],
	credentials: true
}));*/

app.use(express.json()); // Handle JSON payloads
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Handle URL-encoded payloads


// Stripe Payment Route
app.post("/payment", cors(), async (req, res) => {
	let { amount, id } = req.body
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
			return_url:`${process.env.REACT_APP_URL}/donations`
		})
		console.log("Payment", payment)
		res.json({
			message: "Payment successful",
			success: true
		})
	} catch (error) {
		console.log("Error", error)
		res.json({
			message: "Payment failed",
			success: false
		})
	}
})

// Routes
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
        await database.checkConnection();
        console.log(`Server is running on port ${PORT}`);
    } catch (err) {
        console.error('Failed to connect to database:', err);
        // Don't exit the process, as Railway will restart it
        // Just log the error and continue running the server
    }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    try {
        await database.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
});

/*const serverPort = environment === 'production' ? process.env.PORT : port;
app.listen(serverPort, async () => {
  console.log(`Server is running on ${url} and port ${serverPort}`);
});


Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: process.env.DB_HOST ,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

console.log('Attempting to connect to the database with the following configuration:');

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});*/