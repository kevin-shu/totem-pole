Totem-Pole.js
=============

A lightweight, handy, No dependencies MVVM framework of javascript.

Watch the tutorial page [here](http://kevin-shu.github.com/totem-pole/).

How to use it?
--------------



Data-binding type:
------------------
### html, text
Binding DOM object's innerHTML or innerText with view-model's data.

### event
Attach an event-handler to DOM object's attribute.

### attr
Multi-binding between view-model's data and view with an past-in object.

### value
When you bind an view-model's data with "input", "select", "textarea". It would creat an two-way binding: UI to data, data to UI. It's automatic! 

### style


ViewModel's attributes & methods:
---------------------------------
* view - View's DOM object
* html - View's innerHTML.
* data - viewModel's data
* kill() - Remove the viewModel, also remove the view.
* set(data) - pass a data object to batch-update viewModel's data
* set(key, value) - set a data "key" as "value"



