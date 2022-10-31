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
          if ((plaintextPassword.length >= 5) && (plaintextPassword.length <= 36)){

            pool.query( //Why not use pool.query("SELECT username FROM users WHERE username = $1", instead of having a for loop to see if the username exists
                "SELECT username FROM users WHERE username = $1", [username]
            )
                .then((result) => {
                    //console.log(result.rows)
                    if (result){
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
                              // bcrypt crashed
                              console.log(error);
                              res.status(500).send();
                          });
                    }
                    else{
                      res.status(401).send();
                    }
                })
                .catch((error) => {
                    // insert failed
                    console.log(error);
                    res.status(500).send();
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
                return res.status(401).send();
            }
            let hashedPassword = result.rows[0].hashed_password;
            bcrypt
                .compare(plaintextPassword, hashedPassword)
                .then((passwordMatched) => {
                    if (passwordMatched) {
                        res.status(200).send();
                    } else {
                        res.status(401).send();
                    }
                })
                .catch((error) => {
                    // bcrypt crashed
                    console.log(error);
                    res.status(500).send();
                });
        })
        .catch((error) => {
            // select crashed
            console.log(error);
            res.status(500).send();
        });
});


app.post("/add", (req, res) => {

  let taskname = req.body.taskname;
  let estimate = req.body.estimate;
  let workhrs = req.body.workhrs;
  let complete = req.body.complete;

  if (taskname && estimate && workhrs){
    if (taskname.length <= 15 && taskname.length >= 1){
        if (complete == "yes" || complete == "no"){
          pool.query('INSERT INTO tasks (taskname, estimate, workhrs, complete) VALUES ($1, $2, $3, $4)', [taskname, estimate, workhrs, complete]);
          res.status(200).send();
        }
        else{ res.status(400).send(); }}
      else{ res.status(400).send(); }}
    else{ res.status(400).send(); }}
  //else{res.status(400).send(); }}
  );


app.get("/search", (req, res) => {
  
  if (req.query.taskname){
    pool.query(`SELECT * FROM tasks WHERE taskname = '${req.query.taskname}'`).then(result => {
        res.status(200);
        res.json({"rows": result.rows});
    });
  }
  else{
    pool.query("SELECT * FROM tasks").then(result => {
        res.status(200);
        res.json({"rows": result.rows});
    });
  }
});


app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});
