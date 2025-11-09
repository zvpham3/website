const express = require('express');
const { Pool } = require('pg'); // Import the pg library

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

// =================================================================
// 1. CONFIGURE DATABASE CONNECTION USING JAVA CREDENTIALS
// =================================================================
// Note: In Node.js, we prefer reading from environment variables (process.env)
// but we'll use your provided defaults for the host and user/pass.

const DB_HOST = 'csce-315-db.engr.tamu.edu';
const DB_NAME = 'team_42_db';
const DB_USER = process.env.DB_USER || 'team_42';
const DB_PASSWORD = process.env.DB_PASSWORD || 'admin:password123';

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: 5432, // Default PostgreSQL port
  ssl: true // You are connecting to a remote TAMU server, SSL is likely required.
});

// =================================================================
// 2. DATABASE QUERY FUNCTIONS (Same as before)
// =================================================================

/**
 * Executes the sales report query to get itemized quantities sold.
 */
async function generateSalesReport(from_date, to_date) {
    const query = `
        SELECT 
            mi.menuitem_name, 
            COUNT(*) AS quantity 
        FROM orders o 
        JOIN orderentry oe ON o.order_id = oe.order_id 
        JOIN menuitem mi ON oe.menuitem_id = mi.menuitem_id 
        WHERE DATE(time_stamp) >= $1
        AND DATE(time_stamp) <= $2
        GROUP BY mi.menuitem_name, mi.category 
        ORDER BY mi.menuitem_name;
    `;
    
    try {
        const res = await pool.query(query, [from_date, to_date]);
        return res.rows.map(row => ({
            menu_item: row.menuitem_name,
            quantitySold: parseInt(row.quantity, 10)
        }));
    } catch (err) {
        console.error("Error generating sales report:", err.message);
        return [];
    }
}

/**
 * Executes the query to get the total cost (revenue).
 */
async function generateTotalCost(from_date, to_date) {
    const sql = `
        SELECT SUM(total_cost) AS total 
        FROM orders 
        WHERE DATE(time_stamp) >= $1 
        AND DATE(time_stamp) <= $2
    `;
    
    try {
        const res = await pool.query(sql, [from_date, to_date]);
        if (res.rows.length > 0) {
            // Use Math.round for better floating point precision handling if needed,
            // or just ensure it's a number.
            return parseFloat(res.rows[0].total) || 0.0;
        }
        return 0.0;
    } catch (err) {
        console.error("Error generating total cost:", err.message);
        return 0.0;
    }
}


// =================================================================
// 3. EXPRESS ROUTE (GET /)
// =================================================================

app.get('/', async (req, res) => {
    // Default dates for a full year if no query params are provided
    const { from_date = '2023-01-01', to_date = '2023-12-31' } = req.query;

    try {
        // Run both database queries in parallel
        const [reportItems, totalCost] = await Promise.all([
            generateSalesReport(from_date, to_date),
            generateTotalCost(from_date, to_date)
        ]);

        // Render the page, passing all data to the template
        res.render('index', {
            reportItems: reportItems,
            totalCost: totalCost,
            from_date: from_date, 
            to_date: to_date
        });
    } catch (error) {
        // Handle a critical error (e.g., database connection failed)
        console.error("Critical error in main route:", error);
        res.status(500).send("An error occurred while fetching the sales report.");
    }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});