$(function() {
    var layer = layui.layer
    var form = layui.form

    // 初始化富文本编辑器
    initEditor()
        // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    initCate()

    // 定义初始化文章类别函数
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return

                }
                // 根据模板引擎渲染数据
                var htmlStr = template('tpl-cate', res)
                console.log(htmlStr);

                $('[name=cate_id]').html(htmlStr)
                    // 记得调用form.render()
                form.render()


            }

        })
    }

    // 为选择封面按钮添加点击事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    // 监听文件选择框的change事件
    $('#coverFile').on('change', function(e) {
        console.log(e);
        // 获取选择的文件数据列表
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
            // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路
            .cropper(options) // 重新初始化裁剪区域


    })
    var art_state = '已发布'
        // 为btnSave2添加点击事件
    $('#btnSave2').on('click', function() {
        art_state = '已发布'
    })

    // 监听表单的提交行为
    $('#form-pub').submit(function(e) {
        e.preventDefault()
            // 快速创建FormData对象
        var fd = new FormData($(this)[0])
            // 将状态添加到fd中
        fd.append('state', art_state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                publishArticle(fd)
            })



    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art-list.html'
            }
        })
    }



})