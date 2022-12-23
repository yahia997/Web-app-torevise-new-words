var editIndex;
var deleteIndex;
var text = document.getElementById('text'),
    btn = document.getElementById('tran'),
    all = document.getElementById('all'),
    result = document.getElementById('result'),
    num = document.getElementById('number'),
    statusText = document.getElementById('status'),
    warning = document.getElementById('warning');

text.addEventListener('change', () => {
    if(text.value.trim() === "") {
        text.classList.add("warning");
        warning.textContent = "يجب عدم ترك الحقل فارغا";
    }else {
        text.classList.remove("warning");
        warning.textContent = "";
    }
});

result.addEventListener('change', () => {
    if(result.value.trim() === "") {
        result.classList.add("warning");
        warning.textContent = "يجب عدم ترك الحقل فارغا";
    }else {
        result.classList.remove("warning");
        warning.textContent = "";
    }
});

text.addEventListener('change', () => {
    var translated;
    fetch(`https://api.mymemory.translated.net/get?q=${text.value}&langpair=en|ar`)
    .then(res => res.json())
    .then(data => {
        if(data.responseData.translatedText.includes(";") === true){
            translated = data.responseData.translatedText.replace(/;/gi, "-");
        }else if(data.responseData.translatedText.startsWith("MYMEMORY WARNING") ||
        data.responseData.translatedText.startsWith("NO QUERY SPECIFIED")) {
            translated = "";
        }else {
            translated = data.responseData.translatedText;
        }
        result.value = translated;
    });
});

var addBtn = document.getElementById('add'),
    addBoard = document.getElementById('add-board');

addBtn.addEventListener('click', () => {
    text.value = "";
    result.value = "";
    addBoard.classList.toggle('d-none');
    text.focus();
})

window.onload = () => {
    all.innerHTML = "";
    fetch("/words")
        .then(res => res.json())
        .then(data => {

        num.textContent = `لديك ${data.length} كلمات`;
        data.map((obj, index) => {
            if(obj.translation !== "" && obj.word !== "") {
                all.innerHTML += `<div class="word">
                    <p class="one">${obj.word}</p>
                    <p>${obj.translation}</p>
                    <div class="d-flex justify-content-between align-items-center w-100">
                        <button class="voice" onclick=play("${obj.word}")>
                            <img src="./icons/sound.png">
                        </button>
                        <div class="d-flex justify-content-end align-items-center">
                            <button class="edit" onclick=edit("${obj._id}")>
                                تعديل     
                            </button>
                            <button class="del" onclick=del("${obj._id}")>
                            حذف     
                            </button>
                        </div>
                    </div>
                </div>`;
            }
        })
    });
}

///////////////////////////////////////////////////////////
var inst = document.getElementById('voice');

inst.onclick = function(event) {
    inst.classList.add('recording');
    inst.firstElementChild.setAttribute('src', "./icons/microphone-black-shape.svg");
    setUp();
}

function setUp() {
    let speechRec = new p5.SpeechRec('en-US', gotSpeech);
    speechRec.start();

    function gotSpeech() {
        if(speechRec.resultValue) {
            text.value = speechRec.resultString;
            fetch(`https://api.mymemory.translated.net/get?q=${speechRec.resultString}&langpair=en|ar`)
            .then(res => res.json())
            .then(data => {
                let myTran;
                if(data.responseData.translatedText.includes(";")){
                    myTran = data.responseData.translatedText.replace(/;/gi, "/");
                }else {
                    myTran = data.responseData.translatedText;
                }
                translated = myTran;
                result.value = translated;
            });
        }
        inst.classList.remove('recording');
        inst.removeAttribute('disabled');
        inst.firstElementChild.setAttribute('src', "./icons/black.svg");
    }
}

//////////////////////////////////////////////

$('#my-btn').click(function() {
    var newWord = {word: text.value, translate: result.value};
    if(text.value !== "" && result.value !== ""){
        if(document.getElementById('my-btn').textContent === "أضف"){
            // new word
            axios.post("/add", { word: text.value, translation: result.value })
                .then(res => {
                    if (res.data === "new word added !") {
                        all.innerHTML = "";
    fetch("/words")
        .then(res => res.json())
        .then(data => {

        num.textContent = `لديك ${data.length} كلمات`;
        data.map((obj, index) => {
            if(obj.translation !== "" && obj.word !== "") {
                all.innerHTML += `<div class="word">
                    <p class="one">${obj.word}</p>
                    <p>${obj.translation}</p>
                    <div class="d-flex justify-content-between align-items-center w-100">
                        <button class="voice" onclick=play("${obj.word}")>
                            <img src="./icons/sound.png">
                        </button>
                        <div class="d-flex justify-content-end align-items-center">
                            <button class="edit" onclick=edit("${obj._id}")>
                            تعديل     
                            </button>
                            <button class="del" onclick=del("${obj._id}")>
                            حذف     
                            </button>
                        </div>
                    </div>
                </div>`;
            }
        })
    });
    text.value = "";
    result.value = "";
                    }
                })
        }else {
            // edit word
            axios.put(`/edit/${editIndex}`, { word: text.value, translation: result.value })
                .then(res => {
                    if (res.data === "Word updated!") {
                        document.getElementById('my-btn').textContent = "أضف";
                        statusText.textContent = "أضف كلمة جديدة";
                        all.innerHTML = "";
    fetch("/words")
        .then(res => res.json())
        .then(data => {

        num.textContent = `لديك ${data.length} كلمات`;
        data.map((obj, index) => {
            if(obj.translation !== "" && obj.word !== "") {
                all.innerHTML += `<div class="word">
                    <p class="one">${obj.word}</p>
                    <p>${obj.translation}</p>
                    <div class="d-flex justify-content-between align-items-center w-100">
                        <button class="voice" onclick=play("${obj.word}")>
                            <img src="./icons/sound.png">
                        </button>
                        <div class="d-flex justify-content-end align-items-center">
                            <button class="edit" onclick=edit("${obj._id}")>
                            تعديل     
                            </button>
                            <button class="del" onclick=del("${obj._id}")>
                            حذف     
                            </button>
                        </div>
                    </div>
                </div>`;
            }
        })
    });
    text.value = "";
    result.value = "";
                    }
                });
            }
    }
});
/////////// edit func ////////////////////
var edit = function(id) {
    addBoard.classList.remove('d-none');
    fetch(`/single-word/${id}`)
        .then(res => res.json())
        .then(data => {
            text.value = data.word;
            result.value = data.translation;
        });
    document.getElementById('my-btn').textContent = "تعديل";
    statusText.textContent = `(${text.value})  تعديل كلمة `;
    editIndex = id;
}
////////////////// delete ///////////////////////
var del = function(id) {
    deleteIndex = id;
    axios.delete(`/delete/${id}`)
    .then(res => {
        if (res.data === "Word deleted!") {
                all.innerHTML = "";
                fetch("/words")
    .then(res => res.json())
    .then(data => { 
            num.textContent = `لديك ${data.length} كلمات`;

            data.map((obj, index) => {
        if(obj.translate !== "" && obj.word !== "") {
            all.innerHTML += `<div class="word">
                    <p class="one">${obj.word}</p>
                    <p>${obj.translation}</p>
                    <div class="d-flex justify-content-between align-items-center w-100">
                        <button class="voice" onclick=play("${obj.word}")>
                            <img src="./icons/sound.png">
                        </button>
                        <div class="d-flex justify-content-end align-items-center">
                            <button class="edit" onclick=edit("${obj._id}")>
                                تعديل     
                                </button>
                            <button class="del" onclick=del("${obj._id}")>
                            حذف     
                            </button>
                        </div>
                        </div>
                        </div>`;
                    }
                });
            });
            }
        })
}
//////////////// search //////////////////////
var sInput = document.getElementById('s');
var researchResult = document.getElementById('research-result');
var researchResultP = document.getElementById('research-result-p');
var hide = document.getElementById('hide');

sInput.addEventListener('input', () => {
    researchResultP.classList.remove('d-none');
    researchResult.innerHTML = "";
    var searchReasult = [];
    var data = JSON.parse(localStorage.getItem('words'));
    data.map(obj => {
        if(obj.word.toLowerCase().trim().startsWith(sInput.value.toLowerCase().trim())
        && sInput.value !== "") {
            searchReasult.push(obj);
        }
    });
    if(searchReasult.length !== 0) {
        searchReasult.map((obj, index) => {
            if(obj.word !== "" && obj.translate !== ""){
                researchResult.innerHTML += `<div class="sr">
                <button class="voice" onclick=play("${obj.word}")>
                    <img src="./icons/sound.png">
                </button>
                <p class="one-sr">${check(obj.word, sInput.value)}</p>
                <p>${check(obj.translate, sInput.value)}</p>
                </div>
                </div>`;
            }
        })
    }else {
        researchResult.innerHTML = "لا توجد هذه الكلمة";
    }
})

hide.addEventListener('click', () => {
    researchResultP.classList.add('d-none');
});
//////////////////////////////////////
var check = function(s, search) {
    var count = 0;
    for(var i = 0; i < s.length; i++) {
        if(search[i]) {
            if(s[i].toLowerCase() === search[i].toLowerCase()) {
                count ++;
            }
        }
    }
    return `<mark>${s.slice(0, count)}</mark>` + s.slice(count, s.length);
}
////////// quote ///////////

/////////////////////////////

////////////////////////////////
var closeBtn = document.getElementById('close');

closeBtn.onclick = () => {
    addBoard.classList.add('d-none');
}
////////////////////////////////////
document.body.style.height = `${window.innerHeight}px`;
/////////////////////////////////////
var audioBtn = document.getElementById('audio');

var speech;

function play(text) {
    speech = new p5.Speech();
     
    speech.listVoices()
    speech.speak(text);
}

audioBtn.addEventListener('click', () => {
    play(text.value);
});
///////////////////////////////////////////
var menuBtn = document.getElementById('menu-btn'),
    nav = document.getElementById('nav');

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('d-none');
    menuBtn.classList.toggle('open');
});

var deleteAll = document.getElementById('del-all');

deleteAll.addEventListener('click', () => {
    localStorage.removeItem('words');
    all.innerHTML = "";
    num.textContent = "لا يوجد لديك كلمات";
    nav.classList.add('d-none');
    menuBtn.classList.remove('open');
});