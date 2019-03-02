textareaElement = document.getElementById("text-to-copy");

genform.addEventListener("submit", function(event){
    event.preventDefault();
    generate('security.txt', [
        this.contact, this.encryption, this.acknowledgments,
        this.preferredLanguages, this.canonical, this.policy, this.hiring
    ]);

    scrollToStepTwo()
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
        if(e.value.length > 0){
            var name = e.name;
            text += camelToHyphen(name) + ": " + e.value + "\n";
        }
    });

    textareaElement.value = text;

    if (document.queryCommandSupported("copy")) {
      document.getElementById("copy-button").removeAttribute("disabled")
    }
}

function copyTextarea(){
    textareaElement.select();
    document.execCommand("copy");

    window.getSelection().empty();
    showNotification();
}

function scrollToStepTwo() {
  document.getElementById("step-two").scrollIntoView({behavior: "smooth"})
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
