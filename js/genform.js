genform.addEventListener("submit", function(event){
    event.preventDefault();
    generate('security.txt', [this.contact, this.encryption, this.acknowledgements, this.permission, this.policy, this.signature, this.hiring]);
});

function generate(filename, field_array){
    text = "";
    
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
            name = e.name;
            text += camelToHyphen(name) + ": " + e.value + "\n";
        }
    });

    copy(text);
}

function copy(text){
    elem = document.getElementById("text-to-copy");
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
