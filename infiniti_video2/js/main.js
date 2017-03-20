/**
 * Created by samsung on 2017/1/12.
 */
$(document).ready(function(){
    $(".span5").click(function(){
        $(".pop").show();
    });
    $(".popCloseBtn").click(function(){
        $(".pop").hide();
    });
    $(".closeSubmitContent").click(function(){
        $(".submitContainer").hide();
    })
    $(".yysj_btn").click(function(){
        stm_clicki('send', 'event', '打开预约试驾按钮', '打开预约试驾按钮', '打开预约试驾按钮', 4);
        $(".submitContainer").show();
        stm_clicki('send', 'pageview', {'page': 'testDrivePage', 'title': '预约试驾页'});
    })

    initSelect();
    var yySuccess=false;
    $(".submitBtn").click(function(){
        if(yySuccess){
            alert("您已提交过信息，我们会尽快与您联系。");
            return;
        };

        stm_clicki('send', 'event', '提交预约试驾按钮', '提交预约试驾按钮', '提交预约试驾按钮', 5);

        var cx=$("#cx").children('option:selected').val();
        if(cx==""||cx=="请选择"){
            alert("请选择一款车型");
            return;
        }

        var province=$("#province").children('option:selected').val();
        if(province==""||province=="请选择"){
            alert("请选择您所在的省份");
            return;
        }

        var city=$("#city").children('option:selected').val();
        if(city==""||city=="请选择"){
            alert("请选择您所在的城市");
            return;
        }

        var jxs=$("#jxs").children('option:selected').val();
        if(jxs==""||jxs=="请选择"){
            alert("请选择您要试驾的经销商");
            return;
        }

        var xb=$("#xb").children('option:selected').val();
        if(xb==""||xb=="请选择"){
            alert("请选择您的性别");
            return;
        }

        var name=$("#nameInput").val();
        if(!name){
            alert("请输入您的姓名");
            return;
        }

        var phone=$("#phoneInput").val();
        if(!phone){
            alert("请输入您的手机号");
            return;
        }

        var reg = new RegExp("^[0-9]*$");
        if(!reg.test(phone)){
            alert("请输入正确手机号");
            return;
        }else{
            if(phone.length!=11){
                alert("请输入正确手机号");
                return;
            }
        }

        var hcTime=$("#hcTime").children('option:selected').val();
        if(hcTime==""||hcTime=="请选择"){
            alert("请选择您的换车时间");
            return;
        }

        var ttime=new Date();

        var year=ttime.getFullYear();

        var month=ttime.getMonth()+1;

        if(month<10){
            month="0"+month;
        }

        var day=ttime.getDate();

        if(day<10){
            day="0"+day;
        }

        var hour=ttime.getHours();

        if(hour<10){
            hour="0"+hour;
        }

        var min=ttime.getMinutes();

        if(min<10){
            min="0"+min;
        }

        var ss=ttime.getSeconds();

        if(ss<10){
            ss="0"+ss;
        }

        var ccTime=year+"-"+month+"-"+day+" "+hour+":"+min+":"+ss;

        stm_clicki('send', 'event', {
            customActionId: 1, customActionLabel1: cx, customActionLabel2: province, customActionLabel3: city, customActionLabel4: jxs, customActionLabel5: xb, customActionLabel6: name, customActionLabel7: phone, customActionLabel8: hcTime,customActionLabel9:ccTime, customActionValue1: 1
        });

        $.ajax({
            type: "POST",
            url: "/Reservation/Post",
            data: {
                "Name":name,
                "MobileNumber":phone,
                "CarModel":cx,
                "Province":province,
                "City":city,
                "Sex":xb,
                "Dealer":jxs,
                "ChangeTime":hcTime,
                "FromType":"love"
            },
            dataType: "json",
            success: function(data){
                console.log("ajaxSuccess:",data);
                if(data.Status){
                    yySuccess=true;
                    alert("预约试驾成功！");
                }else{
                    alert("您已提交过信息，我们会尽快与您联系。");
                }
            }
        });
    });
});


