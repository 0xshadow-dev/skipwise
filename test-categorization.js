// Quick test script to verify regional categorization is working
const { enhancedCategorizeTemptation } = require('./lib/enhanced-ai-categorization.ts');

async function testCategorization() {
  console.log('Testing enhanced categorization...\n');
  
  const testCases = [
    'idli',
    'chapati', 
    'vada pav',
    'ramen',
    'phjo', // typo for pho
    'biryani',
    'sushi'
  ];
  
  for (const testCase of testCases) {
    try {
      const result = await enhancedCategorizeTemptation(testCase);
      console.log(`"${testCase}" -> ${result}`);
    } catch (error) {
      console.error(`Error testing "${testCase}":`, error.message);
    }
  }
}

testCategorization();