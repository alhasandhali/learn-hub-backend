
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating 10 instructors...');
  const instructors = [];
  for (let i = 1; i <= 10; i++) {
    const instructor = await prisma.user.create({
      data: {
        id: i === 1 ? 'instructor-1' : undefined,
        email: `instructor${i}@ph.com`,
        name: `Instructor ${i}`,
        role: 'INSTRUCTOR',
      },
    });
    instructors.push(instructor);
  }

  console.log('Creating 50 students...');
  const students = [];
  for (let i = 1; i <= 50; i++) {
    const student = await prisma.user.create({
      data: {
        id: i === 1 ? 'student-1' : undefined,
        email: `student${i}@ph.com`,
        name: `Student ${i}`,
        role: 'STUDENT',
      },
    });
    students.push(student);
  }

  console.log('Creating assignments...');
  const difficulties: ("BEGINNER" | "INTERMEDIATE" | "ADVANCED")[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  const assignments = [];
  
  for (let i = 1; i <= 15; i++) {
    const instructor = instructors[i % instructors.length];
    const assignment = await prisma.assignment.create({
      data: {
        title: `Assignment ${i}: ${['React', 'Next.js', 'TypeScript', 'Node.js', 'Prisma'][i % 5]} Mastery`,
        description: `This is a comprehensive assignment to master ${['React', 'Next.js', 'TypeScript', 'Node.js', 'Prisma'][i % 5]}. Please follow all instructions.`,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * (i + 1)), // 1-16 days from now
        difficulty: difficulties[i % 3],
        instructorId: instructor.id,
      },
    });
    assignments.push(assignment);
  }

  console.log('Creating submissions...');
  for (let i = 0; i < 100; i++) {
    const student = students[i % students.length];
    const assignment = assignments[i % assignments.length];
    const statuses: ("PENDING" | "ACCEPTED" | "NEEDS_IMPROVEMENT")[] = ['PENDING', 'ACCEPTED', 'NEEDS_IMPROVEMENT'];
    
    await prisma.submission.create({
      data: {
        studentId: student.id,
        assignmentId: assignment.id,
        url: `https://github.com/${(student.name || 'student').replace(' ', '-').toLowerCase()}/repo-${i}`,
        notes: `Implemented with best practices. Assignment ${i}`,
        status: statuses[i % 3],
        feedback: i % 3 !== 0 ? 'Good progress, but check the details.' : null,
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i % 7)), // 0-6 days ago
      },
    });
  }

  console.log('Seed data created successfully: 10 instructors, 50 students, 15 assignments, 100 submissions.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
