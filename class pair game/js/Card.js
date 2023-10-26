export class Card {
  _open = false;
  _success = false;
  
    constructor(container, cardNumber, flip) {
      this.card = document.createElement('li');
      
      this.cardNumber = cardNumber;
      this.card.classList.add('card');
      
      this.number = cardNumber;
      this.card.addEventListener('click', () => {
        if(this.open === false && this.success === false){
          this.open = true;
          flip(this);
        }
        
      });
      container.append(this.card);
    }
  
    set cardNumber(value) {
      this._cardNumber = value;
      this.card.textContent = value;
    }
  
    get cardNumber() {
      return this._cardNumber;
    }
  
    set open(value) {
      this._open = value;
      
      if(value) {
        this.card.classList.add('open');
      } else {
        this.card.classList.remove('open');
      }
    }
    
    get open() { 
      return this._open;
    }

    set success(value) {
      this._success = value;
      if(value) {
        this.card.classList.add('success');
      } else {
        this.card.classList.remove('success');
      }
    }
    
    get success() {
      return this._success;
    }
  }

  