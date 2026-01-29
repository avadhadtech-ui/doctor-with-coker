const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/mongodb');
const connectCloudinary = require('./config/cloudnary.js');
const adminRouter = require('./routes/adminRoutes.js');
const doctorRouter = require('./routes/doctorRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const forgotPasswordRouter = require('./routes/forgotPassword.js');
const forgotAdminRouter = require('./routes/forgotAdmin.js');
const forgotDoctor = require('./routes/forgotDoctor.js');
const { createAdminIfNoExists } = require('./controllers/adminController.js');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);
app.use('/', forgotPasswordRouter);
app.use('/', forgotAdminRouter);
app.use('/', forgotDoctor);

app.get('/', (req, res) => res.send("Hey server!"));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

async function start() {
  await connectDB();           
  connectCloudinary();        
  await createAdminIfNoExists(); 
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error("Startup failed:", err);
  process.exit(1);
});
