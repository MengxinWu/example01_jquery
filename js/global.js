function highlightPage(){
	$("header nav a").each(function(){
		if(window.location.href.indexOf($(this).attr("href")) !== -1){
			$(this).addClass("here");
			$("body").attr("id",$(this).text().toLowerCase());
		}
	});
}
function moveElement($element, finalX, interval){
	if(!$element.is(":animated")){
		$element.animate({left: finalX}, interval);
	}
}
function prepareSlideShow(){
	var $slideshow = $("<div></div>").attr("id", "slideshow");
	var $frame = $("<img>").attr({"src": "imgs/frame.gif", "alt": "", "id": "frame"});
	var $preview = $("<img>").attr({"src": "imgs/slideshow.gif", "alt": "slideshow", "id": "preview"});
	$slideshow.append($frame, $preview);
	$("#intro").after($slideshow);
	$("a").each(function(){
		$(this).mouseover(function(){
			destination = $(this).attr("href");
			if(destination.indexOf("index")   !== -1){ moveElement($preview, 0, 100); }
			if(destination.indexOf("about")   !== -1){ moveElement($preview, -150, 100); }
			if(destination.indexOf("photos")  !== -1){ moveElement($preview, -300, 100); }	
			if(destination.indexOf("live")    !== -1){ moveElement($preview, -450, 100); }
			if(destination.indexOf("contact") !== -1){ moveElement($preview, -600, 100); }
		});
	});
}

function showSection(id){
	$("section").each(function(){
		$(this).attr("id") === id ? $(this).show() : $(this).hide();
	});
}

function prepareInternalnav(){
	$("article nav a").each(function(){
		var sectionId = $(this).attr("href").split("#")[1];
		$("#" + sectionId).hide();
		$(this).click(function(event){ showSection(sectionId); event.preventDefault();});
	});
}

function prepareGallery(){
	var $placeholder = $("<img>").attr({"src": "imgs/placeholder.gif", "alt": "my image gallery", "id": "placeholder"});
	var $description = $("<p></p>").attr("id", "description").text("choose an image.");
	$("#imagegallery").after($description, $placeholder);
	$("#imagegallery a").each(function(){
		$(this).click(function(event){ 
			$("#placeholder").attr("src", $(this).attr("href")); 
			$("#description").text($(this).attr("title"));
			event.preventDefault();
		});
	});
}

function displayLiveBetter(){
	$("table tr:odd").addClass("odd");
	$("table tr").each(function(){
		$(this).mouseover(function(){$(this).addClass("highlight");}).mouseout(function(){$(this).removeClass("highlight")});
	});
	var $dlist = $("<dl></dl>")
	if($("abbr").length === 0) return false;
	$("abbr").each(function(){
		$dlist.append($("<dt></dt>").text($(this).text()), $("<dd></dd>").text($(this).attr("title")));
	});
	$("article:first").append($("<h3>Abbreviations</h3>"), $dlist);
}

function resetFields(whichform){
	var elements = whichform.elements;
	if(elements.length === 0) return false;
	for(var i=0; i<elements.length; i++){
		var element = elements[i];
		if(element.type === "submit") continue;
		if(!$(element).attr("placeholder")) continue;
		$(element).focus(function(){
			var text = $(this).attr("placeholder");
			if($(this).val() === text){ $(this).attr("class","").val(""); }		
		}).blur(function(){
			if($(this).val() === ""){ $(this).attr("class","placeholder").val($(this).attr("placeholder")); }
		});
		$(element).blur();
	}
}

function submitFormWithAjax(whichform, element){
	$(element).empty();
	$(element).append($("<img>").attr({"src": "imgs/loading.gif", "alt": "Loading..."}));
	var dataParts = [];
	for(var i=0; i<whichform.elements.length; i++){
		dataParts[i] = whichform.elements[i].name + "=" + whichform.elements[i].value;		
	}
	var data = dataParts.join("&");
	$.ajax({
		url: whichform.getAttribute("action"),
		type: "POST",
		data: data,
		dataType: "html",
		success: function(data){
			var matches = data.match(/<article>([\s\S]+)<\/article>/);
			if(matches.length>0){
				element.html(matches[1]);
			} else{
				element.html("<p>Oops, there was an error. Sorry.");
			}
		}
	});
	return true;
}

function prepareForms(){
	$("label").each(function(){
		$(this).click(function(){$("#"+$(this).attr("for")).focus();});
	});
	$("form").each(function(){
		resetFields(this);
		$(this).submit(function(event){
			if(submitFormWithAjax(this, $("article:first"))){ event.preventDefault(); }
			return true;
		});
	});
}

$(function(){
	highlightPage();
	prepareSlideShow();
	prepareInternalnav();
	prepareGallery();
	displayLiveBetter();
	prepareForms();
});