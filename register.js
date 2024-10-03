document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('role').value;
    const fullName = document.getElementById('fullName').value;
    const classNumber = document.getElementById('classNumber').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await addDoc(collection(db, 'users'), {
            email,
            role,
            fullName,
            classNumber
        });
        parent.showDashboard(email);
    } catch (error) {
        console.error(error);
        alert('Ошибка при регистрации');
    }
});
