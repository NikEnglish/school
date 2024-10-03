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
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;

        try {
            await signInWithEmailAndPassword(auth, login, password)
                .then((userCredential) => {
                    currentUser = userCredential.user;
                    saveUserData(userCredential.user.uid);
                    showDashboardPage();
                })
                .catch((error) => {
                    console.error("Ошибка:", error.message);
                    alert("Неверный логин или пароль");
                });
        } catch (error) {
            console.error(error);
            alert('Ошибка при входе');
        }
    });

    // Функция для сохранения данных пользователя в базе данных
    function saveUserData(userId) {
        const usersRef = ref(db, 'users/' + userId);
        set(usersRef, {
            login: document.getElementById('login').value,
            password: document.getElementById('password').value,
            createdAt: new Date()
        });
    }

    // Функция для отображения страницы Dashboard
    function showDashboardPage() {
        document.querySelector('.page.active').classList.remove('active');
        document.getElementById('dashboard-page').classList.add('active');

        // Здесь можно добавить логику для отображения интерфейса
    }

    // Вызываем функцию для создания структуры базы данных при загрузке страницы
    createDatabaseStructure();

    // Добавляем обработчик для кнопки авторизации
    document.getElementById('auth-button').addEventListener('click', () => {
        document.querySelector('.page.active').classList.remove('active');
        document.getElementById('auth-page').classList.add('active');
    });
});
