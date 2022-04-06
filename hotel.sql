\echo 'Delete and recreate hotel db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE hotel;
CREATE DATABASE hotel;
\connect hotel

\i hotel-schema.sql
\i hotel-seed.sql

\echo 'Delete and recreate hotel_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE hotel_test;
CREATE DATABASE hotel_test;
\connect hotel_test

\i hotel-schema.sql
