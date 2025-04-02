require('dotenv').config();
const mongoose = require('mongoose');

 export async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('\x1b[34m Verbonden met MongoDB\x1b[0m');
    console.log('\x1b[34m je kan beginnen met spaghetti code te  schrijven \x1b[0m)')
  } catch (err) {
    if (err instanceof Error) {
      console.error('Fout bij verbinden:', err.message);
    } else {
      console.error(err);
    }
  }
}


