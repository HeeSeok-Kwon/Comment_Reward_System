const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10; 

const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60*60*24,
    },
}))

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "root",
    database: "sol",
})

app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const address = req.body.address;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err) {
            console.log(err);
        }

        db.query(
            "INSERT INTO users (user_name, user_pw, user_addr, reg_date) VALUES (?,?,?, NOW())",
            [username, hash, address],
            (err, result) => {
               if(err) {
                   console.log(err);
               } else {
                   res.send(result);
               }
            }
        );
    })
})

app.get("/login", (req, res) => {
    if(req.session.user) {
        res.send({loggedIn: true, user: req.session.user});
    } else {
        res.send({loggedIn: false});
    }
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM users WHERE user_name = ?;",
        username,
        (err, result) => {
            if(err) {
                res.send({err: err});
            } 
            if (result.length > 0) {
                bcrypt.compare(password, result[0].user_pw, (error, response) => {
                    if(response) {
                        req.session.user = result;
                        console.log(req.session.user);
                        res.send(result);
                    } else {
                        res.send({message: "아이디&비밀번호를 확인해주세요."});
                    }
                })
            } else {
                res.send({message: "아이디가 존재하지 않습니다."});
            }
        }
    )
})

app.post("/writeText", (req, res) => {
    const username = req.body.username;
    const title = req.body.title;
    const content = req.body.content;
    let userId = 0;
    let address = "";
    db.query(
        "SELECT user_id, user_addr FROM users WHERE user_name = ?",
        username,
        (err, result) => {
            if(err) {
                console.log(err);
            } else {
                console.log(result[0]);
                userId = result[0].user_id;
                address = result[0].user_addr;
                // res.send(result);
                db.query(
                    "INSERT INTO text (user_id, user_name, user_addr, title, content, selectOK, reg_date) VALUES (?,?,?,?,?,0,NOW())",
                    [userId, username, address, title, content],
                    (err, result) => {
                        if(err) {
                            console.log(err);
                        } else {
                            res.send(result);
                        }
                    }
                )
            }
        }
    )
})

app.get("/getTexts", (req, res) => {
    db.query(
        "SELECT * FROM text ORDER BY text_id DESC",
        (err, result) => {
            res.send(result);
        }
    )
})

app.post("/writeComment", (req, res) => {
    const textId = req.body.textId;
    const username = req.body.username;
    const comment = req.body.comment;
    let userId = 0;
    let address = "";
    db.query(
        "SELECT user_id, user_addr FROM users WHERE user_name = ?",
        username,
        (err, result) => {
            if(err) {
                console.log(err);
            } else {
                console.log(result[0]);
                userId = result[0].user_id;
                address = result[0].user_addr;
                // res.send(result);
                db.query(
                    "INSERT INTO comment (text_id, user_id, user_name, user_addr, comment, selectOK, reg_date) VALUES (?,?,?,?,?,0,NOW())",
                    [textId, userId, username, address, comment],
                    (err, result) => {
                        if(err) {
                            console.log(err);
                        } else {
                            res.send(result);
                        }
                    }
                )
            }
        }
    )
})

app.post("/getComments", (req, res) => {
    const textId = req.body.textId;
    db.query(
        "SELECT * FROM comment WHERE text_id = ? ORDER BY comment_id DESC",
        textId,
        (err, result) => {
            res.send(result);
        }
    )
})

app.post("/selectComment", (req, res) => {
    const textId = req.body.textId;
    const commentId = req.body.commentId;
    db.query(
        "SELECT selectOK FROM text WHERE text_id = ?",
        textId,
        (err, result) => {
            if(err) {
                console.log(err);
            } else {
                console.log(result[0]);
                if(result[0].selectOK == 1) {
                    res.send({message: "채택된 글이 존재합니다."});
                } else {
                    db.query(
                        "UPDATE text SET selectOK = '1' WHERE text_id = ?",
                        textId,
                        (err, result) => {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log(result);
                            }
                        }
                    )
                    db.query(
                        "UPDATE comment SET selectOK = '1' WHERE text_id = ? AND comment_id = ?",
                        [textId, commentId],
                        (err, result) => {
                            if(err) {
                                console.log(err);
                            } else {
                                res.send({message: "댓글 채택이 완료되었습니다."});
                            }
                        }
                    )
                }
            }
        }
    )
})

app.post("/getSelectedComments", (req, res) => {
    const textId = req.body.textId;
    db.query(
        "SELECT * FROM comment WHERE text_id = ? AND selectOK = '1'",
        textId,
        (err, result) => {
            res.send(result);
        }
    )
})

app.post("/getUserId", (req, res) => {
    const username = req.body.username;
    db.query(
        "SELECT * FROM users WHERE user_name = ?",
        username,
        (err, result) => {
            res.send(result);
        }
    )
})

app.listen(3001, () => {
    console.log("running server");
})