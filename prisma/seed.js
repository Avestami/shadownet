const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clean existing data
  console.log('Cleaning existing data...');
  await prisma.playerChoice.deleteMany({});
  await prisma.levelUnlock.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.level.deleteMany({});
  await prisma.user.deleteMany({});

  // Create admin user
  console.log('Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      id: 'admin',
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      score: 1000
    }
  });

  // Create test user
  console.log('Creating test user...');
  const userPassword = await bcrypt.hash('test123', 10);
  const testUser = await prisma.user.create({
    data: {
      id: 'user1',
      username: 'testuser',
      email: 'test@example.com',
      password: userPassword,
      score: 500
    }
  });

  // Create levels
  console.log('Creating levels...');
  
  // Level 1
  const level1 = await prisma.level.create({
    data: {
      id: 'level1',
      name: 'First Contact',
      description: 'Your first encounter with the ShadowNet system',
      videoUrl: '/videos/level1.mp4',
      audioUrl: '/audio/level1.mp3',
      unlockCode: 'start',
      sequence: 1
    }
  });

  // Level 2
  const level2 = await prisma.level.create({
    data: {
      id: 'level2',
      name: 'Digital Footprints',
      description: 'Follow the trail of digital breadcrumbs',
      videoUrl: '/videos/level2.mp4',
      audioUrl: '/audio/level2.mp3',
      unlockCode: 'follow',
      sequence: 2
    }
  });

  // Level 3
  const level3 = await prisma.level.create({
    data: {
      id: 'level3',
      name: 'The Hidden Truth',
      description: 'Uncover secrets hidden in plain sight',
      videoUrl: '/videos/level3.mp4',
      audioUrl: '/audio/level3.mp3',
      unlockCode: 'truth',
      sequence: 3
    }
  });

  // Update levels with next level links
  await prisma.level.update({
    where: { id: 'level1' },
    data: { nextLevelId: 'level2' }
  });

  await prisma.level.update({
    where: { id: 'level2' },
    data: { nextLevelId: 'level3' }
  });

  // Unlock first level for users
  console.log('Unlocking first level for users...');
  await prisma.levelUnlock.create({
    data: {
      userId: admin.id,
      levelId: level1.id
    }
  });

  await prisma.levelUnlock.create({
    data: {
      userId: testUser.id,
      levelId: level1.id
    }
  });

  // Add some choices for the test user
  console.log('Adding player choices...');
  await prisma.playerChoice.create({
    data: {
      userId: testUser.id,
      levelId: level1.id,
      choiceKey: 'firstInteraction',
      choiceValue: 'investigate'
    }
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 