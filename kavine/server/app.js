const express = require("express");
const app = express();
const port = 3003;
app.use(express.json({ limit: '10mb' }));
const cors = require("cors");
app.use(cors());
const md5 = require('js-md5');
const uuid = require('uuid');
const mysql = require("mysql");
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());


const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "kavine",
});

////////////////////LOGIN/////////////////

const doAuth = function(req, res, next) {
    if (0 === req.url.indexOf('/server')) { // admin
        const sql = `
        SELECT
        name, role
        FROM users
        WHERE session = ?
    `;
        con.query(
            sql, [req.headers['authorization'] || ''],
            (err, results) => {
                if (err) throw err;
                if (!results.length || results[0].role !== 10) {
                    res.status(401).send({});
                    req.connection.destroy();
                } else {
                    next();
                }
            }
        );
    } else if (0 === req.url.indexOf('/login-check') || 0 === req.url.indexOf('/login') || 0 === req.url.indexOf('/register')) {
        next();
    } else { // fron
        const sql = `
        SELECT
        name, role
        FROM users
        WHERE session = ?
    `;
        con.query(
            sql, [req.headers['authorization'] || ''],
            (err, results) => {
                if (err) throw err;
                if (!results.length) {
                    res.status(401).send({});
                    req.connection.destroy();
                } else {
                    next();
                }
            }
        );
    }
}

app.use(doAuth);

// AUTH
app.get("/login-check", (req, res) => {
    const sql = `
         SELECT
         name, role
         FROM users
         WHERE session = ?
        `;
    con.query(sql, [req.headers['authorization'] || ''], (err, result) => {
        if (err) throw err;
        if (!result.length) {
            res.send({ msg: 'error', status: 1 }); // user not logged
        } else {
            if ('admin' === req.query.role) {
                if (result[0].role !== 10) {
                    res.send({ msg: 'error', status: 2 }); // not an admin
                } else {
                    res.send({ msg: 'ok', status: 3 }); // is admin
                }
            } else {
                res.send({ msg: 'ok', status: 4 }); // is user
            }
        }
    });
});

app.post("/login", (req, res) => {
    const key = uuid.v4();
    const sql = `
    UPDATE users
    SET session = ?
    WHERE name = ? AND psw = ?
  `;
    con.query(sql, [key, req.body.user, md5(req.body.pass)], (err, result) => {
        if (err) throw err;
        if (!result.affectedRows) {
            res.status(401).send({ msg: 'error', key: '' });
        } else {
            res.send({ msg: 'ok', key, text: 'Good to see you ' + req.body.user + ' again.', type: 'info' });
        }
    });
});

app.post("/register", (req, res) => {
    const key = uuid.v4();
    const sql = `
    INSERT INTO users (name, psw, session)
    VALUES (?, ?, ?)
  `;
    con.query(sql, [req.body.name, md5(req.body.pass), key], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'ok', key, text: 'Welcome!', type: 'info' });
    });
});

//CREATE
app.post("/server/foods", (req, res) => {
    const sql = `
    INSERT INTO foods (title, price, image)
    VALUES (?, ?, ?)
    `;
    con.query(sql, [req.body.title, req.body.price, req.body.image], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'New food was added.', type: 'success' });
    });
});


// READ (all)
app.get("/server/foods", (req, res) => {
    const sql = `
    SELECT *
    FROM foods
    ORDER BY id DESC
    `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
app.get("/home/foods", (req, res) => {
    const sql = `
    SELECT f.*
    FROM foods AS f
    ORDER BY f.title
    `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


//DELETE
app.delete("/server/foods/:id", (req, res) => {
    const sql = `
    DELETE FROM foods
    WHERE id = ?
    `;
    con.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'Food deleted.', type: 'info' });
    });
});


//EDIT
app.put("/home/foods/:id", (req, res) => {
    const sql = `
    UPDATE foods
    SET 
    rating_sum = rating_sum + ?, 
    rating_count = rating_count + 1, 
    rating = rating_sum / rating_count
    WHERE id = ?
    `;
    con.query(sql, [req.body.rate, req.params.id], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'Thank you for your vote.', type: 'info' });
    });
});
app.put("/server/foods/:id", (req, res) => {
    let sql;
    let r;
    if (req.body.deletePhoto) {
        sql = `
        UPDATE foods
        SET title = ?, price = ?, image = null
        WHERE id = ?
        `;
        r = [req.body.title, req.body.price, req.params.id];
    } else if (req.body.image) {
        sql = `
        UPDATE foods
        SET title = ?, price = ?, image = ?
        WHERE id = ?
        `;
        r = [req.body.title, req.body.price, req.body.image, req.params.id];
    } else {
        sql = `
        UPDATE foods
        SET title = ?, price = ?
        WHERE id = ?
        `;
        r = [req.body.title, req.body.price, req.params.id]
    }
    con.query(sql, r, (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'Food edited.', type: 'success' });
    });
});

app.listen(port, () => {
    console.log(`Kavine rodoma per ${port} portą!`)
});