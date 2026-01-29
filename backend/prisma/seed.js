const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning database for fresh demo...');
  
  // Clean up existing data
  await prisma.task.deleteMany({});
  await prisma.garbageReport.deleteMany({});
  await prisma.pickupRequest.deleteMany({});
  await prisma.worker.deleteMany({});
  await prisma.user.deleteMany({
    where: {
      email: {
        notIn: ['admin@example.com', 'citizen@example.com']
      }
    }
  });

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const workerPassword = await bcrypt.hash('password', 10);
  const citizenPassword = await bcrypt.hash('password', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'Admin',
    },
  });

  // Create 5 worker users (clean number for demo)
  const workers = [];
  for (let i = 1; i <= 5; i++) {
    const worker = await prisma.user.upsert({
      where: { email: `worker${i}@example.com` },
      update: {},
      create: {
        name: `Worker ${i}`,
        email: `worker${i}@example.com`,
        password: workerPassword,
        role: 'Worker',
      },
    });
    workers.push(worker);
  }

  // Create citizen user
  const citizen = await prisma.user.upsert({
    where: { email: 'citizen@example.com' },
    update: {},
    create: {
      name: 'John Citizen',
      email: 'citizen@example.com',
      password: citizenPassword,
      role: 'Citizen',
    },
  });

  // Create Worker entries for each worker user
  for (const worker of workers) {
    await prisma.worker.upsert({
      where: { userId: worker.id },
      update: {},
      create: {
        userId: worker.id,
      },
    });
  }

  // Create 3 fresh pending garbage reports for demo
  const sampleReports = [
    {
      imagePath: '/uploads/garbage-sample-1.jpg',
      latitude: 12.9716,
      longitude: 77.5946,
      status: 'REPORTED',
      citizenId: citizen.id,
      address: '123 Main St, Bangalore',
      notes: 'Large pile of garbage near the bus stop',
      statusHistory: JSON.stringify([
        { status: 'REPORTED', timestamp: new Date().toISOString(), note: 'Report submitted by citizen' }
      ])
    },
    {
      imagePath: '/uploads/garbage-sample-2.jpg',
      latitude: 12.9352,
      longitude: 77.6245,
      status: 'REPORTED',
      citizenId: citizen.id,
      address: '456 Oak Avenue, Bangalore',
      notes: 'Overflowing garbage bin',
      statusHistory: JSON.stringify([
        { status: 'REPORTED', timestamp: new Date().toISOString(), note: 'Report submitted by citizen' }
      ])
    },
    {
      imagePath: '/uploads/garbage-sample-3.jpg',
      latitude: 13.0128,
      longitude: 77.5693,
      status: 'REPORTED',
      citizenId: citizen.id,
      address: '789 Pine Road, Bangalore',
      notes: 'Construction debris blocking sidewalk',
      statusHistory: JSON.stringify([
        { status: 'REPORTED', timestamp: new Date().toISOString(), note: 'Report submitted by citizen' }
      ])
    }
  ];

  await prisma.garbageReport.createMany({
    data: sampleReports
  });

  console.log('✨ Database cleaned and seeded with fresh demo data!');
  console.log('📊 Created:');
  console.log(`   - 1 Admin user`);
  console.log(`   - 5 Worker users`);
  console.log(`   - 1 Citizen user`);
  console.log(`   - 3 Pending garbage reports (ready for assignment)`);
  console.log(`   - 0 Tasks (clean slate)`);
  console.log('');
  console.log('🚀 Ready for demo! Login with:');
  console.log('   Admin: admin@example.com / admin123');
  console.log('   Workers: worker1@example.com / password (workers 1-5)');
  console.log('   Citizen: citizen@example.com / password');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });