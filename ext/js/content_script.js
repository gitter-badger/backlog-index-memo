var pageTags = [];

var hostUrl = location.protocol + "//" +  location.hostname;
var splitPath = location.pathname.split("/");
var projectName = splitPath[splitPath.length-1];
var projectViewUrl = hostUrl + "/view/" + projectName

$(document).ready(function(){

    var build = "";

    if( localStorage[projectName] !== undefined ){
	pageTags = JSON.parse(localStorage[projectName]);
	console.log( pageTags );


	for( i = 0; i<pageTags.length; i++ ){
	    console.log( "load-" + pageTags[i] );
	    build += "<li>" + pageTags[i] + "</li>";
	}
    }

    $("#projectNav").after(
	"<div>"+
	    "<ul id=\"tagit\" class=\"tagit ui-widget ui-widget-content ui-corner-all\">"+
	    build +
	    "</ul>"+
	"</div>"
    );

    var isInit = true;

    $('#tagit').tagit({
	beforeTagAdded: function (event, ui){
	    if( isInit ) return;
	    console.log( "add-" + ui.tagLabel );
	    pageTags.push(ui.tagLabel);
	    localStorage[projectName] = JSON.stringify(pageTags);
	    console.log( localStorage[projectName] );
	},
	onTagClicked: function (event, ui){
	    if( isInit ) return;
	    var showPath = projectViewUrl + "-" + ui.tagLabel;
	    location.href = showPath;
	}
    });

    isInit = false;

});


