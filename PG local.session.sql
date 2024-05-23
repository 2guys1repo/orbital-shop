CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(30) NOT NULL,
    created_at DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS buyers (
    buyer_id INT PRIMARY KEY REFERENCES users(id),
    purchase_count BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS sellers (
    seller_id INT PRIMARY KEY REFERENCES users(id),
    sale_count BIGINT NOT NULL,
    is_new_seller BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS middlemans (
    middleman_id INT PRIMARY KEY REFERENCES users(id),
    transaction_count BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
    transaction_id SERIAL PRIMARY KEY,
    seller_id INT PRIMARY KEY REFERENCES users(id),
    buyer_id INT PRIMARY KEY REFERENCES users(id),
    middleman_id INT PRIMARY KEY REFERENCES users(id),
    date_of_transaction DATE NOT NULL,
    amount DECIMAL NOT NULL,
    is_successful BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS reports (
    transaction_id INT PRIMARY KEY REFERENCES transactions(transaction_id),
    buyer_id INT PRIMARY KEY REFERENCES users(id),
    reason VARCHAR(2000) NOT NULL,
    is_successful boolean NOT NULL
);

INSERT INTO users (username, email, password, created_at)
VALUES('testUser', 'testEmail@gmail.com', 'password', '23-05-2024');

INSERT INTO buyers (buyer_id, purchase_count)
SELECT id, 0 FROM users WHERE username = 'testUser';