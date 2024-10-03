let currentUser;

document.addEventListener('DOMContentLoaded', function() {
    // Функция для создания структуры файлов
    function createFilesStructure() {
        if (!checkFileExists('users.txt')) {
            createFileSync('users.txt', '{}');
        }
        if (!checkFileExists('grades.txt')) {
            createFileSync('grades.txt', '{}');
        }
        console.log('Структура файлов успешно создана.');
    }

    // Функция для проверки существования файла
    function checkFileExists(filename) {
        return fs.existsSync(filename);
    }

    // Функция для синхронного создания файла
    function createFileSync(filename, content) {
        fs.writeFileSync(filename, content);
    }

    // Обработка формы входа/регистрации
    document.getElementById('auth-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const login = document.getElementById('login').value;
        const password = document.getElementById('password');
        const role = document.getElementById('role');

        // Проверяем существование пользователя в файле users.txt
        let usersData = '';
        try {
            usersData = readFileSync('users.txt', 'utf8');
        } catch (error) {
            console.error("Ошибка при чтении файла:", error);
            alert("Произошла ошибка при попытке доступа к файлу.");
            return;
        }

        const userData = JSON.parse(usersData);

        if (userData[login]) {
            if (userData[login].password === password && userData[login].role === role.value) {
                currentUser = { login, role: userData[login].role };
                saveUserData(login);
                showDashboardPage();
            } else {
                alert("Неверный пароль или роль");
            }
        } else {
            alert("Пользователь не найден");
        }
    });

    // Функция для сохранения данных пользователя в файл users.txt
    function saveUserData(login) {
        let usersData = readFileSync('users.txt', 'utf8');
        let userData = JSON.parse(usersData);

        if (!userData[login]) {
            userData[login] = {
                password: document.getElementById('password').value,
                role: document.getElementById('role').value,
                createdAt: new Date()
            };
        }

        try {
            fs.writeFileSync('users.txt', JSON.stringify(userData));
            console.log(`Данные пользователя ${login} успешно сохранены.`);
        } catch (error) {
            console.error("Ошибка при записи файла:", error);
            alert("Произошла ошибка при попытке записи в файл.");
        }
    }

    // Функция для отображения страницы Dashboard
    function showDashboardPage() {
        document.querySelector('.page.active').classList.remove('active');
        document.getElementById('dashboard-page').classList.add('active');

        // Здесь можно добавить логику для отображения интерфейса
    }

    // Вызываем функцию для создания структуры файлов при загрузке страницы
    createFilesStructure();

    // Добавляем обработчик для кнопки авторизации
    document.getElementById('auth-button').addEventListener('click', () => {
        document.querySelector('.page.active').classList.remove('active');
        document.getElementById('auth-page').classList.add('active');
    });
});
