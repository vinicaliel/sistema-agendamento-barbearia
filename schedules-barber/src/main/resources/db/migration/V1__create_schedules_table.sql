CREATE TABLE schedules (
    id BIGSERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    barber_name VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    service VARCHAR(255) NOT NULL



);
