-- Database: scholarhub

-- DROP DATABASE IF EXISTS scholarhub;

CREATE DATABASE scholarhub
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_India.1252'
    LC_CTYPE = 'English_India.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;


/* User Table */
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* Admin Table */ 

CREATE TABLE Admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
/* create scholarship table */

CREATE TABLE scholarships (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    provider VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('government', 'private')),
    application_steps TEXT[],
    youtube_video TEXT,
    official_link TEXT NOT NULL,
    deadline DATE NOT NULL,
);
/* states , cast , education_level */

CREATE TABLE states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE castes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE education_levels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

/* inserting values in table */

INSERT INTO states (name) VALUES 
('Andhra Pradesh'),
('Arunachal Pradesh'),
('Assam'),
('Bihar'),
('Chhattisgarh'),
('Goa'),
('Gujarat'),
('Haryana'),
('Himachal Pradesh'),
('Jharkhand'),
('Karnataka'),
('Kerala'),
('Madhya Pradesh'),
('Maharashtra'),
('Manipur'),
('Meghalaya'),
('Mizoram'),
('Nagaland'),
('Odisha'),
('Punjab'),
('Rajasthan'),
('Sikkim'),
('Tamil Nadu'),
('Telangana'),
('Tripura'),
('Uttar Pradesh'),
('Uttarakhand'),
('West Bengal'),
('Andaman and Nicobar Islands'),
('Chandigarh'),
('Dadra and Nagar Haveli and Daman and Diu'),
('Lakshadweep'),
('Delhi'),
('Puducherry'),
('Ladakh'),
('Jammu and Kashmir');

INSERT INTO castes (name) VALUES 
('General'),
('OBC'),
('SEBC'),
('SC'),
('ST'),
('NT'),
('VJNT'),
('EWS'),
('Other');

INSERT INTO education_levels (name) VALUES
('1th to 12th'),
('ITI'),
('Diploma'),
('Undergraduate'),
('postgraduate'),
('Doctorate'),
('Professional Degree (MBBS, LLB, CA, etc.)'),
('Vocational Course'),
('Other') ;



/* Create Junction Tables for Many-to-Many Relations */
CREATE TABLE scholarship_states (
    scholarship_id INT REFERENCES scholarships(id) ON DELETE CASCADE,
    state_id INT REFERENCES states(id) ON DELETE CASCADE,
    PRIMARY KEY (scholarship_id, state_id)
);

CREATE TABLE scholarship_castes (
    scholarship_id INT REFERENCES scholarships(id) ON DELETE CASCADE,
    caste_id INT REFERENCES castes(id) ON DELETE CASCADE,
    PRIMARY KEY (scholarship_id, caste_id)
);

CREATE TABLE scholarship_education_levels (
    scholarship_id INT REFERENCES scholarships(id) ON DELETE CASCADE,
    education_level_id INT REFERENCES education_levels(id) ON DELETE CASCADE,
    PRIMARY KEY (scholarship_id, education_level_id)
);

CREATE TABLE user_saved_scholarships (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    scholarship_id INTEGER NOT NULL,
    UNIQUE (user_id, scholarship_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE
);