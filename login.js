document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        parent.showDashboard(email);
    } catch (error) {
        console.error(error);
        alert('Ошибка при входе');
    }
});
