 DROP TABLE IF EXISTS events;
 CREATE TABLE events (
    id SERIAL NOT NULL PRIMARY KEY,
    start_date timestamp NOT NULL,
    end_date timestamp NOT NULL,
    text varchar(255) DEFAULT NULL,
    color VARCHAR(30)
); 

INSERT INTO events (start_date, end_date, text, color) VALUES ('2022-08-01', '2022-08-09', 'Immunization', 'Green');
INSERT INTO events (start_date, end_date, text, color) VALUES ('2022-08-02', '2022-08-08', 'Family Planning', 'Blue');
