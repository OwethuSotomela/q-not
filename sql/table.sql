DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    id SERIAL NOT NULL PRIMARY KEY,
    fullname VARCHAR NOT NULL,
	username VARCHAR(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    role VARCHAR(255) NOT NULL, 
    id_number VARCHAR(255),
    contact_number VARCHAR(255)
);

DROP TABLE IF EXISTS appointments CASCADE;
CREATE TABLE appointments(
    id SERIAL NOT NULL PRIMARY KEY,
    slot VARCHAR NOT NULL,
    users_id int,
    description varchar(255) NOT NULL,
    FOREIGN KEY (users_id) REFERENCES users(id)
);