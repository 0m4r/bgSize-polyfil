/*
 * background-size polyfil
 * author: Omar '@0m4r' Adobati
 * source at: https://github.com/0m4r/bgSize-polyfil
 *
 * inspired by: https://gist.github.com/3081898
 * */
!function($) {

    var methods = {
        init: function(opt) {

            if (opt) {
                if (!opt.force && "backgroundSize" in document.body.style) {
                    return;
                }

                var options = opt;
                var newImg = new Image();
                options.img = newImg;
                options.$that = $(this);
                newImg.onload = function() {
                    methods.doit.call(this, options);
                };
                newImg.src = options.backgroundImage;
            }
            else {
                $.error('Invalid arguments number: ', arguments);
            }
        },

        doit: function(opt) {
            var $that = opt.$that;
            var options = opt;

            var w, h = 'auto';
            options.$img = createBgImage(options.backgroundImage);
            options.container_w = $that.width(),
            options.container_h = $that.height(),
            options.img_w = (options.img).width,
            options.img_h = (options.img).height,
            options.container_ratio = $that.width() / $that.height();

            if (options.backgroundSize) {
                var bSize = options.backgroundSize;
                switch (bSize) {
                case 'auto':
                    break;
                case 'cover':
                    /*
                     * ‘cover’
                     * Scale the image, while preserving its intrinsic aspect ratio (if any),
                     * to the smallest size such $that both its width and its height can completely
                     * cover the background positioning area.
                     */
                    (function() {
                        methods.applyCover.call(this, options);
                    })();
                    break;
                case 'contain':
                    /*
                     * ‘contain’
                     * Scale the image, while preserving its intrinsic aspect ratio (if any),
                     * to the largest size such $that both its width and its height can fit inside
                     * the background positioning area.
                     */
                    (function() {
                        methods.applyContain.call(this, options);
                    })();

                    break;
                default:
                    (function() {
                        var tmp = bSize.split(' ');
                        if (tmp.length == 1) {
                            w = tmp[0];
                        }
                        else {
                            w = tmp[0];
                            h = tmp[1];
                        }
                    })();
                }
            }
            else {
                $.error('Invalid options: no "options.backgroundSize" property specified', options);
            }
        },

        cover: function(options) {
            if (options) options.backgroundSize = 'cover';
            methods.init.call(this, options);

        },

        applyCover: function(options) {
            var w, h = 'auto';
            var $that = options.$that;
            var container_ratio = options.container_ratio || '1',
                container_w = options.container_w,
                container_h = options.container_h,
                $img = options.$img,
                img_w = options.img_w,
                img_h = options.img_h;

            if (container_ratio > 1) {
                if (img_w / container_w > img_h / container_h) {
                    h = container_h;
                    w = img_w / img_h * h;
                }
                else {
                    w = container_w;
                    h = img_h / img_w * w;
                }
            }
            else {
                w = 'auto';
                h = '100%';
            }

            $img = restyleBgImage($img, w, h);
            $that = restyleContainer($that, options);
            var $bg_container = createBgContainer(options);

            $that.wrap($bg_container);
            $img.insertBefore($that);
        },

        contain: function(options) {
            options.backgroundSize = 'contain';
            methods.init.call(this, options);

        },

        applyContain: function(options) {
            var w, h = 'auto';
            var $that = options.$that;
            var container_w = options.container_w,
                container_h = options.container_h,
                $img = options.$img,
                img_w = options.img_w,
                img_h = options.img_h;

            var bgRepeat = $that.css('background-repeat');

            if (options.container_ratio > 1) {
                if (img_w / options.container_w > img_h / container_h) {
                    w = container_w;
                    h = img_h / img_w * w;
                }
                else {
                    h = container_h;
                    w = img_w / img_h * h;
                }
            }
            else {
                var ratio = img_h / img_w;
                w = container_w;
                h = ratio * w;
            }

            $img = restyleBgImage($img, w, h);
            $that = restyleContainer($that, options);
            var $bg_container = createBgContainer(options);

            switch (bgRepeat) {
            case 'repeat-y':
                $that.wrap($bg_container);
                repeatY($img, container_h / h, $that);
                break;
            case 'repeat-x':
                $that.wrap($bg_container);
                repeatX($img, container_w / w, $that);
                break;
            case 'no-repeat':
                $that.wrap($bg_container);
                $img.insertBefore($that);
                break;
            default:
                $that.wrap($bg_container);
                repeatX($img, container_w / w, $that);
                repeatY($img, container_h / h, $that);
            }
        }
    };

    var restyleContainer = function($el, options) {
        return $el.css({
            'position': 'relative',
            'top': 0,
            'left': 0,
            'height': options.container_h,
            'width': options.container_w,
        });
    };

    var restyleBgImage = function($el, w, h) {
        return $el.css({
            'width': w,
            'height': h
        });
    };

    var createBgImage = function(bgImgSrc) {
        return $('<img />').attr('src', bgImgSrc).css({
            'position': 'absolute',
            'top': '0',
            'left': '0',
            'background': 'none',
            'border': 'none',
            'z-index': '-10',
            'padding': '0',
            'margin': '0',
            'outline': '0'                       
        });
    };

    var createBgContainer = function(options) {
        return $('<div/>').css({
            'position': 'relative',
            'overflow': 'hidden',
            'height': options.container_h,
            'width': options.container_w,
            'background': 'none',
            'padding': 0,
            'margin': 0,
            'outline': 0,
        });
    };

    var repeatY = function($bgImg, copies, $parent) {
        var repeat = copies;
        var $img = $bgImg;
        var $prnt = $parent;
        for (var j = 0; j < repeat; j++) {
            var top = parseInt($img.height(), 0);
            var $img_clone = $img.clone();
            $img_clone.css({
                'top': (top * j) + 'px'
            }).insertBefore($prnt);
        }
    };

    var repeatX = function($bgImg, copies, $parent) {
        var repeat = copies;
        var $img = $bgImg;
        var $prnt = $parent;
        for (var j = 0; j < repeat; j++) {
            var top = parseInt($img.width(), 0);
            var $img_clone = $img.clone();
            $img_clone.css({
                'left': (top * j) + 'px'
            }).insertBefore($prnt);
        }
    };
    
    $.fn.bgSize = function(method) {
        // Method calling logic
        if (arguments.length > 0) {;
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            }
            else if (typeof method === 'object' || !method) {
                return methods.init.apply(this, arguments);
            }
            else {
                $.error('Method ' + method + ' does not exist on jQuery.bgSize');
            }
        }
        else {
            $.error('Invalid arguments number: ', arguments);
        }
    };

}(window.jQuery);