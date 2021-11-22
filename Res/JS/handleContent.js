var data;
var ite;
var mouseOver = true;

window.addEventListener('load', () => {
    // Attempt to load data from local storage
    data = localStorage['learningCardsData'];
    
    // If data is in local storage, show option to restore it
    if (data) {
        data = JSON.parse(data); // convert to object
        
        let continueBtn = document.getElementsByClassName("continueData")[0];
        
        // Change text of continueBtn to the name of the data
        continueBtn.getElementsByTagName("p")[0].innerHTML = data.name;
        
        continueBtn.addEventListener('click', () => {
            startCardMenu();
        });
    }
    else { // If previous session not found
        console.log("Previous sesion not found.");

        // Hide continue data button
        cssByClass("continueData", "display", "none");
    }

    
});

function attemptLoadFile(fileList) {
    let f = fileList[0];
    if (!fileIsValid(f)) {
        return;
    }
    if (fileList.length > 1) {
        alert(`Multiple files detected, using ${f.name}.`);
    }

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        // get file content
        data = JSON.parse(event.target.result);

        // save data to local storage
        localStorage['learningCardsData'] = event.target.result;

        console.log("Data loaded", data);
        startCardMenu();
    });
    reader.readAsText(f);
}

function fileIsValid(file) {
    if (!file) {
        return false;
    }

    if (!file.name.endsWith(".json") || file.type != "application/json") {
        alert("Please select a json file with the data.");
        return false;
    }
    return true;
}


function startCardMenu() {
    cssByClass("cardMenu", "display", "flex");
    cssByClass("loadMenu", "display", "none");

    ite = iterator(); // create iterator
    nextCard();

    // When element with class newCardBtn pressed
    document.onclick = nextCard;
}


// function nextCard() {
function nextCard(index=null) { // ! debug code
    if (!data || !data.questions) {
        console.error("No data found to show!")
        return;
    }

    // Get html elements
    let q = document.getElementsByClassName("questionText")[0];
    let question = q.getElementsByTagName("p")[0];

    let a = document.getElementsByClassName("answerText")[0];
    let answer = a.getElementsByTagName("p")[0];


    if (mouseOver) { // if mouse over card
        // From now on, the card can not rotate (to prevent cheating)
        cssByClass("card-face", "--rotation-animation-amount", "0deg");
    }

    // Update elements with the new question
    let element = ite.next(); // get next question-index object
    if (element.done) { // If no more questions
        ite = iterator(); // reset iterator
        element = ite.next();
    }
    // let random = element.value; // get random index
    let random = (typeof index == 'number') ? index : element.value; // ! debug code

    question.innerHTML = data.questions[random].q;
    answer.innerHTML = data.questions[random].a;

    if (data.questions[random]["q-image"]) {
        cssByClass("questionImage", "display", "flex"); // show image

        let imgID = data.questions[random]["q-image"];
        document.getElementById("questionImage").src = data.images[imgID];
    }
    else {
        cssByClass("questionImage", "display", "none"); // hide image        

        document.getElementById("questionImage").src = "";
    }

    if (data.questions[random]["a-image"]) {
        cssByClass("answerImage", "display", "flex"); // show image
        
        let imgID = data.questions[random]["a-image"];
        document.getElementById("answerImage").src = data.images[imgID];
    }
    else {
        cssByClass("answerImage", "display", "none"); // hide image
        
        document.getElementById("answerImage").src = "";
    }

    let aDetailContainer = document.getElementsByClassName("detailAnswerText")[0];
    let aDetail = aDetailContainer.getElementsByTagName("p")[0];
    if (data.questions[random]["a-detail"]) {
        aDetail.innerHTML = data.questions[random]["a-detail"];
    }
    else {
        aDetail.innerHTML = "";
    }
}

function *iterator() {
    let index = [];
    for (let i = 0; i < data.questions.length; i++) {
        index.push(i);
    }
    while (index.length > 0) {
        let random = Math.floor(Math.random() * index.length);
        yield index.splice(random, 1)[0];
    }
}