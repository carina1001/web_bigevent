// 在每次调用get(),post(),ajax()之前会
//调用ajaxPreFilter这个函数
//在这个函数中我们可以拿到ajax的配置对象
$.ajaxPrefilter(function(options) {
    //在发起ajax请求之前，统一拼接请求根路径
    // console.log(options.url);
    options.url = 'http://ajax.frontend.itheima.net' + options.url
        // console.log(options.url);
        //统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载complete回调函数
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            console.log('ok');

            // 1.清空本地token
            localStorage.removeItem('token')
                // 2.重新跳转到登录页面
            location.href = '/login.html'
        }
    }


})