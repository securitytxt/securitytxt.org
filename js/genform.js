// Attach the Bulma calendar
var YEAR = 60 * 60 * 24 * 366;
var NOW = new Date();

var calendar = bulmaCalendar.attach('[type="datetime"]', {
    'minDate': NOW,
    'maxDate': new Date(+NOW + YEAR)
})[0];

textareaElement = document.getElementById("text-to-copy");

genform.addEventListener("submit", function(event){
    event.preventDefault();

    // Handle 'Expires' as a special case - so don't include it here
    generate('security.txt', [
        "contact", "encryption", "acknowledgments", "preferredLanguages", "canonical", "policy", "hiring"
    ]);

    scrollToStepTwo()
});

function formatDate(date) {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return zeroFill(date.getDate(), 2) + " " +
           monthNames[date.getMonth()] + " " +
           date.getFullYear() + " " +
           timezoneOffset(date.getTimezoneOffset());
}

function zeroFill(num, length) {
    num = num.toString();
    while (num.length < length) {
        num = "0" + num;
    }
    return num;
}

function timezoneOffset(mins) {
    var hourOffset = Math.abs(Math.floor(mins / 60));
    mins %= 60;

    var sgn = mins >= 0 ? '+' : '-';
    return sgn + zeroFill(hourOffset, 2) + zeroFill(mins, 2);
}

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
            if (child.value.length > 0){
                text += camelToHyphen(e) + ": " + child.value + "\n";
            }
        });
    });

    text += "Expires: " + formatDate(calendar.date.start);
    textareaElement.value = text;

    if (document.queryCommandSupported("copy")) {
        document.getElementById("copy-button").removeAttribute("disabled")
    }
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

function copyTextarea(){
    textareaElement.select();
    document.execCommand("copy");

    window.getSelection().empty();
    showNotification();
}

function scrollToStepTwo() {
  var stepTwo = document.getElementById("step-two")

  if (stepTwo.scrollIntoView) {
      stepTwo.scrollIntoView({behavior: "smooth", block: "start"})
  } else {
      location.hash = "step-two"
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
