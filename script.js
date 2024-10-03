// Import necessary Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBAFDDqbYXjlpNW3UtMvCwA2M-bO9FsCNg",
    authDomain: "school-bf2ca.firebaseapp.com",
    projectId: "school-bf2ca",
    storageBucket: "school-bf2ca.appspot.com",
    messagingSenderId: "639707992069",
    appId: "1:639707992069:web:575f6b016b474d77760c6c",
    measurementId: "G-9B1J98D47F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser;

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    document.querySelectorAll('#login-tab, #register-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelector('.active').classList.remove('active');
            tab.classList.add('active');
            document.getElementById('login-container').style.display = tab.id === 'login-tab' ? '' : 'none';
            document.getElementById('register-container').style.display = tab.id === 'register-tab' ? '' : 'none';
        });
    });

    // Login functionality
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            currentUser = auth.currentUser;
            showDashboard(currentUser.email);
        } catch (error) {
            console.error(error);
            alert('Ошибка при входе');
        }
    });

    // Register functionality
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
            currentUser = userCredential.user;
            showDashboard(email);
        } catch (error) {
            console.error(error);
            alert('Ошибка при регистрации');
        }
    });
});

function showDashboard(email) {
    document.getElementById('auth-section').style.display = 'none';
    const dashboardDiv = document.getElementById('dashboard');

    getDocs(collection(db, 'users')).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.data().email === email) {
                const userData = doc.data();
                if (userData.role === 'teacher') {
                    showTeacherDashboard(userData);
                } else {
                    showStudentDashboard(userData);
                }
            }
        });
    });
}

// Teacher dashboard
function showTeacherDashboard(userData) {
    const html = `
        <h2>Привет, ${userData.fullName}!</h2>
        <button id="add-grade-btn">Добавить оценку</button>
        <table id="gradebook">
            <thead>
                <tr>
                    <th>Ученик</th>
                    <th>Предмет</th>
                    <th>Оценка</th>
                </tr>
            </thead>
            <tbody id="gradebook-body">
                <!-- Grades will be added here -->
            </tbody>
        </table>
    `;
    dashboardDiv.innerHTML = html;

    // Add event listener for adding grades
    document.getElementById('add-grade-btn').addEventListener('click', () => {
        const studentEmail = prompt("Введите email ученика:");
        const subject = prompt("Введите предмет:");
        const grade = prompt("Введите оценку:");

        if (studentEmail && subject && grade) {
            addDoc(collection(db, 'grades'), {
                studentEmail,
                teacherEmail: currentUser.email,
                subject,
                grade
            }).then(() => {
                alert('Оценка добавлена!');
                updateGradebook();
            });
        }
    });

    updateGradebook();
}

// Update gradebook table
function updateGradebook() {
    const gradebookBody = document.getElementById('gradebook-body');
    gradebookBody.innerHTML = '';

    getDocs(collection(db, 'grades')).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const gradeData = doc.data();
            if (gradeData.teacherEmail === currentUser.email) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${gradeData.studentEmail}</td>
                    <td>${gradeData.subject}</td>
                    <td>${gradeData.grade}</td>
                `;
                gradebookBody.appendChild(row);
            }
        });
    });
}

// Student dashboard
function showStudentDashboard(userData) {
    const html = `
        <h2>Привет, ${userData.fullName}!</h2>
        <table id="student-gradebook">
            <thead>
                <tr>
                    <th>Предмет</th>
                    <th>Оценка</th>
                </tr>
            </thead>
            <tbody id="student-gradebook-body">
                <!-- Grades will be added here -->
            </tbody>
        </table>
    `;
    dashboardDiv.innerHTML = html;

    updateStudentGrades();
}

// Update student grades table
function updateStudentGrades() {
    const studentGradebookBody = document.getElementById('student-gradebook-body');
    studentGradebookBody.innerHTML = '';

    getDocs(collection(db, 'grades')).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const gradeData = doc.data();
            if (gradeData.studentEmail === currentUser.email) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${gradeData.subject}</td>
                    <td>${gradeData.grade}</td>
                `;
                studentGradebookBody.appendChild(row);
            }
        });
    });
}
