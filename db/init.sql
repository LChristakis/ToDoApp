CREATE TABLE IF NOT EXISTS tasks (
	id		bigint GENERATED ALWAYS AS IDENTITY,
	title		text NOT NULL,
	description	text DEFAULT '',
	completed	bool DEFAULT FALSE,
	deleted		bool DEFAULT FALSE
);
