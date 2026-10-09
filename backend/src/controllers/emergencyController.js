
const { pool } = require("../config/database");

async function getEmergencyContacts(req, res) {
    try {
        const [contacts] = await pool.execute(`
            SELECT
                id,
                name,
                contact_type,
                phone,
                address,
                city,
                state
            FROM emergency_contacts
            WHERE is_active = 1
            ORDER BY name ASC
        `);

        return res.status(200).json({
            success: true,
            data: contacts.map(contact => ({
                id: contact.id,
                name: contact.name,
                type: contact.contact_type,
                phone: contact.phone,
                address: contact.address,
                city: contact.city,
                state: contact.state
            }))
        });
    } catch (error) {
        console.error("Get emergency contacts error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load emergency contacts."
        });
    }
}

module.exports = { getEmergencyContacts };
