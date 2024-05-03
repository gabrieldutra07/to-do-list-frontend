document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!username || !password) {
        alert('Por favor, preencha todos os campos.');
    } else {
        alert('Login realizado com sucesso!');
        // Aqui você pode adicionar mais lógica, como redirecionar para outra página
    }
});
