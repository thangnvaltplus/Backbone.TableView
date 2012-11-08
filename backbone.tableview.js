// Generated by CoffeeScript 1.3.3

/*
TableView
---------
*/


/*
A View that can be used with any backbone collection, and draws a table with it.
Optionally it supports pagination, search, and any number of filters
("inputs", "button", "option"). Eg (Users is a Backbone.Collection):

    class UserTableView extends Backbone.TableView
        title: "My Users Table"
        collection: new Users()
        columns:
            name:
                header: "My Name"
            type:
                header: "Type"
            last_login:
                header: "Last Login Time"
                draw: (model) ->
                    new Date(model.get 'time')
        pagination: true
        search:
            query: "name"
            detail: "Search by Name"
        filters:
            from:
                type: "input"
                className: "date"
                init: new Date()
                get: (val) ->
                    ... process the date val ...
            my_button:
                type: "button"
            status:
                type: "option"
                options: ["all", "valid", "invalid"]
*/


(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Backbone.TableView = (function(_super) {

    __extends(TableView, _super);

    function TableView() {
      this.render = __bind(this.render, this);

      this.toggleSort = __bind(this.toggleSort, this);

      this.nextPage = __bind(this.nextPage, this);

      this.prevPage = __bind(this.prevPage, this);

      this.toPage = __bind(this.toPage, this);

      this.renderData = __bind(this.renderData, this);

      this.refreshPagination = __bind(this.refreshPagination, this);

      this.update = __bind(this.update, this);

      this.updateUrl = __bind(this.updateUrl, this);

      this.updateSearch = __bind(this.updateSearch, this);

      this.createFilter = __bind(this.createFilter, this);

      this.setData = __bind(this.setData, this);
      return TableView.__super__.constructor.apply(this, arguments);
    }

    TableView.prototype.tagName = "div";

    TableView.prototype.titleTemplate = _.template("<div class=\"<%= classSize %>\">\n    <h4 class=\"<%= model.className || \"\" %>\"><%= model.name || model %></h4>\n</div>");

    TableView.prototype.filtersTemplate = _.template("<div class=\"filters controls pagination-centered <%= classSize %>\">\n</div>");

    TableView.prototype.searchTemplate = _.template("<div class=\"<%= classSize %>\">\n    <input type=\"text\" class=\"search-query input-block-level pull-right\" placeholder=\"<%= model.detail || model %>\" value=\"<%- data[model.query || \"q\"] || \"\" %>\"></input>\n</div>");

    TableView.prototype.paginationTemplate = _.template("<div class=\"row-fluid\">\n    <div class=\"span6\">\n        <div class=\"tableview-info\">Showing <%= from %> to <%= to %><%= total %></div>\n    </div>\n    <div class=\"span6\">\n        <div class=\"pagination tableview-pagination\">\n            <ul>\n                <li class=\"pager-prev <%= prevDisabled %>\"><a href=\"javascript:void(0)\">← Previous</a></li>\n                <% _.each(pages, function (page) { %>\n                    <li class=\"pager-page <%= page.active %>\"><a href=\"javascript:void(0)\"><%= page.number %></a></li>\n                <% }) %>\n                <li class=\"pager-next <%= nextDisabled %>\"><a href=\"javascript:void(0)\">Next → </a></li>\n            </ul>\n        </div>\n    </div>\n</div>");

    TableView.prototype.emptyTemplate = _.template("<tr>\n    <td colspan=\"10\"><%= text %></td>\n</tr>");

    TableView.prototype.columnsTemplate = _.template("<% _.each(model, function (col, key) { %>\n    <th abbr=\"<%= key || col %>\"\n     class=\"<%= !col.nosort ? \"tableview-sorting\" : \"\" %> <%= ((key || col) == data.sort_col) ? \"tableview-sorting-\" + data.sort_dir : \"\" %> <%= col.className || \"\" %>\">\n        <%= col.header || key %>\n    </th>\n<% }) %>");

    TableView.prototype.template = _.template("<div class=\"row-fluid\">\n    <%= title %>\n\n    <%= filters %>\n\n    <%= search %>\n</div>\n\n<table class=\"table table-striped tableview-table\">\n    <thead>\n        <tr>\n            <%= columns %>\n        </tr>\n    </thead>\n    <tbody class=\"fade\">\n    </tbody>\n</table>\n\n<div id=\"pagination-main\">\n</div>");

    TableView.prototype.events = {
      "change .search-query": "updateSearch",
      "click  th": "toggleSort",
      "click  .pager-page:not(.active)": "toPage",
      "click  .pager-prev:not(.disabled)": "prevPage",
      "click  .pager-next:not(.disabled)": "nextPage"
    };

    TableView.prototype.initialize = function() {
      var key, val, _ref, _ref1, _ref2;
      this.collection.on("reset", this.renderData);
      _ref = this.options;
      for (key in _ref) {
        val = _ref[key];
        this[key] = val;
      }
      this.data = _.extend({}, this.initialData);
      if (this.router) {
        this.data = _.extend(this.data, this.parseQueryString(Backbone.history.fragment));
      }
      if (this.pagination) {
        this.data.page = (_ref1 = parseInt(this.data.page) || this.page) != null ? _ref1 : 1;
        this.data.size = (_ref2 = parseInt(this.data.size) || this.size) != null ? _ref2 : 10;
      }
      return this;
    };

    TableView.prototype.parseQueryString = function(uri) {
      var decode, i, match, ret, search;
      ret = {};
      if (uri && (i = uri.indexOf("?")) >= 0) {
        uri = uri.substring(i + 1);
        search = /([^&=]+)=?([^&]*)/g;
        decode = function(s) {
          return decodeURIComponent(s.replace(/\+/g, " "));
        };
        while (match = search.exec(uri)) {
          ret[decode(match[1])] = decode(match[2]);
        }
      }
      return ret;
    };

    TableView.prototype.setData = function() {
      var args, key, val, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this.pagination) {
        this.data.page = 1;
      }
      while (args.length > 1) {
        _ref = args, key = _ref[0], val = _ref[1], args = 3 <= _ref.length ? __slice.call(_ref, 2) : [];
        if ((val != null) && (val === false || val === 0 || val)) {
          this.data[key] = val;
        } else {
          delete this.data[key];
        }
      }
      return this.update();
    };

    TableView.prototype.createFilter = function(name, filter) {
      var options, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      options = {
        id: name,
        extraId: filter.extraId,
        name: (_ref = filter.name) != null ? _ref : this.prettyName(name),
        off: (_ref1 = filter.off) != null ? _ref1 : "false",
        on: (_ref2 = filter.on) != null ? _ref2 : "true",
        filterClass: (_ref3 = filter.className) != null ? _ref3 : "",
        options: filter.options,
        init: ((_ref8 = filter.set) != null ? _ref8 : _.identity)((_ref4 = (_ref5 = this.data[name]) != null ? _ref5 : filter.init) != null ? _ref4 : "", (_ref6 = (_ref7 = this.data[filter.extraId]) != null ? _ref7 : filter.extraInit) != null ? _ref6 : ""),
        setData: this.setData,
        get: (_ref9 = filter.get) != null ? _ref9 : _.identity,
        getExtraId: (_ref10 = filter.getExtraId) != null ? _ref10 : _.identity
      };
      switch (filter.type) {
        case "option":
          return new Backbone.TableView.ButtonOptionFilter(options);
        case "dropdown":
          return new Backbone.TableView.DropdownFilter(options);
        case "input":
          return new Backbone.TableView.InputFilter(options);
        case "button":
          if (!options.init) {
            options.init = (_ref11 = filter.off) != null ? _ref11 : "false";
          }
          return new Backbone.TableView.ButtonFilter(options);
        case "buttongroup":
          return new Backbone.TableView.ButtonGroupFilter(options);
        case "custom":
          filter.setData = this.setData;
          filter.init = ((_ref14 = filter.set) != null ? _ref14 : _.identity)((_ref12 = (_ref13 = this.data[name]) != null ? _ref13 : filter.init) != null ? _ref12 : "");
          return filter;
      }
    };

    TableView.prototype.updateSearch = function(e) {
      return this.setData(this.search.query || "q", e.currentTarget.value);
    };

    TableView.prototype.updateUrl = function(replace) {
      var i, param, uri;
      if (this.router) {
        uri = Backbone.history.fragment;
        if ((i = uri.indexOf("?")) >= 0) {
          uri = uri.substring(0, i);
        }
        param = $.param(this.data);
        if (param) {
          uri += "?" + param;
        }
        this.router.navigate(uri, {
          replace: replace
        });
      }
      return this;
    };

    TableView.prototype.update = function(replace, skipFetch) {
      this.$("tbody").removeClass("in");
      this.trigger("updating");
      this.updateUrl(replace);
      if (!skipFetch) {
        this.collection.fetch({
          data: (typeof this.filterData === "function" ? this.filterData(_.clone(this.data)) : void 0) || this.data
        });
      } else {
        this.renderData();
      }
      return this;
    };

    TableView.prototype.refreshPagination = function() {
      var from, i, max, maxPage, pageFrom, pageTo, pages, to, total;
      from = (this.data.page - 1) * this.data.size;
      to = from + this.collection.size();
      if (this.collection.size() > 0) {
        from++;
      }
      max = this.collection.count != null ? _.result(this.collection, "count") : -1;
      if (max < 0) {
        maxPage = 1;
        pageFrom = this.data.page;
        pageTo = this.data.page;
        total = "";
      } else {
        maxPage = Math.ceil(max / this.data.size) || 1;
        pageFrom = _.max([1, this.data.page - 2 - _.max([0, 2 + this.data.page - maxPage])]);
        pageTo = _.min([maxPage, this.data.page + 2 + _.max([0, 3 - this.data.page])]);
        total = " of " + max + " entries";
      }
      pages = (function() {
        var _i, _len, _ref, _results;
        _ref = _.range(pageFrom, pageTo + 1);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push({
            number: i,
            active: (i === this.data.page && "active") || ""
          });
        }
        return _results;
      }).call(this);
      this.$("#pagination-main").html(this.paginationTemplate({
        from: from,
        to: to,
        total: total,
        prevDisabled: this.data.page === 1 ? "disabled" : "",
        nextDisabled: to === max ? "disabled" : "",
        pages: pages
      }));
      return this;
    };

    TableView.prototype.renderData = function() {
      var body, col, column, model, name, row, _i, _len, _ref, _ref1, _ref2, _ref3;
      body = this.$("tbody");
      if (this.collection.models.length === 0) {
        body.html(this.emptyTemplate({
          text: (_ref = this.empty) != null ? _ref : "No records to show"
        }));
      } else {
        body.html("");
        _ref1 = this.collection.models;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          model = _ref1[_i];
          row = $("<tr>");
          _ref2 = this.columns;
          for (name in _ref2) {
            column = _ref2[name];
            col = $("<td>").addClass(column.className).addClass(column.tdClass);
            if (column.draw != null) {
              col.html(column.draw(model, this));
            } else {
              col.text((_ref3 = model.get(name)) != null ? _ref3 : "");
            }
            row.append(col);
          }
          body.append(row);
        }
      }
      if (this.pagination) {
        this.refreshPagination();
      }
      this.trigger("updated");
      body.addClass("in");
      return this;
    };

    TableView.prototype.toPage = function(e) {
      return this.setData("page", parseInt(e.currentTarget.childNodes[0].text));
    };

    TableView.prototype.prevPage = function() {
      if (this.data.page > 1) {
        return this.setData("page", this.data.page - 1);
      }
    };

    TableView.prototype.nextPage = function() {
      return this.setData("page", this.data.page + 1);
    };

    TableView.prototype.toggleSort = function(e) {
      var cl, el, sort_dir;
      el = e.currentTarget;
      cl = el.className;
      sort_dir = "";
      if (cl.indexOf("tableview-sorting-asc") >= 0) {
        sort_dir = "desc";
      } else if (cl.indexOf("tableview-sorting") >= 0) {
        sort_dir = "asc";
      } else {
        return this;
      }
      this.$("th").removeClass("tableview-sorting-desc tableview-sorting-asc");
      this.$(el).addClass("tableview-sorting-" + sort_dir);
      return this.setData("sort_col", el.abbr, "sort_dir", sort_dir);
    };

    TableView.prototype.applyTemplate = function(template, model, size) {
      if (!(size != null)) {
        size = 12;
      }
      return (model && size && template({
        data: this.data,
        model: model,
        classSize: "span" + size
      })) || "";
    };

    TableView.prototype.render = function() {
      var filter, filters, filtersDiv, filtersSize, searchSize, titleSize, _i, _len,
        _this = this;
      titleSize = 3;
      filtersSize = 6;
      searchSize = 3;
      if (!(this.search != null)) {
        filtersSize += searchSize;
        searchSize = 0;
      }
      if (!(this.title != null)) {
        filtersSize += titleSize;
        titleSize = 0;
      } else if (!(this.filters != null)) {
        titleSize += filtersSize;
        filtersSize = 0;
      }
      this.$el.html(this.template({
        title: this.applyTemplate(this.titleTemplate, this.title, titleSize),
        search: this.applyTemplate(this.searchTemplate, this.search, searchSize),
        filters: this.applyTemplate(this.filtersTemplate, this.filters, filtersSize),
        columns: this.applyTemplate(this.columnsTemplate, this.columns)
      }));
      filters = _.compact(_.map(this.filters, function(filter, name) {
        return _this.createFilter(name, filter);
      }));
      filtersDiv = this.$(".filters");
      for (_i = 0, _len = filters.length; _i < _len; _i++) {
        filter = filters[_i];
        filtersDiv.append(filter.render().el);
      }
      return this.update(true, this.skipInitialFetch);
    };

    TableView.prototype.prettyName = function(str) {
      return str.charAt(0).toUpperCase() + str.substring(1).replace(/_(\w)/g, function(match, p1) {
        return " " + p1.toUpperCase();
      });
    };

    return TableView;

  })(Backbone.View);

  /*
  Filters
  -------
  */


  Backbone.TableView.Filter = (function(_super) {

    __extends(Filter, _super);

    function Filter() {
      this.render = __bind(this.render, this);
      return Filter.__super__.constructor.apply(this, arguments);
    }

    Filter.prototype.tagName = "div";

    Filter.prototype.className = "pull-left tableview-filterbox";

    Filter.prototype.initialize = function() {
      var _this = this;
      this.id = this.options.id;
      this.extraId = this.options.extraId;
      this.setData = this.options.setData;
      return this.options.options = _.map(_.result(this.options, "options"), function(option) {
        var value;
        value = option;
        if (_.isArray(value)) {
          value = {
            name: value[0],
            value: value[1]
          };
        } else if (!_.isObject(value)) {
          value = {
            name: value,
            value: value
          };
        }
        return value;
      });
    };

    Filter.prototype.render = function() {
      this.$el.html(this.template(this.options));
      return this;
    };

    return Filter;

  })(Backbone.View);

  Backbone.TableView.InputFilter = (function(_super) {

    __extends(InputFilter, _super);

    function InputFilter() {
      this.update = __bind(this.update, this);
      return InputFilter.__super__.constructor.apply(this, arguments);
    }

    InputFilter.prototype.template = _.template("<span class=\"add-on\"><%= name %></span><input type=\"text\" class=\"filter <%= filterClass %>\" value=\"<%= init %>\"></input>");

    InputFilter.prototype.className = "input-prepend pull-left tableview-filterbox";

    InputFilter.prototype.events = {
      "change .filter": "update"
    };

    InputFilter.prototype.update = function(e) {
      if (this.extraId) {
        return this.setData(this.id, this.options.get(e.currentTarget.value), this.extraId, this.options.getExtraId(e.currentTarget.value));
      } else {
        return this.setData(this.id, this.options.get(e.currentTarget.value));
      }
    };

    return InputFilter;

  })(Backbone.TableView.Filter);

  Backbone.TableView.ButtonFilter = (function(_super) {

    __extends(ButtonFilter, _super);

    function ButtonFilter() {
      this.update = __bind(this.update, this);
      return ButtonFilter.__super__.constructor.apply(this, arguments);
    }

    ButtonFilter.prototype.template = _.template("<button type=\"button\" class=\"filter btn <%= init == on ? \"active\" : \"\" %> <%= filterClass %>\"><%= name %></button>");

    ButtonFilter.prototype.events = {
      "click .filter": "update"
    };

    ButtonFilter.prototype.initialize = function() {
      ButtonFilter.__super__.initialize.apply(this, arguments);
      this.values = [this.options.off, this.options.on];
      return this.current = this.options.init === this.options.off ? 0 : 1;
    };

    ButtonFilter.prototype.update = function(e) {
      this.$(e.currentTarget).toggleClass("active");
      this.current = 1 - this.current;
      return this.setData(this.id, this.values[this.current]);
    };

    return ButtonFilter;

  })(Backbone.TableView.Filter);

  Backbone.TableView.ButtonGroupFilter = (function(_super) {

    __extends(ButtonGroupFilter, _super);

    function ButtonGroupFilter() {
      this.update = __bind(this.update, this);
      return ButtonGroupFilter.__super__.constructor.apply(this, arguments);
    }

    ButtonGroupFilter.prototype.template = _.template("<% _.each(options, function (el, i) { %>\n    <button class=\"btn <%= _.contains(init, el.value) ? \"active\" : \"\" %> <%= !_.isUndefined(el.className) ? el.className : \"\" %>\" value=\"<%= el.value %>\"><%= el.name %></button>\n<% }) %>");

    ButtonGroupFilter.prototype.className = "btn-group pull-left tableview-filterbox";

    ButtonGroupFilter.prototype.events = {
      "click .btn": "update"
    };

    ButtonGroupFilter.prototype.update = function(e) {
      var values,
        _this = this;
      this.$(e.currentTarget).toggleClass("active");
      values = _.map(this.$(".btn"), function(btn) {
        if (_this.$(btn).hasClass("active")) {
          return _this.$(btn).attr("value");
        } else {
          return null;
        }
      });
      values = _.compact(values);
      return this.setData(this.id, this.options.get(values));
    };

    return ButtonGroupFilter;

  })(Backbone.TableView.Filter);

  Backbone.TableView.ButtonOptionFilter = (function(_super) {

    __extends(ButtonOptionFilter, _super);

    function ButtonOptionFilter() {
      this.update = __bind(this.update, this);
      return ButtonOptionFilter.__super__.constructor.apply(this, arguments);
    }

    ButtonOptionFilter.prototype.template = _.template("<% _.each(options, function (el, i) { %>\n    <button class=\"btn <%= init == el.value ? \"active\" : \"\" %>\" value=\"<%= el.value %>\"><%= el.name %></button>\n<% }) %>");

    ButtonOptionFilter.prototype.className = "btn-group pull-left tableview-filterbox";

    ButtonOptionFilter.prototype.events = {
      "click .btn": "update"
    };

    ButtonOptionFilter.prototype.update = function(e) {
      this.$(".btn").removeClass("active");
      this.$(e.currentTarget).addClass("active");
      return this.setData(this.id, e.currentTarget.value);
    };

    return ButtonOptionFilter;

  })(Backbone.TableView.Filter);

  Backbone.TableView.DropdownFilter = (function(_super) {

    __extends(DropdownFilter, _super);

    function DropdownFilter() {
      this.update = __bind(this.update, this);
      return DropdownFilter.__super__.constructor.apply(this, arguments);
    }

    DropdownFilter.prototype.template = _.template("<select class=\"filter <%= filterClass %>\">\n    <% _.each(options, function (el, i) { %>\n        <option <%= init == el.value ? \"selected='selected'\" : \"\" %> value=\"<%= el.value %>\"><%= el.name %></button>\n    <% }) %>\n</select>");

    DropdownFilter.prototype.events = {
      "change .filter": "update"
    };

    DropdownFilter.prototype.update = function(e) {
      return this.setData(this.id, e.currentTarget.value);
    };

    return DropdownFilter;

  })(Backbone.TableView.Filter);

}).call(this);
