const express = require('express');
const UserRouter = require('./routers/userRouter');
const cors = require('cors');
const CompanyRouter= require('./routers/companyRouter');
const InterviewRouter=require('./routers/interviewRouter');

const app = express();
const port = 5000;

app.use(cors({
    origin: ['http://localhost:3000'],
}));

app.use(express.json());
app.use('/user', UserRouter);

app.use('/company', CompanyRouter);

app.use('/interview',InterviewRouter)


app.get('/', (req, res) => {
    res.send('response from express');
});
app.get('/add', (req, res) => {
    res.send('response from add');
})

app.listen(port, () => {
    console.log('Server is running');
});
