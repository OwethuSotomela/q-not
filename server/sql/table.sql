DROP TABLE IF EXISTS patients CASCADE;
CREATE TABLE patients(
    id SERIAL NOT NULL PRIMARY KEY,
    fullname VARCHAR NOT NULL,
	username VARCHAR(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    card_number VARCHAR(255)
);

DROP TABLE IF EXISTS admin CASCADE;
CREATE TABLE admin(
    id SERIAL NOT NULL PRIMARY KEY,
    fullname VARCHAR NOT NULL,
	username VARCHAR(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL
);

DROP TABLE IF EXISTS appointments CASCADE;
CREATE TABLE appointments(
    id SERIAL NOT NULL PRIMARY KEY,
    dateAndTime VARCHAR NOT NULL,
    patients_id int,
    FOREIGN KEY (patients_id) REFERENCES patients(id)
);