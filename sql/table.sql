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
    confirmed boolean default False,
    description varchar(255) NOT NULL,
    FOREIGN KEY (users_id) REFERENCES users(id)
);

 DROP TABLE IF EXISTS events CASCADE;
 CREATE TABLE events (
    id SERIAL NOT NULL PRIMARY KEY,
    start_date timestamp NOT NULL,
    end_date timestamp NOT NULL,
    text varchar(255) DEFAULT NULL,
    color VARCHAR(30)
); 

INSERT INTO events (start_date, end_date, text, color) VALUES ('2022-08-01', '2022-08-09', 'Immunization', 'Green');
INSERT INTO events (start_date, end_date, text, color) VALUES ('2022-08-02', '2022-08-08', 'Family Planning', 'Blue');
