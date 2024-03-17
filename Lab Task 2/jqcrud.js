// Function to fetch and display stories
function displayMenu() {
    $.ajax({
        url: "https://65f729a6b4f842e808853816.mockapi.io/menu",
        method: "GET",
        dataType: "json",
        success: function(data) {
            var storiesGrid = $("#storiesGrid");
            storiesGrid.empty();
            $.each(data, function(index, menu) {
                var column = $('<div class="col-md-4 mb-3"></div>');
                column.append(
                    `<div class="card">
                        <div class="card-body">
                            <h3 class="card-title">${menu.name}</h3>
                            <h2 class="card-price">${menu.price}</h2>
                            <p class="card-text">${menu.description}</p>
                            <div>
                                <button id="editBtn" class="btn btn-info btn-sm mr-2 btn-edit" data-id="${menu.id}">Edit</button>
                                <button id="delBtn" class="btn btn-danger btn-sm mr-2 btn-del" data-id="${menu.id}">Delete</button>
                            </div>
                        </div>
                    </div>`
                );
                storiesGrid.append(column);
            });
        },
        error: function(error) {
            console.error("Error fetching:", error);
        },
    });
}
//deleting
function deletePost(){
let menuId = $(this).attr("data-id");
$.ajax({
    url: "https://65f729a6b4f842e808853816.mockapi.io/menu/" +menuId,
    method: "DELETE",
    success: function(){
        displayMenu();
    },
    error: function(){
        console.error("Error deleting item: "+error);
    }

});
}
//creating and updating
function HandleFormSubmission(event){
    event.preventDefault();

    let menuId = $("#createBtn").attr("data-id");
    console.log(menuId);
    var name = $("#createTitle").val();
    console.log(name);
    var price = $("#createPrice").val();
    console.log(price);
    var description = $("#createBody").val();
    console.log(description);

    if(menuId){
        $.ajax({
            url: "https://65f729a6b4f842e808853816.mockapi.io/menu/" +menuId,
            method: "PUT",
            dataType: "json",
            data: {name, price, description},
            success: function(){
                displayMenu();
            },
            error: function(){
                console.error("Error updating: "+error);
            }
        
        });
    
    }
    else{
        $.ajax({

            url: "https://65f729a6b4f842e808853816.mockapi.io/menu",
            method: "POST",
            dataType: "json",
            data: {name,price, description},
            success: function(){
                displayMenu();
                $("#createBtn").removeAttr("data-id");
                $("#createTitle").val("");
                $("#createBody").val("");
                $("#createPrice").val("");
            },
            error: function(){
                console.error("Error creating: "+error);
            }
        });


    }

}
//edit button handling
function editBtnClicked(event){
    event.preventDefault();
    let menuId = $(this).attr("data-id");
    $.ajax({
        url: "https://65f729a6b4f842e808853816.mockapi.io/menu/" +menuId,
        method: "GET",
        success: function(data){
            console.log(data);
            $("#clearBtn").show();
            $("#createTitle").val(data.name);
            $("#createBody").val(data.description);
            $("#createPrice").val(data.price);
            $("#createBtn").html("Update");
            $("#createBtn").attr("data-id", data.id);
     },
        error: function(){
            console.error("Error editing: "+error);
        }
    });
}
$(document).ready(function () {
    // Initial display of stories
    displayMenu();
    $(document).on("click",".btn-del",deletePost);
    $(document).on("click",".btn-edit",editBtnClicked);
    $("#createForm").submit(HandleFormSubmission);
    $("#clearBtn").on("click",function(e){
        e.preventDefault();
        $("#clearBtn").hide();
        $("#createBtn").removeAttr("data-id");
        $("#createBtn").html("Create");
        $("#createTitle").val("");
        $("#createBody").val("");
        $("#createPrice").val("");

    });
});
  