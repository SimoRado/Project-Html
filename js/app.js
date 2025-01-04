class BaseService {
    getAll() {
      throw "NotImplementedError";
    }
  
    // options:
    // {brand: string, price_lower: number, price_upper: number }
    filter(options) {
      throw "NotImplementedError";
    }
  
    getById(id) {
      throw "NotImplementedError";
    }
  
    create(data) {
      throw "NotImplementedError";
    }
  
    // Must have id
    update(data) {
      throw "NotImplementedError";
    }
}

class Car{
    constructor(name,img){
        this.name = name;
        this.img = img;
    }
    // constructor(){
    //     this.name = "Noname";
    //     this.img = "../assets/default.png";
    // }
    render(){
        let card = document.createElement('div');
        card.classList.add("card");
        card.innerHTML = `
            <div class="car-img">
                <img src="${this.img}" alt="${this.name}">
            </div>
            <div class="info">
                <h4>${this.name}</h4>
            </div>
        `;
        return card;
    }
}

class Cars{
    constructor() {
        this.cars = [];
    }
    loadCars(data){

    }
}




