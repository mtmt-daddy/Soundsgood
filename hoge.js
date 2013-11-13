// 無名関数の引数にdocumentを渡して実行している
(function(d){

// document.getElementById() 関数へのショートカット
var $ = function(id){ return d.getElementById(id) };

// json2list関数
// function json2list(json) {} でもOK
function json2list(json){

    var divObj = document.getElementById("music");
    
    //でかいディブ
    var result_container = d.createElement("div");
    result_container.className="result-container";
    result_container.style.padding="10px";
    //result_container.style.margin="10px";
    result_container.style.width="280px";
    result_container.style.minHeight="100px";
    result_container.style.overflow = "hidden";
    result_container.style.borderRadius = "10px";
    // result_container.style.borderStyle = "solid";
    // result_container.style.borderColor = "#fe7c4f";
    result_container.style.backgroundColor = "#fff6e6";
    result_container.style.backgroundOpacity = "0.5";
    //result_container.style.marginLeft = "26px";
    result_container.style.marginRight = "auto";
    result_container.style.marginLeft = "auto";
    result_container.style.marginTop = "10px";
    result_container.style.marginBottom = "10px";
    //左のディブ
    var container_left = d.createElement("div");
    container_left.className="container-left";
    container_left.style.float="left";
    container_left.style.width="100px";
    container_left.style.height="100px";
    container_left.style.marginRight="12px";

    //右のディブ
    var container_right = d.createElement("div");
    container_right.className="container-right";
    container_right.style.float="left";
    container_right.style.width="168px";

    // 非順序リストを生成する
    var ul = d.createElement('div');
    // 非順序リストの丸印を非表示にする
    ul.style.listStyleType = 'none';

    // 100*100pxのアートワークがある場合は表示する
    if (json['artworkUrl100']){
      var img = d.createElement('img');
      // imgタグのスタイルを設定する
      img.src = json['artworkUrl100'];
      img.style.borderRadius = "50px 50px 50px 50px";
      //img.style.boxShadow = "1px 1px 5px #707070";
      // 非順序リストに追加する
      container_left.appendChild(img);

      //アーティスト名
      var soso = d.createElement('div');
      soso.innerHTML = json['artistName'];
      soso.id = "soso";
      soso.style.marginLeft = "2px";
      //soso.style.marginTop = "14px";
      container_right.appendChild(soso);
      
      //曲名
      var you = d.createElement('div');
      you.innerHTML = json['itemName'];
      you.id = "you";
      you.style.wordWrap = "break-word";
      you.style.marginLeft = "2px";
      //you.style.marginBottom = "5px";
      container_right.appendChild(you);
    
      //音楽データ
      var ryubi = d.createElement('audio');
      ryubi.id = json['previewUrl'];
      ryubi.src = json['previewUrl'];
      //ryubi.controls = true;
      container_right.appendChild(ryubi);

      var lowbox = d.createElement('div');
      lowbox.style.width = "168px";
      lowbox.style.marginTop = "10px";
      //lowbox.style.marginTop = "13px";
      //lowbox.style.height = "25px";
      container_right.appendChild(lowbox);

      //再生ボタン
      var play = d.createElement('a');
      play.innerHTML = '<input type="image" src="img/play3.png" width="50px" onclick="document.getElementById(\'' + json['previewUrl'] + '\').play()">';
      lowbox.appendChild(play);
 //document.getElementById(\'' + json['previewUrl'] + '\').currentTime=0()

      //停止ボタン
      var stop = d.createElement('a');
      stop.innerHTML = '<input type="image" src="img/stop3.png" width="50px" onclick="document.getElementById(\'' + json['previewUrl'] + '\').pause()">';
      stop.style.marginLeft = "9px";
      stop.style.marginRight = "9px";
      lowbox.appendChild(stop);
     
      //ツイートボタン
      var tweet = d.createElement('a');
      tweet.innerHTML = '<script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script><a href="http://twitter.com/share?url=soundsgood.moo.jp/&text=\'' + json['artistName'] + '\'の\'' + json['itemName'] + '\'を試聴しました！\'' + json['previewUrl'] + '\'&hashtags=SoundsGood"><img src="img/tweet4.png" width="50px" height="25px"></a>';
      lowbox.appendChild(tweet);

      result_container.appendChild(container_left);
      result_container.appendChild(container_right);
      divObj.appendChild(result_container);

    }

    var keys = [];
    for (var keyName in json) {
      // keys配列にキー名をプッシュしていく
      //keys.push(keyName);でもOK
      keys[keys.length] = keyName;
    }
    // キー名を昇順でソート
    keys.sort();
    
    for (var i = 0, l = keys.length; i < l ; i++) {
      var keyName = keys[i];
      if (keyName.match(/artistName/) || keyName.match(/itemName/) || keyName.match(/trackId/) || keyName.match(/previewUrl/)) {
        var li = d.createElement('li');
        li.appendChild(d.createTextNode(''));
        
        ul.appendChild(li);
      }
    }
    return ul;
};

// JSONPオブジェクト
JSONP = {
  // getメソッド（callback関数にJSONP.runを指定している）
  get:function(term){
    var url = 'http://ax.phobos.apple.com.edgesuite.net'
          + '/WebObjects/MZStoreServices.woa/wa/itmsSearch?'
          + ['output='   + 'json',
             'callback=' + 'JSONP.run',
             'country='  + 'JP',
             'entity='   + 'song',
             'lang='     + 'ja_jp',
             'term='     + encodeURIComponent(term)
          ].join('&');
    // scriptタグを動的に生成し、画面に埋め込む
    var scriptTag = d.createElement('script');
    scriptTag.charset = 'UTF-8';
    scriptTag.id = url;
    scriptTag.src = url;
    d.body.appendChild(scriptTag);
  },
  
  // runメソッド
  run:function(json){
    // 出力領域の初期化
    $('music').innerHTML = '';
    // エラーがあった場合は、エラーメッセージを表示
    if (json.errorMessage){
         $('music').appendChild(json.errorMessage);
    }else{
      // 順序リストの生成
      var ol = d.createElement('ol')
      ol.style.listStyleType = 'none';
      // 検索結果の数だけ、以下の処理を繰り返し
      // たぶんこのあたりをいじれば、検索結果数を制御できる。
      for (var i = 0, len = json.resultCount; i < 100; i++){
      // 結果がnullなら処理をスキップ
        if (!json.results[i]) continue;
        // リスト項目を生成
        var li = d.createElement('li');
        // APIの結果をリストにしたものを追加
        li.appendChild(json2list(json.results[i]));
        // 順序リストにリスト項目を追加
        ol.appendChild(li);
      }
    // 結果を出力領域のdiv内に書きこむ
    $('music').appendChild(ol)
    }
  }
};

})(document);