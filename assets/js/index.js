$(function() {
    //调用getUserInfo()函数
    getUserInfo()
    var layer = layui.layer

    $('.btnLogOut').on('click', function() {
        //提示用户是否确认退出？
        layer.confirm('是否退出登录？', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 1.清空本地token
            localStorage.removeItem('token')
                // 2.重新跳转到登录页面
            location.href = '/login.html'

            // 关闭提示框
            layer.close(index);
        })

    })

})

//定义获取用户信息的函数
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //   headers记住要用小写，首字母不能大写

        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // console.log(res);

            layui.layer.msg(res.message)
            console.log(res.data);
            renderAvatar(res.data)

        },
        // 不论成功还是失败，最终都会调用complete函数
        // complete: function(res) {
        //     // // 在complete里，可以用res.responseJSON 拿到服务器响应的信息
        //     console.log(res);
        //     console.log(res.responseJSON);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         console.log('ok');

        //         // 1.清空本地token
        //         localStorage.removeItem('token')
        //             // 2.重新跳转到登录页面
        //         location.href = '/login.html'
        //     }


        // }
    })
}
//渲染用户头像
function renderAvatar(user) {
    //获取用户的name信息
    var name = user.username || user.nickname
        //渲染欢迎文字
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name)
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    }
    $('.layui-nav-img').hide()
    $('.text-avatar').html(name[0].toUpperCase()).show()
}