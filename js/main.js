(() => {
    let timerId; // Переменная для setTimeout
    let timeGame = 180; //Время игры
    let numberOfCoincidences = 0; // Счетчик совпавших пар
    const timeCounter = document.getElementById('timeOut');

    // Заголовок формы
    function createTitle(title) {
        const appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        appTitle.classList.add('game__section-title');
        return appTitle;
    }
    //Создание формы для карточек
    function createForm() {
        const form = document.createElement('form');
        const input = document.createElement('input');
        const contBtn = document.createElement('div');
        const button = document.createElement('button');

        form.classList.add('form');
        form.textContent = 'Количество карточек по вертикали/горизонтали';
        input.classList.add('game__section-input');
        input.placeholder = 'Только чётные от 2-10';
        contBtn.classList.add('game__section-cont');
        button.textContent = 'Начать игру';
        button.classList.add('btn-reset', 'btn')

        form.append(input);
        form.append(contBtn);
        contBtn.append(button);

        return {
            form,
            input,
            button,
        };
    }

    // Отрисовка формы
    function formRender() {
        const formContainer = document.getElementById('contain');
        const formTitle = createTitle('Выбор сложности:');
        const numberFormCard = createForm();
        numberFormCard.button.disabled = true;

        formContainer.append(formTitle);
        formContainer.append(numberFormCard.form);
        //отключает кнопку если поле пустое
        numberFormCard.input.addEventListener('input', function () {
            if (numberFormCard.input.value) {
                numberFormCard.button.disabled = false;
            } else {
                numberFormCard.button.disabled = true;
            }
        });
        // Ввод и проверка чисел на валидность
        numberFormCard.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputValue = numberFormCard.input.value;

            const validNumber = checkOfParity(inputValue);
            if (!validNumber) { //если любое число вне диапазона функции ниже(2-10 и чётное)
                numberFormCard.input.value = '4';// тогда выставлять значение 4(по умолчанию)
                 
            } else {
                numberFormCard.input.value = ''; //очищает значение в поле после отработки функции
                numberFormCard.button.disabled = true;//включает нажатие кнопки
                formContainer.innerHTML = ''; 
                timerId = setInterval(() => { //время продолжительности игры, когда таймер выходит игра заканчивается
                  if (timeGame === 0) {
                      clearInterval(timerId);
                      alert('Время игры закончилось');
                      window.location.reload();
                  }
                  updateCountdown(timeGame);
                  timeGame--;
              }, 1000);
              updateCountdown(timeGame);
              startOfGame(Math.pow(validNumber, 2));
            }
            
        });
    }

    function updateCountdown(timeGame) {
      const minutes = Math.floor(timeGame / 60);
      let seconds = timeGame % 60;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      timeCounter.innerHTML = `До окончания игры осталось ${minutes}:${seconds}`;
      timeGame--;
    }
    

    function checkOfParity(numb) {
        if (numb > 1 && numb < 11) { //условие что значение в диапазоне 2-10 должны быть
            if (!(numb % 2)) { //и проверка внутри условия что значение в диапазоне чётные
                return numb; //возвращает значение в поле
            }
        }
        return null; //возвращает ничего(в дальнейшем его можно приравнять к 4(статичный вызов))
    }

    // Перемешиваем значения в массиве по методу Фишера-Йетса (Fisher-Yates)
    function shuffler(array) { 
        for(let i = 0 ; i < array.length; i++) {
            let j = Math.floor(Math.random() * array.length); //случайное число от 0 до array.length
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array
    }

   // Создание блока для карточек, ненумерованный список
   function createCardList() {
    const list = document.createElement('ul');
    list.classList.add('cards__list');
    return list;
   }
   // Создает и возвращает карточку с атрибутами
   function createCard(idValue, numberOfCards) {
    const containerWidth = document.querySelector('.game__section-body').offsetWidth; // берем ширину контейнера
    const cardWidth = containerWidth * 0.85 / (Math.sqrt(numberOfCards));//расчёт ширины карточки
    const card = document.createElement('li');
    const button = document.createElement('button');

    card.classList.add('card');
    card.setAttribute("style", `width: ${cardWidth}px; height: ${cardWidth}px;`);
    button.classList.add('btn');
    button.id = idValue;
    button.setAttribute("style", `font-size: ${cardWidth * 0.7}px;`);
  
    card.append(button);
  
    return {
        card,
        button,
    };
   }
   // Создаем массив пар цифр расположенных в случайном порядке
   function startOfGame(numberOfCards) {
    const arrayOfCards = [];
      let valueOfCards = numberOfCards / 2;
  
      for (let i = 0; i < numberOfCards; ++i) {
        arrayOfCards.push(valueOfCards);
        if (i % 2) {
          --valueOfCards;
        }
      }
      const shuffledArray = shuffler(arrayOfCards); // Перемешиваем массив
      createListOfCards(numberOfCards, shuffledArray); // Создаем карточки и вешаем обработчик
   }

   //Создаём список карточек
   function createListOfCards(numberOfCards, shuffledArray) {
    const section = document.querySelector('.game__section-body');
    const listOfCards = createCardList();
    

    timeCounter.classList.add('timer')

    for(let i = 0; i < numberOfCards; ++i) {
        let currentCard = createCard(i, numberOfCards);
        listOfCards.append(currentCard.card);
        currentCard.button.addEventListener('click', () => { // карточкам присваивается значение их id
            let valueOfCard = shuffledArray[currentCard.button.id];
            currentCard.button.innerHTML = valueOfCard;
            comparePairs(currentCard, valueOfCard);//присваиваем значение которые сравнили
            if(numberOfCards === numberOfCoincidences * 2) { //проверка на достижение конца игры
                playAgain();//функция повтора игры
            }
        });
    }
    
    section.appendChild(listOfCards);
   }

    let firstNumberObj = {}; // Для записи значения первой карточки {card: currentCard, value: valueOfCards}
    let secondNumberObj = {}; // Для записи значения второй карточки
    let isEqual = false; //переключение карточек

    function comparePairs(card, value) {  // Сравниваем значения карточек, показываем / скрываем их
        if (!Object.keys(firstNumberObj).length) {  // Если значение первой карточки пусто записываем переданное значение в эту карточку
          firstNumberObj = {
            card: card,
            value: value,
          };
          card.button.setAttribute('disabled', 'true');
        } else if (!Object.keys(secondNumberObj).length) { // Если значение второй карточки пусто записываем переданное значение в эту карточку
          secondNumberObj = {
            card: card,
            value: value,
          };
          card.button.setAttribute('disabled', 'true');
          if (firstNumberObj.value === secondNumberObj.value) {
            isEqual = true;
            ++numberOfCoincidences;
            return;
          }
        } else {  // Если есть значение и первой и второй карточки
          if (!isEqual) {
            firstNumberObj.card.button.innerHTML = '';
            secondNumberObj.card.button.innerHTML = '';
            firstNumberObj.card.button.removeAttribute('disabled');
            secondNumberObj.card.button.removeAttribute('disabled');
          } else {
            isEqual = false;
          }
    
          firstNumberObj = {
            card: card,
            value: value,
          };
    
          card.button.setAttribute('disabled', 'true');
          secondNumberObj = {};
        }
      }

      function playAgain() {
        const section = document.querySelector('.game__section-body');
        const button = document.createElement('button');
        button.innerText = 'Сыграть ещё раз';
        button.classList.add('btn-1');
        section.after(button);
    
        clearTimeout(timerId);
    
        button.addEventListener('click', () => {
          console.log('Играем ещё раз!');
          window.location.reload();
        });
      }



    document.addEventListener('DOMContentLoaded', () => {
        formRender();
    });

})();

