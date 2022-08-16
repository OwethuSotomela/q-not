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
    status varchar(255) default 'Pending...',
    description varchar(255) NOT NULL,
    FOREIGN KEY (users_id) REFERENCES users(id)
);

 DROP TABLE IF EXISTS events CASCADE;
 CREATE TABLE events (
    id SERIAL NOT NULL PRIMARY KEY,
    text varchar(255) DEFAULT NULL,
    start_date timestamp NOT NULL,
    end_date timestamp NOT NULL
); 

INSERT INTO events (text, start_date, end_date) VALUES ('Immunization', '2022-07-01 14:00', '2022-08-09 14:15');
INSERT INTO events (text, start_date, end_date) VALUES ('Family Planning', '2022-07-02 13:00', '2022-08-08 13:15');

--  DROP TABLE IF EXISTS events CASCADE;
--  CREATE TABLE events (
--     id SERIAL NOT NULL PRIMARY KEY,
--     event_id varchar(255) DEFAULT NULL
-- ); 
-- INSERT INTO events (event_id) VALUES ('1659696175839');