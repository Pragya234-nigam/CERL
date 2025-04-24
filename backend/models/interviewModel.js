const { Schema, model, Types } = require('../connection');
const mySchema = new Schema({
    company: { type: Types.ObjectId, ref: 'company' },
    panel: [
        {
            type: Types.ObjectId,
            ref: 'company',
            validate: [
                {
                    validator: function (value) {
                        return value.length <= 5; // Limit the panel to 5 companies
                    },
                    message: 'Panel cannot have more than 5 companies'
                },
                {
                    validator: function(value) {
                        // Check for duplicates by converting to Set and comparing lengths
                        return new Set(value.map(v => v.toString())).size === value.length;
                    },
                    message: 'A company can only join the panel once'
                }
            ]
        }
    ],
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
    interviewDate: { type: Date, required: true },
    interviewTime: { type: String, required: true },
    meetingLink: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('interview', mySchema);

