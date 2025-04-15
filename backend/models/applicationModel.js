const { Schema, model } = require('../connection');
const mySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    company: { type: Schema.Types.ObjectId, ref: 'company', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('application', mySchema);