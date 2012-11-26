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