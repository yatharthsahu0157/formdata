const mongoose = require("mongoose");

// 1. Database Schema & Model Definition
const userSchema = new mongoose.Schema({
  name: String,
  age: String,
});

const Users = mongoose.models.data || mongoose.model("data", userSchema);

// 2. Global Connection State for Serverless Environments
let connectionPromise;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI).catch((err) => {
      connectionPromise = null;
      throw err;
    });
  }

  await connectionPromise;
}

// 3. AWS Lambda / Netlify Function Handler
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method not allowed",
    };
  }

  try {
    await connectDB();

    // Parse URL-encoded form data
    const params = new URLSearchParams(event.body);
    const { name, age } = Object.fromEntries(params);

    // Save user record to MongoDB
    await Users.create({ name, age });

    return {
      statusCode: 200,
      body: "Form submitted successfully!",
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: "Failed to save data",
    };
  }
};