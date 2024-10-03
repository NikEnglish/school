let currentUser;

const path = require('path');

function getFilePath(filename) {
    return path.join(__dirname, filename);
}

// Пример использования
const usersPath = getFilePath('users.txt');
const gradesPath = getFilePath('grades.txt');

// Использование в функциях
function createFilesStructure() {
    const usersPath = getFilePath('users.txt');
    const gradesPath = getFilePath('grades.txt');

    if (!checkFileExists(usersPath)) {
        try {
            fs.writeFileSync(usersPath, '');
            console.log('Файл users.txt успешно создан.');
        } catch (error) {
            console.error("Ошибка при создании файла users.txt:", error);
            alert("Не удалось создать файл users.txt. Проверьте права доступа.");
            return;
        }
    }

    if (!checkFileExists(gradesPath)) {
        try {
            fs.writeFileSync(gradesPath, '{}');
            console.log('Файл grades.txt успешно создан.');
        } catch (error) {
            console.error("Ошибка при создании файла grades.txt:", error);
            alert("Не удалось создать файл grades.txt. Проверьте права доступа.");
            return;
        }
    }

    console.log('Структура файлов успешно создана.');
}

// Другие функции...


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

        const lines = usersData.split('\n');
        let userData = {};

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes(':')) {
                const [key, value] = line.split(':');
                userData[key.trim()] = value.trim();
            }
        }

        if (userData.login === login) {
            if (userData.password === password && userData.role === role.value) {
                currentUser = { login, role: userData.role };
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
        const lines = usersData.split('\n');

        let userData = {};
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes(':')) {
                const [key, value] = line.split(':');
                userData[key.trim()] = value.trim();
            }
        }

        userData.login = login;
        userData.password = document.getElementById('password').value;
        userData.role = document.getElementById('role').value;

        let updatedUsersData = '';
        for (const key in userData) {
            updatedUsersData += `${key}:${userData[key]}\n`;
        }

        try {
            fs.writeFileSync('users.txt', updatedUsersData);
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
