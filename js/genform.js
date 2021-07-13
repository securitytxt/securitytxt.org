textareaElement = document.getElementById("text-to-copy");

genform.addEventListener("submit", function(event){
    event.preventDefault();

    // First, validate the form
    var didValidationFail = false;
    var contactInputElements = document.getElementById('contact').getElementsByTagName('input');

    for (var i = 0; i < contactInputElements.length; i++) {
        var inputEl = contactInputElements[i];
        checkContactValidity(inputEl);

        if (!isContactValid(inputEl)) {
            inputEl.focus();
            didValidationFail = true;
        }
    }

    if (didValidationFail) {
        document.getElementById('validation-errors-box').classList.remove('is-hidden');
        return;
    } else {
        document.getElementById('validation-errors-box').classList.add('is-hidden');
    }

    generate('security.txt', [
        "contact", "expires", "encryption", "acknowledgments", "preferredLanguages", "canonical", "policy", "hiring"
    ]);

    scrollToStepTwo()
});

// Convert a date string and time string into a string compliant with the RFC
function formatDate(dateString, timeString) {
    // The replace operation is for Safari compatibility: it can only parse YYYY/MM/DD dates and most
    // other browsers support both YYYY-MM-DD and YYYY/MM/DD.
    var date = new Date(dateString.replace(/-/g, '/') + ' ' + timeString);

    return date.toISOString();
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

            text += camelToHyphen(e) + ": " + formatDate(dateInput.value, timeInput.value) + "\n";
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

    if (button.parentElement.parentElement.parentElement.id === 'contact') {
        newInput.addEventListener('change', function () { autoprefixEmail(newInput); });

        var errorMessage = document.createElement('P');
        newInputControl.appendChild(errorMessage);
        errorMessage.textContent = 'Each contact field must begin with https:// for web URIs; tel: for telephone numbers; or mailto: for e-mails.';

        var ERROR_MESSAGE_CLASSES = ['is-danger', 'is-hidden', 'help']

        for (var i = 0; i < ERROR_MESSAGE_CLASSES.length; i++) {
            errorMessage.classList.add(ERROR_MESSAGE_CLASSES[i])
        }
    }

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

function isContactValid(el) {
    var VALIDATION_REGEX = /^(mailto:|https:\/\/|tel:)/i;

    return VALIDATION_REGEX.test(el.value);
}

function checkContactValidity(el) {
    if (isContactValid(el)) {
        el.parentElement.getElementsByTagName("p")[0].classList.add('is-hidden');
        el.classList.remove('is-danger');
    } else {
        el.parentElement.getElementsByTagName("p")[0].classList.remove('is-hidden')
        el.classList.add('is-danger');
    }
}

function autoprefixEmail(inputEl) {
    // Add mailto: prefix, e.g. contact@example.com -> mailto:contact@example.com

    // NOTE: If this regular expression is changed in future, it should always fail if
    // the user enters some other schema (e.g. https://) so they always have the option of overriding it.
    // Currently this is achieved by not allowing a colon to appear in the input.
    if (/^[a-z0-9_+.-]+@[a-z0-9_+.-]+$/i.test(inputEl.value)) {
        inputEl.value = 'mailto:' + inputEl.value;
    }

    checkContactValidity(inputEl); // potentially remove validation error if issue resolved
}
