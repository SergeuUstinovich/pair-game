const rootBlock = document.getElementById('root');
const timeCounter = document.getElementById('timeOut');
let timeGame = 1000;

function startGame(rootBlock, cardNumber) {
    let arrCards = [];
    let firstCard = null;
    let secondCard = null;

    for (let i = 1; i <= cardNumber; i++) {
        arrCards.push(i, i)
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
            timeGame = 60;
            break;
        case '6':
            timeGame = 120;
            break;
        case '8':
            timeGame = 180;
            break;
        case '10':
            timeGame = 360;
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
    for (let cards of arrCards) {
        const card = document.createElement('li');
        card.textContent = cards;
        card.classList.add('card')

        card.addEventListener('click', () => {
            if (card.classList.contains('open') || card.classList.contains('success')) {
                return
            }
            if (firstCard !== null && secondCard !== null) {
                firstCard.classList.remove('open')
                secondCard.classList.remove('open')
                firstCard = null;
                secondCard = null;
            }
            card.classList.add('open');
            if (firstCard === null) {
                firstCard = card
            } else {
                secondCard = card;
            }

            if (firstCard !== null && secondCard !== null) {
                let firstCardNumber = firstCard.textContent;
                let secondCardNumber = secondCard.textContent
                if (firstCardNumber === secondCardNumber) {
                    firstCard.classList.add('success')
                    secondCard.classList.add('success')
                }
            }

            if (arrCards.length === document.querySelectorAll('.success').length) {
                setTimeout(() => {
                    alert('Победа');
                    window.location.reload();
                }, 300)

            }
        })

        list.append(card)
    }
    rootBlock.append(list)
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
