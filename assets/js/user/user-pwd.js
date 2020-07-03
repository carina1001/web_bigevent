$(function() {
    // 为密码框设定校验规则
    var form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        newPwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }

        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '密码不一致！'
            }

        }
    })

    // 发起请求实现重置密码功能
    $('.layui-form').submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    console.log(res);

                    return layui.layer.msg('更新密码失败！')
                }
                console.log('okl');
                return layui.layer.msg('更新密码成功！')
                    // console.log(res);
                    //重置表单
                $('.layui-form')[0].reset()

            }
        })
    })




})