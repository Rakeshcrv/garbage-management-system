const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const workerPassword = await bcrypt.hash('worker123', 10);
  const citizenPassword = await bcrypt.hash('citizen123', 10);

  // Create users
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

  const worker = await prisma.user.upsert({
    where: { email: 'worker@example.com' },
    update: {},
    create: {
      name: 'Garbage Worker',
      email: 'worker@example.com',
      password: workerPassword,
      role: 'Worker',
    },
  });

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

  // Create sample pickup requests
  await prisma.pickupRequest.createMany({
    data: [
      {
        address: '123 Main St',
        garbageType: 'Dry',
        pickupDate: new Date('2026-01-25'),
        status: 'Pending',
        citizenId: citizen.id,
      },
      {
        address: '456 Oak Ave',
        garbageType: 'Wet',
        pickupDate: new Date('2026-01-26'),
        status: 'Assigned',
        citizenId: citizen.id,
        workerId: worker.id,
      },
      {
        address: '789 Pine Rd',
        garbageType: 'E-waste',
        pickupDate: new Date('2026-01-20'),
        status: 'Collected',
        citizenId: citizen.id,
        workerId: worker.id,
      },
    ],
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });