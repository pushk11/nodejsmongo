$( document ).ready(function() {

	$("#addDevice").click(function() {
		console.log("Add");
		window.location="/admin/add";
	});
	
	$("#cancelAdd").click(function() {
		console.log("Cancel Add");
		window.location="/admin";
	});

	$(document).on("click", "#deleteDevice", function() {
		console.log("Delete");
		var conf = confirm("Want to delete? ");
		if (conf === true) {
			window.location="/admin/delete/" + $(this).data("id");
		}
	});

});