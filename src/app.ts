import express from 'express';
import router  from './apis/index';
import helmet from 'helmet';
import { errorHandler } from "./errors/error-handler";
import { notFoundHandler } from "./errors/not-found";
import { apiRateLimiter } from "./middleware/rate-limit";
// import cors from 'cors';
const app = express();
app.use(helmet());
app.use(express.json());
// app.use(cors());


const PORT = process.env.PORT || 3000;      
// app.get("/", (req, res) => {
//   res.send("SecureVault API is running");
// });
app.use(apiRateLimiter);
app.use('/api', router);
app.use(notFoundHandler);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});