const inputSearch = document.getElementById('search-input');
const _checkbox_strict = document.getElementById('strict-search-input');
const _inputSearch_svg = document.getElementsByClassName('svg-container');
const _checkbox_en = document.getElementById('lang-en-input');
const _checkbox_fr = document.getElementById('lang-fr-input');
const _span_lang = document.getElementsByClassName('lang');

const _counterEl = document.getElementById('count');
var countElementShowed = 0;

const foundedHtml = document.getElementById('founded-lists');
const stickerHtml = document.getElementsByClassName('bottom-right-panel')[0];
var elementHTML;

const ifNothing = "<img src='src/giphy.gif' alt='Nothing found!' class='nohting' style='margin: 0 auto;display: block;'> <p>But there's nothing... Push via <a href='#'>Github</a> if you have something.</p>";
const _nothingEl = document.getElementsByClassName('elements-nothing');


/*
 * Function's list
 */
var resSplit = [];
var splitKeywords = function (val) {
    resSplit = val.split(' ');
}

var clear = function () {
    foundedHtml.innerHTML = "";
    _nothingEl[0].innerHTML = "";
    stickerHtml.style.position = '';
}

var counter = function () {
    _counterEl.innerHTML = elementHTML.length;
}


Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

var checkLang = function (valLang) {
    if (_checkbox_en.checked === false && valLang === 'en') {
        for (var i = 0; i < _span_lang.length; i++)  {
            if (_span_lang[i].innerText === '[EN]') {
                _span_lang[i].parentNode.parentNode.parentNode.parentNode.remove();
            }
        }
    } else if (_checkbox_fr.checked === false && valLang === 'fr') {
        for (var i = 0; i < _span_lang.length; i++)  {
            if (_span_lang[i].innerText === '[FR]') {
                _span_lang[i].parentNode.parentNode.parentNode.parentNode.remove();
            }
        }
    }
}

var containsAll = function(arr1, arr2){
    return arr1.every(elem => arr2.indexOf(elem) > -1)
};

function compareAll(arr1, arr2) {
    var x = 0;
    if (arr1.length === arr2.length) {
        for (var u = 0; u < arr1.length; u++) {
            for (var i = 0; i < arr2.length; i++) {
                if (arr1[u] === arr2[i]) x++;
            }
        }
        if (x === arr2.length) return true;
    }
    return false;
}

/* End of function's list */



var resInput = [];
var activeMultiple = false;
/* Search in database and add it to webpage */
var searchInDB = function (val) {
    var x;
    resInput = val.split(' ');
    clear();

    resInput.length > 1 ? activeMultiple = true : activeMultiple = false;

    elem("keywords").each(function (k) {

        splitKeywords(k.keywords);
        if (k.keywords.indexOf(val) > -1 && activeMultiple === false || containsAll(resInput, resSplit) && activeMultiple === true) {
                
            foundedHtml.style.boxShadow = '0 0.3rem 0.4rem rgba(0,0,0,.3)';
            var elemToInsert = "<div class='element'><a target='_blank' href='" + k.url + "' class='a-title'>" + k.title + "</a>" + (k.price !== 'free' ? "<img src='src/money-bag.png' alt='Have to pay for.' class='if-notfree'/>" : '') + "<div class='more-infos'><div class='type-container'><span class='type'>" + k.type + " <span class='lang'>[" + k.lang + "]</span></span></div><div class='keywords'></div></div></div>";

            var addAndPushKeywords = function () {
                foundedHtml.innerHTML += elemToInsert;

                x = foundedHtml.lastElementChild;
                for (var i = 0; i < resSplit.length; i++) {
                    x.getElementsByClassName('keywords')[0].innerHTML += "<span class='" + resSplit[i] + "'>" + resSplit[i] + "</span>";
                }
                checkLang(k.lang);
            }

            
            
            if (_checkbox_strict.checked === true && compareAll(resInput, resSplit) ||
                _checkbox_strict.checked === false) {
                addAndPushKeywords();
            }
        }
    });

    elementHTML = document.getElementsByClassName('element');

    _counterEl.innerHTML = elementHTML.length;
    if (elementHTML.length === 0) {
        
        // If nothing, show gif + text
        _nothingEl[0].innerHTML = ifNothing;
        
        // only for style. 
        stickerHtml.style.position = 'relative';
        stickerHtml.style.display = 'block';
    }
}


/* Get value from search input and call query to database */
inputSearch.addEventListener('keyup', function () {
    var inputElements = this.value;
    inputElements = inputElements.toLowerCase();

    if (inputElements === "") {
        _inputSearch_svg[0].classList.remove('notEmpty');
        counter();
    } else if(inputElements.length >= 2) {
        
        _inputSearch_svg[0].classList.add('notEmpty');
        searchInDB(inputElements);
    }
});

/* Checkboxes */
document.addEventListener("DOMContentLoaded", function (event) {
    _checkbox_strict.addEventListener('change', function (event) {
        if (inputSearch.value !== "" && inputSearch.value.length >= 2) searchInDB(inputSearch.value);
    });

    _checkbox_en.addEventListener('change', function (event) {
        if (inputSearch.value !== ""  && inputSearch.value.length >= 2) searchInDB(inputSearch.value);

    })

    _checkbox_fr.addEventListener('change', function (event) {
        if (inputSearch.value !== ""  && inputSearch.value.length >= 2) searchInDB(inputSearch.value);
    })
});