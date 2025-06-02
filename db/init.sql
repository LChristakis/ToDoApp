CREATE TABLE IF NOT EXISTS tasks (
	id		bigint GENERATED ALWAYS AS IDENTITY,
	title		text NOT NULL,
	description	text DEFAULT '',
	status		int DEFAULT 0,
	deleted		bool DEFAULT FALSE
);

INSERT INTO tasks (title, description, status) VALUES
	('Task 1', 'Description for task 1', 0),
	('Task 2', 'Description for task 2', 0),
	('Task 3', 'Description for task 3', 0);