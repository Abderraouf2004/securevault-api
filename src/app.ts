import express from 'express';
import router  from './apis/index';
// import cors from 'cors';
const app = express();
app.use(express.json());
// app.use(cors());


const PORT = process.env.PORT || 3000;      
// app.get("/", (req, res) => {
//   res.send("SecureVault API is running");
// });
app.use('/api', router);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});