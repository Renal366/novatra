const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

app.use(cors());
app.use(express.json());

// KONEKSI DATABASE - Gue ambil langsung dari dashboard lo (image_d6840c)
const pool = new Pool({
  connectionString: "postgresql://postgres:Renaldicahya17@db.bbjyifnzvrzzxospplpa.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false } 
});

app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Gunakan petik dua "user" sesuai skema SQL lo
        await pool.query('INSERT INTO "user" (email, password) VALUES ($1, $2)', [email, password]);
        res.json({ success: true, message: "DAFTAR BERHASIL!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM "user" WHERE email = $1 AND password = $2', [email, password]);
        if (result.rows.length > 0) {
            res.json({ success: true, id_user: result.rows[0].id_user });
        } else {
            res.json({ success: false, message: "Email atau password salah!" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = app;
