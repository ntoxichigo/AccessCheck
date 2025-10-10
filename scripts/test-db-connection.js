/**
 * Database Connection Test Script
 * Run this to verify your database connection
 * Usage: node scripts/test-db-connection.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...\n');
  
  try {
    // Test 1: Basic connection
    console.log('Test 1: Attempting to connect to database...');
    await prisma.$connect();
    console.log('✅ Database connection established!\n');
    
    // Test 2: Query database
    console.log('Test 2: Running test query...');
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`;
    console.log('✅ Query successful!');
    console.log('Current database time:', result[0].current_time);
    console.log('');
    
    // Test 3: Check if tables exist
    console.log('Test 3: Checking if tables exist...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    if (tables.length > 0) {
      console.log('✅ Found', tables.length, 'tables:');
      tables.forEach((table) => {
        console.log('  -', table.table_name);
      });
    } else {
      console.log('⚠️  No tables found. You may need to run: npx prisma db push');
    }
    
    console.log('\n✅ All database tests passed!');
    console.log('\n📝 Your database is properly configured and accessible.');
    
  } catch (error) {
    console.error('\n❌ Database connection failed!\n');
    
    if (error.code === 'P1001') {
      console.error('Error: Cannot reach database server');
      console.error('\nPossible solutions:');
      console.error('1. Check if your Supabase database is paused:');
      console.error('   Visit: https://supabase.com/dashboard');
      console.error('   Click on your project and check its status');
      console.error('');
      console.error('2. Verify your DATABASE_URL in .env.local');
      console.error('   Current URL:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@'));
      console.error('');
      console.error('3. Try using the connection pooler (port 6543 instead of 5432)');
      console.error('');
      console.error('4. Check your network/firewall settings');
    } else if (error.code === 'P1002') {
      console.error('Error: Database server timeout');
      console.error('The database server is not responding.');
    } else if (error.code === 'P1003') {
      console.error('Error: Database does not exist');
      console.error('The specified database was not found.');
    } else if (error.code === 'P1008') {
      console.error('Error: Operation timeout');
      console.error('Connection took too long to establish.');
    } else if (error.code === 'P1009') {
      console.error('Error: Database already exists');
    } else if (error.code === 'P1010') {
      console.error('Error: Access denied');
      console.error('Check your database username and password.');
    } else {
      console.error('Error details:');
      console.error('Code:', error.code);
      console.error('Message:', error.message);
    }
    
    console.error('\n📚 For more help, see: ENV_SETUP_INSTRUCTIONS.md');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();
