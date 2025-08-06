-- Seed data for PostgreSQL database

-- Insert users
INSERT INTO users (id, email, name, role, password_hash) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'ceo@company.com', 'Amith Paruchuri', 'ceo', '$2b$10$hashedpassword'),
('550e8400-e29b-41d4-a716-446655440002', 'pm@company.com', 'Mike Chen', 'pm', '$2b$10$hashedpassword'),
('550e8400-e29b-41d4-a716-446655440003', 'finance@company.com', 'Bhaskar', 'finance', '$2b$10$hashedpassword'),
('550e8400-e29b-41d4-a716-446655440004', 'hr@company.com', 'Lavina Gomez', 'hr', '$2b$10$hashedpassword'),
('550e8400-e29b-41d4-a716-446655440005', 'admin@company.com', 'Admin User', 'admin', '$2b$10$hashedpassword'),
('550e8400-e29b-41d4-a716-446655440006', 'hr.manager@company.com', 'Lavina Gomez', 'hr', '$2b$10$hashedpassword'),
('550e8400-e29b-41d4-a716-446655440007', 'hr.specialist@company.com', 'Robert Thompson', 'hr', '$2b$10$hashedpassword');

-- Insert resources
INSERT INTO resources (id, name, email, role, skill_set, hourly_rate, utilization_target, current_utilization, bench_time, status) VALUES
('res-001', 'John Smith', 'john.smith@company.com', 'Senior Developer', ARRAY['React', 'Node.js', 'Python'], 85.00, 80, 75.0, 0, 'active'),
('res-002', 'Emily Davis', 'emily.davis@company.com', 'UI/UX Designer', ARRAY['Figma', 'Adobe Creative Suite', 'Prototyping'], 70.00, 75, 85.0, 0, 'active'),
('res-003', 'Alex Rodriguez', 'alex.rodriguez@company.com', 'Backend Developer', ARRAY['Java', 'Spring Boot', 'AWS'], 80.00, 80, 45.0, 15, 'on_bench'),
('res-004', 'Maria Garcia', 'maria.garcia@company.com', 'QA Engineer', ARRAY['Selenium', 'Test Automation', 'Manual Testing'], 65.00, 70, 80.0, 0, 'active'),
('res-005', 'Tom Wilson', 'tom.wilson@company.com', 'DevOps Engineer', ARRAY['Docker', 'Kubernetes', 'CI/CD'], 90.00, 75, 90.0, 0, 'active'),
('res-006', 'Sarah Lee', 'sarah.lee@company.com', 'Project Coordinator', ARRAY['Scrum', 'Jira', 'Documentation'], 60.00, 80, 30.0, 45, 'on_bench'),
('res-007', 'Robert Brown', 'robert.brown@company.com', 'Frontend Developer', ARRAY['Vue.js', 'Angular', 'TypeScript'], 75.00, 80, 85.0, 0, 'active'),
('res-008', 'Jennifer White', 'jennifer.white@company.com', 'Data Analyst', ARRAY['SQL', 'Python', 'Power BI'], 70.00, 75, 60.0, 10, 'on_bench');

-- Insert projects
INSERT INTO projects (id, name, description, start_date, end_date, status, budget, actual_cost, client_name, project_manager_id) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'E-commerce Platform Redesign', 'Complete redesign of client e-commerce platform with modern UI/UX', '2024-01-15', '2024-06-30', 'active', 150000.00, 95000.00, 'TechCorp Inc.', '550e8400-e29b-41d4-a716-446655440002'),
('650e8400-e29b-41d4-a716-446655440002', 'Mobile Banking App', 'Development of secure mobile banking application', '2024-02-01', '2024-08-15', 'active', 250000.00, 180000.00, 'First National Bank', '550e8400-e29b-41d4-a716-446655440002'),
('650e8400-e29b-41d4-a716-446655440003', 'CRM System Integration', 'Integration of existing CRM with new sales pipeline', '2024-03-10', '2024-05-20', 'completed', 80000.00, 75000.00, 'Sales Solutions Ltd.', '550e8400-e29b-41d4-a716-446655440002'),
('650e8400-e29b-41d4-a716-446655440004', 'AI Analytics Dashboard', 'Machine learning dashboard for business intelligence', '2024-04-01', '2024-09-30', 'planning', 300000.00, 0.00, 'DataTech Enterprises', '550e8400-e29b-41d4-a716-446655440002'),
('650e8400-e29b-41d4-a716-446655440005', 'Healthcare Portal', 'Patient management system for healthcare providers', '2024-01-20', '2024-07-10', 'on_hold', 200000.00, 120000.00, 'MedCare Solutions', '550e8400-e29b-41d4-a716-446655440002');

-- Insert project resources
INSERT INTO project_resources (project_id, resource_id, allocation_percentage, start_date, end_date, billable_rate, planned_hours, actual_hours) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'res-001', 80, '2024-01-15', '2024-06-30', 85.00, 800, 600),
('650e8400-e29b-41d4-a716-446655440001', 'res-002', 60, '2024-01-15', '2024-06-30', 70.00, 600, 450),
('650e8400-e29b-41d4-a716-446655440001', 'res-007', 70, '2024-02-01', '2024-06-30', 75.00, 700, 500),
('650e8400-e29b-41d4-a716-446655440002', 'res-003', 90, '2024-02-01', '2024-08-15', 80.00, 1000, 700),
('650e8400-e29b-41d4-a716-446655440002', 'res-004', 50, '2024-03-01', '2024-08-15', 65.00, 500, 350),
('650e8400-e29b-41d4-a716-446655440002', 'res-005', 40, '2024-02-15', '2024-08-15', 90.00, 400, 300);

-- Insert documents
INSERT INTO documents (id, name, type, file_url, file_size, uploaded_by, project_id, tags, version) VALUES
('doc-001', 'TechCorp_SOW_2024.pdf', 'sow', 'https://example.com/documents/techcorp_sow_2024.pdf', 2048576, '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', ARRAY['contract', 'ecommerce', '2024'], 1),
('doc-002', 'FirstNational_MSA.pdf', 'msa', 'https://example.com/documents/firstnational_msa.pdf', 1536000, '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', ARRAY['master-agreement', 'banking', 'security'], 1),
('doc-003', 'Sales_Solutions_CR_001.pdf', 'cr', 'https://example.com/documents/sales_cr_001.pdf', 512000, '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', ARRAY['change-request', 'crm', 'integration'], 1),
('doc-004', 'DataTech_Technical_Specs.pdf', 'other', 'https://example.com/documents/datatech_specs.pdf', 3072000, '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440004', ARRAY['specifications', 'ai', 'analytics'], 1),
('doc-005', 'MedCare_Compliance_Requirements.pdf', 'other', 'https://example.com/documents/medcare_compliance.pdf', 1024000, '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440005', ARRAY['compliance', 'healthcare', 'hipaa'], 1);

-- Insert sample activity log entries
INSERT INTO activity_log (user_id, entity_type, entity_id, action, description, metadata) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'project', '650e8400-e29b-41d4-a716-446655440001', 'updated', 'Updated project budget from $140,000 to $150,000', '{"field": "budget", "old_value": 140000, "new_value": 150000}'),
('550e8400-e29b-41d4-a716-446655440004', 'resource', 'res-003', 'status_changed', 'Resource status changed from active to on_bench', '{"field": "status", "old_value": "active", "new_value": "on_bench"}'),
('550e8400-e29b-41d4-a716-446655440003', 'document', 'doc-004', 'uploaded', 'Uploaded technical specifications document', '{"file_name": "DataTech_Technical_Specs.pdf", "file_size": 3072000}'),
('550e8400-e29b-41d4-a716-446655440002', 'project', '650e8400-e29b-41d4-a716-446655440003', 'completed', 'Project marked as completed', '{"status": "completed", "completion_date": "2024-05-20"}');

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, read) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Project Deadline Approaching', 'E-commerce Platform Redesign is due in 7 days', 'warning', false),
('550e8400-e29b-41d4-a716-446655440004', 'Resource Available', 'Alex Rodriguez will be available for new projects in 5 days', 'info', false),
('550e8400-e29b-41d4-a716-446655440001', 'Monthly Report Ready', 'Your monthly executive report is ready for review', 'info', true);