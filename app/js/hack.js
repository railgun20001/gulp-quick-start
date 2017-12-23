// 浏览器兼容解决

// placeholder
if (!('placeholder' in document.createElement('input'))) {
    $('input[placeholder],textarea[placeholder]').each(function () {
        var that = $(this),
            text = that.attr('placeholder')
        if (that.val() === "") {
            that.val(text).addClass('placeholder')
        }
        that.focus(function () {
                if (that.val() === text) {
                    that.val("").removeClass('placeholder')
                }
            })
            .blur(function () {
                if (that.val() === "") {
                    that.val(text).addClass('placeholder')
                }
            })
            .closest('form').submit(function () {
                if (that.val() === text) {
                    that.val('')
                }
            })
    })
}

// 判断ie
var isIE = function(ver){
    var b = document.createElement('b')
    b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
    return b.getElementsByTagName('i').length === 1
}