CREATE DATABASE finalcountdown;
\c finalcountdown;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25),
    hashed_password CHAR(60)
);
CREATE TABLE tasks (
    taskID SERIAL PRIMARY KEY,
    userID VARCHAR(25),
    taskname VARCHAR(25),
    description VARCHAR,
    total NUMERIC,
    completed BOOLEAN,
    abandoned BOOLEAN
);
CREATE TABLE sessions (
    sessionID SERIAL PRIMARY KEY,
    userID NUMERIC,
    taskID NUMERIC,
    seconds NUMERIC,
    finished BOOLEAN
);

INSERT INTO users (username, hashed_password) VALUES ('test_user1', 'fake_pw');
INSERT INTO tasks (userID, taskname, description, total, completed, abandoned) VALUES ('1', 'task_name_1', 'task description etc etc etc', 1, false, false);
INSERT INTO sessions (userID, taskID, seconds, finished) VALUES (1, 1, 1, false);


INSERT INTO users (username, hashed_password) VALUES ('test_user2', 'fake_pw');
INSERT INTO tasks (userID, taskname, description, total, completed, abandoned) VALUES ('2', 'task_name_1', 'task 1 description etc etc etc', 10, false, false);
INSERT INTO sessions (userID, taskID, seconds, finished) VALUES (2, 2, 10, false);

INSERT INTO tasks (userID, taskname, description, total, completed, abandoned) VALUES ('2', 'task_name_2', 'task 2 description etc etc etc', 100, true, false);
INSERT INTO sessions (userID, taskID, seconds, finished) VALUES (2, 3, 90, false);
INSERT INTO sessions (userID, taskID, seconds, finished) VALUES (2, 3, 10, true);

INSERT INTO tasks (userID, taskname, description, total, completed, abandoned) VALUES ('2', 'task_name_3', 'task 3 description etc etc etc', 1, false, true);
INSERT INTO sessions (userID, taskID, seconds, finished) VALUES (2, 4, 1, true);
