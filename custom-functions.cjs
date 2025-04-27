// custom-functions.cjs
function logUserInfo(requestParams, response, context, ee, next) {
  console.log(`Processing data for user ID: ${context.vars.firstUserId}`);
  
  // You can manipulate variables here
  context.vars.timestamp = new Date().toISOString();
  context.vars.randomValue = Math.floor(Math.random() * 100);
  
  return next(); // Must call next to continue the scenario
}

function generateRandomTitle(requestParams, response, context, ee, next) {
  const titles = [
    "Performance Testing Basics",
    "Load Testing with Artillery",
    "API Stress Testing",
    "Scalability Analysis",
    "Response Time Benchmarking"
  ];
  
  context.vars.randomTitle = titles[Math.floor(Math.random() * titles.length)];
  return next();
}

// Make functions available to Artillery
module.exports = {
  logUserInfo,
  generateRandomTitle
};