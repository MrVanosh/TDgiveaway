const losowanie = document.getElementsByClassName('losowanie')[0];
const win = document.getElementsByClassName('win')[0];
let osoby;
document.getElementById("losuj").addEventListener('click', () => {
    losowanie.innerHTML += `<div class="spinner"><div class="dot1"></div><div class="dot2"></div></div>`;
    win.innerHTML = '';
    startDate = document.getElementById('start').value;
    endDate = document.getElementById('end').value;
    function modifyDOM(startDate, endDate) {
        console.log(startDate);
        console.log("endDate: " + endDate);
        getRandom = (min,max) => {
            return Math.random() * (max - min) + min;
        }
        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        }

        //You can play with your DOM here or check URL against your regex
        console.log('Tab script:');
        const tabs =document.getElementsByClassName('tabs')[0];
        tabs.childNodes[0].childNodes[0].childNodes[0].classList.remove('tabs__item--active');
        tabs.childNodes[0].childNodes[0].childNodes[1].classList.add('tabs__item--active');
        tabs.childNodes[1].classList.remove('tabs__content--active');
        tabs.childNodes[2].classList.add('tabs__content--active');
        const pagination = document.getElementsByClassName('pagination')[0];
        let osoby = [];
        getUsers = () => {
            console.log('In getUsers()');
            const promise = new Promise((resolve, reject) => {
                console.log('In getUsers() Promise');
                tabela = document.getElementsByClassName('hover')[0].childNodes[1];
                console.log(tabela);
                let dateFrom = new Date(startDate);
                let dateTo = new Date(endDate);
                setTimeout(() => {
                    console.log('In getUsers() Promise setTimeout1000');
                    for(let j=0; j<tabela.childNodes.length; j++) {
                        let user = tabela.childNodes[j];

                        let dateToCheck = new Date(user.childNodes[0].innerText.substring(0,10));
                        if(dateToCheck >= dateFrom && dateToCheck <= dateTo) {
                            console.log('Push user: ', user);
                            osoby.push({
                                date: user.childNodes[0].innerText.substring(0,10),
                                nickname: user.childNodes[1].innerText,
                                message: user.childNodes[2].innerText
                            });
                        }  else {
                            break;
                        }      
                    }
                }, 1000)
                setTimeout(() => {
                    console.log('In getUsers() Promise setTimeout3000');
                    lastUserDate = new Date(tabela.childNodes[tabela.childNodes.length-1].childNodes[0].innerText.substring(0,10));
                    if(!(pagination.childNodes[pagination.childNodes.length-2].innerText >= 1 && pagination.childNodes[pagination.childNodes.length-2].innerText <=99999) && lastUserDate >= dateFrom && lastUserDate <= dateTo) {
                        console.log('In getUsers() Promise setTimeout3000 If next page exists run getUsers()');
                        pagination.childNodes[pagination.childNodes.length-2].click();
                        getUsers();
                    } else {
                        console.log('In getUsers() Promise setTimeout3000 else next page not exists');
                        resolve('Hallo');
                    }
                }, 3000);
            });
            promise.then(() => {
                pagination.childNodes[0].click();
                console.log("OSOBY ARRAY: ", osoby);
                let osobySet = [...new Set(osoby.map(osoba => osoba.nickname))];
                console.log("OSOBY SET: ", osobySet);
                let random = Math.floor(getRandom(0,osobySet.length-1));
                console.log(random + "\n")
                console.log(osoby[random]);
                if(osoby[random]) {
                    chrome.runtime.sendMessage(osoby[random].nickname);
                } else {
                    chrome.runtime.sendMessage(osoby[random]);
                }
            });
        }
        getUsers();
    }
    chrome.tabs.executeScript({
        code: '(' + modifyDOM + ')("' + startDate +'","'+ endDate+'");' //argument here is a string but function.toString() returns function's code
    });
    chrome.runtime.onMessage.addListener(doStuff = (response, sender, sendResponse) => {
        if(response) {
            endLoading(response);
        } else {
            endLoading('Nikt nie wygrał');
        }
        
        chrome.extension.onRequest.removeListener(doStuff);
    });
});
endLoading = (winner) => {
    losowanie.innerHTML = '';
    win.innerHTML = `<h2>Zwycięzca: ${winner}</h2><h2>Gratulacje !</h2><div class="pyro"><div class="before"></div><div class="after"></div></div>`;
}
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
document.getElementById('start').value = new Date().toDateInputValue();
document.getElementById('end').value = new Date().toDateInputValue();
