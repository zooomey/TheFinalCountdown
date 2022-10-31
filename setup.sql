CREATE DATABASE finalcountdown;
\c finalcountdown;
CREATE TABLE users (
    username VARCHAR(25),
    hashed_password CHAR(60),
    tasks VARCHAR(25)
);
