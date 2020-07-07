$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义查询参数对象q,请求数据时,需要将参数传到服务器
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' //	文章的状态
    }

    // 定义过滤器美化时间格式
    // template.defaults.imports.dataFormat = function(date) {
    //     const dt = new date()

    //     var y = dt.getFullYear()
    //     var m = padZero(dt.getMonth() + 1)
    //     var d = padZero(dt.getDate())

    //     var hh = padZero(dt.getHours())
    //     var mm = padZero(dt.getMinutes())
    //     var ss = padZero(dt.getSeconds())

    //     return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss

    // }

    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    initArtList()
    initCate()

    //通过代理为删除文章按钮添加点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        console.log('id是' + id);

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    console.log(res);

                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtList()
                }
            })
        })
    })

    // 定义初始化文章列表函数
    function initArtList() {
        // 发送ajax请求数据

        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                console.log('--------------------');

                console.log(res);
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                console.log('zheli');
                console.log(htmlStr);
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    // 定义获取文章分类列表的函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                console.log(htmlStr);

                $('[name=cate_id]').html(htmlStr)
                    // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })


    }

    // 为筛选表单绑定submit事件

    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
            // 根据最新的筛选条件，重新渲染表格的数据
        initArtList()
    })

    // 定义一个分页函数
    function renderPage(total) {

        laypage.render({
            elem: 'pageBox', //指向存放分页的容器
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 5, 10, 15, 20],
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr);
                q.pagenum = obj.curr
                    //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                q.pagesize = obj.limit
                    //首次不执行
                if (!first) {
                    //do something
                    initArtList()
                }
            }

        })
    }
    // 通过代理为编辑按钮定义点击事件
    $('tbody').on('click', '.btn-edit', function() {
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                location.href = '/article/art-edit.html'

            }
        })
    })

})