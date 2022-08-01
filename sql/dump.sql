CREATE DATABASE  IF NOT EXISTS scheduler;
USE scheduler;
 
DROP TABLE IF EXISTS events;
CREATE TABLE events (
 id bigint(20) unsigned AUTO_INCREMENT,
 start_date datetime NOT NULL,
 end_date datetime NOT NULL,
 text varchar(255) DEFAULT NULL,
 PRIMARY KEY (id)
) DEFAULT