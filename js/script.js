function validateIsAuth() {
    const isAuth = localStorage.getItem("isAuth")

    if(!isAuth) {
        window.location.href = 'index.html'
    }
}

function createUser() {
    const email = document.getElementById("username").value
    const password = document.getElementById("password").value
    var data = JSON.stringify({
        "email": email,
        "password": password
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (this.status === 201) {
                alert("Cadastro realizado com sucesso!")
                window.location.href = 'index.html'
            }
            console.log(this.responseText);
        }
    });

    xhr.open("POST", "http://localhost:8080/api/todolist/user/create");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}

function login() {
    const email = document.getElementById("username").value
    const password = document.getElementById("password").value
    var data = JSON.stringify({
        "email": email,
        "password": password
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if(this.status === 200) {
                window.location.href = 'to-do-list.html'
                localStorage.setItem("isAuth", true)
            } else if (this.status === 404) {
                document.getElementById("login-incorrect").removeAttribute("hidden")
            }
            console.log(this.responseText);
        }
    });

    xhr.open("POST", "http://localhost:8080/api/todolist/user/login");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}