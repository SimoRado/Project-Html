// Dashboard JavaScript - Utilise uniquement les classes existantes

// Initialisation du dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    updateDate();
    loadStatistics();
    loadCharts();
    loadRecentCars();
    loadTopBrands();
}

// Mise à jour de la date
function updateDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateElement.textContent = now.toLocaleDateString('fr-FR', options);
    }
}

// Chargement des statistiques
function loadStatistics() {
    const cars = carList.getAll();
    
    // Total des voitures
    const totalCars = cars.length;
    document.getElementById('total-cars').textContent = totalCars;
    
    // Voitures en location
    const rentalCars = cars.filter(car => car.status === 'Rental' || car.status === 'Rental/Buy').length;
    document.getElementById('rental-cars').textContent = rentalCars;
    
    // Revenus totaux (somme des prix)
    const totalRevenue = cars.reduce((sum, car) => {
        const price = parseFloat(car.price) || 0;
        return sum + price;
    }, 0);
    document.getElementById('total-revenue').textContent = formatPrice(totalRevenue) + ' MAD';
    
    // Prix moyen
    const avgPrice = totalCars > 0 ? totalRevenue / totalCars : 0;
    document.getElementById('avg-price').textContent = formatPrice(avgPrice) + ' MAD';
}

// Formatage du prix
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR').format(Math.round(price));
}

// Chargement des graphiques
function loadCharts() {
    const cars = carList.getAll();
    
    // Graphique par marque
    createBrandChart(cars);
    
    // Graphique par statut
    createStatusChart(cars);
    
    // Graphique de distribution des prix
    createPriceChart(cars);
}

// Graphique par marque
function createBrandChart(cars) {
    const brandCounts = {};
    
    cars.forEach(car => {
        const brand = car.brand || 'Autre';
        brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });
    
    const brands = Object.keys(brandCounts);
    const counts = Object.values(brandCounts);
    
    const ctx = document.getElementById('brandChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: brands,
            datasets: [{
                data: counts,
                backgroundColor: [
                    '#0087a9',
                    '#28a745',
                    '#ffc107',
                    '#17a2b8',
                    '#dc3545',
                    '#6c757d',
                    '#6610f2'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Graphique par statut
function createStatusChart(cars) {
    const statusCounts = {
        'Rental': 0,
        'Buy': 0,
        'Rental/Buy': 0
    };
    
    cars.forEach(car => {
        const status = car.status || 'Autre';
        if (statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
        }
    });
    
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Location', 'Vente', 'Location/Vente'],
            datasets: [{
                data: [
                    statusCounts['Rental'],
                    statusCounts['Buy'],
                    statusCounts['Rental/Buy']
                ],
                backgroundColor: [
                    '#0087a9',
                    '#28a745',
                    '#ffc107'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Graphique de distribution des prix
function createPriceChart(cars) {
    // Créer des tranches de prix
    const priceRanges = [
        { label: '0-50K', min: 0, max: 50000 },
        { label: '50K-100K', min: 50000, max: 100000 },
        { label: '100K-200K', min: 100000, max: 200000 },
        { label: '200K-500K', min: 200000, max: 500000 },
        { label: '500K+', min: 500000, max: Infinity }
    ];
    
    const rangeCounts = priceRanges.map(range => {
        return cars.filter(car => {
            const price = parseFloat(car.price) || 0;
            return price >= range.min && price < range.max;
        }).length;
    });
    
    const ctx = document.getElementById('priceChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: priceRanges.map(r => r.label),
            datasets: [{
                label: 'Nombre de voitures',
                data: rangeCounts,
                backgroundColor: '#0087a9',
                borderColor: '#006d87',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Chargement des voitures récentes
function loadRecentCars() {
    const cars = carList.getAll();
    const recentCars = cars.slice(-5).reverse(); // Les 5 dernières voitures
    
    const tbody = document.getElementById('recent-cars-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (recentCars.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #6c757d;">Aucune voiture enregistrée</td></tr>';
        return;
    }
    
    recentCars.forEach(car => {
        const row = document.createElement('tr');
        const statusClass = car.status === 'Rental' ? 'rental' : 
                           car.status === 'Buy' ? 'buy' : 'both';
        
        row.innerHTML = `
            <td><strong>${escapeHtml(car.name)}</strong></td>
            <td>${escapeHtml(car.brand)}</td>
            <td>${formatPrice(car.price)} MAD</td>
            <td><span class="status-badge ${statusClass}">${escapeHtml(car.status)}</span></td>
        `;
        
        tbody.appendChild(row);
    });
}

// Chargement des top marques
function loadTopBrands() {
    const cars = carList.getAll();
    const brandCounts = {};
    
    cars.forEach(car => {
        const brand = car.brand || 'Autre';
        brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });
    
    // Trier par nombre décroissant
    const sortedBrands = Object.entries(brandCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Top 5
    
    const brandList = document.getElementById('top-brands');
    if (!brandList) return;
    
    brandList.innerHTML = '';
    
    if (sortedBrands.length === 0) {
        brandList.innerHTML = '<p style="text-align: center; color: #6c757d;">Aucune marque disponible</p>';
        return;
    }
    
    sortedBrands.forEach(([brand, count]) => {
        const item = document.createElement('div');
        item.className = 'brand-item';
        item.innerHTML = `
            <span class="brand-name">${escapeHtml(brand)}</span>
            <span class="brand-count">${count}</span>
        `;
        brandList.appendChild(item);
    });
}

// Fonction d'échappement HTML pour sécurité
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Fonction d'export des données
function exportData() {
    const cars = carList.getAll();
    const dataStr = JSON.stringify(cars, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cars-data-' + new Date().toISOString().split('T')[0] + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('Données exportées avec succès !');
}

// Fonction de rafraîchissement
function refreshDashboard() {
    initializeDashboard();
    alert('Dashboard actualisé !');
}

