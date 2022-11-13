let express = require("express");
let { Pool } = require("pg");
let bcrypt = require("bcrypt");
let env = require("../env.json");

let hostname = "localhost";
let port = 3000;
let app = express();

app.use(express.json());
app.use(express.static("public"));

let pool = new Pool(env);
pool.connect().then(() => {
    console.log(`Connected to database ${env.database}`);
});

let saltRounds = 10;

app.post("/signup", (req, res) => {

    if (req.body.username && req.body.plaintextPassword){
      let username = req.body.username;
      let plaintextPassword = req.body.plaintextPassword;

      if ((typeof username === 'string') && (typeof plaintextPassword === 'string')){
        if ((username.length >= 1)  && (username.length <= 25)){
          if ((plaintextPassword.length >= 1) && (plaintextPassword.length <= 36)){

            pool.query(
                "SELECT * FROM users WHERE username = $1", [username]
            )
                .then((result) => {
                    console.log("RESULT :", result.rows.length);

                    if (result.rows.length > 0){ //user already exists
                        console.log(username, "this user name is taken");
                        res.status(200).send();
                          }
                    else{
                        bcrypt
                            .hash(plaintextPassword, saltRounds)
                            .then((hashedPassword) => {
                                pool.query(
                                    "INSERT INTO users (username, hashed_password) VALUES ($1, $2)",
                                    [username, hashedPassword]
                                )
                                .then(() => {
                                    // account created
                                    console.log(username, "account created");
                                    res.status(200).send();
                                })
                                .catch((error) => {
                                    // insert failed
                                    console.log(error);
                                    res.status(500).send();
                                });
                            })
                    .catch((error) => {
                        // insert failed
                        console.log(error);
                        res.status(500).send();
                    });
                }
              });
            }
            else{ res.status(401).send(); }}
        else{ res.status(401).send(); }}
      else{ res.status(401).send(); }}
    else{ res.status(401).send(); }
});

app.post("/signin", (req, res) => {
    let username = req.body.username;
    let plaintextPassword = req.body.plaintextPassword;

    pool.query("SELECT hashed_password FROM users WHERE username = $1", [
        username,
    ])
        .then((result) => {
            if (result.rows.length === 0) {
                // username doesn't exist
                return res.status(401).json({status: 401});
            }
            else{ // check pw
              let hashedPassword = result.rows[0].hashed_password;
              bcrypt
                  .compare(plaintextPassword, hashedPassword)
                  .then((passwordMatched) => {
                      if (passwordMatched) {
                        pool.query("SELECT * FROM users WHERE username = $1", [
                          username,
                        ])
                          .then((result) => {
                            res.status(200).json({"username": result.rows[0].username, status: 200});
                          });
                      } else {
                          res.status(401).send();
                      }
                  })
                  .catch((error) => {
                      // bcrypt crashed
                      console.log(error);
                      res.status(500).send();
                  });
            }
        })
        .catch((error) => {
            // select crashed
            console.log(error);
            res.status(500).send();
        });
});


app.post("/add_task", (req, res) => {
/*
CREATE TABLE tasks (
    taskID SERIAL PRIMARY KEY,
    userID VARCHAR(25),
    taskname VARCHAR(25),
    description VARCHAR,
    total NUMERIC,
    completed BOOLEAN,
    abandoned BOOLEAN
);*/
  let userid = req.body.userid;
  let taskname = req.body.taskname;
  let description = req.body.description;
  let total = 0;
  let completed = false;
  let abandoned = false;

  if (taskname && estimate && workhrs){
    if (taskname.length <= 15 && taskname.length >= 1){
        pool.query('INSERT INTO tasks (userID, taskname, description, total, completed, abandoned) VALUES ($1, $2, $3, $4, $5, $6)', [userid, taskname, description, total, completed, abandoned]);
        res.status(200).send();
    }
    else{ res.status(400).send(); }}
  else{ res.status(400).send(); }}
);

app.post("/add_session", (req, res) => {
/* every time the user clicks STOP a new session is added
CREATE TABLE sessions (
    sessionID SERIAL PRIMARY KEY,
    userID VARCHAR(25),
    taskID VARCHAR(25),
    seconds NUMERIC,
    finished TIMESTAMP
);*/
  let userid = req.body.userid;
  let taskid = req.body.taskid;
  let seconds = req.body.seconds;
  let finished = req.body.finished;

  if (taskname && estimate && workhrs){
    if (taskname.length <= 15 && taskname.length >= 1){
        pool.query('INSERT INTO tasks (userID, taskname, description, total, completed) VALUES ($1, $2, $3, $4)', [userid, taskid, seconds, finished]);
        res.status(200).send();
    }
    else{ res.status(400).send(); }}
  else{ res.status(400).send(); }}
);


app.post("/search/tasks", (req, res) => {
  let userid = req.body.userid;

  if (req.query.taskname){
    pool.query(`SELECT * FROM tasks WHERE taskname = '${req.query.taskname}'`).then(result => {
        res.status(200).json({"rows": result.rows, status: 200});
    });
  }
  else{
    pool.query("SELECT * FROM tasks WHERE userID = $1", [
      userid,
    ]).then(result => {
        res.status(200);
        res.json({"rows": result.rows});
    });
  }
});


app.post("/search/sessions", (req, res) => {
  let userid = req.body.userid;

  if (req.query.taskname){
    pool.query(`SELECT * FROM sessions WHERE taskname = '${req.query.taskname}'`).then(result => {
        res.status(200).json({"rows": result.rows, status: 200});
    });
  }
  else{
    pool.query("SELECT * FROM sessions WHERE userID = $1", [
      userid,
    ]).then(result => {
        res.status(200);
        res.json({"rows": result.rows});
    });
  }
});


app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});
