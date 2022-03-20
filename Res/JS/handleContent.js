var data;
var imgs;

var ite;
var mouseOver = true;

window.addEventListener('load', () => {
    // Attempt to load data from local storage
    data = dataStored();
    
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

    if (!isMobile()) {
        // When card mouse exited or entered, rotate card
        document.getElementsByClassName("card")[0].addEventListener(
            'mouseleave',
            () => {
                cssByClass("card-face", "--rotation-animation-amount", "180deg");
                mouseOver = false;
            },
            false
        );

        document.getElementsByClassName("card")[0].addEventListener(
            'mouseenter',
            () => {
                mouseOver = true;
            },
            false
        );
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
        
        // get file content and save data to local storage
        storeFile(event.target.result);

        startCardMenu();
    });
    console.log("Atempting to load file: ", f.name);
    console.log(f);
    reader.readAsText(f);
}

function storeFile(jsonFile) {
    let content = JSON.parse(jsonFile);

    console.log(new Blob([jsonFile]).size);
    
    console.log("Clearing previous file data.");
    localStorage.clear(); // Clear previous file

    // Get the questions
    data = {
        name: content.name,
        questions: content.questions
    };

    // // Store them on localStorage
    // console.log("Storing new data");
    // localStorage["learningCardsData"] = JSON.stringify(data);

    // // Store imgs in independent cookies.
    // console.log("Storing imgs");
    // let imgIds = Object.keys(content.images);
    // for (let i = 0; i < imgIds.length; i++) {
    //     // console.log(content.images[imgIds[i]]);
    //     localStorage[imgIds[i]] = content.images[imgIds[i]];
    // }

    imgs = content.images;

    console.log("File fully loaded");
}

function dataStored() {
    // return localStorage["learningCardsData"];
    return undefined;
}

function clearLocalStorage() {
    localStorage.clear();
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

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function startCardMenu() {
    cssByClass("cardMenu", "display", "flex");
    cssByClass("loadMenu", "display", "none");

    ite = iterator(); // create iterator
    nextCard();

    // If the device is a mobile device
    if( isMobile() ) {
        console.log("Mobile device detected");
        document.getElementById("rotate-btn").addEventListener(
            "click",
            () => {
                console.log("Rotate button clicked");
                let prev = document.getElementsByClassName("card-face")[0]
                prev = prev.style.getPropertyValue("--rotation-animation-amount");
                if (prev == "0deg") {
                    cssByClass("card-face", "--rotation-animation-amount", "180deg");
                }
                else {
                    cssByClass("card-face", "--rotation-animation-amount", "0deg");
                }
            }
        );

        document.getElementById("next-btn").addEventListener(
            "click",
            nextCard
        );
    }
    else {
        // When element with class newCardBtn pressed
        console.log("Desktop device detected");
        document.onclick = nextCard;
    }
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
        cssByClass("card-face", "transition", "all 0s ease");
        cssByClass("card-face", "--rotation-animation-amount", "0deg");
        setTimeout(
            () => {
                cssByClass("card-face", "transition", "all 0.8s ease"); // ! Hardcoded
            },
            200
        )
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
        document.getElementById("questionImage").src = imgs[imgID];
        // document.getElementById("questionImage").src = data.images[imgID];
    }
    else {
        cssByClass("questionImage", "display", "none"); // hide image        

        document.getElementById("questionImage").src = "";
    }

    if (data.questions[random]["a-image"]) {
        cssByClass("answerImage", "display", "flex"); // show image
        
        let imgID = data.questions[random]["a-image"];
        document.getElementById("answerImage").src = imgs[imgID];
        // document.getElementById("answerImage").src = data.images[imgID];
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