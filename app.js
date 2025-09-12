const express = require("express");
const dotenv = require("dotenv");
const routes=require('./server/routes/siteRoutes.js');
const updateNavJob = require('./jobs/navJobs');

dotenv.config();
const app = express();
app.use(express.json());



app.use('/',routes);
updateNavJob.start();


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
