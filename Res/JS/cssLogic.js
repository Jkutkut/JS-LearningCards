window.addEventListener('load', () => {
    // When createQuestions-Btn pressed, redirect to create questions page
    document.getElementsByClassName("createQuestions")[0].addEventListener(
        'click',
        () => {
            window.location.href = "./createQuestions/createQuestions.html";
        },
        false
    );

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

    // Drag and drop logic
    // When file is dragged over the screen
    document.addEventListener("dragover", (event) => {
        event.stopPropagation();
        event.preventDefault();
        // Style the drag-and-drop as a "copy file" operation.
        event.dataTransfer.dropEffect = 'copy';
    });

    // When file dropped, load the file
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
});

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