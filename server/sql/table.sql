DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    id SERIAL NOT NULL PRIMARY KEY,
    fullname VARCHAR,
	username VARCHAR(255),
    password varchar(255),
    role VARCHAR(255), 
    id_number VARCHAR(255),
    contact_number VARCHAR(255)
);

DROP TABLE IF EXISTS appointments CASCADE;
CREATE TABLE appointments(
    id SERIAL NOT NULL PRIMARY KEY,
    slot VARCHAR NOT NULL,
    users_id int,
    status varchar(255) default 'Pending...',
    description varchar(255) NOT NULL,
    FOREIGN KEY (users_id) REFERENCES users(id)
);

