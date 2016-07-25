var contents;
var filearr;

$.ajax({
    url: "/note",
    method: "GET",
    success: function(response) {
         for(var i=0; i < response.contents.length; i++) {
            var li = document.createElement("LI");
            var a = document.createElement("A");
            var t = document.createTextNode(response.filearr[i]);

            a.appendChild(t);
            li.appendChild(a);

            li.id = "" + i;

            if(i==0)
                li.className = "active";

            document.getElementById("tabs").appendChild(li);

            $(li).click(function(e) {
                $("li").removeClass("active");
                $(this).addClass("active");

                $("#notepad").val(contents[parseInt($(this).attr("id"))]);
            });
        }

        contents = response.contents;
        filearr = response.filearr;

        $("#notepad").val(response.contents[0]);
    }
});

$("#new").click(function(e) {
    var filename = prompt("Enter the name of new file without .txt", "example");
    $.ajax({
        url: "/note",
        method: "POST",
        data: {
            action: "new",
            filename: filename + ".txt"
        },
        success: function(response) {
            if(response.status == "success") {
                alert(filearr[num] + " is created successfully");
            } else {
                alert(filearr[num] + " failed to create")
            }
        }
    });
});

$("#delete").click(function(e) {
    var num = parseInt($(".active").attr("id"));
    $.ajax({
        url: "/note",
        method: "POST",
        data: {
            action: "delete",
            filename: filearr[num]
        },
        success: function(response) {
            if(response.status == "success") {
                alert(filearr[num] + " is deleted successfully");
            } else {
                alert(filearr[num] + " failed to delete")
            }
        }
    });
});

$("#save").click(function(e) {
    var num = parseInt($(".active").attr("id"));
    $.ajax({
        url: "/note",
        method: "POST",
        data: {
            action: "save",
            filename: filearr[num],
            content: $("#notepad").val()
        },
        success: function(response) {
            if(response.status == "success") {
                alert(filearr[num] + " is saved successfully");
            } else {
                alert(filearr[num] + " failed to save")
            }
        }
    });
});

$("#rename").click(function(e) {
    var num = parseInt($(".active").attr("id"));
    var newname = prompt("Enter the new name without .txt", "example");
    $.ajax({
        url: "/note",
        method: "POST",
        data: {
            action: "rename",
            filename: filearr[num],
            newname: newname
        },
        success: function(response) {
            if(response.status == "success") {
                alert(filearr[num] + " is renamed successfully");
            } else {
                alert(filearr[num] + " failed to rename")
            }
        }
    });
});