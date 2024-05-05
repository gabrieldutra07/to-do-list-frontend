const findName = () => {
    const userName = localStorage.getItem('nameUser');
    if (userName) {
        document.getElementById('welcomeText').innerHTML += ' ' + userName;
    }
}

const changePage = (id, page) => {
    document.getElementById(id).addEventListener('click', function (event) {
        window.location.href = page;
    });
}

const setLocalStorage = (key, value) => {
    localStorage.setItem(key, value)
}

const validateIsAuth = () => {
    const isAuth = localStorage.getItem("isAuth")

    if (!isAuth) {
        window.location.href = 'index.html'
    }
}

const validatePassword = () => {
    const password = document.getElementById("password").value

    console.log(password)

    if (password.length < 8) {
        document.getElementById("password-incorrect").removeAttribute("hidden")
        return true
    }
}

const createList = () => {
   
    const id = localStorage.getItem("id")
    const title = document.getElementById("criarList").value

    var data = JSON.stringify({
        "userId": id,
        "title": title
    });
    
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            alert("Lista criada com sucesso!")
            document.getElementById("textList").setAttribute("hidden", true)
            document.getElementById("criarList").setAttribute("hidden", true)
            document.getElementById("confirmCreate").setAttribute("hidden", true)
            getList(id)
        }
    });
    
    xhr.open("POST", "http://localhost:8080/api/todolist/list/create");
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.send(data);
}

const createUser = () => {
    const email = document.getElementById("username").value
    const password = document.getElementById("password").value
    const nameUser = document.getElementById("nameuser").value

    if (validatePassword()) {
        return
    }

    var data = JSON.stringify({
        "email": email,
        "password": password,
        "nameUser": nameUser

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

const login = () => {
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
            if (this.status === 200) {
                const response = JSON.parse(this.responseText);
                setLocalStorage("id", response.id)
                setLocalStorage("nameUser", response.nameUser)
                setLocalStorage("isAuth", true)
                window.location.href = 'list.html'
            } else if (this.status === 404) {
                document.getElementById("login-incorrect").removeAttribute("hidden")
            }
        }
    });

    xhr.open("POST", "http://localhost:8080/api/todolist/user/login");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}

function preencherTabela(data) {
    var tableBody = document.getElementById("tableBody");

    tableBody.innerHTML = ""

    data.forEach(function(item) {
        var row = document.createElement("tr");
        var titleCell = document.createElement("td");
        var dateCell = document.createElement("td");

        titleCell.textContent = item.title;
        dateCell.textContent = new Date(item.dateCreated).toLocaleDateString('pt-BR');

        row.appendChild(titleCell);
        row.appendChild(dateCell);

        tableBody.appendChild(row);
    });
}

const getList = (id) => {

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var responseData = JSON.parse(this.responseText);
                // Chamar a função para preencher a tabela com os dados recebidos
            preencherTabela(responseData);
        }
    });

    xhr.open("GET", "http://localhost:8080/api/todolist/list/get?userId="+ id +"")

    xhr.send();
}
