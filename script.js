const losowanie = document.getElementsByClassName('losowanie')[0];
const win = document.getElementsByClassName('win')[0];
document.getElementById("losuj").addEventListener('click', () => {
    console.log("Popup DOM fully loaded and parsed");

    function modifyDOM() {
        //You can play with your DOM here or check URL against your regex
        console.log('Tab script:');
        console.log(document.body);
        return document.body.innerHTML;
    }

    //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript({
        code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
    }, (results) => {
        //Here we have just the innerHTML and not DOM structure
        console.log('Popup script:')
        //console.log(results[0]);
    });

    losowanie.innerHTML += `<div class="spinner"><div class="dot1"></div><div class="dot2"></div></div>`;
    setTimeout(() => {
        losowanie.innerHTML = '';
        win.innerHTML += `<h2>Zwycięzca: MrVanosh</h2><h2>Gratulacje !</h2>`;
        win.innerHTML += `<div class="pyro"><div class="before"></div><div class="after"></div></div>`;
    }, 3000);
});

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
document.getElementById('start').value = new Date().toDateInputValue();
document.getElementById('end').value = new Date().toDateInputValue();
