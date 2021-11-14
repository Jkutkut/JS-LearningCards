var data;


window.onload = () => {
    data = localStorage['learningCardsData'];

    document.addEventListener("dragover", (event) => {
        event.stopPropagation();
        event.preventDefault();
        // Style the drag-and-drop as a "copy file" operation.
        event.dataTransfer.dropEffect = 'copy';
    });

    document.addEventListener('drop', (event) => {
        event.stopPropagation();
        event.preventDefault();
        const fileList = event.dataTransfer.files;
        console.log(fileList);
    });

    // When loadQuestionsBtn pressed, load questions
    let loadQuestionsBtn = document.getElementById("loadQuestionsBtn");
    loadQuestionsBtn.addEventListener('change', readSingleFile, false);

    if (data) {
        data = JSON.parse(data); // convert to object
        
        let continueBtn = document.getElementsByClassName("continueData")[0];
        continueBtn.addEventListener('click', () => {
            nextCard();
            startCardMenu();
        });
    }
    else { // If previous session not found
        console.log("Previous sesion not found.");

        // Hide continue data button
        cssByClass("continueData", "display", "none");

    }
}

function readSingleFile(e) {
    const file = e.target.files[0];
    if (!file) { // If no file selected
        return;
    }

    // if file is not a json file
    if (!file.name.endsWith(".json") || file.type != "application/json") {
        alert("Please select a json file with the data.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        let contents = e.target.result;
        let d = JSON.parse(contents);

        if (!validQuestions(d)) {
            alert("Invalid file. The file must contain the questions.");
            return;
        }

        localStorage['learningCardsData'] = contents;
        console.log(data);
        startCardMenu();
    };
    reader.readAsText(file);
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
    cssByClass("cardMenu", "display", "flex");
    cssByClass("loadMenu", "display", "none");

    // When element with class newCardBtn pressed
    document.onclick = nextCard;
    console.log(cssByClass("card"));
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
    console.log(random);

    question.innerHTML = data.questions[random].q;
    answer.innerHTML = data.questions[random].a;
}