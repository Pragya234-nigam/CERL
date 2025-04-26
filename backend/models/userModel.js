const {Schema, model} = require('../connection');
const mySchema = new Schema({
    name: String,
    email: {type: String, required: true},
    password: {type: String, required: true},
    education: {type: String, default: ''},
    skills: {type: String, default: ''},
    experience: {type: String, default: ''},
    bio: {type: String, default: ''},
    phone: {type: String, default: ''},
    location: {type: String, default: ''},
    resume: {type: String, default: ''},
    createdAt: {type: Date, default: Date.now}
});

module.exports = model('user', mySchema);