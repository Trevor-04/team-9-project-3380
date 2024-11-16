const {query} = require('../functions/database');

module.exports.addItem = async function (itemData) {
    const {itemName, itemPrice, totalQuantity, category, descript} = itemData;

    try {
        return await query(`
            INSERT INTO Inventory (itemName, itemPrice, totalQuantity, category, descript)
            VALUES (?, ?, ?, ?, ?)`,
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

// module.exports.editItems = async function (itemData) {
//     const {itemID, itemName, itemPrice, totalQuantity, category, descript} = itemData;

//     if (!itemID) {
//         throw new Error("Item ID is required to edit an animal.");
//     }

//     try {
//         const result = await query(`
//         UPDATE Inventory
//         SET itemName = ?,
//             itemPrice = ?, 
//             totalQuantity = ?, 
//             category = ?, 
//             descript = ?
//         WHERE itemID = ?`,
//         [
//             itemName,
//             itemPrice,
//             totalQuantity,
//             category,
//             descript,
//             itemID
//         ]);

//         if (result.affectedRows === 0) {
//             throw new Error(`Item with ID ${itemID} not found.`);
//         }

//         return result;
//     } catch (error) {
//         console.error("Error in editItems function", error);
//         throw error;
//     }
// };


// module.exports.listSalesWithItems = async function () {
//     try {
//         return query(`
//             SELECT G.receiptID, G.quantity, G.purchased_at, I.itemName, I.itemPrice
//             FROM Gift_shop_sales AS G
//             LEFT JOIN Inventory AS I ON G.itemID = I.itemID
//         `); 
//     } catch (err) {
//         console.error("Error fetching sales with items:", err);
//         throw new Error("Failed to list sales with items");
//     }
// };