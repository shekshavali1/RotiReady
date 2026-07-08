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

    order_id VARCHAR(20) UNIQUE NOT NULL,

    customer_id INT NOT NULL,

    quantity INT NOT NULL,

    total_amount DECIMAL(10,2) NOT NULL,

    advance_amount DECIMAL(10,2) NOT NULL,

    remaining_amount DECIMAL(10,2) NOT NULL,

    pickup_date DATE NOT NULL,

    pickup_time TIME NOT NULL,

    instructions TEXT,

    payment_status ENUM(
        'Pending',
        'Paid'
    ) DEFAULT 'Pending',

    order_status ENUM(
        'Preparing',
        'Ready',
        'Completed'
    ) DEFAULT 'Preparing',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id)
    REFERENCES customers(id)

);

-- ==========================================
-- PAYMENTS
-- ==========================================

CREATE TABLE payments (

    id INT AUTO_INCREMENT PRIMARY KEY,

    order_id VARCHAR(20) NOT NULL,

    transaction_id VARCHAR(100),

    payment_method VARCHAR(50),

    paid_amount DECIMAL(10,2),

    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id)
    REFERENCES orders(order_id)

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