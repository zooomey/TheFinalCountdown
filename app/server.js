let express = require("express");
let { Pool } = require("pg");
let bcrypt = require("bcrypt");
let env = require("../env.json");
let cookieParser = require("cookie-parser");

let hostname = "localhost";
let port = 3000;
let app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

let pool = new Pool(env);
pool.connect().then(() => {
    console.log(`Connected to database ${env.database}`);
});

let saltRounds = 10;
let sessionCookies = [];


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
                                .then(() => {  // account created
                                    console.log(username, "account created");
                                    res.status(200).send();
                                })
                                .catch((error) => {  // insert failed
                                    console.log(error);
                                    res.status(500).send();
                                });
                            })
                            .catch((error) => {  // select failed
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
    let oldCookie = req.body.cookie;
    let userID;
    let newCookie;

    pool.query("SELECT hashed_password FROM users WHERE username = $1", [
        username,
    ])
        .then((result) => {
            if (result.rows.length === 0) { // username doesn't exist
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
                          .then((result) => { //generate session cookie, save in array, hash the cookie, send to browser
                                var num = Math.random(1000);
                                newCookie = num.toString();
                                userID = result.rows[0].id;
                                username = result.rows[0].username;

                                bcrypt
                                  .hash(newCookie, saltRounds)
                                  .then((hashedCookie) => {
                                      if (oldCookie === ''){
                                        sessionCookies[userID] = {username: username, cookie: newCookie};
                                        res.status(200).json({userID: userID, username: username, cookie: hashedCookie, status: 200})
                                      }
                                      else{
                                        var cookie = oldCookie.replace('session=', ''); //remove cookie name (most browsers need a name)
                                        cookie = JSON.parse(cookie);
                                        res.status(200).json({userID: userID, username: username, cookie: cookie.cookie, status: 200});
                                      }
                                  }).catch((error) => { // bcrypt crashed
                                      console.log(error);
                                    });
                            });
                        }
                        else { //wrong pw
                          res.status(401).send();
                        }
                  }).catch((error) => { // bcrypt crashed
                      console.log(error);
                      res.status(500).send();
                  });
            }
        })
        .catch((error) => { // select crashed
            console.log(error);
            res.status(500).send();
        });
});

app.post("/signout", (req, res) => {
  let userid = req.body.userid;
  let cookie = req.body.cookie;

  sessionCookies[userid] = ""; // delete cookie
});


app.post("/add_task", (req, res) => {
/*
CREATE TABLE tasks (
    taskID SERIAL PRIMARY KEY,
    userID NUMERIC,
    taskname VARCHAR(40),
    description VARCHAR,
    estimate NUMERIC,
    total NUMERIC,
    completed BOOLEAN,
    abandoned BOOLEAN
);*/
  let userid = req.body.userid;
  let taskname = req.body.taskname;
  let description = req.body.description;
  let estimate = req.body.estimate;
  let cookie = req.body.cookie;

  if (checkCookie(cookie, userid)){
    if (taskname.length < 40 && taskname.length >= 1 && description && estimate){
        pool.query('INSERT INTO tasks (userID, taskname, description, estimate, total, inprogress, completed, abandoned) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [userid, taskname, description, estimate, 0, false, false, false]);
        res.status(200).send();
    }
    else{ res.status(400).send(); }
  }
  else{ res.status(400).send(); } //invalid cookie
});


app.post("/close_task", (req, res) => {
  let taskID = req.body.taskID;
  let status = req.body.status;

  if (taskID && status === "completed") {
    pool.query("UPDATE tasks SET inprogress = false, completed = true WHERE taskid = $1", [taskID]).then((result) => {
      res.send();
    }).catch((error) => {
      res.status(500).send();
    });
  } else if (taskID && status === "abandoned") {
    pool.query("UPDATE tasks SET inprogress = false, abandoned = true WHERE taskid = $1", [taskID]).then((result) => {
      res.send();
    }).catch((error) => {
      res.status(500).send();
    });
  } else {
    res.status(400).send();
  }
});


app.post("/delete_task", (req, res) => {
  // Tasks updated when the user deletes from kanban
  let userid = req.body.userid;
  let taskid = req.body.taskid;
  let cookie = req.body.cookie;
  console.log(userid, taskid, cookie);

  if (checkCookie(cookie, userid)){
    if (taskid) {
      pool.query("DELETE FROM sessions WHERE taskid = $1", [taskid]);
      pool.query("DELETE FROM tasks WHERE taskid = $1", [taskid]).then((result) => {
          res.status(200).send();
        }).catch((error) => {
          res.status(500).send();
      });
    } else {
      res.status(400).send();
    }
  }
  else{ res.status(400).send(); } //invalid cookie
});


app.post("/add_session", (req, res) => {
/*
New session is created when the start button is clicked
CREATE TABLE sessions (
    sessionID SERIAL PRIMARY KEY,
    userID NUMERIC,
    taskID NUMERIC,
    seconds NUMERIC,
    start_date TIMESTAMP,
    stop_date TIMESTAMP
);
*/
  let userid = req.body.userid;
  let taskid = req.body.taskid;
  let date = req.body.date;
  let cookie = req.body.cookie;

  if (checkCookie(cookie, userid)){
    if (userid && taskid && date) {
      pool.query('INSERT INTO sessions (userID, taskID, seconds, start_date, stop_date) VALUES ($1, $2, $3, to_timestamp($4), to_timestamp($4)) RETURNING sessionid', [userid, taskid, 0, date]).then(result => {
        res.json({sessionID: result.rows[0].sessionid});
      }).catch((error) => {
        res.status(500).send();
      });
    }
    else{ res.status(400).send(); }
  }
  else{ res.status(400).send(); } //invalid cookie
});


app.post("/update_session", (req, res) => {
  // Session is updated when the timer resumes/stops/finishes or a minute passes on the timer
  let taskid = req.body.taskid;
  let sessionid = req.body.sessionid;
  let seconds = req.body.seconds;
  let date = req.body.date;
  let userid = req.body.userid;
  let cookie = req.body.cookie;

  if (checkCookie(cookie, userid)){
    if(sessionid && seconds && date) {
      pool.query("UPDATE tasks SET total = total + $1, abandoned = false, inprogress = true, completed = false WHERE taskid = $2", [seconds, taskid]);

      pool.query("UPDATE sessions SET seconds = $1, stop_date = to_timestamp($2) WHERE sessionid = $3", [seconds, date, sessionid]).then((result) => {
        res.send();
      }).catch((error) => {
        res.status(500).send();
      });
    } else {
      res.status(400).send();
    }
  }
  else{
    res.status(400).send();
  } //invalid cookie
});


app.post("/update_tasks", (req, res) => {
  // Tasks updated when the user drags div in kanban
  let userid = req.body.userid;
  let cookie = req.body.cookie;
  let taskid = req.body.taskid;
  let status = req.body.status;
  let abandoned, inprogress, completed;

  //console.log("UPDATE request : taskid ", taskid, " status: ", status);

  if (status === "1"){ //abandoned
    abandoned = true;
    inprogress = false;
    completed = false;
  }
  else if (status === "2"){ //todo
    abandoned = false;
    inprogress = false;
    completed = false;
  }
  else if (status === "3"){ //inprogress
    abandoned = false;
    inprogress = true;
    completed = false;
  }
  else if (status === "4"){ //completed
    abandoned = false;
    inprogress = false;
    completed = true;
  }

  if (checkCookie(cookie, userid)){
    if(userid && taskid) {
      pool.query("UPDATE tasks SET abandoned = $1, inprogress = $2, completed = $3 WHERE taskid = $4", [abandoned, inprogress, completed, taskid]).then((result) => {res.send();
      }).catch((error) => {
        res.status(500).send();
      });
    } else {
      res.status(400).send();
    }
  }
  else{
    res.status(400).send();
  } //invalid cookie
});


app.post("/search/tasks", (req, res) => {
  let userid = req.body.userid;
  let cookie = req.body.cookie;

  if (checkCookie(cookie, userid)) {
    if (req.query.taskname){
      pool.query(
        `SELECT * FROM tasks WHERE taskname = '${req.query.taskname}'`
      ).then((result) => {
        res.status(200).json({"rows": result.rows, status: 200});
      }).catch((error) => {
        res.status(500).send();
      });
    }
    else{
      pool.query(
        "SELECT * FROM tasks WHERE userID = $1", [userid]
      ).then((result) => {
        res.status(200).json({"rows": result.rows, status: 200});
      }).catch((error) => {
        res.status(500).send();
      });
    }
  }
  else{
    res.status(400).send();
  } //invalid cookie
});


app.post("/search/sessions", (req, res) => {
  let userid = req.body.userid;
  let cookie = req.body.cookie;

  if (checkCookie(cookie, userid)) {
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
  }
  else{ res.status(400).send(); } //invalid cookie
});


async function checkCookie(cookie, id){
  try {
    let cookieBool;

    if (cookie === ''){
      return false;
    }
    else {
      let plaintext = sessionCookies[id].cookie;

      cookieBool = await bcrypt
            .compare(plaintext, cookie)
            .then((cookiesMatched) => {
                if (cookiesMatched) {
                  return true;
                }
                else {
                  return false;
                }
        }).catch((error) => {
          return false;
        });
      return cookieBool;
    }
  } catch (error) {
    return false;
  }
}


app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});
