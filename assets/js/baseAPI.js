// 在每次调用get(),post(),ajax()之前会
//调用ajaxPreFilter这个函数
//在这个函数中我们可以拿到ajax的配置对象
$.ajaxPrefilter(function(options) {
    console.log(options.url);
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    console.log(options.url);

})