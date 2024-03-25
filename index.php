<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">	
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link rel="manifest" href="manifest.json">
	<script src="https://kit.fontawesome.com/1cfe34b9a8.js" crossorigin="anonymous"></script>
	<link rel="stylesheet" href="public/styles.css">	
	<title>Students</title>
</head>
<body>
	<?php
    	include 'php/globals/globals.php';
	?>

	<div id="modal-delete" class="modal">
		<form class="modal-content" action="/delete.php" target="_blank">
			<div class="modal-header">
				<i class="fa-solid fa-xmark fa-fw icon-close"></i>
				<h2>Delete student</h2>
			</div>
			<div class="modal-body">
				<h3 id="modal-delete-name"></h3>
				<p>This change will be permanent.</p>
			</div>
			<div class="modal-footer">
				<button type="button" id="button-confirm-delete" class="button-form">Delete</button>
				<button type="button" class="button-form button-form-cancel">Cancel</button>
			</div>
		</form>
	</div>

	<div id="modal-add-edit" class="modal">
		<form id="form-add-edit" class="modal-content" action="/add_edit.php" target="_blank">
			<div class="modal-header">
				<i class="fa-solid fa-xmark fa-fw icon-close"></i>
				<h2 id="modal-h2">Add student</h2>
			</div>
			<div class="modal-body">
				<input type="hidden" id="studentid" name="studentid"><br>

				<label for="group">Group</label>
				<select id="group" name="group">
					<?php
						foreach(GROUP as $key => $group) { ?>
							<option value="<?= $key ?>"><?= $group ?></option>
							<?php
						}
					?>
				</select><br>

				<label for="fname">First name</label>
				<input type="text" id="fname" name="fname"><br>
				<div id="fname-error" class="form-error"></div>
				
				<label for="lname">Last name</label>
				<input type="text" id="lname" name="lname"><br>
				<div id="lname-error" class="form-error"></div>

				<label for="gender">Gender</label>
				<select id="gender" name="gender">
					<?php
						foreach(GENDER as $key => $gender) { ?>
							<option value="<?= $key ?>"><?= $gender ?></option>
							<?php
						}
					?>
				</select><br>

				<label for="birthday">Birthday</label>
				<input type="date" id="birthday" name="birthday">
				
				<input type="hidden" id="status" name="status"><br>
			</div>
			<div class="modal-footer">
				<button type="button" class="button-form button-form-cancel">Cancel</button>
				<button type="button" id="button-confirm-add-edit" class="button-form">Create</button>
			</div>
		</form>
	</div>

	<div id="modal-alert" class="modal">
		<div class="modal-content">
			<div class="modal-header">
				<i class="fa-solid fa-xmark fa-fw icon-close"></i>
				<h2>Error</h2>
			</div>
			<div class="modal-body">
				<h3>An error has occurred.</h3>
				<p id="db-error"></p>
			</div>
			<div class="modal-footer">
				<button type="button" class="button-form button-form-cancel">OK</button>
			</div>
		</div>
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
				<li><a id="switch-to-students" class="current">Students</a></li>
				<li><a id="switch-to-chat">Chat</a></li>
			</ul>
		</nav>
		<div class="content">

			<div id="main-page">
				<h1>Students</h1>
				<div id="addButton" class="button button-add" data-studentid="">
					<i class="fa-solid fa-plus fa-fw icon-add"></i>
				</div>
				<table id="studentTable">
					<thead>
						<tr>
							<th>
								<input type="checkbox" id="head-checkbox" class="table-checkbox">
							</th>
							<th>Group</th>
							<th>Name</th>
							<th>Gender</th>
							<th>Birthday</th>
							<th>Status</th>
							<th>Options</th>
						</tr>
					</thead>
					<tbody id="student-table-body">
						<?php
        					$conn = new MySQLi(SERVERNAME, USERNAME, PASSWORD, DATABASE);
        					if ($conn->connect_error) {
	            				die("Connection failed: " . $conn->connect_error);
        					}
	        				$rows = $conn->query("SELECT * FROM students"); 
        					$conn->close(); 
							
							while($row = $rows->fetch_assoc()) { ?>
            					<tr data-studentid="<?= $row['id'] ?>">

									<td><input type="checkbox" class="table-checkbox"></td>
									<td data-group="<?= $row['studygroup'] ?>"><?= GROUP[$row['studygroup']] ?></td>
									<td	data-fname="<?= $row['fname'] ?>"
										data-lname="<?= $row['lname'] ?>">
										<?= $row['fname'] ?> <?= $row['lname'] ?></td>
									<td data-gender="<?= $row['gender'] ?>"><?= GENDER[$row['gender']] ?></td>
									<td data-birthday="<?= $row['birthday'] ?>"><?= date("d.m.Y", strtotime($row['birthday'])) ?></td>
									<td>
										<div data-status="0" class="button-status">
											<i class="fa-solid fa-circle icon-status"></i>
										</div>
									</td>
									<td>
										<div class="button button-edit" data-studentid="<?= $row['id'] ?>">
											<i class="fa-solid fa-pencil icon-edit"></i>
										</div>
										<div class="button button-delete" data-studentid="<?= $row['id'] ?>">
											<i class="fa-solid fa-trash-can icon-delete"></i>
										</div>
									</td>
								</tr>
        					<?php
        					}
        				?>
					</tbody>
				</table>
			</div>

		</div>
	</div>
	
	<script src="public/students.js"></script>

</body>
</html>