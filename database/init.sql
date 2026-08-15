CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check
        CHECK (role IN ('customer', 'admin', 'staff'))
);

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    capacity INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT rooms_capacity_check
        CHECK (capacity > 0)
);

CREATE TABLE event_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT inventory_quantity_check
        CHECK (quantity >= 0)
);

CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    job_title VARCHAR(100),
    hourly_rate NUMERIC(10,2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT staff_user_fk
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE external_staff (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    company VARCHAR(150),
    role VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
    event_type_id INTEGER NOT NULL,
    event_name VARCHAR(200),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT bookings_customer_fk
        FOREIGN KEY (customer_id)
        REFERENCES users(id),

    CONSTRAINT bookings_room_fk
        FOREIGN KEY (room_id)
        REFERENCES rooms(id),

    CONSTRAINT bookings_event_type_fk
        FOREIGN KEY (event_type_id)
        REFERENCES event_types(id),

    CONSTRAINT bookings_status_check
        CHECK (status IN (
            'pending',
            'approved',
            'rejected',
            'cancelled',
            'completed'
        )),

    CONSTRAINT bookings_time_check
        CHECK (end_time > start_time)
);

CREATE TABLE booking_inventory (
    booking_id INTEGER NOT NULL,
    inventory_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,

    PRIMARY KEY (booking_id, inventory_id),

    FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE CASCADE,

    FOREIGN KEY (inventory_id)
        REFERENCES inventory(id),

    CONSTRAINT booking_inventory_quantity_check
        CHECK (quantity > 0)
);

CREATE TABLE booking_staff (
    booking_id INTEGER NOT NULL,
    staff_id INTEGER NOT NULL,
    role VARCHAR(100),

    PRIMARY KEY (booking_id, staff_id),

    FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE CASCADE,

    FOREIGN KEY (staff_id)
        REFERENCES staff(id)
        ON DELETE CASCADE
);

CREATE TABLE booking_external_staff (
    booking_id INTEGER NOT NULL,
    external_staff_id INTEGER NOT NULL,
    role VARCHAR(100),

    PRIMARY KEY (booking_id, external_staff_id),

    FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE CASCADE,

    FOREIGN KEY (external_staff_id)
        REFERENCES external_staff(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_bookings_customer
    ON bookings(customer_id);

CREATE INDEX idx_bookings_room
    ON bookings(room_id);

CREATE INDEX idx_bookings_start_time
    ON bookings(start_time);

CREATE INDEX idx_bookings_status
    ON bookings(status);

CREATE INDEX idx_booking_staff_staff
    ON booking_staff(staff_id);

CREATE INDEX idx_booking_inventory_inventory
    ON booking_inventory(inventory_id);

INSERT INTO event_types (name, description)
VALUES
    ('Wedding', 'Wedding ceremony or reception'),
    ('Birthday', 'Birthday party'),
    ('Corporate', 'Corporate or office event'),
    ('Private Party', 'Private party or celebration'),
    ('Other', 'Other event type');

INSERT INTO rooms (name, description, capacity)
VALUES
    ('Main Hall', 'Main venue hall', 200),
    ('Small Hall', 'Smaller event space', 80),
    ('Meeting Room', 'Small meeting and conference room', 20);

INSERT INTO inventory (name, description, quantity)
VALUES
    ('Chair', 'Standard venue chair', 200),
    ('Table', 'Standard venue table', 30),
    ('Projector', 'HD presentation projector', 2),
    ('Microphone', 'Wireless microphone', 4);

INSERT INTO users (
    email,
    password_hash,
    first_name,
    last_name,
    role
)
VALUES
    ('john.smith@example.com', 'test-hash-1', 'John', 'Smith', 'customer'),
    ('alice.brown@example.com', 'test-hash-2', 'Alice', 'Brown', 'customer'),
    ('admin@venue.com', 'test-hash-3', 'Sarah', 'Admin', 'admin'),
    ('bob@venue.com', 'test-hash-4', 'Bob', 'Johnson', 'staff'),
    ('emma@venue.com', 'test-hash-5', 'Emma', 'Williams', 'staff'),
    ('michael@venue.com', 'test-hash-6', 'Michael', 'Davis', 'staff');

INSERT INTO staff (
    user_id,
    job_title,
    hourly_rate
)
VALUES
    (4, 'Bartender', 15.00),
    (5, 'Event Coordinator', 18.00),
    (6, 'Security', 16.50);

INSERT INTO external_staff (
    name,
    company,
    role,
    email,
    phone
)
VALUES
    ('DJ Dave', 'DJ Dave Events', 'DJ', 'dave@djdave.com', '07123456789'),
    ('Laura Photography', 'Laura Photography', 'Photographer', 'laura@example.com', '07234567890'),
    ('ABC Catering', 'ABC Catering Ltd', 'Catering', 'events@abccatering.com', '07345678901');

INSERT INTO bookings (
    customer_id,
    room_id,
    event_type_id,
    event_name,
    start_time,
    end_time,
    status,
    notes
)
VALUES
    (
        1,
        1,
        1,
        'John & Sarah Wedding',
        '2026-09-12 15:00:00',
        '2026-09-12 23:00:00',
        'approved',
        'Wedding reception'
    ),
    (
        2,
        2,
        2,
        'Alice Birthday Party',
        '2026-09-20 18:00:00',
        '2026-09-20 23:00:00',
        'pending',
        '30th birthday party'
    ),
    (
        1,
        3,
        3,
        'Company Meeting',
        '2026-10-05 09:00:00',
        '2026-10-05 17:00:00',
        'completed',
        'Annual company meeting'
    );

INSERT INTO booking_inventory (
    booking_id,
    inventory_id,
    quantity
)
VALUES
    (1, 1, 120),
    (1, 2, 15),
    (1, 4, 2),
    (2, 1, 50),
    (2, 2, 8),
    (2, 4, 1),
    (3, 1, 20),
    (3, 3, 1);

INSERT INTO booking_staff (
    booking_id,
    staff_id,
    role
)
VALUES
    (1, 1, 'Bartender'),
    (1, 2, 'Event Coordinator'),
    (1, 3, 'Security'),
    (2, 1, 'Bartender'),
    (2, 3, 'Security'),
    (3, 2, 'Event Coordinator');

INSERT INTO booking_external_staff (
    booking_id,
    external_staff_id,
    role
)
VALUES
    (1, 1, 'DJ'),
    (1, 2, 'Photographer'),
    (1, 3, 'Catering'),
    (2, 1, 'DJ'),
    (2, 3, 'Catering');