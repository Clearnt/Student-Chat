<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">	
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link rel="manifest" href="manifest.json">
	<script src="https://kit.fontawesome.com/1cfe34b9a8.js" crossorigin="anonymous"></script>
	<link rel="stylesheet" href="public/styles.css">	
	<title>Chat</title>
</head>
<body>

	<div id="modal-new-chat" class="modal">
		<form id="form-new-chat" class="modal-content">
			<div class="modal-header">
				<i class="fa-solid fa-xmark fa-fw icon-close"></i>
				<h2>Create new room</h2>
			</div>
			<div class="modal-body">
				<label for="chatname">Room name</label>
				<input type="text" id="chatname" name="chatname"><br>
			</div>
			<div class="modal-footer">
				<button type="button" class="button-form button-form-cancel">Cancel</button>
				<button type="button" id="button-new-chat-create" class="button-form">Create</button>
			</div>
		</form>
	</div>

	<div id="modal-new-member" class="modal">
		<form id="form-new-member" class="modal-content">
			<div class="modal-header">
				<i class="fa-solid fa-xmark fa-fw icon-close"></i>
				<h2>Add new member</h2>
			</div>
			<div class="modal-body">
				<label for="memebername">Username</label>
				<input type="text" id="membername" name="membername"><br>
				<div id="membername-error" class="form-error"></div>
			</div>
			<div class="modal-footer">
				<button type="button" class="button-form button-form-cancel">Cancel</button>
				<button type="button" id="button-new-member-create" class="button-form">Add</button>
			</div>
		</form>
	</div>

	<div id="modal-log-sign" class="modal">
		<form id="form-log-sign" class="modal-content">
			<div class="modal-header">
				<h2 id="modal-h2">Log in</h2>
			</div>
			<div class="modal-body">
				<input type="hidden" id="type" name="type" value="1"><br>

				<label for="username">Username</label>
				<input type="text" id="username" name="username"><br>
				<div id="username-error" class="form-error"></div>
				
				<label for="pass">Password</label>
				<input type="password" id="pass" name="pass"><br>
				<div id="pass-error" class="form-error"></div>
			</div>
			<div class="modal-footer">
				<button type="button" id="button-log-sign-change" class="button-form ">Don't have an account?</button>
				<button type="button" id="button-confirm-log-sign" class="button-form">Log in</button>
			</div>
		</form>
	</div>

	<header>
		<h4><a href="http://pz.lp.edu.ua/uk">CMS</a></h4>
		<div class="profile">
			<div class="profile-picture">
				<img class="profile-picture picture" src="public/images/default_pfp.png"></img>
			</div>
			<div id="profile-name" class="profile-name"></div>
			<div class="profile-dropdown">
				<a href="#profile">Profile</a>
				<a href="#logout">Log out</a>
			</div>
		</div>
		<div id="notification">
			<div id="icon-bell" class="fa-stack">				
				<i class="fa-regular fa-bell fa-fw fa-stack-2x"></i>
				<i id="icon-dot" class="fa-solid fa-circle fa-stack-1x" style="color:tomato"></i>
			</div>
			<div id="notification-dropdown"></div>
		</div>
	</header>
	
	<div class="page">
		<nav>
			<ul>
				<li><a id="switch-to-students">Students</a></li>
				<li><a id="switch-to-chat" class="current">Chat</a></li>
			</ul>
		</nav>
		<div class="content">

			<div id="chat-page">
				<h1>Messages</h1>
				<div class="chat">
					<div id="chat-list-box" class="chat-list-box">
						<div class="chat-header">
							<h1>Chat rooms</h1>

							<div id="button-new-chat" class="button">
								<i class="fa-solid fa-plus fa-fw icon-add"></i>
							</div>
						</div>

						<div id="chat-list"></div>
					</div>

					<div id="chat-screen-box" class="chat-screen">
						<div class="chat-header">
							<h1><span id="chat-name"></span></h1>
						</div>

						<div class="chat-screen-members">
							<h1>Members</h1>
							<div id="chat-members">
								<div class="chat-screen-member">
									<div class="chat-member-profile">
										<img class="chat-member-pfp" src="public/images/default_pfp.png">
										<div class="chat-member-name">User1</div>
									</div>
								</div>
								<div class="chat-screen-member">
									<div class="chat-member-profile">
										<img class="chat-member-pfp" src="public/images/default_pfp.png">
										<div class="chat-member-name">User2</div>
									</div>
								</div>

								<div id="button-add-chat-member" class="button">
									<i class="fa-solid fa-plus fa-fw icon-add"></i>
								</div>
							</div>
						</div>

						<div class="chat-screen-chat">
							<h1>Messages</h1>
							<div id="chat"></div>
						</div>

						<form id="message-send-form" class="chat-screen-write">
							<input type="text" id="message" name="message">
							
							<div id="chat-send">
								<i class="fa-solid fa-paper-plane icon-send"></i>
							</div>
						</form>
					</div>
				</div>
			<div>
		</div>
	</div>
	
	
	<script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>

	<script src="public/chat.js"></script>

</body>
</html>