USE healthcare_connect;

START TRANSACTION;
INSERT INTO medicine_inventory
(pharmacy_id, medicine_id, price, pack_size, quantity, is_available)
VALUES
(1,1,25.00,'10 tablets',120,TRUE),
(1,2,35.00,'10 tablets',95,TRUE),
(1,5,30.00,'10 tablets',80,TRUE),
(1,10,45.00,'10 tablets',70,TRUE),
(1,15,32.00,'10 tablets',100,TRUE),
(1,17,28.00,'10 tablets',85,TRUE),
(1,19,55.00,'10 tablets',60,TRUE),
(1,23,40.00,'10 tablets',75,TRUE),

(2,1,24.00,'10 tablets',150,TRUE),
(2,3,42.00,'10 tablets',80,TRUE),
(2,6,35.00,'10 tablets',65,TRUE),
(2,11,38.00,'10 capsules',90,TRUE),
(2,16,48.00,'10 tablets',70,TRUE),
(2,18,45.00,'10 tablets',85,TRUE),
(2,20,75.00,'10 tablets',55,TRUE),
(2,24,60.00,'10 tablets',50,TRUE),

(3,2,34.00,'10 tablets',90,TRUE),
(3,4,30.00,'10 tablets',70,TRUE),
(3,7,65.00,'10 tablets',60,TRUE),
(3,12,25.00,'10 sachets',120,TRUE),
(3,22,75.00,'30 tablets',45,TRUE),
(3,25,80.00,'30 tablets',60,TRUE),
(3,27,95.00,'30 tablets',40,TRUE),
(3,30,85.00,'170 ml bottle',35,TRUE),

(4,5,28.00,'10 tablets',75,TRUE),
(4,8,65.00,'3 tablets',45,TRUE),
(4,9,55.00,'10 capsules',50,TRUE),
(4,13,40.00,'10 tablets',70,TRUE),
(4,21,55.00,'100 tablets',60,TRUE),
(4,26,90.00,'30 tablets',55,TRUE),
(4,28,70.00,'30 tablets',50,TRUE),
(4,32,48.00,'15 g tube',30,TRUE),

(5,1,26.00,'10 tablets',110,TRUE),
(5,5,29.00,'10 tablets',90,TRUE),
(5,10,46.00,'10 tablets',65,TRUE),
(5,14,50.00,'10 tablets',55,TRUE),
(5,17,30.00,'10 tablets',80,TRUE),
(5,29,75.00,'100 ml bottle',30,TRUE),
(5,33,95.00,'15 g tube',25,TRUE),
(5,35,120.00,'200 doses',20,TRUE),

(6,2,36.00,'10 tablets',70,TRUE),
(6,6,34.00,'10 tablets',80,TRUE),
(6,15,33.00,'10 tablets',100,TRUE),
(6,19,58.00,'10 tablets',50,TRUE),
(6,23,42.00,'10 tablets',65,TRUE),
(6,31,35.00,'100 ml bottle',40,TRUE),
(6,34,55.00,'15 g tube',25,TRUE),
(6,37,20.00,'10 tablets',75,TRUE),

(7,3,40.00,'10 tablets',85,TRUE),
(7,7,62.00,'10 tablets',50,TRUE),
(7,11,40.00,'10 capsules',70,TRUE),
(7,16,50.00,'10 tablets',60,TRUE),
(7,20,78.00,'10 tablets',45,TRUE),
(7,24,58.00,'10 tablets',55,TRUE),
(7,30,82.00,'170 ml bottle',30,TRUE),
(7,38,45.00,'10 tablets',50,TRUE),

(8,1,25.00,'10 tablets',100,TRUE),
(8,4,31.00,'10 tablets',60,TRUE),
(8,8,68.00,'3 tablets',40,TRUE),
(8,12,26.00,'10 sachets',90,TRUE),
(8,18,46.00,'10 tablets',70,TRUE),
(8,22,72.00,'30 tablets',45,TRUE),
(8,27,98.00,'30 tablets',35,TRUE),
(8,36,135.00,'200 doses',18,TRUE);

INSERT INTO appointments
(patient_id, doctor_id, centre_id, appointment_date, appointment_time,
 reason, consultation_fee, status, queue_number)
VALUES
(21,1,1,'2026-09-01','10:00:00','General health consultation',300,'COMPLETED',1),
(22,2,2,'2026-09-02','11:00:00','Child health checkup',350,'COMPLETED',2),
(23,3,4,'2026-09-03','10:30:00','Routine consultation',400,'COMPLETED',1),
(24,5,2,'2026-09-04','14:00:00','Skin allergy',500,'COMPLETED',3),
(25,6,3,'2026-09-05','09:30:00','Fever and weakness',250,'COMPLETED',1),
(26,10,2,'2026-09-06','11:30:00','General consultation',350,'COMPLETED',2),
(27,7,1,'2026-09-07','12:00:00','Child vaccination consultation',350,'COMPLETED',4),
(28,9,3,'2026-09-08','15:00:00','Skin irritation',450,'COMPLETED',2),
(29,11,4,'2026-09-09','10:00:00','Women health consultation',400,'COMPLETED',1),
(30,4,1,'2026-09-10','16:00:00','Heart health consultation',650,'COMPLETED',3),

(31,12,1,'2026-09-11','10:30:00','General checkup',250,'COMPLETED',2),
(32,13,5,'2026-09-12','11:00:00','General consultation',300,'COMPLETED',1),
(33,14,6,'2026-09-13','13:00:00','Women health consultation',400,'COMPLETED',3),
(34,15,7,'2026-09-14','09:30:00','General consultation',350,'COMPLETED',1),
(35,16,5,'2026-09-15','14:30:00','Pediatric consultation',350,'COMPLETED',2),
(36,17,9,'2026-09-16','10:00:00','Cardiology follow-up',600,'COMPLETED',1),
(37,18,6,'2026-09-17','11:30:00','Dermatology consultation',500,'COMPLETED',2),
(38,19,10,'2026-09-18','15:30:00','General health check',350,'COMPLETED',4),
(39,20,10,'2026-09-19','10:30:00','Women health consultation',400,'COMPLETED',1),
(40,1,1,'2026-09-20','09:00:00','Fever and cold',300,'COMPLETED',2),

(41,2,2,'2026-09-21','10:00:00','Child health checkup',350,'COMPLETED',1),
(42,5,2,'2026-09-22','11:00:00','Skin allergy follow-up',500,'COMPLETED',3),
(43,6,3,'2026-09-23','09:30:00','General consultation',250,'COMPLETED',1),
(44,10,2,'2026-09-24','14:00:00','Blood pressure check',350,'COMPLETED',2),
(45,3,4,'2026-09-25','10:30:00','Routine women health consultation',400,'COMPLETED',1),

(46,1,1,'2026-10-10','10:30:00','General health consultation',300,'UPCOMING',1),
(47,2,2,'2026-10-11','11:00:00','Child health consultation',350,'CONFIRMED',2),
(48,3,4,'2026-10-12','10:00:00','Routine consultation',400,'UPCOMING',1),
(49,5,2,'2026-10-13','14:00:00','Skin consultation',500,'CONFIRMED',3),
(50,6,3,'2026-10-14','09:30:00','General consultation',250,'UPCOMING',1),

(21,7,1,'2026-10-15','12:00:00','Child health follow-up',350,'CONFIRMED',2),
(22,9,3,'2026-10-16','15:00:00','Skin follow-up',450,'UPCOMING',1),
(23,11,4,'2026-10-17','10:00:00','Women health follow-up',400,'CONFIRMED',2),
(24,4,1,'2026-10-18','16:00:00','Cardiology consultation',650,'UPCOMING',3),
(25,10,2,'2026-10-19','11:30:00','General consultation',350,'CONFIRMED',1),

(26,12,1,'2026-10-20','10:30:00','General health checkup',250,'UPCOMING',2),
(27,13,5,'2026-10-21','11:00:00','General consultation',300,'CONFIRMED',1),
(28,14,6,'2026-10-22','13:00:00','Women health consultation',400,'UPCOMING',3),
(29,15,7,'2026-10-23','09:30:00','General consultation',350,'CONFIRMED',1),
(30,16,5,'2026-10-24','14:30:00','Pediatric consultation',350,'UPCOMING',2),

(31,17,9,'2026-10-25','10:00:00','Cardiology consultation',600,'CONFIRMED',1),
(32,18,6,'2026-10-26','11:30:00','Dermatology consultation',500,'UPCOMING',2),
(33,19,10,'2026-10-27','15:30:00','General health consultation',350,'CONFIRMED',4),
(34,20,10,'2026-10-28','10:30:00','Women health consultation',400,'UPCOMING',1),
(35,1,1,'2026-10-29','09:00:00','Routine checkup',300,'CONFIRMED',2),

(36,2,2,'2026-10-30','10:00:00','Child health checkup',350,'UPCOMING',1),
(37,5,2,'2026-10-31','11:00:00','Skin consultation',500,'CONFIRMED',3),
(38,6,3,'2026-11-01','09:30:00','General consultation',250,'UPCOMING',1),
(39,10,2,'2026-11-02','14:00:00','Blood pressure consultation',350,'CONFIRMED',2),
(40,3,4,'2026-11-03','10:30:00','Women health consultation',400,'UPCOMING',1);

INSERT INTO health_records
(patient_id, doctor_id, appointment_id, record_type, title, description, record_date)
VALUES
(21,1,1,'CONSULTATION','General Health Consultation','Routine health consultation completed.','2026-09-01'),
(22,2,2,'CONSULTATION','Child Health Checkup','Routine pediatric examination.','2026-09-02'),
(23,3,3,'CONSULTATION','Women Health Consultation','Routine consultation and health assessment.','2026-09-03'),
(24,5,4,'CONSULTATION','Skin Allergy Consultation','Assessment of seasonal skin allergy.','2026-09-04'),
(25,6,5,'CONSULTATION','Fever Consultation','Patient evaluated for fever and weakness.','2026-09-05'),
(26,10,6,'CONSULTATION','General Consultation','Routine general health assessment.','2026-09-06'),
(27,7,7,'CONSULTATION','Pediatric Consultation','Child health assessment completed.','2026-09-07'),
(28,9,8,'CONSULTATION','Dermatology Consultation','Assessment of skin irritation.','2026-09-08'),
(29,11,9,'CONSULTATION','Gynecology Consultation','Routine women health consultation.','2026-09-09'),
(30,4,10,'CONSULTATION','Cardiology Consultation','Initial cardiac health assessment.','2026-09-10'),

(31,12,11,'CONSULTATION','General Checkup','Routine health checkup.','2026-09-11'),
(32,13,12,'LAB_REPORT','Blood Test Report','Routine blood test report reviewed.','2026-09-12'),
(33,14,13,'CONSULTATION','Women Health Checkup','Routine consultation completed.','2026-09-13'),
(34,15,14,'CONSULTATION','General Consultation','General health assessment.','2026-09-14'),
(35,16,15,'CONSULTATION','Pediatric Checkup','Routine pediatric examination.','2026-09-15'),
(36,17,16,'DIAGNOSTIC_REPORT','Cardiology Follow-up','Cardiology follow-up assessment.','2026-09-16'),
(37,18,17,'CONSULTATION','Dermatology Consultation','Skin condition assessment.','2026-09-17'),
(38,19,18,'CONSULTATION','General Health Check','Routine health evaluation.','2026-09-18'),
(39,20,19,'CONSULTATION','Women Health Consultation','Routine consultation completed.','2026-09-19'),
(40,1,20,'LAB_REPORT','CBC Blood Test','Complete blood count report reviewed.','2026-09-20'),

(41,2,21,'CONSULTATION','Pediatric Checkup','Child health checkup completed.','2026-09-21'),
(42,5,22,'CONSULTATION','Skin Follow-up','Follow-up for seasonal allergy.','2026-09-22'),
(43,6,23,'CONSULTATION','General Consultation','Routine consultation.','2026-09-23'),
(44,10,24,'LAB_REPORT','Blood Pressure Assessment','Blood pressure assessment recorded.','2026-09-24'),
(45,3,25,'CONSULTATION','Women Health Consultation','Routine women health assessment.','2026-09-25'),

(21,1,1,'LAB_REPORT','Complete Blood Count','CBC test results reviewed by physician.','2026-09-01'),
(22,2,2,'PRESCRIPTION','Pediatric Medication Plan','Medication instructions provided.','2026-09-02'),
(23,3,3,'LAB_REPORT','Routine Health Screening','Routine screening report.','2026-09-03'),
(24,5,4,'PRESCRIPTION','Allergy Treatment Plan','Treatment plan for skin allergy.','2026-09-04'),
(25,6,5,'PRESCRIPTION','Fever Medication Plan','Medication advised for fever symptoms.','2026-09-05'),
(26,10,6,'LAB_REPORT','General Blood Test','Routine blood test.','2026-09-06'),
(27,7,7,'PRESCRIPTION','Pediatric Supplement Plan','Supplement and nutrition guidance.','2026-09-07'),
(28,9,8,'PRESCRIPTION','Skin Care Prescription','Topical treatment prescribed.','2026-09-08'),
(29,11,9,'LAB_REPORT','Women Health Screening','Routine screening report.','2026-09-09'),
(30,4,10,'DIAGNOSTIC_REPORT','Cardiac Assessment','Initial cardiac assessment report.','2026-09-10'),

(31,12,11,'LAB_REPORT','Routine Blood Test','Routine blood work reviewed.','2026-09-11'),
(32,13,12,'PRESCRIPTION','General Medication Plan','Medication instructions provided.','2026-09-12'),
(33,14,13,'LAB_REPORT','Women Health Screening','Screening results reviewed.','2026-09-13'),
(34,15,14,'PRESCRIPTION','General Treatment Plan','General medication plan.','2026-09-14'),
(35,16,15,'PRESCRIPTION','Pediatric Treatment','Pediatric treatment instructions.','2026-09-15'),
(36,17,16,'DIAGNOSTIC_REPORT','Cardiac Follow-up Report','Follow-up cardiac assessment.','2026-09-16'),
(37,18,17,'PRESCRIPTION','Dermatology Treatment','Treatment for skin condition.','2026-09-17'),
(38,19,18,'LAB_REPORT','Health Screening Report','Routine health screening.','2026-09-18'),
(39,20,19,'PRESCRIPTION','Women Health Treatment','Treatment instructions provided.','2026-09-19'),
(40,1,20,'LAB_REPORT','CBC Report','Complete blood count results.','2026-09-20'),

(41,2,21,'PRESCRIPTION','Pediatric Medication','Medication prescribed after consultation.','2026-09-21'),
(42,5,22,'LAB_REPORT','Allergy Assessment','Follow-up allergy assessment.','2026-09-22'),
(43,6,23,'PRESCRIPTION','General Medication','General treatment plan.','2026-09-23'),
(44,10,24,'DIAGNOSTIC_REPORT','Blood Pressure Report','Blood pressure monitoring report.','2026-09-24'),
(45,3,25,'PRESCRIPTION','Women Health Treatment','Treatment plan provided.','2026-09-25'),

(21,1,1,'OTHER','Health Visit Summary','Summary of recent healthcare visit.','2026-09-01'),
(22,2,2,'OTHER','Patient Health Note','Additional patient care notes.','2026-09-02'),
(23,3,3,'OTHER','Follow-up Note','Follow-up recommendations recorded.','2026-09-03'),
(24,5,4,'OTHER','Allergy Follow-up Note','Follow-up advice recorded.','2026-09-04'),
(25,6,5,'OTHER','Recovery Note','Recovery guidance recorded.','2026-09-05'),
(26,10,6,'OTHER','Lifestyle Advice','Lifestyle recommendations provided.','2026-09-06'),
(27,7,7,'OTHER','Nutrition Guidance','Nutrition guidance recorded.','2026-09-07'),
(28,9,8,'OTHER','Skin Care Advice','Skin care recommendations recorded.','2026-09-08'),
(29,11,9,'OTHER','Health Advice','General health advice recorded.','2026-09-09'),
(30,4,10,'OTHER','Cardiac Lifestyle Advice','Lifestyle recommendations provided.','2026-09-10');

INSERT INTO prescriptions
(patient_id, doctor_id, appointment_id, diagnosis, instructions, prescription_date)
VALUES
(21,1,1,'Viral fever','Take medicines after food and maintain hydration.','2026-09-01'),
(22,2,2,'Seasonal cold','Follow prescribed dosage and rest adequately.','2026-09-02'),
(23,3,3,'Routine health condition','Follow prescribed treatment plan.','2026-09-03'),
(24,5,4,'Skin allergy','Apply prescribed treatment as directed.','2026-09-04'),
(25,6,5,'Fever','Take medicines after meals and drink fluids.','2026-09-05'),
(26,10,6,'General weakness','Follow medication schedule and maintain balanced diet.','2026-09-06'),
(27,7,7,'Nutritional deficiency','Continue supplements as advised.','2026-09-07'),
(28,9,8,'Skin irritation','Use topical medication as directed.','2026-09-08'),
(29,11,9,'Routine women health concern','Follow treatment instructions.','2026-09-09'),
(30,4,10,'Cardiac risk assessment','Follow medication and lifestyle recommendations.','2026-09-10'),

(31,12,11,'Mild fever','Take medication as prescribed.','2026-09-11'),
(32,13,12,'Vitamin deficiency','Continue supplements and maintain diet.','2026-09-12'),
(33,14,13,'Routine health concern','Follow treatment plan.','2026-09-13'),
(34,15,14,'General weakness','Take medicines regularly.','2026-09-14'),
(35,16,15,'Childhood infection','Complete the prescribed treatment course.','2026-09-15'),
(36,17,16,'Cardiac follow-up','Continue medication and monitor symptoms.','2026-09-16'),
(37,18,17,'Dermatitis','Apply topical medication regularly.','2026-09-17'),
(38,19,18,'General health concern','Follow prescribed instructions.','2026-09-18'),
(39,20,19,'Routine women health condition','Take medication as directed.','2026-09-19'),
(40,1,20,'Viral infection','Maintain hydration and complete treatment.','2026-09-20'),

(41,2,21,'Seasonal allergy','Take medication as advised.','2026-09-21'),
(42,5,22,'Skin allergy','Continue prescribed treatment.','2026-09-22'),
(43,6,23,'Fever','Take medicine after meals.','2026-09-23'),
(44,10,24,'Hypertension monitoring','Continue medication and monitor blood pressure.','2026-09-24'),
(45,3,25,'Routine women health concern','Follow treatment instructions.','2026-09-25'),

(21,1,1,'General infection','Complete the prescribed course.','2026-09-26'),
(22,2,2,'Childhood fever','Maintain hydration and rest.','2026-09-27'),
(23,3,3,'Nutritional deficiency','Continue supplements as advised.','2026-09-28'),
(24,5,4,'Dermatitis','Use prescribed cream regularly.','2026-09-29'),
(25,6,5,'Seasonal fever','Follow dosage instructions.','2026-09-30');

INSERT INTO prescription_items
(prescription_id, medicine_id, dosage, frequency, duration, instructions)
VALUES
(1,1,'1 tablet','Twice daily','5 days','Take after food'),
(1,12,'1 sachet','Once daily','3 days','Dissolve in clean water'),

(2,5,'1 tablet','Once daily','5 days','Take after breakfast'),
(2,29,'10 ml','Twice daily','5 days','Shake well before use'),

(3,23,'1 tablet','Once daily','30 days','Take after breakfast'),
(3,26,'1 tablet','Once daily','30 days','Take with water'),

(4,32,'Apply thin layer','Twice daily','7 days','Apply to affected area'),
(4,5,'1 tablet','Once daily','5 days','Take after food'),

(5,1,'1 tablet','Twice daily','5 days','Take after meals'),
(5,12,'1 sachet','Once daily','3 days','Dissolve in water'),

(6,27,'1 tablet','Once daily','30 days','Take after breakfast'),
(6,28,'1 tablet','Once daily','30 days','Take with water'),

(7,26,'1 tablet','Once daily','30 days','Take after lunch'),
(7,27,'1 tablet','Once daily','30 days','Take after breakfast'),

(8,32,'Apply thin layer','Twice daily','10 days','Apply externally'),
(8,33,'Apply thin layer','Once daily','7 days','Apply to affected area'),

(9,39,'1 tablet','Once daily','30 days','Take as advised'),
(9,26,'1 tablet','Once daily','30 days','Take with water'),

(10,37,'1 tablet','Once daily','30 days','Take after food'),
(10,19,'1 tablet','Once daily','30 days','Take after dinner'),

(11,1,'1 tablet','Twice daily','5 days','Take after meals'),
(12,23,'1 tablet','Once daily','30 days','Take after breakfast'),
(13,26,'1 tablet','Once daily','30 days','Take with water'),
(14,15,'1 tablet','Once daily','10 days','Take after meals'),
(15,5,'1 tablet','Once daily','5 days','Take after breakfast'),
(16,38,'1 tablet','Once daily','30 days','Take as prescribed'),
(17,34,'Apply thin layer','Twice daily','7 days','Apply externally'),
(18,27,'1 tablet','Once daily','30 days','Take after breakfast'),
(19,26,'1 tablet','Once daily','30 days','Take with water'),
(20,1,'1 tablet','Twice daily','5 days','Take after meals'),
(21,5,'1 tablet','Once daily','5 days','Take after breakfast'),
(22,32,'Apply thin layer','Twice daily','7 days','Apply externally'),
(23,1,'1 tablet','Twice daily','5 days','Take after food'),
(24,17,'1 tablet','Once daily','30 days','Take after breakfast'),
(25,26,'1 tablet','Once daily','30 days','Take with water'),
(26,1,'1 tablet','Twice daily','5 days','Take after meals'),
(27,5,'1 tablet','Once daily','5 days','Take after breakfast'),
(28,23,'1 tablet','Once daily','30 days','Take after breakfast'),
(29,33,'Apply thin layer','Twice daily','7 days','Apply externally'),
(30,1,'1 tablet','Twice daily','5 days','Take after meals');

INSERT INTO medicine_reminders
(patient_id, medicine_id, medicine_name, dosage, frequency, reminder_time, start_date, notes, is_active)
VALUES
(21,15,'Metformin 500 mg','1 tablet','Twice daily','08:00:00','2026-10-01','Take after breakfast',TRUE),
(21,23,'Vitamin D3','1 tablet','Once daily','13:00:00','2026-10-01','Take after lunch',TRUE),
(22,5,'Cetirizine 10 mg','1 tablet','Once daily','21:00:00','2026-10-02','Take at night',TRUE),
(23,26,'Iron + Folic Acid','1 tablet','Once daily','20:30:00','2026-10-03','Take with water',TRUE),
(24,32,'Clotrimazole Cream','Apply thin layer','Twice daily','09:00:00','2026-10-04','Apply to affected area',TRUE),
(25,1,'Paracetamol 500 mg','1 tablet','Twice daily','09:00:00','2026-10-05','Take after food',TRUE),
(26,27,'Multivitamin','1 tablet','Once daily','08:30:00','2026-10-01','Take after breakfast',TRUE),
(27,26,'Iron + Folic Acid','1 tablet','Once daily','20:00:00','2026-10-01','Take with water',TRUE),
(28,33,'Mupirocin Ointment','Apply thin layer','Twice daily','09:00:00','2026-10-02','Apply externally',TRUE),
(29,23,'Vitamin D3','1 tablet','Once daily','13:00:00','2026-10-03','Take after lunch',TRUE),

(30,19,'Atorvastatin 10 mg','1 tablet','Once daily','21:00:00','2026-10-01','Take at night',TRUE),
(31,15,'Metformin 500 mg','1 tablet','Twice daily','08:00:00','2026-10-01','Take after meals',TRUE),
(32,27,'Multivitamin','1 tablet','Once daily','09:00:00','2026-10-04','Take after breakfast',TRUE),
(33,26,'Iron + Folic Acid','1 tablet','Once daily','20:30:00','2026-10-02','Take with water',TRUE),
(34,17,'Amlodipine 5 mg','1 tablet','Once daily','20:00:00','2026-10-01','Take after dinner',TRUE),
(35,5,'Cetirizine 10 mg','1 tablet','Once daily','21:00:00','2026-10-03','Take at night',TRUE),
(36,19,'Atorvastatin 10 mg','1 tablet','Once daily','21:00:00','2026-10-01','Take after dinner',TRUE),
(37,32,'Clotrimazole Cream','Apply thin layer','Twice daily','09:00:00','2026-10-05','Apply externally',TRUE),
(38,23,'Vitamin D3','1 tablet','Once daily','13:00:00','2026-10-01','Take after lunch',TRUE),
(39,26,'Iron + Folic Acid','1 tablet','Once daily','20:30:00','2026-10-02','Take with water',TRUE),

(40,1,'Paracetamol 500 mg','1 tablet','Twice daily','09:00:00','2026-10-04','Take after food',TRUE),
(41,5,'Cetirizine 10 mg','1 tablet','Once daily','21:00:00','2026-10-05','Take at night',TRUE),
(42,32,'Clotrimazole Cream','Apply thin layer','Twice daily','09:00:00','2026-10-01','Apply externally',TRUE),
(43,15,'Metformin 500 mg','1 tablet','Twice daily','08:00:00','2026-10-01','Take after meals',TRUE),
(44,17,'Amlodipine 5 mg','1 tablet','Once daily','20:30:00','2026-10-01','Take after dinner',TRUE),
(45,26,'Iron + Folic Acid','1 tablet','Once daily','21:00:00','2026-10-01','Take with water',TRUE),
(46,23,'Vitamin D3','1 tablet','Once daily','13:00:00','2026-10-10','Take after lunch',TRUE),
(47,5,'Cetirizine 10 mg','1 tablet','Once daily','21:00:00','2026-10-11','Take at night',TRUE),
(48,27,'Multivitamin','1 tablet','Once daily','09:00:00','2026-10-12','Take after breakfast',TRUE),
(49,19,'Atorvastatin 10 mg','1 tablet','Once daily','21:00:00','2026-10-13','Take after dinner',TRUE);

INSERT INTO emergency_contacts
(name, contact_type, phone, address, city, state, is_active)
VALUES
('Emergency Ambulance Service','Ambulance','108','District Emergency Service Centre','Kopargaon','Maharashtra',TRUE),
('National Emergency Number','Emergency','112','National Emergency Response','Kopargaon','Maharashtra',TRUE),
('Sahyadri Community Health Centre','Hospital','02550-245001','Main Road','Kopargaon','Maharashtra',TRUE),
('Jeevan Jyoti Rural Hospital','Hospital','02550-245002','Station Road','Kopargaon','Maharashtra',TRUE),
('Aarogya Primary Care Centre','Primary Health Centre','02550-245003','Market Road','Kopargaon','Maharashtra',TRUE),
('Aarogya Women Centre','Women Healthcare','02550-245004','College Road','Kopargaon','Maharashtra',TRUE),
('Gram Seva Hospital','Hospital','02559-245005','Main Road','Yeola','Maharashtra',TRUE),
('Sanjeevani Health Clinic','Clinic','02422-245006','Main Road','Rahata','Maharashtra',TRUE),
('Navjeevan Primary Health Centre','Primary Health Centre','02423-245007','Temple Road','Shirdi','Maharashtra',TRUE),
('Seva Rural Hospital','Hospital','02425-245008','Main Road','Sangamner','Maharashtra',TRUE);

COMMIT;
