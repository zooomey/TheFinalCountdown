CREATE DATABASE finalcountdown;
\c finalcountdown;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25),
    hashed_password CHAR(60)
);
CREATE TABLE tasks (
    taskID SERIAL PRIMARY KEY,
    userID NUMERIC,
    taskname VARCHAR(40),
    description VARCHAR,
    estimate NUMERIC,
    total NUMERIC,
    inprogress BOOLEAN,
    completed BOOLEAN,
    abandoned BOOLEAN
);
CREATE TABLE sessions (
    sessionID SERIAL PRIMARY KEY,
    userID NUMERIC,
    taskID NUMERIC,
    seconds NUMERIC,
    start_date TIMESTAMP,
    stop_date TIMESTAMP
);

INSERT INTO users (username, hashed_password) VALUES ('test_user1', 'fake_pw');
INSERT INTO tasks (userID, taskname, description, estimate, total, inprogress, completed, abandoned) VALUES (1, 'task_name_1', 'task description etc etc etc', 500, 1, false, false, false);
INSERT INTO sessions (userID, taskID, seconds, start_date, stop_date) VALUES (1, 1, 1, '2022-11-07 11:11:11-11', '2022-11-07 11:11:11-11');


INSERT INTO users (username, hashed_password) VALUES ('test_user2', 'fake_pw');
INSERT INTO tasks (userID, taskname, description, estimate, total, inprogress, completed, abandoned) VALUES (2, 'task_name_1', 'task 1 description etc etc etc', 8000, 10, true, false, false);
INSERT INTO sessions (userID, taskID, seconds, start_date, stop_date) VALUES (2, 2, 10, '2022-11-06 11:11:11-11', '2022-11-06 11:11:11-11');

INSERT INTO tasks (userID, taskname, description, estimate, total, inprogress, completed, abandoned) VALUES (2, 'task_name_2', 'task 2 description etc etc etc', 80, 100, false, true, false);
INSERT INTO sessions (userID, taskID, seconds, start_date, stop_date) VALUES (2, 3, 90, '2022-11-07 11:11:11-11', '2022-11-07 11:11:11-11');
INSERT INTO sessions (userID, taskID, seconds, start_date, stop_date) VALUES (2, 3, 10, '2022-11-08 11:11:11-11', '2022-11-08 11:11:11-11');

INSERT INTO tasks (userID, taskname, description, estimate, total, inprogress, completed, abandoned) VALUES (2, 'task_name_3', 'task 3 description etc etc etc', 1, 1, false, false, true);
INSERT INTO sessions (userID, taskID, seconds, start_date, stop_date) VALUES (2, 4, 1, '2022-11-07 11:11:11-11', '2022-11-07 11:11:11-11');
