const express = require("express");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3307,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "konyvtar_db", 
    waitForConnections: true,
    connectionLimit: 5
};

const pool = mysql.createPool(dbConfig);


app.get("/", (req, res) => {
    res.status(200).send("A szerver működik!");
});
app.get("/teszt", (req, res) => {
    res.status(200).send("MUKODIK");
});

app.get("/api/konyvek", async (req, res) => {
    try {
        const [adatok] = await pool.query(`
            SELECT konyvek.id, konyvek.cim, konyvek.kiadasi_ev,
             konyvek.oldalszam,konyvek.kolcsonozheto,mufajok.nev
             FROM konyvek,mufajok WHERE konyvek.mufaj_id = mufajok.id  
             ORDER By konyvek.kiadasi_ev ASC;
        `);

        res.status(200).json(adatok);

    } catch (hiba) {
        console.log(hiba);
        res.status(500).json({ hiba: "Adatbázis hiba" });
    }
});
app.get("/api/konyvek/elerheto", async (req, res) => {
    try {
        const [adatok] = await pool.query(`
            SELECT konyvek.id, konyvek.mufaj_id, konyvek.cim, 
            konyvek.kiadasi_ev, konyvek.oldalszam, 
            konyvek.kolcsonozheto FROM konyvek 
            WHERE konyvek.kolcsonozheto = 1 AND konyvek.kiadasi_ev < 2000;
        `);

        res.status(200).json(adatok);

    } catch (hiba) {
        console.log(hiba);
        res.status(500).json({ hiba: "Adatbázis hiba" });
    }
});
app.get("/api/konyvek/kereses/:sátán", async (req, res) => {
    try {
        const [adatok] = await pool.query(`
            SELECT konyvek.id, konyvek.mufaj_id, konyvek.cim, konyvek.kiadasi_ev,
            konyvek.oldalszam, konyvek.kolcsonozheto FROM konyvek 
            WHERE konyvek.cim LIKE "%sátán%";
        `);

        res.status(200).json(adatok);

    } catch (hiba) {
        console.log(hiba);
        res.status(500).json({ hiba: "Adatbázis hiba" });
    }
});
app.get("/api/mufajok/statisztika", async (req, res) => {
    try {
        const [adatok] = await pool.query(`
            SELECT mufajok.nev, COUNT(konyvek.id), 
            ROUND(AVG(konyvek.oldalszam))
             FROM mufajok, konyvek WHERE mufajok.id = konyvek.mufaj_id GROUP BY mufajok.nev;
        `);

        res.status(200).json(adatok);

    } catch (hiba) {
        console.log(hiba);
        res.status(500).json({ hiba: "Adatbázis hiba" });
    }
});
app.get("/api/konyvek/hosszuak", async (req, res) => {
    try {
        const [adatok] = await pool.query(`
            SELECT konyvek.cim,konyvek.kiadasi_ev,konyvek.oldalszam
             FROM konyvek WHERE konyvek.oldalszam > 400 
             ORDER BY konyvek.oldalszam DESC;
        `);

        res.status(200).json(adatok);

    } catch (hiba) {
        console.log(hiba);
        res.status(500).json({ hiba: "Adatbázis hiba" });
    }
});
app.post("/api/konyvek", async (req, res) => {
    try {
        const { mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto } = req.body;

        const [adatok] = await pool.query(
            `INSERT INTO konyvek 
            (mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto)
            VALUES (?, ?, ?, ?, ?)`,
            [mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto]
        );

        res.status(201).json({
            uzenet: "Sikeres hozzáadás!",
            id: adatok.insertId
        });

    } catch (hiba) {
        console.log(hiba);
        res.status(500).json({ hiba: hiba.message });
    }
});
app.post("/api/mufajok", async (req, res) => {
    try {
        const { nev } = req.body;

        const [adatok] = await pool.query(
            "INSERT INTO mufajok (nev) VALUES (?)",
            [nev]
        );

        res.status(201).json({
            uzenet: "Sikeres hozzáadás!",
            id: adatok.insertId
        });

    } catch (hiba) {
        res.status(500).json({ hiba: hiba.message });
    }
});
app.delete("/api/konyvek/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const [adatok] = await pool.query(
            "DELETE FROM konyvek WHERE id = ?",
            [id]
        );

        if (adatok.affectedRows === 0) {
            return res.status(404).json({
                hiba: "Nincs ilyen könyv!"
            });
        }

        res.status(200).json({
            uzenet: "Sikeres törlés!"
        });

    } catch (hiba) {
        console.log(hiba);
        res.status(500).json({ hiba: hiba.message });
    }
});
app.delete("/api/mufajok/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const [adatok] = await pool.query(
            "DELETE FROM mufajok WHERE id = ?",
            [id]
        );

        if (adatok.affectedRows === 0) {
            return res.status(404).json({
                hiba: "Nincs ilyen műfaj!"
            });
        }

        res.status(200).json({
            uzenet: "Sikeres törlés!"
        });

    } catch (hiba) {
        res.status(500).json({ hiba: hiba.message });
    }
});
app.patch("/api/konyvek/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const cim = req.body.cim;

        console.log("Kapott ID:", id);
        console.log("Kapott cím:", cim);

        const [eredmeny] = await pool.query(
            "UPDATE konyvek SET cim = ? WHERE id = ?",
            [cim, id]
        );

        if (eredmeny.affectedRows === 0) {
            return res.status(404).json({
                hiba: "Nincs ilyen könyv!"
            });
        }

        res.status(200).json({
            uzenet: "Sikeres módosítás!"
        });

    } catch (hiba) {
        console.log("ADATBAZIS HIBA:", hiba);

        res.status(500).json({
            hiba: hiba.message
        });
    }
});
app.patch("/api/konyvek/oldalszam/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const oldalszam = req.body.oldalszam;

        const [adatok] = await pool.query(
            "UPDATE konyvek SET oldalszam = ? WHERE id = ?",
            [oldalszam, id]
        );

        if (adatok.affectedRows === 0) {
            return res.status(404).json({
                hiba: "Nincs ilyen könyv!"
            });
        }

        res.status(200).json({
            uzenet: "Oldalszám sikeresen módosítva!"
        });

    } catch (hiba) {
        res.status(500).json({ hiba: hiba.message });
    }
});
app.listen(PORT, () => {
    console.log("A szerver fut: http://localhost:" + PORT);
});