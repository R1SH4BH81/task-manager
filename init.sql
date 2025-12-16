-- Create the database (if it doesn't exist)
CREATE DATABASE taskmanager;

-- Connect to the database
\c taskmanager;

-- Create the User table
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the Task table
CREATE TABLE IF NOT EXISTS "Task" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo',
    priority VARCHAR(50) DEFAULT 'medium',
    dueDate TIMESTAMP
    WITH
        TIME ZONE,
        creatorId INTEGER REFERENCES "User" (id),
        assignedToId INTEGER REFERENCES "User" (id),
        createdAt TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_task_creator ON "Task" (creatorId);

CREATE INDEX IF NOT EXISTS idx_task_assigned ON "Task" (assignedToId);

CREATE INDEX IF NOT EXISTS idx_task_status ON "Task" (status);

CREATE INDEX IF NOT EXISTS idx_task_priority ON "Task" (priority);