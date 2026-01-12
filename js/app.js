const addCarForm = document.getElementById("add-car-form");

//this part is for adding cars to the system and editing existing ones !!!

let editingIndex = null;

addCarForm.addEventListener("submit", (e) => {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const brand = document.getElementById("add-brand-select").value;
    const status = document.getElementById("add-status-select").value;
    const details = document.getElementById("details").value;
    var img = document.getElementById("img").value;
    if (img.length === 0) {
        img = "../assets/default.png"; 
    }else{
        img = "../assets/" + img.substring(12);
    }

    if (editingIndex !== null) {
        try{
            carsService.updateAt(editingIndex, new Car(name, brand, price, status, details, img));
        }catch(err){ console.error(err); }
        editingIndex = null;
    } else {
        carsService.create(new Car(name, brand, price, status, details, img));
    }

    Render(carList, productList, filterCondition)
    removeForm();
});

function addCarModalShow() {
    const addCarModal = document.getElementById("modal");
    const form = document.getElementById("form-container");
    form.style.display = "flex";
    addCarModal.showModal();
    addCarModal.style.animation = "showInfo 1s ease";
}

function removeForm() {
    const addCarModal = document.getElementById("modal");
    const form = document.getElementById("form-container");
    const infocard = document.getElementById("info-container");
    infocard.style.display = "none";
    form.style.display = "none";
    addCarModal.close();
    addCarModal.style.animation = "showInfo 1s ease";
}

//this part is for filtering !!!

var filterCondition = {
    brand: null,
    minPrice: 0,
    maxPrice: 999999999,
    status: null
}

var cars = [];

function Render(carList, whereRender, filterCondition) {
    cars = [];
    const allCars = carList.getAll();
    
    // Filtrer les voitures selon les critères
    for (const car of allCars) {
        // Vérifier le prix
        const carPrice = parseFloat(car.price) || 0;
        if (carPrice < filterCondition.minPrice || carPrice > filterCondition.maxPrice) {
            continue;
        }
        
        // Vérifier la marque
        if (filterCondition.brand !== null && car.brand !== filterCondition.brand) {
            continue;
        }
        
        // Vérifier le statut
        if (filterCondition.status !== null && car.status !== filterCondition.status) {
            continue;
        }
        
        // Si toutes les conditions sont remplies, ajouter la voiture
        cars.push(car);
    }
    
    // Vider et remplir la liste
    whereRender.innerHTML = "";
    carList.renderList(whereRender, cars);
    
    // Ajouter le bouton d'ajout
    const addBtnCard = `
            <div class="add-card">
                <button onclick="addCarModalShow()" class="add-btn" id="add-btn"> 
                    <img src="../assets/add.png" alt="">
                </button>
            </div>
    `;
    whereRender.innerHTML += addBtnCard;
}

function filter() {
    // Vérifier que les éléments existent
    const brandSelect = document.getElementById("brand-select");
    const statusSelect = document.getElementById("status-select");
    const minPriceInput = document.getElementById("min-price");
    const maxPriceInput = document.getElementById("max-price");
    
    if (!brandSelect || !statusSelect || !minPriceInput || !maxPriceInput) {
        console.error("Éléments de filtre non trouvés");
        return;
    }
    
    // Récupérer les valeurs
    let brand = brandSelect.value;
    let status = statusSelect.value;
    let minP = minPriceInput.value ? parseInt(minPriceInput.value) : NaN;
    let maxP = maxPriceInput.value ? parseInt(maxPriceInput.value) : NaN;
    
    // Mettre à jour les conditions de filtrage
    filterCondition.brand = (brand != "none" && brand != "") ? brand : null; 
    filterCondition.status = (status != "none" && status != "") ? status : null;
    
    // Gérer les prix
    if (!isNaN(minP) && !isNaN(maxP)) {
        if (minP <= maxP) {
            filterCondition.minPrice = minP;
            filterCondition.maxPrice = maxP;
        } else {
            // Si min > max, inverser les valeurs
            filterCondition.minPrice = maxP;
            filterCondition.maxPrice = minP;
        }
    } else if (!isNaN(minP) && isNaN(maxP)) {
        // Seulement prix minimum
        filterCondition.minPrice = minP >= 0 ? minP : 0;
        filterCondition.maxPrice = 999999999;
    } else if (isNaN(minP) && !isNaN(maxP)) {
        // Seulement prix maximum
        filterCondition.minPrice = 0;
        filterCondition.maxPrice = maxP > 0 ? maxP : 999999999;
    } else {
        // Aucun prix spécifié
        filterCondition.minPrice = 0;
        filterCondition.maxPrice = 999999999;
    }
    
    // Vérifier que productList existe avant de rendre
    if (productList) {
        Render(carList, productList, filterCondition);
    } else {
        console.error("productList n'est pas défini");
    }
}

function reset() {
    // Réinitialiser les conditions de filtrage
    filterCondition = {
        brand: null,
        minPrice: 0,
        maxPrice: 999999999,
        status: null
    };
    
    // Réinitialiser les champs du formulaire
    const brandSelect = document.getElementById("brand-select");
    const statusSelect = document.getElementById("status-select");
    const minPriceInput = document.getElementById("min-price");
    const maxPriceInput = document.getElementById("max-price");
    
    if (brandSelect) brandSelect.value = "none";
    if (statusSelect) statusSelect.value = "none";
    if (minPriceInput) minPriceInput.value = "";
    if (maxPriceInput) maxPriceInput.value = "";
    
    // Re-rendre la liste
    if (productList) {
        Render(carList, productList, filterCondition);
    }
}

// Initialiser le rendu seulement si productList existe
if (typeof productList !== 'undefined' && productList) {
    Render(carList, productList, filterCondition);
}

document.addEventListener("click", (e) => {
    if(e.target.matches(".view-more-btn")){
        const card = e.target.closest(".card");
        if (card) {
            const cardId = card.getAttribute("data-id");
            console.log(cardId, cars[cardId]);
            const addCarModal = document.getElementById("modal");
            const infocard = document.getElementById("info-container");
            infocard.style.display = "flex";
            infocard.innerHTML = cars[cardId].renderInfoCard();
            addCarModal.showModal();
        }
    }
});

// Edit button handler: populate the add/edit form with car data and open modal
document.addEventListener("click", (e) => {
    if (e.target.matches('.edit-btn')) {
        const card = e.target.closest('.card');
        if (!card) return;
        const idx = parseInt(card.getAttribute('data-id'));
        if (isNaN(idx)) return;
        // ensure `cars` has been populated by Render
        const car = cars[idx];
        if (!car) return;
        editingIndex = idx;
        document.getElementById("name").value = car.name;
        document.getElementById("price").value = car.price;
        document.getElementById("add-brand-select").value = car.brand;
        document.getElementById("add-status-select").value = car.status;
        document.getElementById("details").value = car.detail;
        // Note: cannot prefill file input for security reasons
        addCarModalShow();
    }
});

// Shared delete modal and handlers (works on all pages)
(function(){
    let pendingStorageIndex = null;

    // create modal markup and append to body
    const delModal = document.createElement('dialog');
    delModal.id = 'delete-modal';
    delModal.innerHTML = `
        <div style="padding:1rem; max-width:420px;">
            <h3 style="color:#b71c1c; margin-bottom:8px;">Confirmer la suppression</h3>
            <p id="delete-modal-text">Voulez-vous vraiment supprimer cette voiture ? Cette action est irréversible.</p>
            <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px;">
                <button id="delete-cancel" type="button" style="background:#eee; border:none; padding:8px 12px; border-radius:6px;">Annuler</button>
                <button id="delete-confirm" type="button" style="background:#b71c1c; color:white; border:none; padding:8px 12px; border-radius:6px;">Supprimer</button>
            </div>
        </div>
    `;
    document.body.appendChild(delModal);

    document.addEventListener('click', function(e){
        if (e.target.matches('.delete-btn')){
            const card = e.target.closest('.card');
            if(!card) return;
            // prefer storage index attribute
            const storageIdx = card.getAttribute('data-storage');
            pendingStorageIndex = storageIdx !== null ? parseInt(storageIdx) : parseInt(card.getAttribute('data-id'));
            delModal.showModal();
        }
    });

    const delCancel = document.getElementById('delete-cancel');
    const delConfirm = document.getElementById('delete-confirm');

    if(delCancel) delCancel.addEventListener('click', function(){
        pendingStorageIndex = null;
        delModal.close();
    });

    if(delConfirm) delConfirm.addEventListener('click', function(){
        if (pendingStorageIndex === null || isNaN(pendingStorageIndex)) return;
        try{
            carsService.removeAt(pendingStorageIndex);
        }catch(err){ console.error(err); }
        pendingStorageIndex = null;
        delModal.close();
        Render(carList, productList, filterCondition);
    });
})();
