///**
// * jQuery Mobile Menu
// * Turn unordered list menu into dropdown select menu
// * version 1.0(31-OCT-2011)
// *
// * Built on top of the jQuery library
// *   http://jquery.com
// *
// * Documentation
// *   http://github.com/mambows/mobilemenu
// */
//(function($){
//	$.fn.mobileMenu = function(options) {
//		var defaults = {
//				defaultText: 'Navigate to...',
//				className: 'select-menu',
//				subMenuClass: 'sub-menu',
//				subMenuDash: '&ndash;'
//				},
//			settings = $.extend( defaults, options ),
//			el = $(this);

//		$("head").append('<style type="text/css">@media(max-width: 767px){.sf-menu{display:none;} .select-menu{display: block;}}</style>')

//		this.each(function(){
//			// ad class to submenu list
//			el.find('ul').addClass(settings.subMenuClass);

//			// Create base menu
//			$('<select />',{'class':settings.className}).insertAfter(el);

//			// Create default option
//			$('<option />', {"value":'#', "text":settings.defaultText}).appendTo( '.' + settings.className );

//            $.ajax({
//                type: "POST",
//                url: "../Common/MainMenu",
//                data: '{}',
//                contentType: 'application/json', // content type sent to server
//                dataType: 'json', // Expected data format from server
//                processdata: true, // True or False
//                crossDomain: true,
//                success: function (Result) {
//                    debugger;
//                    var Type = "";
//                    var UserId = 0;
//                    for (var i = 0; i < Result.length; i++) {
//                        var li = $('<li/>')
//                            .appendTo('#topnav');
//                        var MainMenu = Result[i].MenuName;
//                        var MenuID = Result[i].MenuId;
//                        var MPath = Result[i].Path;
//                        $('<a />').text(MainMenu).attr('href', '' + MPath + '').appendTo(li);
//                        var jsondata = JSON.stringify({ action: 'login', MenuID: MenuID });
//                        $.ajax({
//                            type: "POST",
//                            url: "../Common/SubMenu",
//                            data: jsondata,
//                            async: false,
//                            contentType: 'application/json', // content type sent to server
//                            dataType: 'json', // Expected data format from server
//                            processdata: true, // True or False
//                            crossDomain: true,
//                            success: function (Result) {
//                                debugger;
//                                var sub_ul = $('<ul/>').appendTo(li);

//                                for (var i = 0; i < Result.Data.length; i++) {
//                                    var sub_li = $('<li/>').appendTo(sub_ul);
//                                    var titles = Result.Data[i].MenuName;
//                                    var Path = Result.Data[i].Path;
//                                    $('<a />')
//                                        .text(titles)
//                                        .attr('href', '' + Path + '')
//                                        .appendTo(sub_li);
//                                }
//                                Type = Result.UserType;
//                                UserId = Result.UserId;
//                            }
//                        });
//                    }

//                    var li = $('<li/>')
//                        .appendTo('#topnav');
//                    $('<a />').text('profile').attr('href', '#').attr('style', "").appendTo(li);
//                    var sub_ul = $('<ul/>').attr('style', "margin-left: -102px;").appendTo(li);
//                    var sub_li = $('<li/>').appendTo(sub_ul);

//                    if (Type == "ADMIN") {
//                        var anchorpath = "AdminProfile?id=" + UserId + "";
//                    }
//                    else if (Type == "AGENT") {
//                        var anchorpath = "AgentProfile?id=" + UserId + "";
//                    }
//                    else if (Type == "SUBAGENT") {
//                        var anchorpath = "SubAgentProfile?id=" + UserId + "";

//                    }
//                    else if (Type == "CLIENT") {
//                        var anchorpath = "ClientProfile?id=" + UserId + "";
//                    }

//                    $('<a />')
//                        .text("Profile")
//                        .attr('href', "" + anchorpath + "")
//                        .appendTo(sub_li);
//                    var sub_li = $('<li/>').appendTo(sub_ul);
//                    $('<a />')
//                        .text("Logout")
//                        .attr('href', 'Login')
//                        .appendTo(sub_li);


//                    // Create select option from menu
//                    el.find('a,.separator').each(function () {
//                        var $this = $(this),
//                            // optText = $this.context.firstChild.textContent,
//                            optText = $this.text(),
//                            optSub = $this.parents('.' + settings.subMenuClass),
//                            len = optSub.length,
//                            dash;
//                        // if menu has sub menu
//                        if ($this.parents('ul').hasClass(settings.subMenuClass)) {
//                            dash = Array(len + 1).join(settings.subMenuDash);
//                            optText = dash + optText;
//                        }
//                        if ($this.is('span')) {
//                            // Now build menu and append it
//                            $('<optgroup />', { "label": optText, }).appendTo('.' + settings.className);
//                        } else {
//                            // Now build menu and append it
//                            $('<option />', { "value": this.href, "html": optText, "selected": (this.href == window.location.href) }).appendTo('.' + settings.className);
//                        }
//                    }); // End el.find('a').each

//                },
//                error: function (err) {
//                    alert('error' + err);
//                }
//            });



//			// Change event on select element
//			$('.' + settings.className).change(function(){
//				var locations = $(this).val();
//				if( locations !== '#' ) {
//					window.location.href = $(this).val();
//				}
//			});
//		}); // End this.each
//		return this;
//	};
//})(jQuery);