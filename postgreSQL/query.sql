-- Create the tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);

-- Insert sample data into the tasks table
INSERT INTO tasks (title, description) VALUES
('Complete project proposal', 'Prepare and submit the project proposal document by end of the week.'),
('Code review', 'Review the pull requests and give feedback.'),
('Database backup', 'Schedule a database backup for production server.');