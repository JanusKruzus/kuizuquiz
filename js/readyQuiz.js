const KANJI_GRADE_LIST = "https://kanjiapi.dev/v1/kanji/grade-"

$("#startQuiz").click(function(){
    var kanjiString = "";
    var promises = [];

    $("input[type=checkbox]").each(function(index){
        if(!this.checked){
            return;
        }
        var promise = new Promise(function(resolve, reject) {
            $.getJSON(KANJI_GRADE_LIST + (index + 1), function(data){
                for(let i = 0; i < data.length; i++){
                    kanjiString += data[i];
                }
                resolve()
            })
        })
        promises.push(promise);
    });

    Promise.all(promises).then(function() {
        sessionStorage.setItem("list", kanjiString)
        window.location.href = "quiz"
    });
});