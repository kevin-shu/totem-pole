alert("Generate todo1...");
var todo1 = new TP("event-template",{id:"555"});
document.getElementById("todo-container").appendChild(todo1.view);

alert("Generate todo2...");
var todo2 = new TP("event-template",{"event":"TEST"});
document.getElementById("todo-container").appendChild(todo2.view);

var setTodo1 = confirm("Set Todo1's event as \"123\"?");
if (setTodo1){
	todo1.setData("event","123");
} 