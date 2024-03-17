// Function to fetch and display stories
function displayPosts() {
    $.ajax({
        url: "https://65f6d0eafec2708927c9caf3.mockapi.io/posts",
        method: "GET",
        dataType: "json",
        success: function(data) {
            var storiesGrid = $("#storiesGrid");
            storiesGrid.empty();
            $.each(data, function(index, post) {
                var column = $('<div class="col-md-4 mb-3"></div>');
                column.append(
                    `<div class="card">
                        <div class="card-body">
                            <h3 class="card-title">${post.title}</h3>
                            <p class="card-text">${post.body}</p>
                            <div>
                                <button id="editBtn" class="btn btn-info btn-sm mr-2 btn-edit" data-id="${post.id}">Edit</button>
                                <button id="delBtn" class="btn btn-danger btn-sm mr-2 btn-del" data-id="${post.id}">Delete</button>
                            </div>
                        </div>
                    </div>`
                );
                storiesGrid.append(column);
            });
        },
        error: function(error) {
            console.error("Error fetching stories:", error);
        },
    });
}
//deleting
function deletePost(){
let postId = $(this).attr("data-id");
$.ajax({
    url: "https://65f6d0eafec2708927c9caf3.mockapi.io/posts/" +postId,
    method: "DELETE",
    success: function(){
        displayPosts();
    },
    error: function(){
        console.error("Error deleting post: "+error);
    }

});
}
//creating and updating
function HandleFormSubmission(event){
    event.preventDefault();

    let postId = $("#createBtn").attr("data-id");
    console.log(postId);
    var title = $("#createTitle").val();
    console.log(title);
    var body = $("#createBody").val();
    console.log(body);

    if(postId){
        $.ajax({
            url: "https://65f6d0eafec2708927c9caf3.mockapi.io/posts/" +postId,
            method: "PUT",
            dataType: "json",
            data: {title, body},
            success: function(){
                displayPosts();
            },
            error: function(){
                console.error("Error updating post: "+error);
            }
        
        });
    
    }
    else{
        $.ajax({

            url: "https://65f6d0eafec2708927c9caf3.mockapi.io/posts",
            method: "POST",
            dataType: "json",
            data: {title, body},
            success: function(){
                displayPosts();
            },
            error: function(){
                console.error("Error creating post: "+error);
            }
        });


    }

}
//edit button handling
function editBtnClicked(event){
    event.preventDefault();
    let postId = $(this).attr("data-id");
    $.ajax({
        url: "https://65f6d0eafec2708927c9caf3.mockapi.io/posts/" +postId,
        method: "GET",
        success: function(data){
            console.log(data);
            $("#clearBtn").show();
            $("#createTitle").val(data.title);
            $("#createBody").val(data.body);
            $("#createBtn").html("Update");
            $("#createBtn").attr("data-id", data.id);
     },
        error: function(){
            console.error("Error editing post: "+error);
        }
    });
}
$(document).ready(function () {
    // Initial display of stories
    displayPosts();
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
    });
});
  