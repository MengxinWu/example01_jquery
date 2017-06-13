function highlightPage() {
	$("header nav a").each(function(){
		if(window.location.href.indexOf($(this).attr("href")) !== -1){
			$(this).addClass("here");
			$("body").attr("id",$(this).text().toLowerCase());
		}
	});
}

function moveElement(elementId,finalX,finalY,interval) {
	var elem = $("#"+elementId)[0];
	if(elem.movement) clearTimeout(elem.movement);
	if(!elem.style.left) elem.style.left = "0px";
	if(!elem.style.top) elem.style.top = "0px";
	var xpos = parseInt(elem.style.left);
	var ypos = parseInt(elem.style.top);
	if(xpos === finalX && ypos === finalY){ return true; }
	if(xpos < finalX){ xpos += Math.ceil((finalX - xpos)/10); }
	if(xpos > finalX){ xpos -= Math.ceil((xpos - finalX)/10); }
	if(ypos < finalY){ ypos += Math.ceil((finalY - ypos)/10); }
	if(ypos > finalY){ ypos -= Math.ceil((ypos - finalY)/10); }
	elem.style.left = xpos + "px";
	elem.style.top = ypos + "px";
	var repeat = "moveElement('" + elementId + "'," + finalX + "," + finalY + "," + interval + ")";
	elem.movement = setTimeout(repeat,interval);
}

function prepareSlideShow() {
	var $slideshow = $("<div></div>").attr("id","slideshow");
	var $frame = $("<img>").attr({"src": "imgs/frame.gif", "alt": "", "id": "frame"});
	var $preview = $("<img>").attr({"src": "imgs/slideshow.gif", "alt": "slideshow", "id": "preview"});
	$slideshow.append($frame, $preview);
	$("#intro").after($slideshow);
	$("a").each(function(){
		$(this).mouseover(function(){
			if($(this).attr("href").indexOf("index") !== -1) {moveElement("preview",0,0,5)};
			if($(this).attr("href").indexOf("about") !== -1) {moveElement("preview",-150,0,5)};
			if($(this).attr("href").indexOf("photos") !== -1) {moveElement("preview",-300,0,5)};
			if($(this).attr("href").indexOf("live") !== -1) {moveElement("preview",-450,0,5)};
			if($(this).attr("href").indexOf("contact") !== -1) {moveElement("preview",-600,0,5)};
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
		$(this).click(function(){ showSection(sectionId); return false;});
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
		var check = element.placeholder || element.getAttribute("placeholder");
		if(!check) continue;
		element.onfocus = function(){
			var text = this.placeholder || this.getAttribute("placeholder");
			if(this.value === text){
				this.className = "";
				this.value = "";
			}
		};
		element.onblur = function(){
			if(this.value === ""){
				this.className = "placeholder";
				this.value = this.placeholder || this.getAttribute("placeholder");
			}
		};
		element.onblur();
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