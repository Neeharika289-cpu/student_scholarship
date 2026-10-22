-- Future backend database design
CREATE DATABASE scholarship_portal;
USE scholarship_portal;

CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    course VARCHAR(50),
    year INT,
    state VARCHAR(50),
    category VARCHAR(50),
    income DECIMAL(12,2),
    percentage DECIMAL(5,2)
);

CREATE TABLE scholarships (
    scholarship_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    provider VARCHAR(150),
    description TEXT,
    amount DECIMAL(12,2),
    income_limit DECIMAL(12,2),
    minimum_percentage DECIMAL(5,2),
    course VARCHAR(50),
    state VARCHAR(50),
    category VARCHAR(50),
    deadline DATE,
    application_link VARCHAR(500)
);

CREATE TABLE saved_scholarships (
    student_id INT,
    scholarship_id INT,
    PRIMARY KEY(student_id, scholarship_id),
    FOREIGN KEY(student_id) REFERENCES students(student_id),
    FOREIGN KEY(scholarship_id) REFERENCES scholarships(scholarship_id)
);

CREATE TABLE applications (
    application_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    scholarship_id INT,
    application_date DATE,
    status VARCHAR(30),
    FOREIGN KEY(student_id) REFERENCES students(student_id),
    FOREIGN KEY(scholarship_id) REFERENCES scholarships(scholarship_id)
);
