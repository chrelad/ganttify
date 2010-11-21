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
					grid = $("<div/>");

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
						"min":9999999999999,
						"max":0,
						"days":10,
						"gantt":gantt
					});
				}

				// Add some CSS hooks to our DOM nodes
				gantt.addClass("ganttify-root");
				grid.html("&nbsp;");
				grid.attr("id", "ganttify-grid");
				grid.addClass("ganttify-grid");

				// Append the node
				gantt.append(grid);
				$this.append(gantt);

				// A few test cases
				if(items.length > 0)
					for(var i in items)
						$this.ganttify("add", items[i]);

				$this.ganttify("duration");
				$this.ganttify("columns");
				$this.ganttify("bars");
				$this.ganttify("offsets");
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

				// Cache the epoch of the start time
				item.stamps = {
					"start":null,
					"end":null
				};

				$this.ganttify("stamps", item);
				$this.ganttify("extend", item);

				// Calculate seconds
				if(item.stamps.end > 0 && item.stamps.start > 0)
					if(item.stamps.end > item.stamps.start)
						item.seconds = (item.stamps.end - item.stamps.start) / 1000;

				// Calculate days
				item.days = parseInt(parseInt(item.seconds) / 86400);

				// Add the item to the item array
				data.items[item.id] = item;

				// Append the item
				$this.ganttify("append", item.id);
			});
		},
		"offsets":function(){
			return this.each(function(){
				var $this = $(this),
					data = $this.data("gantt");

				for(var i in data.items)
					$this.ganttify("offset", i);
			});
		},
		"offset":function(id){
			return this.each(function(){
				var $this = $(this),
					data = $this.data("gantt");

				// Cache the offset in the item
				data.items[id].offset = (data.items[id].stamps.start - data.min)
					/ 1000 / 60 / 60 / 24;

				// Set the left attribute of the bar
				$("#ganttify-item-bar-" + id + " .ganttify-item-bar-guts").css("left", (data.items[id].offset * 25) + "px");
			});
		},
		"duration":function(){
			return this.each(function(){
				var $this = $(this),
					data = $this.data("gantt");

				// Duration
				data.duration = (data.max - data.min);

				// Number of days
				data.days = data.duration / 1000 / 60 / 60 / 24;
				console.log("Days: " + data.days);

				// Number of hours
				data.hours = data.duration / 1000 / 60 / 60;
				console.log("Hours: " + data.hours);

				// Number of minutes
				data.minutes = data.duration / 1000 / 60;
				console.log("Minutes: " + data.minutes);
			});
		},
		"stamps":function(item){
			return this.each(function(){
				var $this = $(this),
					data = $this.data("gantt");

				// If start date, calculate stamp
				if(item.start)
					item.stamps.start =
						Date.parse(item.start);

				// If end date, calculate stamp
				if(item.end)
					item.stamps.end =
						Date.parse(item.end);
			});
		},
		"extend":function(item){
			return this.each(function(){
				var $this = $(this),
					data = $this.data("gantt");

				// If start less than min, set min
				if(item.stamps.start < data.min)
					data.min = item.stamps.start;

				// If end greater than max, set max
				if(item.stamps.end > data.max)
					data.max = item.stamps.end;
			});
		},
		"append":function(id){
			return this.each(function(){
				var $this = $(this),
					data = $this.data("gantt");

				// Make sure item with ID exists
				if(typeof data.items[id] == "undefined")
					return false;

				// Create row node for this item
				var row = $("<div />");
				row.attr("id", "ganttify-item-row-" + id);
				row.addClass("ganttify-item-row");

				// Create title node for this item
				var title = $("<div />");
				title.attr("id", "ganttify-item-title-" + id);
				title.addClass("ganttify-item-title");
				title.html($("<div />")
					.html(data.items[id].title)
					.attr("title", data.items[id].title));
				row.append(title);

				// Create days node for this item
				var days = $("<div />");
				days.attr("id", "ganttify-item-days-" + id);
				days.addClass("ganttify-item-days");
				days.html($("<div />")
					.html(data.items[id].days)
					.attr("title", data.items[id].days));
				row.append(days);

				// Create start node for this item
				var start = $("<div />");
				start.attr("id", "ganttify-item-start-" + id);
				start.addClass("ganttify-item-start");
				start.html($("<div />")
					.html(data.items[id].start)
					.attr("title", data.items[id].start));
				row.append(start);

				// Create end node for this item
				var end = $("<div />");
				end.attr("id", "ganttify-item-end-" + id);
				end.addClass("ganttify-item-end");
				end.html($("<div />")
					.html(data.items[id].end)
					.attr("title", data.items[id].end));
				row.append(end);

				// Create bar node for this item
				var bar = $("<div />");
				bar.attr("id", "ganttify-item-bar-" + id);
				bar.addClass("ganttify-item-bar");
				row.append(bar);

				// Add a clearing div
				row.append($("<div />").addClass("ganttify-clear"));

				data.gantt.append(row);
			});
		},
		"scale":function(){
			return this.each(function(){
				var $this = $(this),
					data = $this.data("gantt");
			});
		},
		"columns":function(){
			return this.each(function(){
				var $this = $(this),
					data = $this.data("gantt");

				// Create arbitrary column divs
				for(var i = 0; i < 50; i++)
					$("#ganttify-grid").append(
						$("<div><i></i></div>").addClass("ganttify-grid-line"));

				// Set the grid spacing
				$("div.ganttify-grid").addClass("ganttify-grid-fixed-day");
//				$("div.ganttify-grid").addClass("ganttify-grid-flexible");
			});
		},
		"bars":function(){
			return this.each(function(){
				var $this = $(this),
					data = $this.data("gantt");

				for(var id in data.items)
					$this.ganttify("bar", id);

				console.log("Min: " + data.min);
				console.log("Max: " + data.max);
			});
		},
		"bar":function(id){
			return this.each(function(){
				var $this = $(this),
					data = $this.data("gantt");

				// If existing guts exist, just update them
				if($("ganttify-item-bar-" + id).find("div.ganttify-item-bar-guts").length > 0)
					return $this.ganttify("bar_update", id);

				// Create new gut node
				var guts = $("<div />");
				guts.addClass("ganttify-item-bar-guts");
				guts.html($("<div />")
					.html((data.items[id].days + "d"))
					.css("width", ((data.items[id].days * "25") + "px"))
					.attr("title", (data.items[id].days + " days")));

				// Add the bar guts to the page
				$("#ganttify-item-bar-" + id).append(guts);
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
