textareaElement = document.getElementById("text-to-copy");

genform.addEventListener("submit", function(event){
    event.preventDefault();
    generate('security.txt', [
        "contact", "expires", "encryption", "acknowledgments", "preferredLanguages", "canonical", "policy", "hiring"
    ]);

    scrollToStepTwo()
});

// Convert a date string and time string into a string compliant with the RFC
// Date string: YYYY-MM-DD, Time string: HH:MM (just like browsers will return for date/time inputs)
function formatDate(dateString, timeString) {
    var monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    var splitDate = dateString.split("-");

    return [
        Number(splitDate[2]).toString(),
        monthNames[splitDate[1] - 1],
        splitDate[0],
        timeString,
        getTimezone(-(new Date).getTimezoneOffset())
    ].join(" ");

    function pad(num) {
        return num.toString().padStart(2, '0');
    }

    function getTimezone(offset) {
        // Converts e.g. -90 to "-0130" i.e. "+/- HHMM"
        
        // Sign +/-
        var timezone = offset < 0 ? "-" : "+";
        offset = Math.abs(offset);

        // HH (pad with '0' to ensure length is 2)
        timezone += pad(Math.floor(offset / 60));
        offset %= 60;

        // MM (pad with '0' to ensure length is 2)
        timezone += pad(offset);
        return timezone;
    }
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

        if (e == "expires") {
            var dateInput = document.getElementById(e).querySelector("[type='date']");
            var timeInput = document.getElementById(e).querySelector("[type='time']");

            text += camelToHyphen(e) + ": " + formatDate(dateInput.value, timeInput.value);
        } else {
            var inputs = document.getElementById(e).querySelector(".list-of-inputs")
            inputs.querySelectorAll("input").forEach(function(child) {
                if(child.value.length > 0){
                    text += camelToHyphen(e) + ": " + child.value + "\n";
                }
            });
        }
    });

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
