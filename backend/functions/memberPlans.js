const { query } = require('./database.js');

module.exports.addPlan = async function(planData) {
    // Destructure planData
    const { firstName, lastName, address, city, state, zip, email, phone } = planData;

    // Sanitize input by replacing undefined with null
    const sanitizedPlanData = {
        firstName: firstName || null,
        lastName: lastName || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zip: zip || null,
        email: email || null,
        phone: phone || null
    };

    try {
        const result = await query(`
            INSERT INTO member_plans (firstName, lastName, address, city, state, zip, email, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
            [
                sanitizedPlanData.firstName,
                sanitizedPlanData.lastName,
                sanitizedPlanData.address,
                sanitizedPlanData.city,
                sanitizedPlanData.state,
                sanitizedPlanData.zip,
                sanitizedPlanData.email,
                sanitizedPlanData.phone
            ]
        );
        return result;
    } catch (error) {
        console.error("Error in addPlan function:", error);
        throw error;
    }
};
