// ==========================================
// SMART ATTENDANCE SYSTEM
// ==========================================


// Default student data
let students = [
    {
        id: 1,
        name: "Rahul Kumar",
        roll: "101",
        status: "Pending"
    },

    {
        id: 2,
        name: "Priya Sharma",
        roll: "102",
        status: "Pending"
    },

    {
        id: 3,
        name: "Arjun Singh",
        roll: "103",
        status: "Pending"
    },

    {
        id: 4,
        name: "Sneha Patil",
        roll: "104",
        status: "Pending"
    }
];


// ==========================================
// DOM ELEMENTS
// ==========================================

const studentTable = document.getElementById("studentTable");

const totalStudents =
    document.getElementById("totalStudents");

const presentStudents =
    document.getElementById("presentStudents");

const absentStudents =
    document.getElementById("absentStudents");

const attendanceRate =
    document.getElementById("attendanceRate");

const searchInput =
    document.getElementById("searchInput");

const studentModal =
    document.getElementById("studentModal");

const openModalBtn =
    document.getElementById("openModalBtn");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const studentForm =
    document.getElementById("studentForm");

const markAllBtn =
    document.getElementById("markAllBtn");

const emptyMessage =
    document.getElementById("emptyMessage");


// ==========================================
// DATE
// ==========================================

function displayDate() {

    const today = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    document.getElementById("currentDate").textContent =
        today.toLocaleDateString("en-US", options);
}

displayDate();


// ==========================================
// DISPLAY STUDENTS
// ==========================================

function displayStudents(list = students) {

    studentTable.innerHTML = "";

    if (list.length === 0) {

        emptyMessage.style.display = "block";

        return;
    }

    emptyMessage.style.display = "none";


    list.forEach((student, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>
                ${index + 1}
            </td>

            <td>
                <strong>${student.name}</strong>
            </td>

            <td>
                ${student.roll}
            </td>

            <td>

                <span class="status ${student.status.toLowerCase()}">
                    ${getStatusIcon(student.status)}
                    ${student.status}
                </span>

            </td>

            <td>

                <div class="action-buttons">

                    <button
                        class="action-btn present-btn"
                        onclick="markPresent(${student.id})">

                        ✓ Present

                    </button>


                    <button
                        class="action-btn absent-btn"
                        onclick="markAbsent(${student.id})">

                        ✕ Absent

                    </button>


                    <button
                        class="action-btn delete-btn"
                        onclick="deleteStudent(${student.id})">

                        🗑 Delete

                    </button>

                </div>

            </td>

        `;

        studentTable.appendChild(row);
    });
}


// ==========================================
// STATUS ICON
// ==========================================

function getStatusIcon(status) {

    if (status === "Present") {
        return "✓";
    }

    if (status === "Absent") {
        return "✕";
    }

    return "•";
}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    const total = students.length;

    const present = students.filter(
        student => student.status === "Present"
    ).length;

    const absent = students.filter(
        student => student.status === "Absent"
    ).length;


    let percentage = 0;

    if (total > 0) {

        percentage =
            Math.round((present / total) * 100);
    }


    totalStudents.textContent = total;

    presentStudents.textContent = present;

    absentStudents.textContent = absent;

    attendanceRate.textContent =
        percentage + "%";
}


// ==========================================
// MARK PRESENT
// ==========================================

function markPresent(id) {

    const student = students.find(
        student => student.id === id
    );

    if (student) {

        student.status = "Present";
    }

    displayStudents();

    updateDashboard();

    saveData();
}


// ==========================================
// MARK ABSENT
// ==========================================

function markAbsent(id) {

    const student = students.find(
        student => student.id === id
    );

    if (student) {

        student.status = "Absent";
    }

    displayStudents();

    updateDashboard();

    saveData();
}


// ==========================================
// DELETE STUDENT
// ==========================================

function deleteStudent(id) {

    const confirmation =
        confirm("Are you sure you want to delete this student?");

    if (!confirmation) {
        return;
    }


    students = students.filter(
        student => student.id !== id
    );


    displayStudents();

    updateDashboard();

    saveData();
}


// ==========================================
// MARK ALL PRESENT
// ==========================================

markAllBtn.addEventListener("click", function () {

    if (students.length === 0) {
        alert("No students available.");
        return;
    }


    students.forEach(student => {

        student.status = "Present";

    });


    displayStudents();

    updateDashboard();

    saveData();
});


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener("input", function () {

    const searchText =
        searchInput.value.toLowerCase().trim();


    const filteredStudents =
        students.filter(student =>

            student.name
                .toLowerCase()
                .includes(searchText)

            ||

            student.roll
                .toLowerCase()
                .includes(searchText)

        );


    displayStudents(filteredStudents);
});


// ==========================================
// OPEN MODAL
// ==========================================

openModalBtn.addEventListener("click", function () {

    studentModal.classList.add("show");

    document.getElementById("name").focus();
});


// ==========================================
// CLOSE MODAL
// ==========================================

function closeModal() {

    studentModal.classList.remove("show");

    studentForm.reset();
}


closeModalBtn.addEventListener(
    "click",
    closeModal
);

cancelBtn.addEventListener(
    "click",
    closeModal
);


// Close when clicking outside
studentModal.addEventListener("click", function (event) {

    if (event.target === studentModal) {

        closeModal();
    }
});


// ==========================================
// ADD STUDENT
// ==========================================

studentForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();

    const roll =
        document.getElementById("roll").value.trim();


    if (name === "" || roll === "") {

        alert("Please fill all fields.");

        return;
    }


    // Check duplicate roll number

    const duplicate =
        students.some(student =>
            student.roll.toLowerCase() ===
            roll.toLowerCase()
        );


    if (duplicate) {

        alert("This roll number already exists.");

        return;
    }


    const newStudent = {

        id: Date.now(),

        name: name,

        roll: roll,

        status: "Pending"
    };


    students.push(newStudent);


    displayStudents();

    updateDashboard();

    saveData();

    closeModal();
});


// ==========================================
// LOCAL STORAGE
// ==========================================

function saveData() {

    localStorage.setItem(
        "smartAttendanceStudents",
        JSON.stringify(students)
    );
}


// ==========================================
// LOAD SAVED DATA
// ==========================================

function loadData() {

    const savedData =
        localStorage.getItem(
            "smartAttendanceStudents"
        );


    if (savedData) {

        students = JSON.parse(savedData);
    }
}


// ==========================================
// INITIALIZE APPLICATION
// ==========================================

loadData();

displayStudents();

updateDashboard();