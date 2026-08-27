-- ==========================================
-- SSV HOTEL DATABASE
-- ==========================================

CREATE DATABASE IF NOT EXISTS ssv_hotel;

USE ssv_hotel;

-- ==========================================
-- ADMINS
-- ==========================================

CREATE TABLE admins (

    id INT AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(50) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- ==========================================
-- CUSTOMERS
-- ==========================================

CREATE TABLE customers (

    id INT AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    mobile VARCHAR(15) UNIQUE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- ==========================================
-- ORDERS
-- ==========================================
CREATE TABLE orders (

    id INT AUTO_INCREMENT PRIMARY KEY,

    customer_name VARCHAR(100) NOT NULL,

    mobile VARCHAR(20) NOT NULL,

    item_name VARCHAR(100) NOT NULL,

    quantity INT NOT NULL,

    total_amount DECIMAL(10,2) NOT NULL,

    payment_status ENUM('Pending','Paid') DEFAULT 'Pending',

    order_status ENUM(
        'Pending',
        'Preparing',
        'Ready',
        'Completed',
        'Cancelled'
    ) DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- ==========================================
-- PAYMENTS
-- ==========================================

CREATE TABLE payments (

    id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,

    transaction_id VARCHAR(100),

    payment_method VARCHAR(50),

    paid_amount DECIMAL(10,2),

    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id)
    REFERENCES orders(id)

);


-- ==========================================
-- FEEDBACK
-- ==========================================

CREATE TABLE feedback (

    id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,

    customer_name VARCHAR(100),

    mobile VARCHAR(20),

    rating INT,

    review TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id)
    REFERENCES orders(id)

);

-- ==========================================
-- DEFAULT ADMIN
-- ==========================================

INSERT INTO admins (

username,
password

)

VALUES(

'admin',

'admin123'

);