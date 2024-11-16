const {query} = require('../functions/database');

module.exports.addItem = async function (itemData) {
    const {itemName, itemPrice, totalQuantity, category} = itemData;

    try {
        return await query(`
            INSERT INTO Inventory (itemName, itemPrice, totalQuantity, category)
            VALUES (? ? ? ? )`,
        [itemName, itemPrice, totalQuantity, category])
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
    const { itemID, itemName, itemPrice, totalQuantity, category } = itemData;

    try {
        return await query(`
            UPDATE Inventory
            SET itemName = ?, itemPrice = ?, totalQuantity = ?, category = ?
            WHERE itemID = ?`,
            [itemName, itemPrice, totalQuantity, category, itemID]);
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

module.exports.editItems = async function (itemData) {
    const {itemID, itemName, itemPrice, totalQuantity, category, descript} = itemData;

    // Log the inputs to check the values
    console.log('itemData:', itemData);
    console.log('itemPrice:', itemPrice);
    console.log('totalQuantity:', totalQuantity);
    console.log('category:', category);

    // Validate the input types
    if (isNaN(itemPrice) || typeof itemPrice !== 'number') {
        throw new Error('itemPrice must be a valid number');
    }
    if (totalQuantity && !Number.isInteger(totalQuantity)) {
        throw new Error('totalQuantity must be a valid integer');
    }
    if (category && !Number.isInteger(category)) {
        throw new Error('category must be a valid integer');
    }

    try {
        const result = await query(`
        UPDATE Inventory
        SET itemName = ?,
            itemPrice = ?, 
            totalQuantity = ?, 
            category = ?, 
            descript = ?
        WHERE itemID = ?`,
        [
            itemName,
            itemPrice,
            totalQuantity,
            category,
            descript,
            itemID
        ]);

        if (result.affectedRows === 0) {
            throw new Error(`Item with ID ${itemID} not found.`);
        }

        console.log(`Item with ID ${itemID} updated successfully.`);
    } catch (error) {
        console.error("Error in editItems function", error);
        throw error;
    }
};


module.exports.listSalesWithItems = async function () {
    try {
        return query(`
            SELECT G.receiptID, G.quantity, G.purchased_at, I.itemName, I.itemPrice
            FROM Gift_shop_sales AS G
            LEFT JOIN Inventory AS I ON G.itemID = I.itemID
        `); 
    } catch (err) {
        console.error("Error fetching sales with items:", err);
        throw new Error("Failed to list sales with items");
    }
};