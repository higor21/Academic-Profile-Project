
var itens = []

// ready
var reload_itens = function(){
	let i = 0, j;
	$('ul').empty()
	itens.forEach(elem => {
		let str = 	"<li class='item "+ i +"'>"+
						"<span class='hf_trash'><i class='fa fa-trash'></i></span>" +
						elem.title +
						"<span class='hf_plus'><i class='fa fa-plus'></i></span>" +
					"</li>" +
					"<input id='add_subitem_"+ i +"' type='text' placeholder='Add SubItem'>"
		j = 0;
		elem.sub_itens.forEach(s_e => {
			str += 	"<li class='sub_item "+ i +"_"+ (j++) +"'><span class='hf_trash'><i class='fa fa-trash'></i></span>" +
						"<span class='hf_angle'><i class='fas fa-angle-right'></i></span>" +
						s_e.topic +
					"</li>"
		})
		i++;
		$("ul").append(str)
	})
}

// ready
var add_itens = function(obj, event){
	if(event.which === 13){
		//grabbing new todo text from input
		var todoText = $(obj).val();
		$(obj).val("");
		//create a new li and add to ul
		if(obj.id == "add_item")
			itens.push({ title: todoText, sub_itens: []})
		else{
			var index_si = parseInt(obj.id.split('_')[2])
			itens[index_si].sub_itens.push({topic: todoText})
		}
		reload_itens()
	}
}

// ready
$("#add_item").keypress(function(event){
	add_itens(this, event)
});


// ready
$("ul").on("keydown","[id*='add_subitem']", function(event){
	add_itens(this, event)
});

// ready
$("ul").on("click", ".fa-plus", function(){
	var input_i = $(this).parent().parent()[0].className.split(' ')[1]
	$('#add_subitem_' + input_i).fadeToggle();
});

$("h1 > .fa-plus").click(function(){
	$("#add_item").fadeToggle();
})

// ready
$("ul").on("click", ".hf_trash", function(event){
	if($(this).parent()[0].className.split(' ')[0] == 'item'){
		pos = itens.map(e => {return e.title}).indexOf($(this).parent()[0].textContent)
		if(pos > -1) itens.splice(pos, 1)
	}else{
		item_i = parseInt($(this).parent()[0].className.split(' ')[1][0])
		subitem_i = parseInt($(this).parent()[0].className.split(' ')[1][2])
		itens[item_i].sub_itens.splice(subitem_i, 1);
	}
	reload_itens()
});