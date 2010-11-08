(function($){
	var methods = {
		"init":function(options){
			return this.each(function(){
				var $this = $(this),
					settings = {
						"url":null,
						"name":"Gantt chart",
						"callbacks":{
							"onMissingTitle":function(item){
								return "Missing title"
							},
							"onMissingDescription":function(item){
								return "Missing description"
							}
						}
					},
					data = $this.data("gantt"),
					items = [],
					gantt = $("<div/>"),
					gantt_left = $("<div/>"),
					gantt_right = $("<div/>"),
					gantt_clear = $("<div/>");

				// If items were added in the constructor,
				// add them to a temporary variable for
				// later addition.
				if(options
					&& typeof options["items"] == "object"
					&& options["items"].length > 0){
					items = options["items"];
					delete options["items"];
				}

				// Remove any callbacks that aren't functions
				if(options && typeof options.callbacks == "object")
					for(var i in options.callbacks)
						if(typeof options.callbacks[i] != "function")
							delete options.callbacks[i];

				// Set the options
				if(options)
					$.extend(settings, options);

				// Persistent data
				if(!data){
					$(this).data("gantt",{
						"target":$this,
						"settings":settings,
						"items":{},
						"gantt":gantt
					});
				}

				// Add some CSS hooks to our DOM nodes
				gantt.addClass("ganttify-root");
				gantt_left.addClass("ganttify-left");
				gantt_right.addClass("ganttify-right");
				gantt_clear.addClass("ganttify-clear");

				// Add child nodes
				gantt.append(gantt_left);
				gantt.append(gantt_right);
				gantt.append(gantt_clear);

				// Append the node
				$this.append(gantt);

				// A few test cases
				if(items.length > 0)
					for(var i in items)
						$this.ganttify("add", items[i]);

				// Try to update the chart
				$this.ganttify("update");
			});
		},
		"add":function(item){
			return this.each(function(){
				var $this = $(this),
					data = $this.data("gantt");
				// Must have an item to add
				if(typeof item == "undefined"
					|| item == null)
					return false;
				// Must have an ID
				if(typeof item["id"] == "undefined"
					|| item.title == null)
					return false;
				// Title doesn't exist, set default
				if(typeof item["title"] == "undefined"
					|| item.title == null)
					item.title =
						data.settings.callbacks.onMissingTitle(item);
				// Description doesn't exist, set default
				if(typeof item["description"] == "undefined"
					|| item.description == null)
					item.description =
						data.settings.callbacks.onMissingDescription(item);
				// The item already exists
				if(typeof data.items[item.id] != "undefined")
					return false;
				// Add the item
				data.items[item.id] = item;
			});
		},
		"update":function(){
			return this.each(function(){
				var $this = $(this),
					data = $this.data("gantt");
			});
		},
		"destroy":function(){
			return this.each(function(){
				var $this = $(this),
					data = $this.data("gantt");
				$(window).unbind(".gantt");
				data.gantt.remove();
				$this.removeData("gantt");
			});
		}
	};
	$.fn.ganttify = function(method)
	{
		if(methods[method])
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		else if(typeof method === 'object' || !method)
			return methods.init.apply(this, arguments);
		else
			$.error("Method " + method + " does not exist on jQuery.ganttify");
	};
})(jQuery);
