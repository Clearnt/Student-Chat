import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    text: String, 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Message = mongoose.model('Message', messageSchema);
export default Message;