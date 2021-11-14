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

    if (data) {
        data = JSON.parse(data); // convert to object
    }
    else {
        console.log("Previous sesion not found.");
        // cssByClass("continueData", "display", "none");

        // When loadQuestionsBtn pressed, load questions
        // document.getElementById("loadQuestionsBtn").onclick = () => {
            // Ask user for a file
        // }

        // startCardMenu();
    }
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
    console.log("nextCard");
}