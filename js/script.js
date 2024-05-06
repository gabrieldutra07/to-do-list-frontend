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

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            alert("Lista criada com sucesso!")
            document.getElementById("textList").setAttribute("hidden", true)
            document.getElementById("criarList").setAttribute("hidden", true)
            document.getElementById("confirmCreate").setAttribute("hidden", true)
            getList(id, true)
        }
    });

    xhr.open("POST", "http://localhost:8080/api/todolist/list/create");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}


const createTask = () => {

    const listId = document.getElementById("listaSelecao").value
    const description = document.getElementById("criarTask").value
    const completedTask = document.getElementById("selectCompletedTask").value

    console.log(description)

    var data = JSON.stringify({
        "listId": listId,
        "description": description,
        "complete": completedTask
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            alert("Tarefa criada com sucesso!")
            document.getElementById("descriptionTask").setAttribute("hidden", true)
            document.getElementById("completedTask").setAttribute("hidden", true)
            document.getElementById("selectCompletedTask").setAttribute("hidden", true)
            document.getElementById("confirmCreateTask").setAttribute("hidden", true)
            document.getElementById("criarTask").setAttribute("hidden", true)
            handleSelecaoChange()
        }
    });

    xhr.open("POST", "http://localhost:8080/api/todolist/task/create");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}

const formatCompleted = (data) => {
    if (data) {
        return "Sim"
    }

    return "Não"
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

const preencherTabelaList = (data) => {
    var tableBody = document.getElementById("tableBody");

    tableBody.innerHTML = "";

    if (data.length === 0) {
        var row = document.createElement("tr");
        var noDataCell = document.createElement("td");
        noDataCell.colSpan = 3;
        noDataCell.textContent = "Nenhuma informação encontrada";
        row.appendChild(noDataCell);
        tableBody.appendChild(row);
    } else {

        data.forEach(function (item) {
            var row = document.createElement("tr");
            var titleCell = document.createElement("td");
            titleCell.textContent = item.title;

            var dateCell = document.createElement("td");
            dateCell.textContent = new Date(item.dateCreated).toLocaleDateString('pt-BR');

            var actionCell = document.createElement("td");

            var editButton = document.createElement("button");
            editButton.innerHTML = "🖊";
            editButton.className = "action-button";
            editButton.onclick = function () {
                let textList = document.getElementById("textList")
                let criarList = document.getElementById("criarList")
                let editLista = document.getElementById("editCreate")
                textList.removeAttribute("hidden")
                criarList.removeAttribute("hidden")
                criarList.value = item.title
                setLocalStorage("listId", item.id)
                editLista.removeAttribute("hidden")
            };

            var deleteButton = document.createElement("button");
            deleteButton.innerHTML = "🗑";
            deleteButton.className = "action-button";
            deleteButton.onclick = function () {
                deleteList(item.id)
            };

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);

            row.appendChild(titleCell);
            row.appendChild(dateCell);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });
    }
}

const editList = () => {

    const edit = document.getElementById("criarList").value

    var data = JSON.stringify({
        "title": edit
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            alert("Lista editada com sucesso!")
            localStorage.removeItem("listId")
            document.getElementById("textList").setAttribute("hidden", true)
            document.getElementById("criarList").setAttribute("hidden", true)
            document.getElementById("editCreate").setAttribute("hidden", true)
            getList(localStorage.getItem("id"), true)
        }
    });

    xhr.open("PUT", "http://localhost:8080/api/todolist/list/edit?listId=" + localStorage.getItem("listId") + "");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}

const preencherTabelaTask = (data) => {
    var tableBody = document.getElementById("tableBodyTask");

    tableBody.innerHTML = ""
    if (data.length === 0) {
        var row = document.createElement("tr");
        var noDataCell = document.createElement("td");
        noDataCell.colSpan = 3; // Spanning all three columns
        noDataCell.textContent = "Nenhuma informação encontrada";
        row.appendChild(noDataCell);
        tableBody.appendChild(row);
    } else {

        data.forEach(function (item) {
            var row = document.createElement("tr");
            var descriptionCell = document.createElement("td");
            var completeCell = document.createElement("td");

            descriptionCell.textContent = item.description;
            completeCell.textContent = formatCompleted(item.complete)

            var actionCell = document.createElement("td");

            var editButton = document.createElement("button");
            editButton.className = "action-button";
            editButton.innerHTML = "🖊";
            editButton.onclick = function () {
                let inputTask = document.getElementById("criarTask")
                inputTask.removeAttribute("hidden")
                inputTask.value = item.description
                let buttonTask = document.getElementById("editTask")
                buttonTask.removeAttribute("hidden")
                document.getElementById("descriptionTask").removeAttribute("hidden")
                buttonTask.addEventListener("click", function () {
                    item.description = inputTask.value
                    editTask(item)
                })

            };

            var deleteButton = document.createElement("button");
            deleteButton.className = "action-button";
            deleteButton.innerHTML = "🗑";
            deleteButton.onclick = function () {
                var id = item.listId
                deleteTask(item.id)
                getTask(id)
            };

            var completeButton = document.createElement("button");
            completeButton.innerHTML = "✔️";
            completeButton.className = "action-button";
            completeButton.onclick = function () {
                item.complete = true;
                completeTask(item)
                alert("Tarefa concluída com sucesso!")
                console.log(item.listId)
                getTask(item.listId)
            };

            actionCell.appendChild(completeButton);
            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);

            row.appendChild(descriptionCell);
            row.appendChild(completeCell);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });
    }
}

const getList = (id, isList) => {

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var responseData = JSON.parse(this.responseText);
            if (isList) {
                preencherTabelaList(responseData);
            } else {
                preencherSelect(responseData)
            }

        }
    });

    xhr.open("GET", "http://localhost:8080/api/todolist/list/get?userId=" + id + "")

    xhr.send();
}

const deleteList = (listId) => {

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (this.status === 204) {
                alert("Lista excluída com sucesso!")
                getList(localStorage.getItem("id"), true)
            } else if (this.status === 400) {
                var response = JSON.parse(this.responseText)
                alert(response.message)
            }
        }
    });

    xhr.open("DELETE", "http://localhost:8080/api/todolist/list/delete?listId=" + listId + "");

    xhr.send();
}

const deleteTask = (taskId) => {

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            alert("Tarefa excluída com sucesso!")
        }
    });

    xhr.open("DELETE", "http://localhost:8080/api/todolist/task/delete?taskId=" + taskId + "");

    xhr.send();
}

const getTask = (listId) => {

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var responseData = JSON.parse(this.responseText);

            preencherTabelaTask(responseData);
        }
    });

    xhr.open("GET", "http://localhost:8080/api/todolist/task/get?listId=" + listId + "")

    xhr.send();
}

const preencherSelect = (dados) => {
    const select = document.getElementById("listaSelecao");

    select.innerHTML = "";

    const optionPadrao = document.createElement("option");
    optionPadrao.text = "Selecione uma opção";
    select.add(optionPadrao);

    dados.forEach(function (item) {
        const option = document.createElement("option");
        option.value = item.id;
        option.text = item.title;
        select.add(option);
    });
}

const handleSelecaoChange = () => {
    const select = document.getElementById("listaSelecao");
    getTask(select.value);

}

const editTask = (task) => {
    var data = JSON.stringify({
        "description": task.description,
        "complete": task.complete,
        "listId": task.listId
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            alert("Tarefa editada com sucesso!")
            document.getElementById("descriptionTask").setAttribute("hidden", true)
            document.getElementById("criarTask").setAttribute("hidden", true)
            document.getElementById("editTask").setAttribute("hidden", true)
            getTask(task.listId)
        }
    });

    xhr.open("PUT", "http://localhost:8080/api/todolist/task/edit?taskId=" + task.id + "");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}