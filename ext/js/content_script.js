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

/// デバッグ用...
function debug( str ){ console.log(str); }

$(document).ready(function(){

    var liTags = "";

    // localStorageからタグ情報読み取り, <li>作成
    if( localStorage[projectName] !== undefined ){
	// JSONで入ってるのでパースする
	pageTags = JSON.parse(localStorage[projectName]);
	debug( pageTags );
	for( i = 0; i<pageTags.length; i++ ){
	    debug( "load-" + pageTags[i] );
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

	    var label = ui.tagLabel;
	    
	    // 入力文字に数字以外が含まれている
	    if( label.match(/[^0-9]+/) ){
		pop.smallipop("show");
		return false;
	    }

	    debug( "add-" + label );

	    pop.smallipop("hide");
	    pageTags.push(label);

	    // JSON形式の文字列に変更しておく必要がある
	    localStorage[projectName] = JSON.stringify(pageTags);
	    debug( localStorage[projectName] );
	},
	onTagClicked: function (event, ui){
	    if( isInit ) return;

	    var label = ui.tagLabel;
	    var showPath = projectViewUrl + "-" + label;

	    // 遷移
	    location.href = showPath;
	},
	beforeTagRemoved: function( event, ui ){
	    if( isInit ) return;

	    var label = ui.tagLabel;

	    debug( "remoe-" + label );

	    for( var i=0; i<pageTags.length; i++){
		if( pageTags[i] == label ){
		    pageTags.splice(i,1);
		}
	    }
	    
	    // 削除反映
	    localStorage[projectName] = JSON.stringify(pageTags);

	    debug( pageTags );
	}
    });

    isInit = false;

    var pop = $("li.tagit-new").smallipop({
	preferredPosition: "bottom",
	theme: "white"
    }, "数値のみ入力できます");

});
