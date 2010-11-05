(function($){
	var methods = {
		"init":function(options){
			return this.each(function(){
				var $this = $(this),
					settings = {
						"url":null,
						"name":"Blah blah"
					},
					data = $this.data("gantt"),
					gantt = $("<div/>"),
					gantt_left = $("<div/>"),
					gantt_right = $("<div/>");
					gantt_clear = $("<div/>");

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

				/*
				 * Set the class name for the root
				 * div of the gantt chart
				 */
				gantt.addClass("ganttify-root");

				/*
				 * Add class name to the left side
				 */
				gantt_left.addClass("ganttify-left");

				/*
				 * Add class name to the right side
				 */
				gantt_right.addClass("ganttify-right");

				/*
				 * Add class name to the clearing div
				 */
				gantt_clear.addClass("ganttify-clear");

				// Add child nodes
				gantt.append(gantt_left);
				gantt.append(gantt_right);
				gantt.append(gantt_clear);

				// Append the node
				$this.append(gantt);

				$this.ganttify("add",{"id":5,"title":"The first task","days":2,"start":"11/07/2010","end":"11/20/2010"});
				$this.ganttify("add",{"id":6,"title":"This is the task","days":6,"start":"11/23/2010","end":"12/3/2010"});
				$this.ganttify("update");
			});
		},
		"add":function(item){
			return this.each(function(){
				var $this = $(this),
					data = $this.data("gantt");
				// Must have an item to add
				if(typeof item == "undefined")
					return false;
				// Must have an ID
				if(typeof item["id"] == "undefined")
					return false;
				// The item already exists
				if(typeof data.items[item.id] != "undefined"){
					alert("The item already exists: " + item.id);
					return false;
				}
				// Add the item
				data.items[item.id] = item;
			});
		},
		"update":function(){
			return this.each(function(){
				var $this = $(this),
					data = $this.data("gantt");
				alert(data.items[6].id);
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
		if(methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if(typeof method === 'object' || !method){
			return methods.init.apply(this, arguments);
		} else {
			$.error("Method " + method + " does not exist on jQuery.ganttify");
		}
	};
})(jQuery);
