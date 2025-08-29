const {query} = require('../functions/database');

module.exports.addItem = async function (itemData) {
    const {itemName, itemPrice, totalQuantity, category, descript} = itemData;

    try {
        return await query(`
            INSERT INTO Inventory (itemName, itemPrice, totalQuantity, category, descript)
            VALUES (?, ?, ?, ?, ?)`,
        [itemName, itemPrice, totalQuantity, category, descript])
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports.deleteItem = async function (itemData) {
    const { itemID } = itemData;

    try {
        return await query(`DELETE FROM Inventory WHERE itemID = ?`, [itemID]);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports.updateItem = async function (itemData) {
    const { itemID, itemName, itemPrice, totalQuantity, category, descript } = itemData;

    try {
        return await query(`
            UPDATE Inventory
            SET itemName = ?, itemPrice = ?, totalQuantity = ?, category = ?, descript = ?
            WHERE itemID = ?`,
            [itemName, itemPrice, totalQuantity, category, descript, itemID]);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports.listItems = async function () {
    try {
        return await query(`
        SELECT * 
        FROM Inventory`);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports.getItemById = async function (itemData) {
    const { itemID } = itemData;

    try {
        const result = await query(`SELECT * FROM Inventory WHERE itemID = ?`, [itemID]);
        return result[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports.getItemsByCategory = async function (itemData) {
    const { category } = itemData;

    try {
        return await query(`SELECT * FROM Inventory WHERE category = ?`, [category]);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports.getItemsByName = async function (itemData) {
    const { itemName } = itemData;

    try {
        return await query(`SELECT * FROM Inventory WHERE itemName LIKE ?`, [`%${itemName}%`]);
    } catch (err) {
        console.log(err);
        throw err;
    }
};
