// models/Conversation.js
const mongoose = require('mongoose');

const messageContentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Virtual field for sender's full name
// messageContentSchema.virtual('senderFullName').get(function() {
//     if (this.senderId && this.senderId.firstName && this.senderId.lastName) {
//         return `${this.senderId.firstName} ${this.senderId.lastName}`;
//     }
//     return '';
// });

const conversationSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [messageContentSchema]
});

// Virtual field for participant names
// conversationSchema.virtual('participantNames').get(function() {
//     return this.participants.map(participant => `${participant.firstName} ${participant.lastName}`);
// });

// Ensure there are at least two participants
conversationSchema.path('participants').validate(function (value) {
    return value.length >= 2;
}, 'A conversation must have at least two participants.');

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;