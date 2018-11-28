$(document).on("click", ".delete", function(){
    let userNum = $(this).attr("data-userId");
    let favId = $(this).attr("data-inspectionId");
    $.ajax(`/api/delete/${userNum}/${favId}`, {
        type: "DELETE"
    });
    window.location.reload(true);
});