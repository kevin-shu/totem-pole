//= require tp.js
//= require jquery.js
//= require jq.stellar.js

function add(vm) {
	var content = vm.data["content"];
	var todo = TP.template("#event-template",{event:content,check:check});
	document.getElementById("todolist").appendChild(todo.view);
}

function check(vm) {
	vm.set( "isCheck", vm.data.isCheck=="&times;" ? "":"&times;" );
	if(vm.data.isCheck=="&times;"){
		var r = confirm("Delete it now?");
		if (r){
			vm.kill();
		}
	}
};

TP("#controller");

$(".totem-left, .totem-right").height($("body").height());
$(window).stellar({horizontalScrolling: false});