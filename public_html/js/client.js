let socket = io.connect(window.location.origin);

let UserName = document.getElementById("UserName");
let message = document.getElementById("message");
let send = document.getElementById("send");
let innerDiv = document.querySelector(".chats");
let output = document.querySelector(".output");
message.disabled = true;

UserName.onkeyup = function() {
    if (this.value != "") {
        message.disabled = false;
    } else {
        message.disabled = true;
    }
}

send.onclick = function() {;
    let datas = {
        UserName: UserName.value,
        message: message.value
    };
    localStorage.setItem("UserName", UserName.value);
    socket.emit("message", datas);
    output.innerHTML = "";
    message.value = "";
}

socket.on("New_Message", function(data) {
    innerDiv.innerHTML += `
        <div class="chat">
            <span>${data.UserName}</span>
            <p>${data.message}</p>
        </div>
    `;
    output.innerHTML = "";
})

message.onkeypress = function() {
    socket.emit("broadcast", {
        UserName: UserName.value
    });
}

socket.on("New_broadcast", function(data) {
    output.innerHTML = `<div class="wait"> <strong>${data.UserName}</strong> write message <img src="images/write.gif "></div>`;
});

window.onload = function() {
    fetch("js/fakeData.json")
        .then(function(resp) {
            return resp.json()
        })
        .then(function(data) {
            for (let i = 0; i < data.length; i++) {
                innerDiv.innerHTML += `
                    <div class="chat">
                        <span>${data[i].UserName}</span>
                        <p>${data[i].message}</p>
                    </div>
                `;
            }
        })
    if (localStorage.length > 0) {
        UserName.value = localStorage.getItem("UserName");
        message.disabled = false;
    } else {
        UserName.value = "";
        message.disabled = true;
    }
}