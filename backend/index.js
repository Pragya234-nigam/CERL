const express = require('express');
const UserRouter = require('./routers/userRouter');
const cors = require('cors');
const CompanyRouter= require('./routers/companyRouter');
const InterviewRouter=require('./routers/interviewRouter');
const ApplicationRouter=require('./routers/applicationRouter')

const app = express();
const port = 5000;

app.use(cors({
    origin: ['http://localhost:3000'],
}));

app.use(express.json());
app.use('/user', UserRouter);

app.use('/company', CompanyRouter);

app.use('/interview',InterviewRouter);

app.use('/application',ApplicationRouter);


app.listen(port, () => {
    console.log('Server is running');
});
