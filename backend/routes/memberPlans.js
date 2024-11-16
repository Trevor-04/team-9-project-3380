const express = require('express');
const router = express.Router();
const memberPlansController = require('../functions/memberPlans');

// Change this from GET to POST to handle POST requests
router.post('/add', async (req, res) => {
    try {
        const planData = req.body; // Get data from request body
        const result = await memberPlansController.addPlan(planData);
        res.status(201).json({ message: 'Plan added successfully!', result });
    } catch (error) {
        console.error("Error adding plan:", error);
        res.status(500).json({ error: 'Failed to add plan.' });
    }
});

router.get('/subedOn', async (req, res) => {
    try {
        const subedOn = req.query.subedOn; // Get subedOn from query string
        const result = await memberPlansController.subedOn(subedOn);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error getting plan:", error);
        res.status(500).json({ error: 'Failed to get plan.' });
    }
});

module.exports = router;
