const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixKarmaValues() {
  try {
    console.log('Checking users with null karma values...');
    
    // Find users with null karma
    const usersWithNullKarma = await prisma.user.findMany({
      where: {
        karma: null
      }
    });
    
    console.log(`Found ${usersWithNullKarma.length} users with null karma`);
    
    if (usersWithNullKarma.length > 0) {
      console.log('Updating karma values to 0...');
      
      // Update all users with null karma to have karma = 0
      const result = await prisma.user.updateMany({
        where: {
          karma: null
        },
        data: {
          karma: 0
        }
      });
      
      console.log(`Updated ${result.count} users`);
    }
    
    // Show all users and their karma values
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        karma: true
      }
    });
    
    console.log('\nAll users and their karma values:');
    allUsers.forEach(user => {
      console.log(`${user.username}: ${user.karma}`);
    });
    
  } catch (error) {
    console.error('Error fixing karma values:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixKarmaValues(); 