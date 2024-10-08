INSERT INTO divisions (id, name, description) VALUES
('a1b2c3d4e5f6g7h8i9j0klmnopqrst12', 'ADMINISTRATORS', 'Handles administrative tasks'),
('b2c3d4e5f6g7h8i9j0klmnopqrstuvw3', 'REGISTRAR', 'Manages the registration of documents and users'),
('c3d4e5f6g7h8i9j0klmnopqrstuvwxy4', 'CASH DIVISION', 'Handles financial transactions and payments'),
('d4e5f6g7h8i9j0klmnopqrstuvwxyza5', 'ACCOUNTING', 'Responsible for financial reporting and analysis');

INSERT INTO administrators (id, division_id, role, fullname, password, username) VALUES
('1234567890abcdef1234567890abcde1', 'a1b2c3d4e5f6g7h8i9j0klmnopqrst12', 'superadmin', 'John Doe', '$2y$10$CyDcWTkus.0Y.g3M.UHbdeaUC.tGOxfqDR2rZ2lmgYNVyfVzg8m5K', 'jdoe'),
('abcdef1234567890abcdef123456789b', 'b2c3d4e5f6g7h8i9j0klmnopqrstuvw3', 'registrar', 'Jane Smith', '$2y$10$CyDcWTkus.0Y.g3M.UHbdeaUC.tGOxfqDR2rZ2lmgYNVyfVzg8m5K', 'jsmith'),
('7890abcdef1234567890abcdef12345c', 'd4e5f6g7h8i9j0klmnopqrstuvwxyza5', 'accountant', 'Mark Johnson', '$2y$10$CyDcWTkus.0Y.g3M.UHbdeaUC.tGOxfqDR2rZ2lmgYNVyfVzg8m5K', 'mjohnson'),
('567890abcdef1234567890abcdef123d', 'c3d4e5f6g7h8i9j0klmnopqrstuvwxy4', 'cashier', 'Emily Davis', '$2y$10$CyDcWTkus.0Y.g3M.UHbdeaUC.tGOxfqDR2rZ2lmgYNVyfVzg8m5K', 'edavis');



INSERT INTO desk_attendants (id, fullname, username, password) VALUES
('abcdefabcdef123456abcdef12345678', 'Alice Green', 'aliceg', '$2y$10$CyDcWTkus.0Y.g3M.UHbdeaUC.tGOxfqDR2rZ2lmgYNVyfVzg8m5K'),
('abcdef1234567890abcdef1234567890', 'Bob Brown', 'bobb', '$2y$10$CyDcWTkus.0Y.g3M.UHbdeaUC.tGOxfqDR2rZ2lmgYNVyfVzg8m5K');


INSERT INTO services (id, division_id, name, description) VALUES
('abcdefabcdefabcdefabcdefabcdef01', 'b2c3d4e5f6g7h8i9j0klmnopqrstuvw3', 'Request Document', 'Request a specific document from the system'),
('123456789012345678901234567890f2', 'b2c3d4e5f6g7h8i9j0klmnopqrstuvw3', 'File Documents', 'File documents into the system'),
('abcdef123456abcdef123456abcdef23', 'c3d4e5f6g7h8i9j0klmnopqrstuvwxy4', 'Make Payment', 'Make a payment through the system'),
('1234abcdef5678901234abcdef5678g4', 'b2c3d4e5f6g7h8i9j0klmnopqrstuvw3', 'Set Appointment', 'Set an appointment with a department');

INSERT INTO logs (id, division_id, event, timestamp) VALUES
('abcdefabcdefabcdefabcdefabcdef56', 'a1b2c3d4e5f6g7h8i9j0klmnopqrst12', 'User login', '2024-10-08 09:00:00'),
('1234abcdefabcdefabcdefabcdef123b', 'b2c3d4e5f6g7h8i9j0klmnopqrstuvw3', 'User logout', '2024-10-08 09:30:00');


INSERT INTO terminals (id, division_id, desk_attendant_id, number, in_maintenance) VALUES
('abcdefabcdefabcdefabcdefabcdef78', 'a1b2c3d4e5f6g7h8i9j0klmnopqrst12', 'abcdefabcdef123456abcdef12345678', 101, FALSE),
('123456abcdefabcdefabcdefabcdef12', 'b2c3d4e5f6g7h8i9j0klmnopqrstuvw3', 'abcdef1234567890abcdef1234567890', 102, TRUE);

INSERT INTO client_reviews (id, terminal_id, queue_id, field) VALUES
('abcdefabcdefabcdefabcdefabcdef90', 'abcdefabcdefabcdefabcdefabcdef78', 'abcdefabcdefabcdefabcdef12345678', 'Good service'),
('123456abcdefabcdefabcdefabcdef78', '123456abcdefabcdefabcdefabcdef12', '123456abcdefabcdefabcdefabcdef12', 'Needs improvement');

INSERT INTO contents (id, division_id, logo, video, background, timezone, weather_location, currency) VALUES
('abcdefabcdefabcdefabcdefabcdef99', 'a1b2c3d4e5f6g7h8i9j0klmnopqrst12', 'logo1.png', 'intro.mp4', 'blue.jpg', 'UTC', 'New York', TRUE),
('123456abcdefabcdefabcdefabcdef45', 'b2c3d4e5f6g7h8i9j0klmnopqrstuvw3', 'logo2.png', 'tutorial.mp4', 'green.jpg', 'PST', 'San Francisco', FALSE);

INSERT INTO announcements (id, content_id, message) VALUES
('abcdefabcdefabcdefabcdefabcdef87', 'abcdefabcdefabcdefabcdefabcdef99', 'System will be down for maintenance'),
('123456abcdefabcdefabcdefabcdef76', '123456abcdefabcdefabcdefabcdef45', 'New service available');

INSERT INTO queue (id, division_id, number, status, timestamp, type, fullname, department) VALUES
('abcdefabcdefabcdefabcdefabcdef65', 'a1b2c3d4e5f6g7h8i9j0klmnopqrst12', 1, 'active', '2024-10-08 09:15:00', 'Standard', 'Michael Jordan', 'Customer Service'),
('123456abcdefabcdefabcdefabcdef54', 'b2c3d4e5f6g7h8i9j0klmnopqrstuvw3', 2, 'completed', '2024-10-08 09:20:00', 'Technical', 'Lebron James', 'Technical Support');

INSERT INTO attended_queue (id, desk_id, queue_id, attended_on, finished_on, status) VALUES
('abcdefabcdefabcdefabcdefabcdef32', 'abcdefabcdefabcdefabcdefabcdef78', 'abcdefabcdefabcdefabcdefabcdef65', '2024-10-08 09:30:00', '2024-10-08 09:45:00', 'Completed'),
('123456abcdefabcdefabcdefabcdef21', '123456abcdefabcdefabcdefabcdef12', '123456abcdefabcdefabcdefabcdef54', '2024-10-08 10:00:00', '2024-10-08 10:20:00', 'Pending');


INSERT INTO client_intents (id, queue_id, service_id) VALUES
('abcdefabcdefabcdefabcdefabcdef19', 'abcdefabcdefabcdefabcdefabcdef65', 'abcdefabcdefabcdefabcdefabcdef01'),
('123456abcdefabcdefabcdefabcdef09', '123456abcdefabcdefabcdefabcdef54', '123456789012345678901234567890f2');

INSERT INTO client_reviews (id, terminal_id, queue_id, field) VALUES
('abcdefabcdefabcdefabcdefabcdef90', 'abcdefabcdefabcdefabcdefabcdef78', 'abcdefabcdefabcdefabcdefabcdef65', 'Good service'),
('123456abcdefabcdefabcdefabcdef78', '123456abcdefabcdefabcdefabcdef12', '123456abcdefabcdefabcdefabcdef54', 'Needs improvement');

