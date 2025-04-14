const mongoose = require("mongoose");
const url = "mongodb+srv://pragyanigam234:1234@cluster0.53dqq.mongodb.net/mydb1?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(url)
.then((result) => {
    console.log('Connected to database');
})
.catch((err) => {
    console.log(err);
});

module.exports = mongoose;