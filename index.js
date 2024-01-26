
// let courseTable = document.getElementById("course-table");
// let mainCourses = courseTable.getElementsByClassName("main-courses")[0];
let mainContent = document.getElementsByTagName("main")[0];

let dayCheckboxes = [];
let wingCheckboxes = [];
let studentCheckboxes = [];

let studentSelector = document.getElementById("student-options");

let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
let wings = ["A", "B", "C", "D", "E"];

let schedules = null;
let elements = [];


for (let i = 0; i < 5; ++i) {
    let checkbox = document.getElementById(`day-${i}`);
    dayCheckboxes.push(checkbox);

    checkbox.addEventListener("change", e => {
        if (schedules !== null) {
            updateSchedules();
        } 
    });
}
for (let wing of wings) {
    let checkbox = document.getElementById(`wing-${wing}`);
    wingCheckboxes.push(checkbox);

    checkbox.addEventListener("change", e => {
        if (schedules !== null) {
            updateSchedules();
        } 
    });
}


fetch("schedules.json").then(data => data.json()).then(s => {
    schedules = s;

    for (let name in schedules) {

        let label = document.createElement("label");
        let checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.name = `name-${name}`;
        checkbox.id = `name-${name}`;
        checkbox.checked = true;

        label.append(checkbox, document.createTextNode(` ${name}`));
        studentCheckboxes.push(checkbox);
        studentSelector.append(label);
        
        checkbox.addEventListener("change", e => {
            if (schedules !== null) {
                updateSchedules();
            } 
        });
    }

    updateSchedules();
}).catch(e => {
    console.log(`ERROR: ${e}`);
})

function updateSchedules() {
    for (let element of elements) {
        element.remove();
    }
    elements = [];

    for (let name in schedules) {
        if (!studentCheckboxes.find(element => element.checked == true && `name-${name}` == element.name)) {
            continue;
        }
        let schedule = schedules[name];

        let heading = document.createElement("h5");
        heading.textContent = name;
        
        let table = document.createElement("table");
        let thead = document.createElement("thead");

        let row = document.createElement("tr");
        for (let column of ["Course", "Room Number", "Teacher", "Days"]) {
            let data = document.createElement("td");
            data.textContent = column;
            row.append(data);
        }
        thead.append(row);
        table.append(thead);



        for (let course of schedule) {
            let found = false;


            for (let i = 0; i < 5; ++i) {
                let dayIsActive = dayCheckboxes[i].checked;
                if (dayIsActive && course.days.find(v => v == days[i]) != undefined) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                continue;
            }
            found = false;
            for (let i = 0; i < 5; ++i) {
                let showWing = wingCheckboxes[i].checked;
                if (showWing && course.roomNumber[0] == wings[i]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                continue;
            }
    


            let row = document.createElement("tr");
    
            let name = document.createElement("td");
            name.textContent = course.className;
    
            let room = document.createElement("td");
            room.innerHTML = course.roomNumber;
    
            let teacher = document.createElement("td");
            teacher.textContent = course.teacher;
    
            let daysElement = document.createElement("td");
            daysElement.textContent = course.days.join(", ");
    
    
            row.append(name, room, teacher, daysElement);
            table.append(row);
        }
        elements.push(heading);
        elements.push(table);
        mainContent.append(heading, table);
    }
}