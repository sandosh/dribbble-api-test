(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"app": function(exports, require, module) {
  var App = {
  	initialize: function initialize() {
  		var TabView = require('views/tab');
  		var Gallery = require('views/gallery');
  		var Router = require('router');
  		require('dust_extension');
  		require('infinite_scroll');
  		require('spinner');

  		this.tab_view = new TabView();
  		this.gallery_view = new Gallery({
  			available_lists: this.tab_view.available_lists
  		});
  		this.router = new Router();

  		if (typeof Object.freeze === 'function') Object.freeze(this);
  	}
  };

  Backbone.Mediator.subscribe('App:show', function subcribeCallback(list_type){
  	App.tab_view.switchTabFor(list_type)
  	App.gallery_view.showList(list_type);
  	App.router.navigate(list_type, {
  		trigger: false
  	});
  });


  module.exports = App;
}});

window.require.define({"collections/shots": function(exports, require, module) {
  var Shot = require('models/shot');
  module.exports = Backbone.Collection.extend({
  	model: Shot,
  	list_type: 'popular',
  	loading: true,
  	current_page: 1,
  	per_page: 18,
  	url: function url() {
  		return [
  			'http://api.dribbble.com/shots/', this.list_type,
  			'?page=', this.current_page,
  			'&per_page=', this.per_page
  		].join('');
  	},
  	sync: function(method, model, options) {
  		_.extend(options, {
  			dataType: 'jsonp'
  		});
  		model.loading = true;
  		$jqxhr = Backbone.sync(method, model, options);
  		$jqxhr.complete(function jqxhrComplete(){
  			model.loading = false;
  		});
  		return $jqxhr;
  	},
  	parse: function(data) {
  		this.current_page = data.page;
  		this.pages = data.pages;
  		return data.shots;
  	},
  	nextPage: function() {
  		if (this.current_page < this.pages) {
  			this.current_page++;
  			return this.fetch({
  				add: true
  			});
  		}
  	}
  });
}});

window.require.define({"dust_extension": function(exports, require, module) {
  dust.onLoad = function dustOnLoad(template_name, callback) {
  	var template_source = require('views/templates/' + template_name);
  	if (template_source) {
  		callback.call(dust, null, template_source);
  	} else {
  		callback.call(dust, 'Template Not Found');
  	}
  }

  dust.compile = function(source, name) {
  	return source;
  }
}});

window.require.define({"infinite_scroll": function(exports, require, module) {
  $(function() {
  	var startLoadingAtPx = 20;
  	var $document = $(document);
  	var $window = $(window);

  	var checkIfReachingEnd = function checkIfReachingEnd() {
  		var scrollTop = $window.scrollTop();
  		return scrollTop + 40 >= $document.height() - $window.height();
  	};

  	$window.on('smartscroll', function smartscrollCallback() {
  		if (checkIfReachingEnd()) {
  			Backbone.Mediator.publish('scroller.bottom');
  		}
  	});
  });
}});

window.require.define({"init": function(exports, require, module) {
  var app = require('app');

  $(function DOMReady(argument) {
  	app.initialize();
  	Backbone.history.start();

  	window.app = app;
  });
}});

window.require.define({"models/shot": function(exports, require, module) {
  module.exports = Backbone.Model.extend({
  	
  });
}});

window.require.define({"router": function(exports, require, module) {
  module.exports = Backbone.Router.extend({
  	routes: {
  		"": "showPopular",
  		":list_type": "showList"
  	},
  	showList: function showList(list_type) {
  		Backbone.Mediator.publish('App:show', list_type);
  	},
  	showPopular: function showPopular() {
  		this.showList('popular');
  	}
  });
}});

window.require.define({"spinner": function(exports, require, module) {
  $(function() {
  	var $footer = $('footer');
  	new Spinner({
  			color: '#999',
  			lines: 13,
  			radius: 5,
  			length: 5,
  			width: 2
  		}).spin($('.spinner').get()[0]);

  	Backbone.Mediator.subscribe('spinner.show', function() {
  		$footer.show();
  	});
  	Backbone.Mediator.subscribe('spinner.hide', function() {
  		$footer.hide();
  	});
  });
}});

window.require.define({"views/gallery": function(exports, require, module) {
  var ShotView = require('views/shot');
  var Collection_Shots = require('collections/shots');
  var collections = {};

  module.exports = Backbone.View.extend({
  	el: 'section',
  	initializeCollections: function initializeCollections(available_lists) {
  		_.each(available_lists, function(list_type){
  			if (list_type == 'popular') {
  				collections[list_type] = new Collection_Shots();
  			} else {
  				var Collection_Shots_Custom = Collection_Shots.extend({
  					list_type: list_type
  				});
  				collections[list_type] = new Collection_Shots_Custom();
  			}
  			collections[list_type].fetch();
  		});
  		this.collections = collections;
  		this.$container = this.$el.find('ol');
  		Backbone.Mediator.subscribe('scroller.bottom', this.loadMore, this);
  		this.$el.hide();
  	},
  	initialize: function initializeGallery(options) {
  		this.initializeCollections(options.available_lists);
  	},
  	showList: function(list_type) {
  		if (this.collection) {
  			this.collection.off();
  		}
  		this.collection = collections[list_type];
  		this.$el.hide();
  		if (this.collection.loading) {
  			this.collection.on('reset', this.render, this);			
  		} else {
  			this.render();
  		}
  		this.collection.on('add', this.renderOne, this);
  	},
  	render: function() {
  		this.$container.html('');
  		_.each(this.collection.models, this.renderOne, this);
  		this.$el.show();
  		Backbone.Mediator.publish('spinner.hide');
  	},
  	renderOne: function(model) {
  		var shot_view = new ShotView({
  			model: model
  		});
  		this.$container.append(shot_view.$el);
  		shot_view.render();
  	},
  	loadMore: function() {
  		if (this.collection && !this.collection.loading) {
  			var $jqxhr = this.collection.nextPage();
  			if ($jqxhr) {
  				Backbone.Mediator.publish('spinner.show');
  				$jqxhr.complete(function() {
  					Backbone.Mediator.publish('spinner.hide');
  				});
  			}
  		}
  	}
  });
}});

window.require.define({"views/shot": function(exports, require, module) {
  var Shot = require('models/shot');

  module.exports = Backbone.View.extend({
  	model: Shot,
  	template: 'shot',
  	tagName: 'li',
  	render: function renderShot() {
  		var self = this;
  		dust.render(this.template, this.model.toJSON(), function dustRenderCallback(error, output) {
  			if (!error) {
  				self.$el.html(output);
  			}
  		});
  	}
  });
}});

window.require.define({"views/tab": function(exports, require, module) {
  module.exports = Backbone.View.extend({
  	el: 'nav',
  	initialize: function initialize() {
  		this.available_lists = _.map(this.$el.find('a'), function(el){
  			return $(el).attr('data-list-type');
  		});
  	},
  	events: {
  		'click a': 'tabClicked'
  	},
  	tabClicked: function(event) {
  		event.preventDefault();

  		$active_tab = $(event.target);
  		this.switchTab($active_tab);

  		var list_type = $active_tab.attr('data-list-type');
  		Backbone.Mediator.pub('App:show', list_type);
  	},
  	switchTab: function($tab) {
  		this.$el.find('li.active').removeClass('active');
  		$tab.parent('li').addClass('active');
  	},
  	switchTabFor: function(list_type) {
  		this.switchTab(this.$el.find('[data-list-type="' + list_type + '"]'));
  	}
  });
}});

window.require.define({"views/templates/shot": function(exports, require, module) {
  module.exports = "(function(){dust.register(\"shot\",body_0);function body_0(chk,ctx){return chk.write(\"<figure><div class=\\\"shadow\\\"></div><img src=\\\"\").reference(ctx.get(\"image_teaser_url\"),ctx,\"h\").write(\"\\\" alt=\\\"\").reference(ctx.get(\"title\"),ctx,\"h\").write(\"\\\"><figcaption>\").helper(\"if\",ctx,{\"block\":body_1},{\"cond\":body_4}).helper(\"if\",ctx,{\"block\":body_5},{\"cond\":body_8}).write(\"</figcaption></figure>\");}function body_1(chk,ctx){return chk.write(\"<span class=\\\"button\\\"><i class=\\\"icon-star\\\"></i>\").reference(ctx.get(\"likes_count\"),ctx,\"h\").write(\" Like\").helper(\"if\",ctx,{\"block\":body_2},{\"cond\":body_3}).write(\"</span>\");}function body_2(chk,ctx){return chk.write(\"s\");}function body_3(chk,ctx){return chk.write(\"'\").reference(ctx.get(\"likes_count\"),ctx,\"h\").write(\"' > 1\");}function body_4(chk,ctx){return chk.write(\"'\").reference(ctx.get(\"likes_count\"),ctx,\"h\").write(\"' > 0\");}function body_5(chk,ctx){return chk.write(\"<span class=\\\"button\\\"><i class=\\\"icon-comment\\\"></i>\").reference(ctx.get(\"comments_count\"),ctx,\"h\").write(\" Comment\").helper(\"if\",ctx,{\"block\":body_6},{\"cond\":body_7}).write(\"</span>\");}function body_6(chk,ctx){return chk.write(\"s\");}function body_7(chk,ctx){return chk.write(\"'\").reference(ctx.get(\"comments_count\"),ctx,\"h\").write(\"' > 1\");}function body_8(chk,ctx){return chk.write(\"'\").reference(ctx.get(\"comments_count\"),ctx,\"h\").write(\"' > 0\");}return body_0;})();";
}});

