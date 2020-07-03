$(function() {
    // var form = layui.form
    // form.verify({
    //     nickname: function(value) {
    //         if (value.length >= 6) {
    //             return "昵称必须在1~6字符之间"
    //         }
    //     }
    // })

    var form = layui.form

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                // 表单验证这里没必要使用layer.msg()
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })
    initUserInfo()

    //初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return '获取基本信息失败'
                }
                console.log(res);
                // 使用form.val()快速为表单赋值
                form.val('formUserInfo', res.data)

            }

        })
    }

    // 重置表单的数据
    $('#btnReset').on('click', function(e) {
        e.preventDefault()
        initUserInfo()
    })

    // $('#btnReset').on('click', function(e) {
    //     // 阻止表单的默认重置行为
    //     e.preventDefault()
    //     initUserInfo()
    // })

    // 监听表单的提交事件
    $('.layui-form').submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return '修改用户信息失败！'
                }
                layui.layer.msg(res.message)
                    // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }

        })
    })

})