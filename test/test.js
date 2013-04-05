var p = new TP("people-template");
document.body.appendChild(p.getView());
p.setData({"name":"Kevin","color":{background:"green"}});