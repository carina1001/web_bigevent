$(function() {
    $("#link-reg").on("click", function() {
        $(".login-box").hide()
        $(".reg-box").show()

    })
    $("#link-login").on("click", function() {
            $(".reg-box").hide()
            $(".login-box").show()

        })
        // 自定义校验规则
    var form = layui.form
    var layer = layui.layer
        //调用接口发起登录请求
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功！')
                    //将登录成功后的token值存储到本地的localStorage中
                console.log(res.token);

                localStorage.setItem('token', res.token)
                console.log(localStorage);
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            //通过value拿到repassword的值
            //再拿到password的值
            //比较两个值是否一致 不一致则return一个错误消息
            var pwd = $('.reg-box [name=password]').val()
            console.log(pwd);
            console.log(value);


            if (pwd !== value) { return "两次密码不一致" }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
            // 注意获取的格式书写 单引号加空格
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);

            }
            // return console.log(res.message)
            layer.msg('注册成功，请登录！');
            // 模拟人的点击行为
            $('#link-login').click()


        })
    })

})