// Инициализация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBAFDDqbYXjlpNW3UtMvCwA2M-bO9FsCNg",
    authDomain: "school-bf2ca.firebaseapp.com",
    projectId: "school-bf2ca",
    storageBucket: "school-bf2ca.appspot.com",
    messagingSenderId: "639707992069",
    appId: "1:639707992069:web:575f6b016b474d77760c6c",
    measurementId: "G-9B1J98D47F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentUser;

document.addEventListener('DOMContentLoaded', function() {
    // Обработка формы входа/регистрации
    document.getElementById('auth-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        try {
            await signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    currentUser = userCredential.user;
                    showDashboardPage();
                });
        } catch (error) {
            console.error(error);
            alert('Ошибка при входе или регистрации');
        }
    });

    // Функция для отображения страницы Dashboard
    function showDashboardPage() {
        document.querySelector('.page.active').classList.remove('active');
        document.getElementById('dashboard-page').classList.add('active');

        // Здесь можно добавить логику для отображения интерфейса учителя или ученика
        // в зависимости от выбранной роли
    }
});
