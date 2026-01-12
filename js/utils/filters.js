/**
 * Utilitaires de filtrage pour les voitures
 * @module utils/filters
 */

import { AppConfig } from '../config/app.config.js';

/**
 * Classe pour filtrer une liste de voitures
 */
export class CarFilter {
    /**
     * @param {Array<Car>} cars - Liste des voitures à filtrer
     */
    constructor(cars) {
        this.cars = [...cars]; // Copie pour ne pas modifier l'original
    }

    /**
     * Filtre par marque
     * @param {string|null} brand - Marque à filtrer (null pour ignorer)
     * @returns {CarFilter} Instance pour le chaînage
     */
    byBrand(brand) {
        if (brand && brand !== 'none') {
            this.cars = this.cars.filter(car => car.brand === brand);
        }
        return this;
    }

    /**
     * Filtre par plage de prix
     * @param {number|null} min - Prix minimum (null pour ignorer)
     * @param {number|null} max - Prix maximum (null pour ignorer)
     * @returns {CarFilter} Instance pour le chaînage
     */
    byPriceRange(min, max) {
        const minPrice = min !== null && min !== undefined ? min : AppConfig.price.min;
        const maxPrice = max !== null && max !== undefined ? max : AppConfig.price.max;
        
        this.cars = this.cars.filter(car => {
            const price = parseFloat(car.price);
            return price >= minPrice && price <= maxPrice;
        });
        return this;
    }

    /**
     * Filtre par statut
     * @param {string|null} status - Statut à filtrer (null pour ignorer)
     * @returns {CarFilter} Instance pour le chaînage
     */
    byStatus(status) {
        if (status && status !== 'none') {
            this.cars = this.cars.filter(car => car.status === status);
        }
        return this;
    }

    /**
     * Filtre par recherche textuelle
     * @param {string} query - Terme de recherche
     * @returns {CarFilter} Instance pour le chaînage
     */
    bySearch(query) {
        if (!query || query.trim().length === 0) {
            return this;
        }
        
        const searchTerm = query.toLowerCase().trim();
        this.cars = this.cars.filter(car => {
            return car.name.toLowerCase().includes(searchTerm) ||
                   car.brand.toLowerCase().includes(searchTerm) ||
                   (car.detail && car.detail.toLowerCase().includes(searchTerm));
        });
        return this;
    }

    /**
     * Trie les résultats
     * @param {string} sortBy - Critère de tri (price, name, brand)
     * @param {string} order - Ordre (asc, desc)
     * @returns {CarFilter} Instance pour le chaînage
     */
    sort(sortBy = 'name', order = 'asc') {
        this.cars.sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case 'price':
                    comparison = parseFloat(a.price) - parseFloat(b.price);
                    break;
                case 'name':
                    comparison = a.name.localeCompare(b.name, 'fr');
                    break;
                case 'brand':
                    comparison = a.brand.localeCompare(b.brand, 'fr');
                    break;
                default:
                    comparison = 0;
            }
            
            return order === 'asc' ? comparison : -comparison;
        });
        return this;
    }

    /**
     * Limite le nombre de résultats
     * @param {number} limit - Nombre maximum de résultats
     * @returns {CarFilter} Instance pour le chaînage
     */
    limit(limit) {
        this.cars = this.cars.slice(0, limit);
        return this;
    }

    /**
     * Pagine les résultats
     * @param {number} page - Numéro de page (commence à 1)
     * @param {number} itemsPerPage - Nombre d'éléments par page
     * @returns {CarFilter} Instance pour le chaînage
     */
    paginate(page, itemsPerPage = AppConfig.ui.itemsPerPage) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        this.cars = this.cars.slice(start, end);
        return this;
    }

    /**
     * Retourne les résultats filtrés
     * @returns {Array<Car>} Liste des voitures filtrées
     */
    getResults() {
        return this.cars;
    }

    /**
     * Retourne le nombre de résultats
     * @returns {number} Nombre de résultats
     */
    count() {
        return this.cars.length;
    }
}

/**
 * Applique des filtres à une liste de voitures
 * @param {Array<Car>} cars - Liste des voitures
 * @param {Object} filters - Objet contenant les critères de filtrage
 * @param {string} [filters.brand] - Marque
 * @param {number} [filters.minPrice] - Prix minimum
 * @param {number} [filters.maxPrice] - Prix maximum
 * @param {string} [filters.status] - Statut
 * @param {string} [filters.search] - Recherche textuelle
 * @param {string} [filters.sortBy] - Critère de tri
 * @param {string} [filters.order] - Ordre de tri (asc/desc)
 * @returns {Array<Car>} Liste filtrée
 */
export function filterCars(cars, filters = {}) {
    const filter = new CarFilter(cars);
    
    if (filters.brand) filter.byBrand(filters.brand);
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        filter.byPriceRange(filters.minPrice, filters.maxPrice);
    }
    if (filters.status) filter.byStatus(filters.status);
    if (filters.search) filter.bySearch(filters.search);
    if (filters.sortBy) filter.sort(filters.sortBy, filters.order || 'asc');
    
    return filter.getResults();
}

