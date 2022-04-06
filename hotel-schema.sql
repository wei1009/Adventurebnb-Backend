CREATE TABLE users (
  id serial PRIMARY KEY,
  username VARCHAR(25),
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1)
);

CREATE TABLE hotel (
    id serial PRIMARY KEY,
    code INTEGER NOT NULL,
    name TEXT NOT NULL,
    street1 TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip TEXT NOT NULL,
    image TEXT
);

CREATE TABLE user_plan(
  id serial PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
  hotel_code  INTEGER NOT NULL,
  create_date DATE NOT NUll,
  checkin_date DATE NOT NUll,
  checkout_date DATE NOT NUll,
  room_description TEXT NOT NULL,
  guest_adult INTEGER,
  guest_children INTEGER,
  status TEXT NOT NULL
);
