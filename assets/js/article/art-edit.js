$(function() {
    var layer = layui.layer
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

    // 定义方法获取当前URL地址栏中的ID
    console.log(location.href);

    // 定义方法获取url中的id
    function getUrlParams(name) { // 不传name返回所有值，否则返回对应值
        var url = window.location.search;
        console.log(url);

        if (url.indexOf('?') == 1) { return false; }
        url = url.substr(1);
        url = url.split('&');
        var name = name || '';
        var nameres;
        // 获取全部参数及其值
        for (var i = 0; i < url.length; i++) {
            var info = url[i].split('=');
            var obj = {};
            obj[info[0]] = decodeURI(info[1]);
            url[i] = obj;
        }
        // 如果传入一个参数名称，就匹配其值
        if (name) {
            for (var i = 0; i < url.length; i++) {
                for (const key in url[i]) {
                    if (key == name) {
                        nameres = url[i][key];
                    }
                }
            }
        } else {
            nameres = url;
        }
        console.log(nameres);

        // 返回结果
        return nameres;
    }
    // 获取文章的ID
    var id = getUrlParams('id')
    var form = layui.form
    var state = ''

    initArtEdit(id)
    initCate()

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

    // 根据ID发送ajax数据请求 
    function initArtEdit(id) {
        $.ajax({
            url: '/my/article/' + id,
            method: 'GET',
            success: function(res) {
                console.log(res);

                form.val('form-edit', res.data)
                state = res.data.state
                console.log(state);


            }
        })
    }

    // 监听表单的提交行为
    $('#form-edit').submit(function(e) {
            e.preventDefault()
                // 快速创建FormData
            var fd = new FormData($(this)[0])
            fd.append('Id', id)
            fd.append('state', state)
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                    console.log(blob);

                    // 得到文件对象后，进行后续的操作
                    fd.append('cover_img', blob)
                    for (var key of fd.keys()) {
                        console.log('key:' + key + 'value:' + fd.get(key));
                    }
                    EditArticle(fd)
                })

        })
        // 
    function EditArticle(fd) {
        $.ajax({
            url: '/my/article/edit',
            method: 'POST',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章失败！')
                }
                layer.msg('修改文章成功！')
                    // location.href = '/article/art-list.html'

            }
        })
    }

})