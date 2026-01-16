const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const filePath = "./tasks.json";

function loadTasks() {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const findLastId = (tasks) => {
  if (tasks.length === 0) return 0;
  return Math.max(...tasks.map((task) => task.id));
};

function saveTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

function showMenu() {
  const tasks = loadTasks();
  let taskId = findLastId(tasks);
  rl.question(
    `\n1. Add Task
2. Update Task
3. Delete Task
4. View Tasks
5. Set Completed Task
6. View Completed Tasks
7. View Not Completed Tasks
8. Exit
Choose an option: `,
    (selection) => {
      switch (selection) {
        case "1":
          rl.question("Enter Task Description: ", (desc) => {
            const newTask = {
              id: ++taskId,
              description: desc,
              completed: false,
            };
            tasks.push(newTask);
            saveTasks(tasks);
            console.log("Task added");
            showMenu();
          });
          break;

        case "2":
          rl.question("Enter Task ID to Update: ", (id) => {
            const task = tasks.find((t) => t.id === Number(id));
            if (!task) {
              console.log("Task not found");
              return showMenu();
            }

            rl.question("Enter New Description: ", (newDesc) => {
              task.description = newDesc;
              saveTasks(tasks);
              console.log("✅ Task updated");
              showMenu();
            });
          });
          break;

        case "3":
          rl.question("Enter Task ID to Delete: ", (id) => {
            const index = tasks.findIndex((t) => t.id === Number(id));
            if (index === -1) {
              console.log("Task not found");
              return showMenu();
            }
            tasks.splice(index, 1);
            saveTasks(tasks);
            console.log("Task deleted");
            showMenu();
          });
          break;

        case "4":
          console.table(tasks);
          showMenu();
          break;

        case "5":
          rl.question("Enter Task ID to Mark as Completed: ", (id) => {
            const task = tasks.find((t) => t.id === Number(id));
            if (!task) {
              console.log("❌ Task not found");
              return showMenu();
            }
            task.completed = true;
            saveTasks(tasks);
            console.log("Task marked as completed");
            showMenu();
          });
          break;
        case "6":
          console.table(tasks.filter((t) => t.completed));
          showMenu();
          break;

        case "7":
          console.table(tasks.filter((t) => !t.completed));
          showMenu();
          break;
        case "8":
          console.log("Goodbye!");
          rl.close();
          break;

        default:
          console.log("Invalid choice");
          showMenu();
      }
    },
  );
}

showMenu();
