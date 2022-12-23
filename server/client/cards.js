var cards = document.getElementById('cards'),
    cardsCloseBtn = document.getElementById('crads-close'),
    face = document.getElementById('face'),
    textOne = document.getElementById('text-1'),
    textTwo = document.getElementById('text-2'),
    wordsBtn = document.getElementById('words-btn'),
    cardsBtn = document.getElementById('cards-btn'),
    nav = document.getElementById('nav'),
    menuBtn = document.getElementById('menu-btn');

fetch("/words")
    .then(res => res.json())
    .then(data => {
        
        
        if(Array.isArray(data)) {
    if(data.length !== 0) {
        var num = Math.floor(Math.random() * data.length);
        textOne.textContent = data[num].word;
        textTwo.textContent = data[num].translation;
    }else {
        textOne.textContent = "لا يوجد لديك كلمات";
        textTwo.textContent = "";
    }
}else {
    textOne.textContent = "لا يوجد لديك كلمات";
    textTwo.textContent = "";
}

cards.addEventListener('click', () => {
    face.classList.add('flip');
    setTimeout(() => {
        face.classList.remove('flip');
        setTimeout(() => {
            if(Array.isArray(data)) {
                if(data.length !== 0) {
                    var num = Math.floor(Math.random() * data.length);
                    textOne.textContent = data[num].word;
                    textTwo.textContent = data[num].translation;
                }else {
                    textOne.textContent = "لا يوجد لديك كلمات";
                    textTwo.textContent = "";
                }
            }else {
                textOne.textContent = "لا يوجد لديك كلمات";
                textTwo.textContent = "";
            }
        }, 800);
    }, 1500);
});
});

cardsCloseBtn.addEventListener('click', () => {
    cards.classList.add('d-none');
});

wordsBtn.onclick= () => {
    cards.classList.add('d-none');
}

cardsBtn.onclick = () => {
    cards.classList.remove('d-none');
    nav.classList.add('d-none');
    menuBtn.classList.remove('open');
}