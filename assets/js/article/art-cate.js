$(function() {
    var layer = layui.layer
    var form = layui.form

    initArtCateList()
        // 获取文章分类数据
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败!')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

            }
        })
    }
    // 为添加类别按钮绑定点击事件
    var index = null
    $('#addCate').on('click', function() {
            index = layer.open({
                type: 1,
                area: ['500px', '300px'],
                title: '添加文章分类',
                content: $('#dialog-add').html()
            })
        })
        // 通过代理的方式为 form-add 表单绑定提交事件
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault()
            $.ajax({
                url: '/my/article/addcates',
                method: 'POST',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('添加文章分类失败!')
                    }
                    initArtCateList()
                    layer.msg('添加文章分类成功!')
                        // 关闭弹出层
                    layer.close(index)
                }
            })
        })
        // 通过tbody代理的方式为btn-edit绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '#btn-edit', function(e) {
            indexEdit = layer.open({
                    type: 1,
                    area: ['500px', '300px'],
                    title: '修改文章分类',
                    content: $('#dialog-edit').html()
                })
                // 获取当前ID列表数据
            var id = $(this).attr('data-id')
            console.log(id);

            // 发起请求获取对应分类的数据
            $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    console.log(res);
                    // 使用layui的表单赋值为lay-filter为form-edit的表单赋值
                    form.val('form-edit', res.data)

                }
            })

        })
        // 通过body代理为form-edit绑定提交事件
    $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault()
                // $.ajax({
                //     method: 'POST',
                //     url: '/my/article/updatecate',
                //     data: $(this).serialize(),
                //     success: function(res) {
                //         console.log(res);
                //         if (res.status !== 0) {
                //             return layer.msg('修改失败!')
                //         }
                //         layer.msg('修改ch!')
                //         initArtCateList()
                //     }
                // })
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新分类数据失败！')
                    }
                    layer.msg('更新分类数据成功！')
                    layer.close(indexEdit)
                    initArtCateList()
                }
            })

        })
        // 通过代理为artDel按钮添加点击事件
    $('tbody').on('click', '#artDel', function() {
        var id = $(this).attr('data-id')
        console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + id,
            success: function() {
                initArtCateList()
            }
        })
    })

})