const KANJI_INFO_URL = "https://kanjiapi.dev/v1/kanji/"
const list = sessionStorage.getItem('list')
const kanjiForQuiz = list.split("")
const iterations = 7;
let rendered = false
let counter = 1

const resultData = []
const resultChoises = []
const usedKeys = []

function generateUniqueKey() {
    let index
    do {
        index = Math.floor(Math.random() * kanjiForQuiz.length)
    } while (usedKeys.includes(index))

    usedKeys.push(index)
    return index
}

function setup() {

    if(rendered == true) {
        $(".card").each(function(){
            $(this).empty()
        })
    }
    
    const kanjiData = []
    const promises = []
    let key
    
    $(".answear").each(function (i) {

        let randomKanji = generateUniqueKey()
        console.log(usedKeys)
        let result = KANJI_INFO_URL + kanjiForQuiz[randomKanji]
        console.log(result)
        let promise = new Promise(function (resolve) {

        $.ajax({
            type: "GET",
            url: result,
            dataType: "json",
            async: true
        }).done(function (data) {
            kanjiData.push(data)
            resolve()
        })
        })
    promises.push(promise)
    })

    Promise.all(promises).then(function () {
    
        key = Math.floor(Math.random() * kanjiData.length)
    
        let keyData = kanjiData[key]
        let keyKanji = keyData.kanji

        resultData.push(keyData)

        $(".card.question").append(keyKanji)
    
            kanjiData.forEach(function(value, i){
        
            //arrays, slice to print max 2 values, that should be enough
            let meanings = value.meanings.slice(0, 2)
            let onReading = value.on_readings.slice(0, 2)
            let kunReadings = value.kun_readings.slice(0, 2)
        
            $(".answear." + (i + 1)).append('<span class="quizMeaningContainer"></span>')
            $(".answear." + (i + 1)).append('<span class="quizKunContainer"></span>')
            $(".answear." + (i + 1)).append('<span class="quizOnContainer"></span>')
        
            //filling the meanings and readings
            meanings.forEach(el => {
                $(".answear." + (i + 1) + ' .quizMeaningContainer').append("<span>" + el + "</span>")
            });
            kunReadings.forEach(el => {
                $(".answear." + (i + 1) + ' .quizKunContainer').append("<span>" + el + "</span>")
            });
            onReading.forEach(el => {
                $(".answear." + (i + 1) + ' .quizOnContainer').append("<span>" + el + "</span>")
            });
        })

    

    let firstTry = 0
    let pushed = false

    $(".answear").unbind().click(function () {
        let index = $(this).attr("class").slice(-1);
        if (index == (key + 1)) {
            if (firstTry == 0 && !pushed) {
                resultChoises.push(true)
            }
            $(".answear." + index).toggleClass("green")
            return
        } else {
            firstTry++
            $(".answear." + index).toggleClass("red")
        }

        if (!pushed) {
            pushed = true
            resultChoises.push(false)
        }
    })
    rendered = true
})
}

function results(){

    $(".quiz_container").remove()
    $("main").append('<div class="quizInfo"></div>')
    $(".quizInfo").after('<div class="results"></div>')

    let correctAnswears = 0

    for (let i = 0; i < resultChoises.length; i++) {
        if(resultChoises[i]){
            correctAnswears++
        }
    }

    let percentCompleted = (100 / resultChoises.length) * correctAnswears

    console.log(percentCompleted)
    console.log(typeof percentCompleted)

    if(isNaN(percentCompleted)){
        percentCompleted = 0
    }

    if(percentCompleted % 1 != 0){
        percentCompleted = percentCompleted.toFixed(2)
    }
    
    $(".quizInfo").append('<h1 class="resultsTitle">Results</h1>')
    $(".quizInfo").append('<div>'+correctAnswears+'/' + iterations + '</div>')
    $(".quizInfo").append('<div>'+percentCompleted+'%</div>')

    for (let i = 0; i < iterations; i++) {
        
        let correctKanji = resultData[i].kanji
        let answear
        let color
        
        if(resultChoises[i]){
            answear = "you were right"
            color = "green"
        }
        else {
            answear = "you were wrong"
            color = "red"
        }
        $(".results").append(`<a class="result_href" href="kanji/${correctKanji}"><div class="resultCard ${color}">Card ${i+1}: ${correctKanji}     ${answear}</div></a>`)
    }

    //gsap.to(".resultCard", { x: 200, stagger: 0.2 })
    
    gsap.fromTo(".resultCard", { opacity: 0, stagger: 0.1 }, { opacity: 1, stagger: 0.05, duration: 1 });
    
}

setup()
$(".indicator").html("Card " + counter + "/" + iterations) 

$("#arrow").click(function () {
    $(".answear").removeClass("red green")
    if(counter >= iterations){
        console.log(resultChoises)
        console.log(resultData)
        results()
        return
    }
    counter++
    $(".indicator").html("Card " + counter + "/" + iterations)
    setup()   
})