const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

// SQLite Veritabanı Bağlantısı
const db = new sqlite3.Database('./journal.db', (err) => {
    if (err) console.error(err.message);
    console.log('SQLite veritabanına bağlanıldı.');
});

// Kullanıcılar Tablosunu Oluşturma
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)`);

// Kayıt (Register) Sistemi
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function(err) {
        if (err) return res.status(400).json({ error: "Bu kullanıcı adı zaten alınmış." });
        res.json({ message: "Kayıt başarılı!", userId: this.lastID });
    });
});

// Giriş (Login) Sistemi
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (!user) return res.status(400).json({ error: "Kullanıcı bulunamadı." });
        
        const match = await bcrypt.compare(password, user.password);
        if (match) res.json({ message: "Giriş başarılı!", userId: user.id });
        else res.status(400).json({ error: "Hatalı şifre." });
    });
});

// Sunucuyu Başlatma
app.listen(3000, () => {
    console.log('Backend sunucusu http://localhost:3000 adresinde çalışıyor.');
});