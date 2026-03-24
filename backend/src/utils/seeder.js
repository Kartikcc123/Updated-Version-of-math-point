require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { Course, Batch } = require('../models/Course');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected for seeding...');
};

const seedData = async () => {
  await connectDB();
  try {
    await User.deleteMany({});
    await Course.deleteMany({});
    await Batch.deleteMany({});

    // Create super admin
    const superAdmin = await User.create({
      name: 'Ashish Upadhyay',
      email: 'admin@mathpoint.in',
      phone: '9876543210',
      password: 'Admin@1234',
      role: 'superadmin',
      permissions: [
        'manage_students','manage_teachers','manage_courses',
        'manage_fees','manage_attendance','manage_tests',
        'manage_study_material','view_analytics','send_notifications','manage_roles'
      ],
    });

    // Create teachers
    const teacher1 = await User.create({
      name: 'Rahul Sharma', email: 'rahul@mathpoint.in', phone: '9876543211',
      password: 'Teacher@1234', role: 'teacher', teacherId: 'MP-TCH-0001',
      subjects: ['Physics', 'Maths'], qualification: 'M.Sc Physics', experience: 8,
    });
    const teacher2 = await User.create({
      name: 'Priya Singh', email: 'priya@mathpoint.in', phone: '9876543212',
      password: 'Teacher@1234', role: 'teacher', teacherId: 'MP-TCH-0002',
      subjects: ['Chemistry', 'Biology'], qualification: 'M.Sc Chemistry', experience: 6,
    });

    // Courses
    const jeeMain = await Course.create({
      name: 'JEE Main & Advanced', code: 'JEE-2Y',
      description: 'Complete 2-Year program for JEE Main and Advanced preparation.',
      targetExam: ['JEE'], duration: '2 Years', fee: 85000,
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      features: ['Daily Practice Problems', 'Weekly Tests', 'Doubt Sessions', 'Study Material'],
    });
    const neetCourse = await Course.create({
      name: 'NEET UG Complete', code: 'NEET-2Y',
      description: 'Comprehensive 2-Year NEET preparation program.',
      targetExam: ['NEET'], duration: '2 Years', fee: 75000,
      subjects: ['Physics', 'Chemistry', 'Biology'],
      features: ['NCERT Focus', 'Mock Tests', 'Biology Special', 'Revision Classes'],
    });
    const crashCourse = await Course.create({
      name: 'JEE Crash Course', code: 'JEE-CC',
      description: '6-Month intensive crash course for JEE droppers.',
      targetExam: ['JEE'], duration: '6 Months', fee: 35000,
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
    });

    // Batches
    const batch1 = await Batch.create({
      name: 'JEE Morning Batch A', course: jeeMain._id, teacher: teacher1._id,
      schedule: [
        { day: 'Monday', startTime: '7:00 AM', endTime: '9:00 AM', subject: 'Physics' },
        { day: 'Wednesday', startTime: '7:00 AM', endTime: '9:00 AM', subject: 'Maths' },
        { day: 'Friday', startTime: '7:00 AM', endTime: '9:00 AM', subject: 'Chemistry' },
      ],
      startDate: new Date('2024-04-01'), endDate: new Date('2026-03-31'),
      maxStudents: 40, room: 'Room 101',
    });
    const batch2 = await Batch.create({
      name: 'NEET Evening Batch B', course: neetCourse._id, teacher: teacher2._id,
      schedule: [
        { day: 'Tuesday', startTime: '5:00 PM', endTime: '7:00 PM', subject: 'Biology' },
        { day: 'Thursday', startTime: '5:00 PM', endTime: '7:00 PM', subject: 'Chemistry' },
        { day: 'Saturday', startTime: '10:00 AM', endTime: '12:00 PM', subject: 'Physics' },
      ],
      startDate: new Date('2024-04-01'), endDate: new Date('2026-03-31'),
      maxStudents: 35, room: 'Room 102',
    });

    // Students
    const student1 = await User.create({
      name: 'Arjun Patel', email: 'arjun@student.com', phone: '9876001001',
      password: 'Student@1234', role: 'student', studentId: 'MP-STU-0001',
      targetExam: ['JEE'], enrolledBatches: [batch1._id],
      parentName: 'Suresh Patel', parentPhone: '9876001000',
      dateOfBirth: new Date('2006-05-15'), gender: 'male',
    });
    const student2 = await User.create({
      name: 'Sneha Gupta', email: 'sneha@student.com', phone: '9876001002',
      password: 'Student@1234', role: 'student', studentId: 'MP-STU-0002',
      targetExam: ['NEET'], enrolledBatches: [batch2._id],
      parentName: 'Ramesh Gupta', parentPhone: '9876001003',
      dateOfBirth: new Date('2006-08-22'), gender: 'female',
    });

    batch1.students.push(student1._id);
    await batch1.save();
    batch2.students.push(student2._id);
    await batch2.save();

    console.log('✅ Seed data created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('SuperAdmin: admin@mathpoint.in / Admin@1234');
    console.log('Teacher:    rahul@mathpoint.in / Teacher@1234');
    console.log('Student:    arjun@student.com / Student@1234');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedData();
