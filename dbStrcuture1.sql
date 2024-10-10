
-- divisions

CREATE TABLE divisions (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(255),
    description TEXT
);


-- administrators

CREATE TABLE administrators (
    id VARCHAR(32) PRIMARY KEY,
    division_id VARCHAR(32),
    role VARCHAR(255),
    fullname VARCHAR(255),
    password VARCHAR(255),
    username VARCHAR(255),
    FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE
);



-- desk_attendants

CREATE TABLE desk_attendants (
    id VARCHAR(32) PRIMARY KEY,
    fullname VARCHAR(255),
    username VARCHAR(255),
    password VARCHAR(255)
);


-- services

CREATE TABLE services (
    id VARCHAR(32) PRIMARY KEY,
    division_id VARCHAR(32),
    name VARCHAR(255),
    description TEXT,
    FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE
);



-- terminals

CREATE TABLE terminals (
    id VARCHAR(32) PRIMARY KEY,
    division_id VARCHAR(32),
    number INT,
    in_online BOOLEAN,
    FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE,
);



ALTER TABLE terminals DROP COLUMN desk_attendant_id;



-- contents

CREATE TABLE contents (
    id VARCHAR(32) PRIMARY KEY,
    division_id VARCHAR(32),
    logo VARCHAR(255),
    video VARCHAR(255),
    background VARCHAR(255),
    timezone VARCHAR(255),
    weather_location VARCHAR(255),
    currency BOOLEAN,
    FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE
);


-- announcements

CREATE TABLE announcements (
    id VARCHAR(32) PRIMARY KEY,
    content_id VARCHAR(32),
    message TEXT,
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
);


-- queue

CREATE TABLE queue (
    id VARCHAR(32) PRIMARY KEY,
    division_id VARCHAR(32),
    number INT,
    status VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(255),
    fullname VARCHAR(255),
    department VARCHAR(255),
    FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE
);



-- client_intents

CREATE TABLE client_intents (
    id VARCHAR(32) PRIMARY KEY,
    queue_id VARCHAR(32),
    service_id VARCHAR(32),
    FOREIGN KEY (queue_id) REFERENCES queue(id) ON DELETE CASCADE, 
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);




-- attended_queue

CREATE TABLE attended_queue (
    id VARCHAR(32) PRIMARY KEY,
    desk_id VARCHAR(32),
    queue_id VARCHAR(32),
    attended_on TIMESTAMP,
    finished_on TIMESTAMP,
    status VARCHAR(255),
    FOREIGN KEY (desk_id) REFERENCES terminals(id) ON DELETE CASCADE,
    FOREIGN KEY (queue_id) REFERENCES queue(id) ON DELETE CASCADE
);


-- logs

CREATE TABLE logs (
    id VARCHAR(32) PRIMARY KEY,
    division_id VARCHAR(32),
    event TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE
);



-- client_reviews

CREATE TABLE client_reviews (
    id VARCHAR(32) PRIMARY KEY,
    terminal_id VARCHAR(32),
    queue_id VARCHAR(32),
    field VARCHAR(255),
    FOREIGN KEY (terminal_id) REFERENCES terminals(id) ON DELETE CASCADE,
    FOREIGN KEY (queue_id) REFERENCES queue(id) ON DELETE CASCADE
);



-- terminal_sessions

CREATE Table terminal_sessions(
    id VARCHAR(32) PRIMARY KEY,
    terminal_id VARCHAR(32),
    attendant_id VARCHAR(32),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (terminal_id) REFERENCES terminals(id) ON DELETE CASCADE,
    FOREIGN KEY (attendant_id) REFERENCES desk_attendants(id) ON DELETE CASCADE
);