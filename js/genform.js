genform.addEventListener("submit", function(event){
    event.preventDefault();
    generate('security.txt', [
        "contact", "encryption", "acknowledgments", "preferredLanguages", "canonical", "policy", "hiring"
    ]);
});

function generate(filename, field_array){
    var text = "";
    
    // Converts camel case like 'abcDefGhi' into
    // the format 'Abc-Def-Ghi'
    function camelToHyphen(camelCaseWord) {
      var components = camelCaseWord.split(/(?=[A-Z])/) // abcDef => [abc, Def]
      
      return components.map(function (component) {
        return component[0].toUpperCase() + component.slice(1) // ABC => Abc
      }).join('-')
    }

    field_array.forEach(function(e){
        console.log(e)
        var inputs = document.getElementById(e).querySelector(".list-of-inputs")

        inputs.querySelectorAll("input").forEach(function(child) {
            if(child.value.length > 0){
                text += camelToHyphen(e) + ": " + child.value + "\n";
            }
        });
    });

    copy(text);
}

function addAlternative(button) {
    var list = button.parentElement.parentElement.parentElement.querySelector(".list-of-inputs")
    
    var newInput = document.createElement("INPUT")
    newInput.setAttribute("placeholder", "Another possible alternative")
    newInput.setAttribute("class", "input")

    var newInputControl = document.createElement("DIV")
    newInputControl.setAttribute("class", "control is-expanded")
    newInputControl.appendChild(newInput)

    var removeButton = document.createElement("BUTTON")
    removeButton.setAttribute("type", "button")
    removeButton.setAttribute("class", "button is-danger")
    removeButton.textContent = "Remove"
    
    var removeButtonControl = document.createElement("DIV")
    removeButtonControl.setAttribute("class", "control")
    removeButtonControl.appendChild(removeButton)

    var overallField = document.createElement("LI")
    overallField.setAttribute("class", "field is-grouped")
    overallField.appendChild(newInputControl)
    overallField.appendChild(removeButtonControl)

    removeButton.addEventListener("click", function() {
        // not using Element.remove() to maintain support
        // with Internet Explorer
        overallField.parentNode.removeChild(overallField)
    })

    list.appendChild(overallField)
    newInput.focus()
}

function copy(text){
    var elem = document.getElementById("text-to-copy");
    elem.value = text;

    if(document.queryCommandSupported("copy")){
        elem.select();
        document.execCommand("copy");
        window.getSelection().empty();
        showNotification();
    } else {
        elem.classList.remove("copy");
        elem.classList.add("textarea");
    }
}

notification = document.getElementById("txt-notification");

function removeNotification(){
    function hide(){
        notification.classList.remove("visible");
        notification.removeEventListener("transitionend ", hide);
    };

    notification.classList.remove("opaque");
    notification.addEventListener("transitionend", hide)
}

function showNotification(){
    notification.classList.add("visible");
    setTimeout(function(){
        // doesn't work when called on the same tick
        notification.classList.add("opaque");
    });
}
