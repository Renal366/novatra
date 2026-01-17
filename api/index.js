const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Jalur ini bakal terpanggil lewat /api/register
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        await pool.query('INSERT INTO "user" (email, password) VALUES ($1, $2)', [email, password]);
        res.json({ success: true, message: "DAFTAR BERHASIL!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = app;
