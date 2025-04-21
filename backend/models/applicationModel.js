const { Schema, model } = require('../connection');
const mySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    interview: { type: Schema.Types.ObjectId, ref: 'interview', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('application', mySchema);