var earth_radius = 3960.0
var degrees_to_radians = 3.14159/180.0
var radians_to_degrees = 180.0/3.14159
$(document).ready(function() {
    $(document).on("click", "#create", function(e) {
        $("#wwrapper").css("transform","translateX(-50%)")
      //$("#products").css("transform","translateX(-100%)")
      //$("#check").css("visibility","hidden")
    })
    $(document).on("click", "#back", function(e) {
        $("#wwrapper").css("transform","translateX(0)")
      //$("#products").css("transform","translateX(-100%)")
      //$("#check").css("visibility","hidden")
    })
    $(document).on("click", "#cgroup", function(e) {
        $("#error1").css("visibility","hidden");
        data={}
        data.name=$("#cname").val()
        data.groupname=$("#cgname").val()
        data.radius=Number($("#cmiles").val())

        navigator.geolocation.getCurrentPosition((datas)=>{
            data.long=datas.coords.longitude
            data.lat=datas.coords.latitude
            diff=(data.radius/earth_radius)*radians_to_degrees
            data.longbox=[data.long-diff,data.long+diff]
            data.latbox=[data.lat-diff,data.lat+diff]
            console.log(data.lat,data.long)
            console.log(data.latbox[0],data.longbox[0])
            console.log(data.latbox[0],data.longbox[1])
            console.log(data.latbox[1],data.longbox[0])
            console.log(data.latbox[1],data.longbox[1])
            info=data
            console.log(data)
            $.ajax({
                type: "POST",
                url: "/creategroup?name="+data.name,
                contentType:"application/x-www-form-urlencoded",
                data: info,
                success: (data)=>{
                    console.log(data)
                    window.location.replace("/chat?id="+data)
                },
                error:(err)=>{
                    console.log(err)
                    $("#error1").text(err.responseText)
                    $("#error1").css("visibility","visible")
                }
            });
        })
        
        
    })
    $(document).on("click", "#join", function(e) {
        $("#error").css("visibility","hidden")
        navigator.geolocation.getCurrentPosition((datas)=>{
            $.ajax({
                type: "GET",
                url: "/joingroupapi?name="+$("#jname").val()+"&long="+datas.coords.longitude+"&lat="+datas.coords.latitude,
                success: (data)=>{
                    data=JSON.parse(data)
                    console.log("out of main")
                    window.location.replace("/chat?id="+data._id)
                },
                error:(err)=>{
                    console.log(err)
                    $("#error1").text(err.responseText)
                    $("#error").css("visibility","visible")
                }
            });
        })
        
    }) 
    
  });