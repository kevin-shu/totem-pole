//= require_tree .

function add(vm) {
	var content = vm.data["content"];
	// alert(todo);
	var check = function(vm){
		vm.set( "isCheck", vm.data.isCheck=="&times;" ? "":"&times;" );
		if(vm.data.isCheck=="&times;"){
			var r = confirm("Delete it now?");
			if (r){
				vm.kill();
			}
		}
	};
	var todo = TP.template("#event-template",{event:content,check:check});
	document.getElementById("todolist").appendChild(todo.view);
}

TP("#controller");