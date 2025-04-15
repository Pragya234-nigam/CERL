const { Schema, model, Types } = require('../connection');
const mySchema = new Schema({
    company: { type: Types.ObjectId, ref: 'company' },
    panel: [{ type: Types.ObjectId, ref: 'company' }],
    image: String,
    name: String,
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    skills: { type: String, required: true },
    age: { type: String, required: true },
    experience: { type: String, required: true },
    education: { type: String, required: true },
    address: { type: String, required: true },
    jobType: { type: String, required: true },
    resume: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
module.exports = model('interview', mySchema);