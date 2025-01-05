const addCarForm = document.getElementById("add-car-form");

addCarForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const productList = document.getElementById('product-list');

    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const brand = document.getElementById("add-brand-select").value;
    const status = document.getElementById("status-select").value;
    const details = document.getElementById("details").value;
    var img = document.getElementById("img").files[0].name;
    console.log(name, price, brand, status, details, img);
    img = "../assets/" + img;
    carsService.create(new Car(name, brand, price, status, details, img));
    productList.innerHTML = "";
    carList.renderList(productList);
    const addBtnCard = `
            <div class="add-card">
                <button onclick="addCarModalShow()" class="add-btn" id="add-btn"> 
                    <img src="../assets/add.png" alt="">
                </button>
            </div>
    `
    productList.innerHTML += addBtnCard;
});

function removeForm() {
    const addCarModal = document.getElementById("add-car-modal");
    addCarModal.style.display = "none";
}


