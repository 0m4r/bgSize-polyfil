
/* 
 * background-size polyfil 
 * source: https://gist.github.com/3081898
 * */
!function($) {

    "use strict"; // jshint ;_;

	var BGSize = function(element, options) {
		this.$element = $(element);
		this.options = options;

		this.init();
	};

	BGSize.prototype = {
		init : function() {
			
			if ("backgroundSize" in document.body.style) {
				return;
			}

			var that = this;
			var img = $('<img />').attr('src', this.options.backgroundImage);

			var w, h = 'auto';
			var container_w = that.$element.width(), container_h = that.$element
					.height();
			if (this.options.backgroundSize) {
				var bSize = this.options.backgroundSize;
				switch (bSize) {
				case 'auto':
					break;
				case 'cover':
					(function() {
						if (container_w === container_h) {
							w = container_w;
						} else if (container_w > container_h) {
							w = container_h;
						} else {
							w = container_w;
						}
					})();
					break;
				case 'contain':
					(function() {
						w = that.$element.width();
						that.$element.css({
							'position' : 'relative',
							'overflow' : 'hidden',
							'height' : container_h
						});
						img.css({
							'position' : 'absolute',
							'top' : that.options.top || '0',
							'left' : that.options.left || '0'
						});
					})();
					break;
				default:
					(function() {
						var tmp = bSize.split(' ');
						if (tmp.length == 1) {
							w = tmp[0]
						} else {
							w = tmp[0]
							h = tmp[1];
						}
					})();
				};

				img.css({
					'width' : w,
					'height' : h,
					'z-index' : '0',
					'background' : 'none',
					'border' : 'none'
				});
				that.$element.css({
					'background' : 'none',
					'padding' : 0
				});
				
				that.$element.find(':first-child').css({
					'display' : 'inline',
					'*display' : 'inline',
					'*zoom' : '1',
					'vertical-align' : 'middle'
				});

				if (that.options.position === 'right')
					that.$element.append(img);
				else if (that.options.position === 'left')
					that.$element.prepend(img);
			}
		}
	};

	$.fn.bgSize = function(option) {
		return this.each(function() {
			var $this = $(this), 
                options = $.extend({}, $.fn.bgSize.defaults, typeof option == 'object' && option);
			$this.data('bgSize', (new BGSize(this, options)));
		});
	};
    
    $.fn.bgSizeContain = function(option){
        if(!option) option = {};
        option.backgroundSize = 'contain';
        this.bgSize.call(this, option);
    };

	$.fn.bgSize.defaults = {
		backgroundImage : '/img/your_placemark_here.png'
	};

	$.fn.bgSize.Constructor = BGSize;

}(window.jQuery);