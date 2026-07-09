-- SQLite Database Schema for Multichannel Product Authenticity Management System

CREATE TABLE IF NOT EXISTS manufacturers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    manufacturer_id INTEGER,
    unique_code VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id)
);

CREATE INDEX IF NOT EXISTS idx_products_unique_code ON products(unique_code);

CREATE TABLE IF NOT EXISTS verifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NULL,
    scanned_code VARCHAR(100) NULL,
    channel VARCHAR(20) NOT NULL,
    verification_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    verification_result VARCHAR(20) NOT NULL,
    location VARCHAR(255),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE INDEX IF NOT EXISTS idx_verifications_product_id ON verifications(product_id);
CREATE INDEX IF NOT EXISTS idx_verifications_verification_time ON verifications(verification_time);
