import app from './app';
import { connectDB } from './utils/db';
// import { seedInitialData } from './utils/seedData';

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  
  // // Seed initial data
  // await seedInitialData();
  
  app.listen(5000, '0.0.0.0', () => {
    console.log("Server running on port 5000");
  });  
})();
