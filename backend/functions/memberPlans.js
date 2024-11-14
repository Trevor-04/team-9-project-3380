const {query} = require('./database.js');

module.exports.addPlan = async function(planData) {
    const {amount, firstName, lastName,address, city, state, zip,email, phone} = planData;
   try {
    const result = await query(`
    INSERT INTO member_plans (amount, firstName, lastName, address, city, state, zip, email, phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
    [amount, firstName, lastName,address, city, state, zip,email, phone]);
    return result;
   } catch (error) {
    console.error("Error in addPlan function:", error);
    throw error;
   }
};

