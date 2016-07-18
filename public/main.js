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

$(".active").click(function(e) {});

$(".btn.btn-default").click(function(e) {
    e.preventDefault();
    var content = $("#notepad").val();
    $.ajax({
        url: "/note",
        method: "POST",
        data: {
            content: content
        },
        success: function(response) {
            if(response.status == "success") {
                alert("노트가 성공적으로 저장되었습니다.");
            } else {
                alert("노트 저장이 실패했습니다.");
            }
        }
    });
});
