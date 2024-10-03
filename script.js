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
const db = getDatabase(app);

let currentUser;

document.addEventListener('DOMContentLoaded', function() {
    // Функция для создания структуры базы данных
    function createDatabaseStructure() {
        const usersRef = ref(db, 'users/');
        const gradesRef = ref(db, 'grades/');

        // Создаем папки пользователей и оценок
        set(usersRef, {});
        set(gradesRef, {});

        console.log('Структура базы данных успешно создана.');
    }

    // Обработка формы входа/регистрации
    document.getElementById('auth-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        try {
            await createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    currentUser = userCredential.user;
                    saveUserToDatabase(email, role);
                    showDashboardPage();
                });
        } catch (error) {
            console.error(error);
            alert('Ошибка при регистрации');
        }
    });

    // Функция для сохранения пользователя в базе данных
    function saveUserToDatabase(email, role) {
        const usersRef = ref(db, 'users/' + currentUser.uid);
        set(usersRef, {
            email,
            role,
            createdAt: new Date()
        });
    }

    // Функция для отображения страницы Dashboard
    function showDashboardPage() {
        document.querySelector('.page.active').classList.remove('active');
        document.getElementById('dashboard-page').classList.add('active');

        // Здесь можно добавить логику для отображения интерфейса учителя или ученика
        // в зависимости от выбранной роли
    }

    // Вызываем функцию для создания структуры базы данных при загрузке страницы
    createDatabaseStructure();

    // Добавляем обработчик для кнопки авторизации
    document.getElementById('auth-button').addEventListener('click', () => {
        document.querySelector('.page.active').classList.remove('active');
        document.getElementById('auth-page').classList.add('active');
    });
});
