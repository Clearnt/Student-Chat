window.addEventListener("load", function() {
    let checks = document.getElementsByClassName("table-checkbox");
    Array.from(checks).forEach(check => {
        check.addEventListener("change", function() { updateCheckboxes(this); });
    })

    let notif = document.getElementById("notification");
    notif.addEventListener("mouseenter", notificationHover, false);
    notif.addEventListener("mouseleave", notificationUnHover, false);

    let closeButs = document.getElementsByClassName("icon-close");
    let formButs = document.getElementsByClassName("button-form-cancel");
    let buttons = Array.from(closeButs).concat(Array.from(formButs));
    buttons.forEach(button => {
        button.addEventListener("click", function() { closeModal(this); });
    });
    
    document.getElementById("button-confirm-delete").addEventListener("click", function() { submitDelete(this); });

    document.getElementById("button-confirm-add-edit").addEventListener("click", function() { submitAddEdit(); });

    let stats = document.getElementsByClassName("button-status");
    Array.from(stats).forEach(stat => {
        stat.addEventListener("click", function() { changeStatus(this); });
        stat.style.color = "lightgray";
    })

    let eds = document.getElementsByClassName("button-edit");
    Array.from(eds).forEach(ed => {
        ed.addEventListener("click", function() { showAddEditModal(this); });
    })

    let dels = document.getElementsByClassName("button-delete");
    Array.from(dels).forEach(del => {
        del.addEventListener("click", function() { showDeleteModal(this); });
    })

    document.getElementById("addButton").addEventListener("click", function() { showAddEditModal(this); });

    document.getElementById("switch-to-chat").addEventListener("click", switchToChat);
});

function showAddEditModal(callerButton) {
    document.getElementById("modal-h2").innerHTML = "Add student";
    document.getElementById("button-confirm-add-edit").innerHTML = "Create";
    let student = {
        studentid : "",
        group : 1,
        fname : "",
        lname : "",
        gender : 1,
        birthday : new Date().toISOString().split("T")[0],
    };

    let studentid = callerButton.dataset.studentid;
    if (studentid != "") {
        document.getElementById("modal-h2").innerHTML = "Edit student";
        document.getElementById("button-confirm-add-edit").innerHTML = "Save";

        let row = callerButton.parentNode.parentNode;

        student = {
            studentid : studentid,
            group : row.cells[1].dataset.group,
            fname : row.cells[2].dataset.fname,
            lname : row.cells[2].dataset.lname,
            gender : row.cells[3].dataset.gender,
            birthday : row.cells[4].dataset.birthday
        };
    }

    let form = document.getElementById("form-add-edit");
    form.elements["studentid"].value = student.studentid;
    form.elements["group"].value = student.group;
    form.elements["fname"].value = student.fname;
    form.elements["lname"].value = student.lname;
    form.elements["gender"].value = student.gender;    
    form.elements["birthday"].value = student.birthday;

    document.getElementById("modal-add-edit").style.display='block';
}

function submitAddEdit() {
    document.getElementById("fname-error").innerHTML = "";
    document.getElementById("lname-error").innerHTML = "";

    let form = document.getElementById("form-add-edit");

    let student = {
        studentid : form.elements["studentid"].value,
        group : form.elements["group"].value,
        fname : form.elements["fname"].value,
        lname : form.elements["lname"].value,
        gender : form.elements["gender"].value,
        birthday : form.elements["birthday"].value
    };
    
    let url = "php/server/add_edit.php";
    let submit = formAddEditSubmit(student);
    sendSubmit(url, submit, fillRow);
}

function formAddEditSubmit(student) {
    let submit = "";    
    for (const [key, value] of Object.entries(student)) {
        submit += `${key}=${value}&`;
    }
    submit.slice(-1, 0);
    return submit;
}

function showDeleteModal(callerButton) {
    let studentid = callerButton.dataset.studentid;
    let del = document.getElementById("button-confirm-delete");
    del.dataset.studentid = studentid;

    let table = document.getElementById("student-table-body");
    let name = table.querySelector(`[data-studentid="${studentid}"]`).cells[2].innerHTML;

    name = "Are you sure you want to delete " + name + " ?";
    document.getElementById("modal-delete-name").innerHTML = name;

    document.getElementById("modal-delete").style.display="block";
}

function submitDelete(callerButton) {
    let url = "php/server/delete.php";
    let submit = formDeleteSubmit(callerButton.dataset.studentid);
    sendSubmit(url, submit, deleteRow);
}

function formDeleteSubmit(studentid) {
    return "studentid=" + studentid;
}

function sendSubmit(url, submit, respFunction) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            handleResponse(response, respFunction);
        }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(submit);
}

function handleResponse(response, respFunction) {
    if (response.status == false) {
                  
        for (let error of response.errors) {
            switch (error.code) {
                case 100: document.getElementById("fname-error").innerHTML = error.message; break;
                case 101: document.getElementById("lname-error").innerHTML = error.message; break;
                case 201: 
                    document.getElementById("modal-add-edit").style.display='none';
                    document.getElementById("modal-delete").style.display='none';
                    document.getElementById("db-error").innerHTML = error.message;
                    document.getElementById("modal-alert").style.display='block'; break;
                default:
                    document.getElementById("db-error").innerHTML = error.message;
                    document.getElementById("modal-alert").style.display='block';
            }
        }
    }
    else {
        respFunction(response.student);
    }
}

function fillRow(student) {
    let form = document.getElementById("form-add-edit");
    if (form.elements["studentid"].value == "") addRow(student.studentid);

    let table = document.getElementById("student-table-body");
    let row = table.querySelector(`[data-studentid="${student.studentid}"]`);

    row.cells[1].dataset.group = student.group;
    row.cells[1].innerHTML = document.getElementById("group").options.item(row.cells[1].dataset.group - 1).text;

    row.cells[2].dataset.fname = student.fname;
    row.cells[2].dataset.lname = student.lname;
    row.cells[2].innerHTML = row.cells[2].dataset.fname + " " + row.cells[2].dataset.lname;

    row.cells[3].dataset.gender = student.gender;
    row.cells[3].innerHTML = document.getElementById("gender").options.item(row.cells[3].dataset.gender - 1).text;

    row.cells[4].dataset.birthday = student.birthday;
    row.cells[4].innerHTML = dateConvertToUA(row.cells[4].dataset.birthday);
    
    document.getElementById("modal-add-edit").style.display='none';
    document.getElementById("modal-delete").style.display='none';
    
    updateCheckboxes(null);
}

function dateConvertToUA(dateISO) {    
    let bday = new Date(dateISO);
    return bday.toLocaleDateString("uk-UA");
}

function addRow(id) {
    let table = document.getElementById("student-table-body");
    let row = table.insertRow();
    row.dataset.studentid = id;
    
    let cell = row.insertCell(0);
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "table-checkbox";
    checkbox.addEventListener("change", function() { updateCheckboxes(this); });
    cell.appendChild(checkbox);

    cell = row.insertCell(1);
    cell = row.insertCell(2);
    cell = row.insertCell(3);
    cell = row.insertCell(4);

    cell = row.insertCell(5);
    let statusIcon = document.createElement("div");
    statusIcon.innerHTML = '<i class="fa-solid fa-circle icon-status"></i>';
    statusIcon.addEventListener("click", function() { changeStatus(this); });
    statusIcon.dataset.status = 0;
    statusIcon.style.color = "lightgray";
    cell.appendChild(statusIcon);
    
    cell = row.insertCell(6);
    let editButton = document.createElement("div");
    editButton.className = "button button-edit";
    editButton.innerHTML = '<i class="fa-solid fa-pencil icon-edit"></i>';
    editButton.addEventListener("click", function() { showAddEditModal(this); });
    editButton.dataset.studentid = id;
    cell.appendChild(editButton);

    let deleteButton = document.createElement("div");
    deleteButton.className = "button button-delete";    
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can icon-delete"></i>';
    deleteButton.addEventListener("click", function() { showDeleteModal(this); });
    deleteButton.dataset.studentid = id;
    cell.appendChild(deleteButton);
}

function deleteRow(student) {
    let table = document.getElementById("studentTable");
    let row = table.querySelector(`[data-studentid="${student.studentid}"]`);
    
    row.parentNode.removeChild(row);

    document.getElementById("modal-delete").style.display='none';
    updateCheckboxes(null);
}

function changeStatus(callerButton) {
    if (callerButton.dataset.status == 0) {
        callerButton.dataset.status = 1;
        callerButton.style.color = "green";
    }
    else {
        callerButton.dataset.status = 0;
        callerButton.style.color = "lightgray";
    }
}

function closeModal(modalButton) {
    modalButton.parentNode.parentNode.parentNode.style.display = "none";
    document.getElementById("fname-error").innerHTML = "";
    document.getElementById("lname-error").innerHTML = "";
}

function updateCheckboxes(caller) {
    let checkboxes = Array.from(document.getElementsByClassName("table-checkbox"));
    let head = document.getElementById("head-checkbox");
    
    if (caller === head) {
        checkboxes.forEach(checkbox => {
            checkbox.checked = head.checked;
        });
        
        return;
    }

    let checkedCount = 0;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked == true && checkbox !== head) {
            checkedCount++;
        }
    });

    head.indeterminate = false;
    head.checked = false;
    switch (checkedCount) {
        case checkboxes.length - 1:
            head.checked = true;
            break;
        case 0: break;
        default:
            head.indeterminate = true;
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

function switchToChat() {
    window.location = "chat.php";
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/sw.js")
        .then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, 
        function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}