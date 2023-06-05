CREATE DATABASE todoapp;

CREATE TABLE todos(
    id serial PRIMARY KEY,
    user_email VARCHAR(255), 
    title VARCHAR(30),
    progress INT,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users(
    email VARCHAR(255) PRIMARY KEY,
    hashed_password VARCHAR(255)
);

INSERT INTO todos(user_email, title, progress) VALUES ('zard1313@outlook.com', 'First Todo', 10);
INSERT INTO todos(user_email, title, progress, date) VALUES ('zard1313@gmail.com', 'Second Todo', 5, CURRENT_TIMESTAMP);