var data;
var ite;

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
        if (property.startsWith("--")) { // If property is a CSS variable
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.setProperty(property, value);
            }
        }
        else { // If property is a CSS property
            for (var i = 0; i < elements.length; i++) {
                elements[i].style[property] = value;
            }
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
    ite = iterator(); // create iterator
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

    let element = ite.next();
    if (element.done) {
        ite = iterator(); // reset iterator
        element = ite.next();
    }
    let random = element.value;

    question.innerHTML = data.questions[random].q;
    answer.innerHTML = data.questions[random].a;
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