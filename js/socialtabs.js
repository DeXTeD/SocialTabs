
/*
 * SocialTabs
 */

function SocialTabs (services, config) {
	this.services = [];
	this.config = $.extend({}, this._config, config);
	if (this.config.action === 'click') {
		this.config.hideDelay = 0;
		this.config.showDelay = 0;
	}
	this.wrapper = $('<div/>', {
		'class': this.getClass()
	});
	this.init(services);
	this.wrapper.appendTo(document.body);
}

SocialTabs.prototype = {
	_config: {
		action: 'hover',
		baseClass: 'socialTabs',
		appendDelay: 500,
		hideDelay: 100,
		showDelay: 200
	},

	init: function(services) {
		var self = this;
		$.each(services, function(name, code) {
			self.addService(name, code);
		});
	},

	addService: function(name, code) {
		var service = {
			name: name,
			code: code,
			release: this.getReleaseCode(name, code),
			el: this.newTab(name)
		};
		this.services.push(service);
		this.bind(service);
		this.wrapper.append(service.el.tab);
		return service;
	},

	show: function(service) {
		var self = this;
		clearTimeout(service._showTimer);
		service._showTimer = setTimeout(function() {
			service.el.tab.addClass(self.getOpenClass());
			if (!service.appended) {
				var content = service.release;
				clearTimeout(service._appendTimer);
				service._appendTimer = setTimeout(function() {
					service.el.content.append(content);
					service.appended = true;
				}, self.config.appendDelay);
			}
		}, self.config.showDelay);
	},

	hide: function(service) {
		var self = this;
		clearTimeout(service._showTimer);
		clearTimeout(service._appendTimer);
		clearTimeout(service._hideTimer);
		service._hideTimer = setTimeout(function() {
			service.el.tab.removeClass(self.getOpenClass());
		}, this.config.hideDelay);
	},

	hideAll: function() {
		var self = this;
		$.each(this.services, function(i, service) {
			self.hide(service);
		});
	},

	toggle: function(service) {
		if (service.el.tab.hasClass(this.getOpenClass())) {
			return this.hide(service);
		}
		else {
			return this.show(service);
		}
	},

	bind: function(service) {
		var self = this,
			action = this.config.action,
			tab = service.el.tab;

		if (action === 'hover') {
			tab.on('mouseenter mouseleave', function(event) {
				if (event.type === 'mouseenter') {
					self.show(service);
				} else {
					self.hide(service);
				}
			});
		} else if (action === 'click') {
			tab.on('click', function() {
				self.hideAll();
				self.toggle(service);
			});
			$('body').on('click', function(event) {
				if (!$(event.target).closest(self.wrapper).length) {
					self.hideAll();
				}
			});
		} else {
			return $.error('Nie istniejąca akcja: '+action);
		}
	},

	getReleaseFrame: function(name, code) {
		switch(name) {
		case 'facebook':
			return '<iframe src="http://www.facebook.com/plugins/likebox.php?href='+code+'&amp;width=234&amp;height=260&amp;colorscheme=light&amp;show_faces=true&amp;border_color=white&amp;stream=false&amp;header=false" scrolling="no" frameborder="0" style="width:234px; height:260px; margin: -1px;" allowTransparency="true"></iframe>';
		case 'youtube':
			return '<iframe src="http://www.youtube.com/subscribe_widget?gl=PL&amp;hl=pl&amp;p='+code+'" style="height: 100px; width: 234px; border: 0; margin:-1px;" scrolling="no" frameBorder="0"></iframe>';
		case 'twitter':
			return '<a class="twitter-timeline" href="#" data-widget-id="'+code+'"></a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?"http":"https";if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>';
		case 'google':
			return '<div class="g-page" data-width="234" data-height="500" data-href="'+code+'"></div><script type="text/javascript" src="https://apis.google.com/js/plusone.js"></script>';
		default:
			return code;
		}
	},

	getReleaseCode: function(name, code) {
		return $('<div/>', {
				'class': this.getClass('tab-content-inner')
			}).append(this.getReleaseFrame(name, code));
	},

	newTab: function(name) {
		var tab = $('<div/>', {
				'class': this.getClass('tab')+' '+this.getClass('tab--'+name)
			}),
			content = $('<div />', {
				'class': this.getClass('tab-content')
			});
		tab.append(content);
		return {
			tab: tab,
			content: content
		};
	},

	getClass: function(name) {
		return this.config.baseClass+(name ? '-'+name : '');
	},

	getOpenClass: function() {
		return this.getClass('tab--open');
	}
};

