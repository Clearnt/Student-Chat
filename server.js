import express from 'express';
const app = express();

import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
	  origin: '*',
	}
});

import mongoose from 'mongoose';
//mongoose.set('debug', true);
mongoose.connect("mongodb+srv://ZhukIvan:wVDfBLBUTzAn2QBx@cluster0.l78ughw.mongodb.net/chat_system?retryWrites=true&w=majority");

import User from './models/User.js';
import Chat from './models/Chat.js';
import Message from './models/Message.js';

let connections = [];

app.use('/public', express.static('public'));

server.listen(process.env.PORT || 3000, () => {
	console.log('Server running on port 3000');
});

io.on('connection', (socket) => {
	connections.push(socket);
	console.log("User connected " + socket.id);

	socket.on('disconnect', () => {
		connections.splice(connections.indexOf(socket), 1);
	});

	socket.on('send message', async (data, callback) => {
		let chat = await Chat.findById(data.chat._id).exec(); 

		if (chat) {

			let message = new Message ({
				text: data.text,
				user: data.user._id
			});

			await message.save();
			chat.messages.push(message._id);
			await chat.save();

			await Message.populate(message, { path: "user", select: "username" });

			socket.to(`${data.chat._id}`).emit('new message', {chat, message});
			callback(message);
		}
	});

	socket.on('signup user', async (data, callback) => {
		let count = await User.countDocuments({username: data.user.username}).exec(); 
		if (count === 0){
			let user = new User ({
				username: data.user.username,
				password: data.user.password,
				chats: []
			});
				
			await user.save();
	
			callback({status: true, user: {_id: user._id, chats: []}});
		}
		else {
			callback({status: false, error: {code: 200, msg: "Username taken"}});
		}
	});

	socket.on('login user', async (data, callback) => {
		let user = await User.findOne({username: data.user.username}).exec(); 
	
		if (user) {
			if (user.password == data.user.password) {
	
				socket.userId = user._id.toString();
				socket.join(user.chats.map(r => r._id.toString()));

				await User.populate(user, { path: "chats", populate: ["name", 
					{ path: "members", model: "User", select: "username" }, 
					{ path: "messages", model: "Message", populate: ["text", 
						{ path: "user", model: "User", select: "username" }
					]}
				]});
	
				callback({status: true, user: {_id: user._id, chats: user.chats}});
			}
			callback({status: false, error: {code: 201, msg: "Wrong password"}});
		}
		else {
			callback({status: false, error: {code: 202, msg: "Wrong username"}});
		}
	});

	socket.on('new chat', async (data, callback) => {
		let chat = new Chat ({
			name: data.name,
			members: [data.userId],
			messages: []
		});			
		await chat.save();

		let user = await User.findById(data.userId).exec();
		user.chats.push(chat._id);		
		await user.save();

		socket.join(`${chat._id}`);

		callback(chat._id);
	});

	socket.on('new member', async (data, callback) => {
		let chat = await Chat.findById(data.chatId).exec(); 

		if (chat) {
			let addedUser = await User.findOne({username: data.username}).exec(); 

			if (addedUser) {	
				addedUser.chats.push(chat._id);	
				await addedUser.save();		
				chat.members.push(addedUser._id);	
				await chat.save();

				socket.to(`${chat._id}`).emit('update members', {chatId: chat._id, user: {_id: addedUser._id, username: addedUser.username}});
				
				await Chat.populate(chat, [
					{ path: "members", model: "User", select: "username"},
					{ path: "messages", model: "Message", populate: ["text", 
						{ path: "user", model: "User", select: "username" }
					]}
				]);

				let addedUserSocket = connections.find(c => c.userId == addedUser._id.toString());

				if (typeof addedUserSocket !== 'undefined') {	
					addedUserSocket.join(`${chat._id}`);
					io.to(`${addedUserSocket.id}`).emit('add chat', {chat});
				}

				callback({status: true, user: {_id: addedUser._id, username: addedUser.username}});
			}
			else {
				callback({status: false, error: {code: 203, msg: "Wrong username"}});
			}
		}		
	});
});