const socket = io("http://localhost:3000");

const chatListBox = document.getElementById("chat-list-box");
const chatList = document.getElementById("chat-list");

const chatScreenBox = document.getElementById("chat-screen-box");
chatScreenBox.style.display = "none";
const chatName = document.getElementById("chat-name");
const chatMembers = document.getElementById("chat-members");
const chatArea = document.getElementById("chat");
const messageForm = document.getElementById("message-send-form");
const message = document.getElementById("message");

const modalLogSign = document.getElementById("modal-log-sign");
modalLogSign.style.display = "block";
const formLogSign = document.getElementById("form-log-sign");
const inputUsername = document.getElementById("username");
const inputPassword = document.getElementById("pass");
const inputType = document.getElementById("type");
const buttonLogSign = document.getElementById("button-confirm-log-sign");
const buttonSwitchLogSign = document.getElementById("button-log-sign-change");

buttonLogSign.addEventListener("click", logSign);
buttonSwitchLogSign.addEventListener("click", switchLogSign);

const modalAddChat = document.getElementById("modal-new-chat");
const formAddChat = document.getElementById("form-new-chat");
const inputAddChatName = document.getElementById("chatname");

const modalAddMember = document.getElementById("modal-new-member");
const formAddMember = document.getElementById("form-new-member");
const inputAddMemberName = document.getElementById("membername");

const notifications = document.getElementById("notification-dropdown");
const notifDot = document.getElementById("icon-dot");

document.getElementById("chat-send").addEventListener("click", sendMessage);
document.getElementById("button-add-chat-member").addEventListener("click", addMemberForm);
document.getElementById("button-new-chat").addEventListener("click", addChatForm);
document.getElementById("button-new-chat-create").addEventListener("click", addChatSubmit);
document.getElementById("button-new-member-create").addEventListener("click", addMemberSubmit);

let notif = document.getElementById("notification");
notif.addEventListener("mouseenter", notificationHover, false);
notif.addEventListener("mouseleave", notificationUnHover, false);

let closeButs = document.getElementsByClassName("icon-close");
let formButs = document.getElementsByClassName("button-form-cancel");
let buttons = Array.from(closeButs).concat(Array.from(formButs));
buttons.forEach(button => {
    button.addEventListener("click", function() { closeModal(this); });
});

document.getElementById("switch-to-students").addEventListener("click", switchToStudents);

const currentUser = {_id: -1, username: ""};
const currentChat = {_id: -1, name: ""};

const chats = [];

function sendMessage() {
    if (message.value !== "") {
        socket.emit('send message', {chat: currentChat, user: currentUser, text: message.value}, (data) => {
            let chat = chats.find(c => c._id == currentChat._id);
            chat.messages.push(data);
            pushMessage(data, true);
        });
        message.value = "";
    }
}

socket.on('new message', (data) => {
    let chat = chats.find(c => c._id == data.chat._id);
    chat.messages.push(data.message);

    if (data.chat._id == currentChat._id) {
        pushMessage(data.message, false);
    }
    else {
        pushNotification(data)
    }
});

function renderMessages(messages) {
    chatArea.innerHTML = "";
    for(let message of messages) {
        let self = message.user._id == currentUser._id ? true : false;
        pushMessage(message, self);
    }
}

function pushMessage(data, self) {
    let message = document.createElement("div");
    message.className = "message-chat";
    
    let messageProfileBorder = document.createElement("div");
    messageProfileBorder.className = "message-chat-profile-border";
    if (self) { messageProfileBorder.classList.add("self-profile-border"); }
    
    let messageProfile = document.createElement("div");
    messageProfile.className = "message-chat-profile";
    if (self) { messageProfile.classList.add("self-profile"); }
    
    let messasgePFP = document.createElement("img");
    messasgePFP.className = "message-chat-pfp";
    messasgePFP.src = "public/images/default_pfp.png";
    
    let messageProfileName = document.createElement("div");
    messageProfileName.className = "message-chat-name";
    messageProfileName.innerHTML = data.user.username;

    messageProfile.append(messasgePFP);
    messageProfile.append(messageProfileName);
    
    messageProfileBorder.append(messageProfile);

    let chatMessage = document.createElement("div");
    chatMessage.className = "message-chat-message";
    chatMessage.innerHTML = data.text;
    if (self) { chatMessage.classList.add("self-message"); }
    
    message.append(messageProfileBorder);
    message.append(chatMessage);

    chatArea.appendChild(message);
}

function logSign() {
    document.getElementById("username-error").innerHTML = "";
    document.getElementById("pass-error").innerHTML = "";

    let action;
    if (inputType.value == 0) {
        action = 'signup user';
    }
    else {
        action = 'login user';
    }

    socket.emit(action, {user: {username: inputUsername.value, password: inputPassword.value}}, (data) => {
        if (data.status) {
            currentUser._id = data.user._id;
            currentUser.username = inputUsername.value;

            document.getElementById("profile-name").innerHTML = inputUsername.value;

            for (let chat of data.user.chats) {
                chats.push(chat);
            }
            renderChats(chats);

            modalLogSign.style.display = "none";
        }
        else {
            switch (data.error.code) {
                case 200:
                case 202:
                    document.getElementById("username-error").innerHTML = data.error.msg;
                    break;
                case 201:
                    document.getElementById("pass-error").innerHTML = data.error.msg;
                    break;
                default: break;
            }
        }
    });
}

function switchLogSign() {
    document.getElementById("username-error").innerHTML = "";
    document.getElementById("pass-error").innerHTML = "";

    let h2 = document.getElementById("modal-h2");
    if (h2.innerHTML == "Log in") {
        h2.innerHTML = "Sign up";
        buttonLogSign.innerHTML = "Sign up";
        buttonSwitchLogSign.innerHTML = "Already have an account?";
        inputType.value = 0;
    }
    else {
        h2.innerHTML = "Log in";
        buttonLogSign.innerHTML = "Log in";
        buttonSwitchLogSign.innerHTML = "Don't have an account?";
        inputType.value = 1;
    }
}

function renderChats(chats) {
    chatList.innerHTML = "";
    for(let chat of chats) {
        addChat(chat);
    }
}

function addChat(chat) {
    let chatTile = document.createElement("li");
    chatTile.className = "chat-list-profile";
    chatTile.dataset.id = chat._id;
    chatTile.addEventListener("click", function() { changeChat(this); })

    let chatTilePFP = document.createElement("img");
    chatTilePFP.className = "chat-list-pfp";
    chatTilePFP.src = "public/images/default_pfp.png";
    
    let chatTileName = document.createElement("div");
    chatTileName.className = "chat-list-name";
    chatTileName.innerHTML = chat.name;

    chatTile.appendChild(chatTilePFP);
    chatTile.appendChild(chatTileName);

    chatList.appendChild(chatTile);
}

function addChatForm() {
    modalAddChat.style.display = "block";
}

function addChatSubmit() {    
    socket.emit('new chat', {name: inputAddChatName.value, userId: currentUser._id}, (data) => {
        chats.push({_id: data._id, name: inputAddChatName.value, members: [currentUser], messages: []});
        renderChats(chats);
        
        modalAddChat.style.display = "none";
        inputAddChatName.value = "";
    });
}

function changeChat(chatTile) {
    let chat = chats.find(c => c._id == chatTile.dataset.id);

    if (typeof chat !== 'undefined') {
        chatName.innerHTML = chat.name;
        chatScreenBox.style.display = "block"
        currentChat._id = chatTile.dataset.id;
        currentChat.name = chat.name;

        renderMembers(chat.members);
        renderMessages(chat.messages);

        clearNotifications(chatTile.dataset.id)
    }
}

function renderMembers(members) {
    let t = document.getElementById("button-add-chat-member");
    chatMembers.innerHTML = "";
    for(let member of members) {
        addMember(member);
    }
    chatMembers.appendChild(t);
}

function addMember(member) {
    let memberTile = document.createElement("div");
    memberTile.className = "chat-screen-member"

    let memberProfile = document.createElement("div");
    memberProfile.className = "chat-member-profile"

    let memberPFP = document.createElement("img");
    memberPFP.className = "chat-member-pfp";
    memberPFP.src = "public/images/default_pfp.png";
    
    let memberName = document.createElement("div");
    memberName.className = "chat-member-name";
    memberName.innerHTML = member.username;

    memberProfile.appendChild(memberPFP);
    memberProfile.appendChild(memberName);
    
    memberTile.appendChild(memberProfile);

    chatMembers.appendChild(memberTile);
}

function addMemberForm() {
    document.getElementById("membername-error").innerHTML = "";
    modalAddMember.style.display = "block";
}

function addMemberSubmit() {
    socket.emit('new member', {chatId: currentChat._id, username: inputAddMemberName.value}, (data) => {
        if(data.status == false) {
            document.getElementById("membername-error").innerHTML = data.error.msg;
        }
        else {
            let chat = chats.find(c => c._id == currentChat._id);

            if (typeof chat !== 'undefined') {
                chat.members.push(data.user);
                renderMembers(chat.members);
            }

            modalAddMember.style.display = "none";
            inputAddMemberName.value = "";
        }
    });
}

socket.on('update members', (data) => {
    let chat = chats.find(c => c._id == data.chatId);
    
    if (typeof chat !== 'undefined') {
        chat.members.push(data.user);
        if (data.chat._id == currentChat._id) {
            renderMembers(chat.members);
        }
    }
})

socket.on('add chat', (data) => {
    chats.push(data.chat);
    renderChats(chats);
})

function pushNotification(data) {
    let noitfChat = document.createElement("div");
    noitfChat.className = "notification-chat";

    let noitfChatProfile = document.createElement("div");
    noitfChatProfile.className = "notification-chat-profile";
    
    let noitfChatPFP = document.createElement("img");
    noitfChatPFP.className = "notification-chat-pfp";
    noitfChatPFP.src = "public/images/default_pfp.png";
    
    let noitfChatName = document.createElement("div");
    noitfChatName.className = "notification-chat-name";
    noitfChatName.innerHTML = data.chat.name;

    noitfChatProfile.appendChild(noitfChatPFP);
    noitfChatProfile.appendChild(noitfChatName);
    
    let noitfChatMsgBorder = document.createElement("div");
    noitfChatMsgBorder.className = "notification-chat-message-border";

    let noitfChatMsg = document.createElement("a");
    noitfChatMsg.className = "notification-chat-message";
    noitfChatMsg.addEventListener("mouseenter", function() { messageHover(this); }, false);
    noitfChatMsg.addEventListener("mouseleave", function() { messageUnHover(this); }, false);
    noitfChatMsg.innerHTML = "<b>" + data.message.user.username + ":</b>\n" + data.message.text;
    noitfChatMsg.dataset.id = data.chat._id;
    noitfChatMsg.addEventListener("click", function() { 
        changeChat(this);
    });

    noitfChatMsgBorder.appendChild(noitfChatMsg);

    noitfChat.appendChild(noitfChatProfile);
    noitfChat.appendChild(noitfChatMsgBorder);

    notifications.appendChild(noitfChat);
    notifDot.style.display = "block";
}

function clearNotifications(id) {
    let notifs = notifications.children;
    for (let notif of notifs) {
        if (notif.lastChild.lastChild.dataset.id == id) {
            notifications.removeChild(notif);
        }
    }
    if (!notifications.hasChildNodes()) {
        notifDot.style.display = "none";
    }
}

function notificationHover() {
    let bell = document.getElementById("icon-bell");
    bell.style.transform = "scale(1.15)";
    bell.style.transition = "all .3s"
}

function notificationUnHover() {
    let bell = document.getElementById("icon-bell");
    bell.style.transform = "scale(1)";
    bell.style.transition = "all .3s"
}

function messageHover(msg) {
    msg.style.transition = "all .3s"
    msg.style.backgroundColor = "lightgray";
    let chat = msg.parentNode.parentNode;
    chat.style.transition = "all .3s"
    chat.style.backgroundColor = "lightgray";
}

function messageUnHover(msg) {
    msg.style.transition = "all .3s"
    msg.style.backgroundColor = "white";
    let chat = msg.parentNode.parentNode;
    chat.style.transition = "all .3s"
    chat.style.backgroundColor = "white";    
}

function switchToStudents() {
    currentChat._id = -1;
    chatScreenBox.style.display = "none";
    window.location = "index.php";
}

function closeModal(modalButton) {
    modalButton.parentNode.parentNode.parentNode.style.display = "none";
    document.getElementById("membername-error").innerHTML = "";
    document.getElementById("username-error").innerHTML = "";
    document.getElementById("pass-error").innerHTML = "";
}