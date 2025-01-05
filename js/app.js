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

class LocalStorageService extends BaseService {
  constructor(key) {
    super();
    this.key = key;
  }

  getAll() {
    return JSON.parse(localStorage.getItem(this.key) ?? "[]");
  }

  create(data) {
    // By default the value is an empty list
    // []
    const value = JSON.parse(localStorage.getItem(this.key) ?? "[]");
    if (data != null) {
      console.log(localStorage.getItem(this.key));
      value.push(data);
      localStorage.setItem(this.key, JSON.stringify(value));
    }
  }

  empty() {
    localStorage.removeItem(this.key);
  }
}

class Car{
    constructor(name, brand, price, status, detail = "noDetails", img = "../assets/default.png"){
        this.name = name;
        this.brand = brand;
        this.price = price;
        this.status = status;
        this.detail = detail;
        this.img = img;
    }

    static parse(data){
      return new Car(data.name, data.brand, data.price, data.status, data.detail, data.img);
    }

    renderCard(cpt){
        let card = document.createElement('div');
        card.classList.add("card");
        card.setAttribute('data-id', cpt);
        card.innerHTML = `
            <div class="car-img">
                    <img src="${this.img}" alt="${this.name}">
                </div>
                <div class="info">
                    <h4 class="title">${this.name}</h4>
                    <h4>Price :</h4>
                    <p>from   ${this.price}$</p>
                    <h4>status :</h4> 
                    <p>${this.status}</p>
                    <div class="info-btn">
                        <button>veiw more</button>
                    </div>
                </div>
        `;
        return card;
    }
}

class Cars{
    constructor(service) {
      this.service = service;
    }
    getAll(){
      const cars = [];
      for (const car of this.service.getAll()) {
        cars.push(Car.parse(car))
      }
      return cars;
    }

    renderList(list){
      let cpt = 0;
      for (const car of this.getAll()) {
        list.appendChild(car.renderCard(cpt++));
      }
    }

}

const carsService = new LocalStorageService("cars");
const carList = new Cars(carsService);

function addCarModalShow() {
  const addCarModal = document.getElementById("add-car-modal");
  addCarModal.style.display = "flex";
}

const productList = document.getElementById('product-list');
carList.renderList(productList);

const addBtnCard = `
            <div class="add-card">
                <button onclick="addCarModalShow()" class="add-btn" id="add-btn"> 
                    <img src="../assets/add.png" alt="">
                </button>
            </div>
    `
productList.innerHTML += addBtnCard;


