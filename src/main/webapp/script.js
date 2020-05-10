$(document).ready(function(){
	$("form#main_input_box").submit(function(event){
            event.preventDefault();
            addTarefa();    
	});

	$(".list_of_items").on("click", "button.delete", function(){
            remTarefa(this);
	});

	$(".list_of_items").on("click", "button.edit", function (){
                var id = $(this).closest("li").find('#TaskId').val();
                var status = 0;
                if ($(this).closest("li").find('.pull-right').is(':checked'))
                    status = 1;                
		var editItemBox = "<form class='edit_input_box'><input type='text' class='itembox' id='"+id+"' flag='"+status+"'></form>";
		var originalItem = $(this).parent().val();
		var deleteButton = "<button class='delete btn btn-warning'>Delete</button>";
		var editButton = "<button class='edit btn btn-success'>Edit</button>";
		var twoButtons = "<div class='btn-group pull-right'>" + deleteButton + editButton + "</div>";
		$(this).closest("div.text_holder").replaceWith(editItemBox);
		$("form.edit_input_box ").on("submit", function(){
                        editTarefa($(".itembox").attr('id'), $(".itembox").val(), $(".itembox").attr('flag'));
			event.preventDefault(); 
			var checkBox = "<label><input type='checkbox'></label>";
			$(this).replaceWith("<div>" + $(".itembox").val() + twoButtons + "</div>");
		}); 
	});
	
	$(".list_of_items").on("click", ":checkbox", function (){
            $(this).closest("li").toggleClass("completed_item");
            changeStatus($(this));    
	});
        
        ListarTarefas();
});

function changeStatus(obj)
{
    var id = $(obj).closest("li").find('#TaskId').val();
    var status = "";
    if ($(obj).is(':checked'))
        status = 1;
    else
        status = 0;
    $.ajax({
             type: "PUT",
             url: "/TaskList/resources/model.task/status/"+id+"/"+status,
             contentType: "application/json; charset=utf-8",
             crossDomain: true,
             dataType: "json",
             success: function (data, status, jqXHR) {
             },

             error: function (jqXHR, status) {
                 alert('erro ' + status.code);
                 return false;
             }
          });
}

function editTarefa(id, descricao, status)
{
    var dados = new Object();
    dados.id = id;
    dados.descricao = descricao;
    dados.concluida = status;
    //console.log(JSON.stringify(dados));
    $.ajax({
             type: "PUT",
             url: "/TaskList/resources/model.task/"+id,
             data: JSON.stringify(dados),
             contentType: "application/json; charset=utf-8",
             crossDomain: true,
             dataType: "json",
             success: function (data, status, jqXHR) {
                 $("#custom_textbox").val('');
             },

             error: function (jqXHR, status) {
                 alert('erro ' + status.code);
                 return false;
             }
          });
}

function ListarTarefas(){
    $.ajax({
             type: "GET",
             url: "/TaskList/resources/model.task",
             contentType: "application/json; charset=utf-8",
             crossDomain: true,
             dataType: "json",
             success: function (data, status, jqXHR) {
                for(var i = 0; i < data.length; i++) {
                    var item = data[i];
                    addItem(item.id, item.descricao, item.concluida);
                }
             },

             error: function (jqXHR, status) {
                 alert('erro ' + status.code);
                 return false;
             }
          });
}

function remTarefa(obj){
    var id = $(obj).closest("li").find('#TaskId').val();
    $(obj).closest("li").remove();
    $.ajax({
             type: "DELETE",
             url: "/TaskList/resources/model.task/"+id,
             success: function (data, status, jqXHR) {
             },

             error: function (jqXHR, status) {
                 alert('erro ' + status.code);
                 return false;
             }
          });
}

function addTarefa(){
    $("#custom_textbox").val($("#custom_textbox").val().trim());
    if ($("#custom_textbox").val() == "")
        return;
    var dados = new Object();
    dados.id = "";
    dados.descricao = $("#custom_textbox").val();
    
    $.ajax({
             type: "POST",
             url: "/TaskList/resources/model.task",
             data: JSON.stringify(dados),
             contentType: "application/json; charset=utf-8",
             crossDomain: true,
             dataType: "json",
             success: function (data, status, jqXHR) {
                 addItem(data.id, data.descricao, 0);
                 $("#custom_textbox").val('');
             },

             error: function (jqXHR, status) {
                 alert('erro ' + status.code);
                 return false;
             }
          });
}

function addItem(id, descricao, concluida)
{
    var aux = " id='ch-"+id+"' ";
    var deleteButton = "<button class='delete btn btn-warning'>Delete</button>";
    var editButton = "<button class='edit btn btn-success'>Edit</button>";
    var twoButtons = "<div class='btn-group pull-right'>" + deleteButton + editButton + "</div>";
    var checkBox = "<div class='checkbox'><label><input type='checkbox' class='pull-right' "+aux+"></label></div>";
    var idinput = "<input type='hidden' id='TaskId' name='TaskId' value="+id+">";
    $(".list_of_items").append("<li class='list-group-item'>" + "<div class='text_holder'>" + descricao + twoButtons + idinput + "</div>" + checkBox + "</li>");
    if (concluida == 1){
        $('#ch-'+id).prop( "checked", true );
        $('#ch-'+id).closest("li").toggleClass("completed_item");
    }
}
