// 콘솔을 지우는 명령. 개발자 도구에서 사용됩니다.
console.clear();

// JSON 데이터를 파싱하여 _data 변수에 저장
// var _data = JSON.parse(`{"lyrics":[{"line":"","time":-1},{"line":"Hey, let's all go into the forest","note":"Verse 1","time":16000},{"line":"Nobody will notice for a while","time":20000},{"line":"There we can visit all the creatures","time":24000},{"line":"Maybe they can teach us facts of life","time":27500},{"line":"","time":32000},{"line":"Or we can travel to the ocean","note":"Verse 2","time":55500},{"line":"Don't forget your lotion","time":59500},{"line":"It's quite hot","time":61500},{"line":"I once met seven lovely crabs","time":64000},{"line":"They said I should go back and join them for tea","time":67500},{"line":"","time":72000},{"line":"Oh wait, the forest got demolished","note":"Verse 3","time":95500},{"line":"When they built the airport years ago","time":99000},{"line":"But we can still go see the ocean","time":103500},{"line":"Cause they put it in a bowl at the mall","time":107500},{"line":"","time":112000}]}`);
var _data = 
   JSON.parse(`{
      "lyrics": [
         {"line": "", "time": -1},
         {"line": "Hey, let's all go into the forest", "note": "Verse 1", "time": 2000},
         {"line": "Nobody will notice for a while", "time": 4000},
         {"word": "Th", "time": 4800},
         {"word": "ere", "time": 5000},
         {"word": "May", "time": 5200},
         {"word": "be", "time": 5400},
         {"word": "No", "time": 5600},
         {"word": "ti", "time": 6000},
         {"word": "ce", "time": 6800},
         {"line": "Or we can travel to the ocean", "note": "Verse 2", "time": 7500},
         {"line": "Don't forget your lotion", "time": 8850},
         {"line": "It's quite hot", "time": 9350},
         {"line": "I once met seven lovely crabs", "time": 10400},
         {"line": "They said I should go back and join them for tea", "time": 11750},
         {"line": "", "time": 12900},
         {"line": "Oh wait, the forest got demolished", "note": "Verse 3", "time": 14550},
         {"line": "When they built the airport years ago", "time": 17500},
         {"line": "But we can still go see the ocean", "time": 18350},
         {"line": "Cause they put it in a bowl at the mall", "time": 19750},
         {"line": "", "time": 20200}
       ]
   }`);

// 현재 가사 라인을 저장하는 변수
var currentLine = "";

// 특정 라인을 가운데 정렬하는 함수
function align() {
   // 현재 강조된 요소의 높이, 부모 요소의 높이, 그리고 강조된 요소의 상단 위치를 계산
   var a = $(".highlighted").height();
   var c = $(".content").height();
   var d = $(".highlighted").offset().top - $(".highlighted").parent().offset().top;
   var e = d + (a/2) - (c/2);

   // 스크롤 애니메이션을 통해 정렬
   $(".content").animate(
       {scrollTop: e + "px"}, {easing: "swing", duration: 250}
   );
}

// 초기 가사 높이 저장
var lyricHeight = $(".lyrics").height();

// 창 크기 조절 시 가사 높이가 변경되면 정렬 함수를 호출
$(window).on("resize", function() {
   if ($(".lyrics").height() != lyricHeight) {
      lyricHeight = $(".lyrics").height();
      align();
   }
});

// 문서가 준비되면 실행되는 함수
$(document).ready(function(){
   // 비디오의 재생 시간이 업데이트 될 때마다 호출되는 함수
   $("video").on('timeupdate', function(e){
      // 비디오의 현재 시간을 가져옴
      var time = this.currentTime*1000;

      // 현재 시간보다 이전에 나온 가사 필터링
      var past = _data["lyrics"].filter(function (item) {
         return item.time < time;
      });

      // 현재 라인이 변경되었을 때만 실행
      if (_data["lyrics"][past.length] != currentLine) {
         currentLine = _data["lyrics"][past.length];

         // 모든 가사 요소에서 강조 클래스를 제거하고 현재 라인에 추가
        
         $(".lyrics div").removeClass("highlighted");
         $(`.lyrics div:nth-child(${past.length})`).addClass("highlighted");

         
         $(".lyrics span").removeClass("highlighted");
         $(`.lyrics span:nth-child(${past.length})`).addClass("highlighted");
         
         // 정렬 함수 호출
         align();
      }
   });
});

// 초기 가사 생성 함수 호출
generate();

// 가사를 HTML로 생성하는 함수
function generate() {
   var html = "";

   for(var i = 0; i < _data["lyrics"].length; i++) {

      if(_data["lyrics"][i]["line"] != undefined)
         html += "<div";
      else 
         html += "<span";

      // 첫 번째 라인은 강조 클래스 추가
      if(i == 0) {
         html+=` class="highlighted"`;
         currentLine = 0;
      }

      // 노트가 있는 경우 속성 추가
      if(_data["lyrics"][i]["note"]) {
         html += ` note="${_data["lyrics"][i]["note"]}"`;
      }

      if(_data["lyrics"][i]["line"]) {
         html += ` text-data="${_data["lyrics"][i]["line"]}"`;
      }

      if(_data["lyrics"][i]["word"]) {
         html += ` text-data="${_data["lyrics"][i]["word"]}"`;
      }
      html += ">";

      // 라인이 비어있으면 점 표시를 추가, 아니면 라인 텍스트 추가
      html += _data["lyrics"][i]["line"] == undefined ? "" : _data["lyrics"][i]["line"];

      html += _data["lyrics"][i]["word"] == undefined ? "" : _data["lyrics"][i]["word"];
      
      if(_data["lyrics"][i]["line"] != undefined)
         html += "</div>";
      else 
         html += "</span>";
   }

   // 생성된 HTML을 가사 요소에 삽입
   $(".lyrics").html(html);

   // 정렬 함수 호출
   align();
}
