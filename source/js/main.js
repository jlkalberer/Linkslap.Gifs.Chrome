$(function () {

	var searchLoaded = null,
		activeElement = null;

	function showSearch() {
	    if (!searchLoaded) {
		    searchLoaded = $.Deferred();
		    var iframe = $("<iframe class='linkslap__frame hidden' src='" + chrome.extension.getURL("/search.html") + "' frameborder=0></iframe>");
		    iframe.css({
		    	display: 'none',
		    	position:'fixed',
				bottom:0,
				right:0,
				width:'500px',
				height: '138px',
				'z-index':999999999999,
				'border': 0,
				'-webkit-box-shadow': '0 0 15px rgba(0,0,0,0.8)',
			    'box-shadow': '0 0 15px rgba(0,0,0,0.8)'
		    });

		    $("body").append(iframe);

		    iframe.on('load', function () {
		    	searchLoaded.resolve();
		    })
	    }

	    var content = $('.linkslap__frame').toggle();

	    if (content.is(":visible")) {
	    	searchLoaded.done(function () {
	            chrome.runtime.sendMessage({ action: "focus" });
	    	});
	    }
	}

	function hideSearch() {
		$('.linkslap__frame').hide();
	}

	$(window).on('focus', function () {
		var el = $(document.activeElement);

	    var canInsert = el.length && (el.is("input[type=text]") || el.is("textarea"));
	    if (!canInsert) {
	    	return;
	    }

		activeElement = el;
	});

	$("textarea, input[type=text]").on('focus', function () {
		activeElement = $(document.activeElement);
	});

	function insert(url) {
	    if (!activeElement) {
	    	toastr.error('You must focus a textbox before you can insert into it.')
	    	return;
	    }

		var str = activeElement.val();
    	var selection = {
    		start: activeElement[0].selectionStart || 0,
    		end: activeElement[0].selectionEnd || 0
    	}

		str = str.slice(0, selection.start) + (url || "") + str.slice(selection.end);

		activeElement.val(str);

	    toastr.success('Inserted url - ' + url, "Success");
	}

	$(window).bind('keydown', function(event) {
	    var character = String.fromCharCode(event.which).toLowerCase();
	    if ((event.ctrlKey || event.metaKey) && event.shiftKey && character === 'g') {
	    	event.preventDefault();
			
			showSearch();
	    }

	    if (event.which === 27) {
	    	event.preventDefault();
	    	hideSearch();
	    }
	}).bind('click', function () {
		//hideSearch();
	});


	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.action === "showModal") {
				showSearch();
			} else if (request.action === "resize") {
				$('.linkslap__frame').height(request.height);
			} else if (request.action === "close") {
				hideSearch();
			} else if (request.action === "insert") {
				insert(request.url);
			} else if (request.action === "copy") {
            	var copyFrom = $('<textarea/>');
			    copyFrom.text(request.url);
			    $('body').append(copyFrom);
			    copyFrom.select();
			    document.execCommand('copy', true);
			    copyFrom.remove();
            	hideSearch();

	    		toastr.success('Copied url - ' + request.url, "Success");
			}
		});
});
