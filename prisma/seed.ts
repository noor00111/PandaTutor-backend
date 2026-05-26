import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {

  // ---------Hash passwords------------ //
  const adminPassword= await bcrypt.hash('admin123', 10);
  const tutorPassword = await bcrypt.hash('tutor123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);

  // ---------Admin--------- //
  const admin = await prisma.user.upsert({
    where: { email: 'admin@PandaTutor.com' },
    update: { password: adminPassword },
    create: {
      name: 'Admin sir',
      email: 'admin@PandaTutor.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // ---------Categories--------- //
  const categoriesData = ['Math', 'Physics', 'Chemistry', 'Biology', 'Programming', 'Language',];

  const categories = [];
  for (const name of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories.push(category);
  }

  // -----------Tutors---------- //
  const tutor1 = await prisma.user.upsert({
    where: { email: 'tutor1@test.com' },
    update: {},
    create: {
      name: 'Elena Petrova',
      email: 'tutor1@test.com',
      password: tutorPassword,
      role: Role.TUTOR,
    },
  });

  const tutor2 = await prisma.user.upsert({
    where: { email: 'tutor2@test.com' },
    update: {},
    create: {
      name: 'Rafael Costa',
      email: 'tutor2@test.com',
      password: tutorPassword,
      role: Role.TUTOR,
    },
  });
 
  const tutor3 = await prisma.user.upsert({
    where: { email: 'tutor3@test.com' },
    update: {},
    create: {
      name: 'Amara Okafor',
      email: 'tutor3@test.com',
      password: tutorPassword,
      role: Role.TUTOR,
    },
  });

  const tutor4 = await prisma.user.upsert({
    where: { email: 'tutor4@test.com' },
    update: {},
    create: {
      name: 'Sora Nakamura',
      email: 'tutor4@test.com',
      password: tutorPassword,
      role: Role.TUTOR,
    },
  });

  const tutor5 = await prisma.user.upsert({
    where: { email: 'tutor5@test.com' },
    update: {},
    create: {
      name: 'Luca Bianchi',
      email: 'tutor5@test.com',
      password: tutorPassword,
      role: Role.TUTOR,
    },
  });

  // ---------Tutor Profiles------------- //
  await prisma.tutorProfile.upsert({
    where: { userId: tutor1.id },
    update: {},
    create: {
      userId: tutor1.id,
      bio: 'Mathematics specialist with 8+ years of experience teaching algebra, calculus, and linear algebra',
      hourlyRate: 30,
      rating: 4.8,
      totalReviews: 12,
    },
  });

  await prisma.tutorProfile.upsert({
    where: { userId: tutor2.id },
    update: {},
    create: {
      userId: tutor2.id,
      bio: 'Physics tutor specializing in mechanics and electromagnetism',
      hourlyRate: 35,
      rating: 5.0,
      totalReviews: 9,
    },
  });
  await prisma.tutorProfile.upsert({
    where: { userId: tutor3.id },
    update: {},
    create: {
      userId: tutor3.id,
      bio: 'Chemistry specialist with expertise in organic and inorganic chemistry',
      hourlyRate: 48,
      rating: 4.5,
      totalReviews: 11,
    },
  });
  await prisma.tutorProfile.upsert({
    where: { userId: tutor4.id },
    update: {},
    create: {
      userId: tutor4.id,
      bio: 'Computer science tutor specializing in Programming & Web Development Specialist',
      hourlyRate: 45,
      rating: 4.9,
      totalReviews: 15,
    },
  });
  await prisma.tutorProfile.upsert({
    where: { userId: tutor5.id },
    update: {},
    create: {
      userId: tutor5.id,
      bio: 'English literature expert focused on academic writing, critical analysist',
      hourlyRate: 40,
      rating: 4.6,
      totalReviews: 10,
    },
  });

  // ------------Students----------- //
  const student1 = await prisma.user.upsert({
    where: { email: 'student1@test.com' },
    update: {},
    create: {
      name: 'Zayn Al-Hakim',
      email: 'student1@test.com',
      password: studentPassword,
      role: Role.STUDENT,
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@test.com' },
    update: {},
    create: {
      name: 'Kaito Fujimori',
      email: 'student2@test.com',
      password: studentPassword,
      role: Role.STUDENT,
    },
  });
  const student3= await prisma.user.upsert({
    where: { email: 'student3@test.com' },
    update: {},
    create: {
      name: 'Anika Svensson',
      email: 'student3@test.com',
      password: studentPassword,
      role: Role.STUDENT,
    },
  });
  const student4 = await prisma.user.upsert({
    where: { email: 'student4@test.com' },
    update: {},
    create: {
      name: 'Isabella Moretti',
      email: 'student4@test.com',
      password: studentPassword,
      role: Role.STUDENT,
    },
  });

  // Bookings
  await prisma.booking.create({
    data: {
      studentId: student1.id,
      tutorId: tutor1.id,
      date: new Date(),
      status: 'CONFIRMED',
    },
  });

  await prisma.booking.create({
    data: {
      studentId: student2.id,
      tutorId: tutor2.id,
      date: new Date(),
      status: 'COMPLETED',
    },
  });

  await prisma.booking.create({
    data: {
      studentId: student3.id,
      tutorId: tutor3.id,
      date: new Date(),
      status: 'COMPLETED',
    },
  });

  await prisma.booking.create({
    data: {
      studentId: student4.id,
      tutorId: tutor5.id,
      date: new Date(),
      status: 'CONFIRMED',
    },
  });

  // -------Reviews------- //
  await prisma.review.create({
    data: {
      studentId: student1.id,
      tutorId: tutor1.id,
      rating: 5,
      comment: 'Amazing tutor!',
    },
  });

  await prisma.review.create({
    data: {
      studentId: student2.id,
      tutorId: tutor2.id,
      rating: 4,
      comment: 'Very helpful session!',
    },
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });