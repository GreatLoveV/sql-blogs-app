CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INT DEFAULT 0
);

INSERT INTO blogs (author, url, title) 
VALUES ('Dan Abramov', 'https://overreacted.io/my-decade-in-js-core/', 'My Decade in JS');

INSERT INTO blogs (author, url, title) 
VALUES ('Martin Fowler', 'https://martinfowler.com/articles/microservices.html', 'Microservices');