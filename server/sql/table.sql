<<<<<<< HEAD
 DROP TABLE IF EXISTS;

CREATE TABLE patients(
    id SERIAL NOT NULL PRIMARY KEY,
    fullname VARCHAR NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
=======
DROP TABLE IF EXISTS;
CREATE TABLE patients(
    id SERIAL NOT NULL PRIMARY KEY,
    fullname VARCHAR NOT NULL,
	username VARCHAR(255) NOT NULL UNIQUE,
>>>>>>> b0102d149f8cd236b73348c3f06da38620904f9c
    password varchar(255) NOT NULL,
    card_number VARCHAR(255)
);

<<<<<<< HEAD
 DROP TABLE IF EXISTS;


CREATE TABLE admin(
    id SERIAL NOT NULL PRIMARY KEY,
    fullname VARCHAR NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL
);

 DROP TABLE IF EXISTS;

=======
DROP TABLE IF EXISTS;
CREATE TABLE admin(
    id SERIAL NOT NULL PRIMARY KEY,
    fullname VARCHAR NOT NULL,
	username VARCHAR(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL
);

DROP TABLE IF EXISTS;
>>>>>>> b0102d149f8cd236b73348c3f06da38620904f9c
CREATE TABLE appointments(
    id SERIAL NOT NULL PRIMARY KEY,
    date VARCHAR NOT NULL,
    time VARCHAR NOT NULL,
    patients_id int,
    FOREIGN KEY (patients_id) REFERENCES patients(id)
);