import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "0123456",
    database: "cntt2",
});

app.get("/", (req, res) => {
    res.json("hello");
});

app.get("/sensor", (req, res) => {
    const q = "SELECT * FROM sensorgas_temp";
    db.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
});

app.get('/sensor/:id', function (req, res) {
    const {id} = req.params
    var q = "SELECT * FROM sensorgas_temp where id="+id+""
    db.query(q, function(err, results) {
    if (err) throw err;
    res.send(results);
    });
    })

app.post("/sensor", (req, res) => {
    const q = "INSERT INTO sensorgas_temp(`temperature`, `humid`, `gas`) VALUES (?)";

    const values = [
        // req.body.id,
        req.body.temperature,
        req.body.humid,
        req.body.gas,
        // req.body.time,
        // req.body.farmid,
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.delete("/sensor/:id", (req, res) => {
    const bookId = req.params.id;
    const q = " DELETE FROM sensorgas_temp WHERE id = ? ";

    db.query(q, [bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.put("/sensor/:id", (req, res) => {
    const sensorId = req.params.id;
    const q =
        "UPDATE sensorgas_temp SET `temperature`= ?, `humid`= ?, `gas`= ?, WHERE id = ?";
        const values = [
            req.body.temperature,
            req.body.humid,
            req.body.gas,
            // req.body.time,
            // req.body.farmid,
        ];

    db.query(q, [...values, sensorId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.listen(8800, () => {
    console.log("Connected to backend.");
});
