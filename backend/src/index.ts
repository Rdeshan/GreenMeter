import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { connectDB } from './config/db';


<<<<<<< Updated upstream
connectDB();
const PORT = process.env.PORT || 5000;
=======
const PORT = parseInt(process.env.PORT || "5000", 10);
>>>>>>> Stashed changes

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
