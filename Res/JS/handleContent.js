var data;


window.onload = () => {
    // Drag and drop logic
    document.addEventListener("dragover", (event) => {
        event.stopPropagation();
        event.preventDefault();
        // Style the drag-and-drop as a "copy file" operation.
        event.dataTransfer.dropEffect = 'copy';
    });

    document.addEventListener('drop', (event) => {
        event.stopPropagation();
        event.preventDefault();

        attemptLoadFile(event.dataTransfer.files);
    });


    // When loadQuestionsBtn pressed, select file and load questions
    document.getElementById("loadQuestionsBtn").addEventListener(
        'change',
        (e) => {
            attemptLoadFile(e.target.files);
        },
        false
    );

    data = localStorage['learningCardsData'];
    if (data) {
        let continueBtn = document.getElementsByClassName("continueData")[0];
        continueBtn.addEventListener('click', () => {
            data = JSON.parse(data); // convert to object
            startCardMenu();
        });
    }
    else { // If previous session not found
        console.log("Previous sesion not found.");

        // Hide continue data button
        cssByClass("continueData", "display", "none");

    }
}

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

function cssByClass(className, property, value=null) {
    var elements = document.getElementsByClassName(className);
    if (value) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].style[property] = value;
        }
    }
    else {
        if (property) {
            return elements[0].style[property];
        }
        return elements;
    }
}


function startCardMenu() {
    nextCard();

    cssByClass("cardMenu", "display", "flex");
    cssByClass("loadMenu", "display", "none");

    // When element with class newCardBtn pressed
    document.onclick = nextCard;
}


function nextCard() {
    if (!data || !data.questions) {
        console.error("No data found to show!")
        return;
    }
    let q = document.getElementsByClassName("questionText")[0];
    let question = q.getElementsByTagName("p")[0];

    let a = document.getElementsByClassName("answerText")[0];
    let answer = a.getElementsByTagName("p")[0];

    let random = Math.floor(Math.random() * data.questions.length);

    question.innerHTML = data.questions[random].q;
    answer.innerHTML = data.questions[random].a;
}