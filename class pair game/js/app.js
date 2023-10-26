import { AmazingCard } from "/js/AmazingCard.js";

const rootBlock = document.getElementById('root');
const timeCounter = document.getElementById('timeOut');
let timeGame = 1000;
let firstCard = null;
let secondCard = null;
let arrCards = [];

function startGame(rootBlock, cardNumber) {

    if (cardNumber === '10') {
        for (let i = 1; i <= cardNumber * 5; i++) {
            arrCards.push(i, i);
        }
    } else if (cardNumber === '8') {
        for (let i = 1; i <= cardNumber * 4; i++) {
            arrCards.push(i, i);
        }
    } else if (cardNumber === '6') {
        for (let i = 1; i <= cardNumber * 3; i++) {
            arrCards.push(i, i);
        }
    } else if (cardNumber === '4') {
        for (let i = 1; i <= cardNumber * 2; i++) {
            arrCards.push(i, i);
        }
    } else {
        for (let i = 1; i <= cardNumber; i++) {
            arrCards.push(i, i);
        }
    }

    for (let i = 0; i < arrCards.length; i++) {
        let randomIndex = Math.floor(Math.random() * arrCards.length)
        let temp = arrCards[i];
        arrCards[i] = arrCards[randomIndex]
        arrCards[randomIndex] = temp;
    }

    switch (cardNumber) {
        case '2':
            timeGame = 20;
            break;
        case '4':
            timeGame = 120;
            break;
        case '6':
            timeGame = 360;
            break;
        case '8':
            timeGame = 480;
            break;
        case '10':
            timeGame = 600;
            break;
    }
    setInterval(() => {
        if (timeGame === 0) {
            clearInterval()
            alert('Время игры закончилось');
            window.location.reload();
        }
        updateCountdown(timeGame)
        timeGame--
    }, 1000)

    

    const list = document.createElement('ul')
    list.classList.add('list')
    list.style = `grid-template-columns: repeat(${cardNumber}, 1fr)`

    for (let cards of arrCards) {
    const cardClass = new AmazingCard(list, cards, flip) 
    }

    rootBlock.append(list)
}

function flip(card) {
    if (firstCard !== null && secondCard !== null) {
        if (firstCard.number !== secondCard.number)
        firstCard.open = false;
        secondCard.open = false;
        firstCard = null;
        secondCard = null;
    }

    //сравнивает 2 экземпляра и если они совпадают, отмечает как готовое, не совсем понимаю почему именно цифра нужна

    if (firstCard === null) {
        firstCard = card;
    } else {
        secondCard = card;
    }

    if (firstCard !== null && secondCard !== null) {
        if (firstCard.number === secondCard.number) {
            firstCard.success = true;
            secondCard.success = true;
            firstCard = null;
            secondCard = null;
        }
    }

    if (arrCards.length === document.querySelectorAll('.success').length) {
        setTimeout(() => {
            alert('Победа');
            window.location.reload();
        }, 300)

    }
    console.log('Клик по карте', card);
}

function updateCountdown(timeGame) {
    const minutes = Math.floor(timeGame / 60);
    let seconds = timeGame % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    timeCounter.innerHTML = `До окончания игры осталось ${minutes}:${seconds}`;
    timeGame--;
}

function createForm() {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const contBtn = document.createElement('div');
    const button = document.createElement('button');

    form.classList.add('form');
    form.textContent = 'Выбор сложности';
    input.classList.add('game__section-input');
    input.maxLength = 10;
    input.placeholder = 'От 2 до 10 (только чётное число)';
    contBtn.classList.add('game__section-cont');
    button.textContent = 'Начать игру';
    button.classList.add('btn-reset', 'btn')

    input.addEventListener('input', function () {
        if (input.value) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
            const inputValue = input.value;

            const validNumber = checkOfParity(inputValue);
            if (!validNumber) { 
                input.value = '4';
                 return
            } else {
                input.value = ''; 
                button.disabled = true;
                rootBlock.textContent = ''; 
            }
            startGame(rootBlock, inputValue)
    })

    form.append(input);
    form.append(contBtn);
    contBtn.append(button);
    rootBlock.append(form)
}

function checkOfParity(numb) {
    if (numb > 1 && numb < 11) { 
        if (!(numb % 2)) { 
            return numb; 
        }
    }
    return null; 
}

createForm()
