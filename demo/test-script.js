alert("Generate todo1...");
var todo1 = new TP("event-template",{id:"555"});
document.getElementById("todo-container").appendChild(todo1.view);

alert("Generate todo2...");
var todo2 = new TP("event-template",{"event":"TEST"});
document.getElementById("todo-container").appendChild(todo2.view);

alert("Generate issue ticket...");
var ticket = new TP("issue-ticket",{"issue":"bug"});
document.getElementById("todo-container").appendChild(ticket.view);

var setTodo1 = confirm("Set Todo1's event as \"123\"?");
if (setTodo1){
	todo1.set("event","123");
} 

var setErrorData = confirm("Set Todo1's \"ununun\" as \"test\"?");
if (setErrorData){
	todo1.set("ununun","test");
} 

var setErrorData = confirm("Set Todo1's \"check\" as \"function(viewModel){viewModel.kill();}\"?");
if (setErrorData){
	todo1.set( "check", function(vm){vm.kill();} );
}

var setErrorData = confirm("When change one event, alert all events?");
if (setErrorData){
	TP.chain("event-template",function(){alert(this.data.event)});
}