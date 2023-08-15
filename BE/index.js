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

app.get("/farm", (req, res) => {
    const q = "SELECT * FROM farm";
    db.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
});

app.get('/farm/:id', function (req, res) {
    const {id} = req.params
    var q = "SELECT * FROM farm where id="+id+""
    db.query(q, function(err, results) {
    if (err) throw err;
    res.send(results);
    });
    })

app.post("/farm", (req, res) => {
    const q = "INSERT INTO farm(`nameFarm`, `codeFarm`, `descFarm`, `img`) VALUES (?)";

    const values = [
        req.body.nameFarm,
        req.body.codeFarm,
        req.body.descFarm,
        req.body.img,
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.delete("/farm/:id", (req, res) => {
    const bookId = req.params.id;
    const q = " DELETE FROM farm WHERE id = ? ";

    db.query(q, [bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.put("/farm/:id", (req, res) => {
    const farmId = req.params.id;
    const q =
        "UPDATE farm SET `nameFarm`= ?, `codeFarm`= ?, `descFarm`= ?, `img`= ? WHERE id = ?";

    const values = [
        req.body.nameFarm,
        req.body.codeFarm,
        req.body.descFarm,
        req.body.img,
    ];

    db.query(q, [...values, farmId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.listen(8800, () => {
    console.log("Connected to backend.");
});
