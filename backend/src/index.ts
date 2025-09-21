import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';

dotenv.config();
connectDB();

const PORT = parseInt(process.env.PORT || "5000", 10);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
