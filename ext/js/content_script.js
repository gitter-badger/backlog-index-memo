/// 
/// #projectNavの下にタグ表示領域作成し、
/// タグを使って課題Noをメモ/ジャンプできるようにする
///

/// ページのタグ文字列
var pageTags = [];

/// https://hoge.backlog.jp
var hostUrl = location.protocol + "//" +  location.hostname;
/// find/STWK とか projects/STWK-833?q=hogehoge
var splitPath = location.pathname.split("/");
/// STWK
var projectName = splitPath[2].split("-")[0];

/// https://hoge.backlog.jp/view/STWK
var projectViewUrl = hostUrl + "/view/" + projectName

$(document).ready(function(){

    var liTags = "";

    // localStorageからタグ情報読み取り, <li>作成
    if( localStorage[projectName] !== undefined ){
	// JSONで入ってるのでパースする
	pageTags = JSON.parse(localStorage[projectName]);
	console.log( pageTags );
	for( i = 0; i<pageTags.length; i++ ){
	    console.log( "load-" + pageTags[i] );
	    liTags += "<li>" + pageTags[i] + "</li>";
	}
    }

    // タグ表示部分作成
    $("#projectNav").after(
	"<div>"+
	    "<ul id=\"tagit\" class=\"tagit ui-widget ui-widget-content ui-corner-all\">"+
	    liTags +
	    "</ul>"+
	"</div>"
    );

    // 初回に呼ばれることを防ぐ( 他に手がありそう )
    var isInit = true;

    $('#tagit').tagit({
	beforeTagAdded: function (event, ui){
	    if( isInit ) return;
	    console.log( "add-" + ui.tagLabel );
	    pageTags.push(ui.tagLabel);
	    // JSON形式の文字列に変更しておく必要がある
	    localStorage[projectName] = JSON.stringify(pageTags);
	    console.log( localStorage[projectName] );
	},
	onTagClicked: function (event, ui){
	    if( isInit ) return;
	    var showPath = projectViewUrl + "-" + ui.tagLabel;
	    location.href = showPath;
	},
	beforeTagRemoved: function( event, ui ){
	    if( isInit ) return;
	    console.log( "remoe-" + ui.tagLabel );

	    for( var i=0; i<pageTags.length; i++){
		if( pageTags[i] == ui.tagLabel ){
		    pageTags.splice(i,1);
		}
	    }

	    localStorage[projectName] = JSON.stringify(pageTags);
	    console.log( pageTags );
	    
	}
    });

    isInit = false;

});


