 DROP TABLE IF EXISTS;

CREATE TABLE patients(
    id SERIAL NOT NULL PRIMARY KEY,
    fullname VARCHAR NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    card_number VARCHAR(255)
);

 DROP TABLE IF EXISTS;


CREATE TABLE admin(
    id SERIAL NOT NULL PRIMARY KEY,
    fullname VARCHAR NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL
);

 DROP TABLE IF EXISTS;

CREATE TABLE appointments(
    id SERIAL NOT NULL PRIMARY KEY,
    date VARCHAR NOT NULL,
    time VARCHAR NOT NULL,
    patients_id int,
    FOREIGN KEY (patients_id) REFERENCES patients(id)
);