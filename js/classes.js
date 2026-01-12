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
      value.push(data);
      localStorage.setItem(this.key, JSON.stringify(value));
    }
  }

  removeAt(index){
    const value = JSON.parse(localStorage.getItem(this.key) ?? "[]");
    if (!Array.isArray(value)) return;
    if (index < 0 || index >= value.length) return;
    value.splice(index,1);
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  updateAt(index, data){
    const value = JSON.parse(localStorage.getItem(this.key) ?? "[]");
    if (!Array.isArray(value)) return;
    if (index < 0 || index >= value.length) return;
    value[index] = data;
    localStorage.setItem(this.key, JSON.stringify(value));
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
        this.img = img;
        if (detail.length === 0) {
          this.detail = "No detail available for this car !";
        }else{
          this.detail = detail;
        }
    }

    static parse(data){
      return new Car(data.name, data.brand, data.price, data.status, data.detail, data.img);
    }

    renderCard(cpt){
        let card = document.createElement('div');
        card.classList.add("card");
        card.setAttribute('data-id', cpt);
        // `data-storage` will be set by Cars.renderList when available.
        card.innerHTML = `
            <div class="car-img">
                    <img src="${this.img}" alt="${this.name}">
                </div>
                <div class="info">
                    <h4 class="title">${this.name}</h4>
                    <h4>Price :</h4>
                    <p>from   ${this.price} MAD</p>
                    <h4>status :</h4> 
                    <p>${this.status}</p>
                    <div class="info-btn">
                  <button class="view-more-btn">view more</button>
                  <button class="edit-btn" title="Edit">✏️</button>
                  <button class="delete-btn" title="Supprimer">🗑️</button>
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    renderInfoCard(){
      let card = `
                <div class="close-btn">
                    <button onclick="removeForm()" ><img src="../assets/closeBlack.png" alt=""></button>
                </div>
                <div class="info-img">
                    <img src="${this.img}" alt="${this.name}">
                </div>
                <h1>${this.name}</h1>
                <div class="info-div">
                    <h4>Price : </h4>
                    <p>from ${this.price} MAD</p>
                    <h4>Status : </h4>
                    <p>${this.status}</p>
                    <h4>Details :</h4>
                    <p>${this.detail}</p>
                </div>
                <div class="info-btn">
                    <button>Buy / Rent</button>
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
      const raw = this.service.getAll();
      for (let i = 0; i < raw.length; i++) {
        const parsed = Car.parse(raw[i]);
        // keep original storage index so UI actions (delete) map correctly
        parsed._storageIndex = i;
        cars.push(parsed);
      }
      return cars;
    }

    renderList(where, listCars){
      let cpt = 0;
      for (const car of listCars) {
        const card = car.renderCard(cpt++);
        if (typeof car._storageIndex !== 'undefined') {
            card.setAttribute('data-storage', car._storageIndex);
        }
        where.appendChild(card);
      }
    }

}

const carsService = new LocalStorageService("cars");
const carList = new Cars(carsService);
const productList = document.getElementById('product-list');


