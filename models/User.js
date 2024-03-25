import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }]
});

const User = mongoose.model('User', userSchema);
export default User;