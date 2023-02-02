var temp='<div class="message"><p class="user"></p><p class="tmessage"></p></div>'
var id;
var pname;
$(document).ready(function() {
    const socket = io();
    navigator.geolocation.getCurrentPosition((datas)=>{
        var long=datas.coords.longitude
        var lat=datas.coords.latitude
        $.ajax({url: '/joingroupapi?long='+long+'&lat='+lat,
        success: function(result){
            data=JSON.parse(result)
            var rendered = Mustache.render(document.body.innerHTML,data);
            document.body.innerHTML = rendered;
            id=$(".wrapper").attr("id")
            pname=$(".texts").attr("id")
            console.log(result)
            socket.on(id, function(data) {
                var newm=$(temp)
                $(newm.children()[1]).html(data.message)
                $(newm.children()[0]).html(data.name)
                $(newm).appendTo( "#mboard" )
                $("#mboard").scrollTop($("#mboard").height())
                console.log(newm)
                console.log($(newm))
              });
        },
        error:(err)=>{
            window.location.replace("/")
        }});
    })

    $(document).on("click", "#send", function(e) {
        if ($("#stext").val()!=""){
            socket.emit('message', {"cid":id,"message":$("#stext").val(),"name":pname});
            $("#stext").val("")
        }

    })
  });
