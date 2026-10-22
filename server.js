
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();

// Middleware-lər (Mütləq ən yuxarıda olmalıdır)
app.use(cors());
app.use(express.json());

// Məlumat bazasına qoşuluruq
const db = new sqlite3.Database('./journal.db', (err) => {
    if (err) {
        console.error("Baza qoşulma xətası:", err.message);
    } else {
        console.log("SQLite məlumat bazasına qoşuldu.");
    }
});

// Cədvəllərin yaradılması
db.serialize(() => {
    // 1. İstifadəçilər cədvəli
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

    // 2. Gündlüklər cədvəli
    db.run(`CREATE TABLE IF NOT EXISTS journals (
        username TEXT UNIQUE,
        data TEXT
    )`);
});

// --- 1. QEYDİYYAT ENDPOINT-İ ---
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Boşluqları təmizləyirik və istifadəçi adını kiçik hərflərə çeviririk
    const cleanUser = username ? username.trim().toLowerCase() : '';
    const cleanPass = password ? password.trim() : '';

    if (!cleanUser || !cleanPass) {
        return res.status(400).json({ error: "İstifadəçi adı və şifrə mütləqdir" });
    }

    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(query, [cleanUser, cleanPass], function(err) {
        if (err) {
            console.error("Qeydiyyat xətası:", err.message);
            return res.status(400).json({ error: "Bu istifadəçi adı artıq mövcuddur!" });
        }
        console.log(`✅ Yeni istifadəçi bazaya yazıldı: [${cleanUser}]`);
        res.status(201).json({ message: "Qeydiyyat uğurla tamamlandı!" });
    });
});

// --- 2. DAXİL OL ENDPOINT-İ ---
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const cleanUser = username ? username.trim().toLowerCase() : '';
    const cleanPass = password ? password.trim() : '';

    console.log(`🔑 Giriş cəhdi -> Ad: "${cleanUser}", Şifrə: "${cleanPass}"`);

    if (!cleanUser || !cleanPass) {
        return res.status(400).json({ error: "İstifadəçi adı və şifrə mütləqdir" });
    }

    const query = `SELECT * FROM users WHERE LOWER(username) = ? AND password = ?`;
    db.get(query, [cleanUser, cleanPass], (err, row) => {
        if (err) {
            console.error("Baza xətası:", err);
            return res.status(500).json({ error: "Baza xətası baş verdi" });
        }
        if (!row) {
            console.log("❌ XƏTA: İstifadəçi bazada tapılmadı və ya şifrə yanlışdır!");
            return res.status(400).json({ error: "İstifadəçi adı və ya şifrə yanlışdır!" });
        }
        console.log("✅ UĞURLU: İstifadəçi tapıldı və daxil oldu.");
        res.status(200).json({ message: "Giriş uğurludur!" });
    });
});

// --- 3. YADDA SAXLA ENDPOINT-İ ---
app.post('/save', (req, res) => {
    const { username, data } = req.body;
    if (!username || !data) {
        return res.status(400).json({ error: "Məlumat əksikdir" });
    }

    const query = `INSERT OR REPLACE INTO journals (username, data) VALUES (?, ?)`;
    db.run(query, [username, data], function(err) {
        if (err) {
            console.error("Yadda saxlama xətası:", err);
            return res.status(500).json({ error: "Baza xətası baş verdi" });
        }
        res.status(200).json({ message: "Gündlük uğurla yadda saxlanıldı!" });
    });
});
// --- 4. GÜNDLÜYÜ YÜKLƏ (LOAD) ENDPOINT-İ ---
app.get('/load/:username', (req, res) => {
    const username = req.params.username;

    const query = `SELECT data FROM journals WHERE username = ?`;
    db.get(query, [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Baza xətası baş verdi" });
        }
        if (!row) {
            return res.status(404).json({ message: "Hələlik saxlanılmış gündlük tapılmadı." });
        }
        res.status(200).json({ data: row.data });
    });
});

// Serveri işə salırıq
app.listen(3000, () => {
    console.log("Server 3000 portunda işləyir...");
});