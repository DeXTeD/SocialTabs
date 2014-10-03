
/*!
 * SocialTabs
 * Version 1.2.0
 * Full source at https://github.com/dexted/SocialTabs
 * Copyright (c) 2013 Kacper Kozak
 * MIT License
 */

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], function($) {
			return factory($);
		});
	} else {
		// Browser globals
		root.SocialTabs = factory(root.jQuery || root.Zepto || root.$);
	}
}(this, function ($) {

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

		frames: {
			facebook: function(href, options) {
				return '<iframe src="http://www.facebook.com/plugins/likebox.php?href='+href+'&amp;width=234&amp;height=260&amp;colorscheme=light&amp;show_faces=true&amp;border_color=white&amp;stream=false&amp;header=false" scrolling="no" frameborder="0" style="width:234px; height:260px; margin: -1px" allowTransparency="true"></iframe>';
			},
			youtube: function(user, options) {
				return '<iframe src="http://www.youtube.com/subscribe_widget?gl=PL&amp;hl=pl&amp;p='+user+'" style="height: 100px; width: 234px; border: 0; margin:-1px;" scrolling="no" frameBorder="0"></iframe>';
			},
			twitter: function(id, options) {
				return '<a class="twitter-timeline" href="#" data-widget-id="'+id+'"></a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?"http":"https";if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>';
			},
			google: function(href, options) {
				return '<div class="g-page" data-width="234" data-height="500" data-href="'+href+'"></div><script type="text/javascript" src="https://apis.google.com/js/plusone.js"></script>';
			}
		},

		/**
		 * Inicjuje SocialTabs dodając wszystkie strony
		 * oraz sprawdza czy przeglądara obsługuje CSS3 Transform
		 * @param  {object} services
		 */
		init: function(services) {
			var self = this;
			$.each(services, $.proxy(self.addService,this));

			// Sprawdzamy czy mamy Transform
			var support = false,
				divStyle = document.createElement("div").style,
				suffix = "Transform",
				test = [
					"O" + suffix,
					"ms" + suffix,
					"Webkit" + suffix,
					"Moz" + suffix
				],
				i = test.length;

			while( i-- ) {
				if ( test[i] in divStyle ) {
					support = true;
					continue;
				}
			}

			// Dodajemy klasę "socialTabs--noTransform" jak nie ma
			if(!support) {
				this.wrapper.addClass(this.getClass('-noTransform'));
			}
		},

		/**
		 * Dodaje nową stronę
		 * @param  {string} name
		 * @param  {string} code kod lub adres strony
		 * @return {object}
		 */
		addService: function(name, code) {
			if(!code) return;
			var service = {
					name: name,
					code: code,
					release: this.getReleaseCode(name, code),
					el: this.newTab(name)
				};
			this.services.push(service);
			this.bind(service);
			this.wrapper.append(service.el.tab);
			if (this.config.appendDelay === false) {
				setTimeout(function() {
					service.el.content.append(service.release);
					service.appended = true;
				}, 1);
			}
			return service;
		},

		/**
		 * Wysuwa panel z opóźnieniem
		 * @param  {object} service
		 */
		show: function(service) {
			var self = this;
			clearTimeout(service._showTimer);
			service._showTimer = setTimeout(function() {
				service.el.tab.addClass(self.getOpenClass());
				if (!service.appended) {
					clearTimeout(service._appendTimer);
					service._appendTimer = setTimeout(function() {
						service.el.content.append(service.release);
						service.appended = true;
					}, self.config.appendDelay);
				}
			}, self.config.showDelay);
		},

		/**
		 * Ukrywa wskazany panel
		 * @param  {object} service
		 */
		hide: function(service) {
			var self = this;
			clearTimeout(service._showTimer);
			clearTimeout(service._appendTimer);
			clearTimeout(service._hideTimer);
			service._hideTimer = setTimeout(function() {
				service.el.tab.removeClass(self.getOpenClass());
			}, this.config.hideDelay);
		},

		/**
		 * Ukrywa wszystkie panele
		 */
		hideAll: function() {
			var self = this;
			$.each(this.services, function(i, service) {
				self.hide(service);
			});
		},

		/**
		 * Ukrywa lub wysuwa na zmianę wskazany panel
		 * @param  {object} service
		 */
		toggle: function(service) {
			if (service.el.tab.hasClass(this.getOpenClass())) {
				this.hide(service);
			} else {
				this.show(service);
			}
		},

		/**
		 * Binduje wskazany panel
		 * @param  {object} service
		 */
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

		/**
		 * Generuje kod widgetu na podstawie nazwy oraz
		 * tworzy warstwę i wrzuca w nią wygenerowany kod
		 * @param  {string} name
		 * @param  {string} code
		 * @return {jQuery object}
		 */
		getReleaseCode: function(name, code) {
			if (typeof this.frames[name] !== 'undefined') {
				code = this.frames[name](code);
			}
			return $('<div/>', {
					'class': this.getClass('tab-content-inner')
				}).append(code);
		},

		/**
		 * Tworzy nową zakładkę
		 * @param  {string} name
		 * @return {object}
		 */
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

		/**
		 * Usuwa taby
		 */
		destroy: function() {
			this.wrapper.remove();
		},

		/**
		 * Taki mały helper, tworzy klasę dodając bazowy prefiks
		 * @param  {string} name
		 * @return {string}
		 */
		getClass: function(name) {
			return this.config.baseClass+(name ? '-'+name : '');
		},

		/**
		 * Generuje klasę otwartego panelu
		 * @return {string}
		 */
		getOpenClass: function() {
			return this.getClass('tab--open');
		},
	};

	return SocialTabs;

}));