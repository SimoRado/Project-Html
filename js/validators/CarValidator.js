/**
 * Validateur pour les données de voiture
 * @module validators/CarValidator
 */

import { AppConfig } from '../config/app.config.js';
import { CAR_BRANDS, CAR_STATUS } from '../constants/carConstants.js';

/**
 * Classe pour valider les données d'une voiture
 */
export class CarValidator {
    /**
     * Valide les données d'une voiture
     * @param {Object} carData - Les données à valider
     * @param {string} carData.name - Nom de la voiture
     * @param {string} carData.brand - Marque de la voiture
     * @param {number|string} carData.price - Prix de la voiture
     * @param {string} carData.status - Statut de la voiture
     * @param {string} [carData.detail] - Détails optionnels
     * @returns {Object} Résultat de la validation avec isValid et errors
     */
    static validate(carData) {
        const errors = [];
        const config = AppConfig.validation.car;

        // Validation du nom
        if (!carData.name || typeof carData.name !== 'string') {
            errors.push('Le nom est requis et doit être une chaîne de caractères');
        } else {
            const trimmedName = carData.name.trim();
            if (trimmedName.length < config.minNameLength) {
                errors.push(`Le nom doit contenir au moins ${config.minNameLength} caractères`);
            }
            if (trimmedName.length > config.maxNameLength) {
                errors.push(`Le nom ne peut pas dépasser ${config.maxNameLength} caractères`);
            }
        }

        // Validation du prix
        const price = parseFloat(carData.price);
        if (isNaN(price)) {
            errors.push('Le prix doit être un nombre valide');
        } else {
            if (price < config.minPrice) {
                errors.push(`Le prix doit être supérieur ou égal à ${config.minPrice}`);
            }
            if (price > config.maxPrice) {
                errors.push(`Le prix ne peut pas dépasser ${config.maxPrice.toLocaleString()}`);
            }
        }

        // Validation de la marque
        if (!carData.brand || typeof carData.brand !== 'string') {
            errors.push('La marque est requise');
        } else {
            const brandValues = Object.values(CAR_BRANDS);
            if (!brandValues.includes(carData.brand)) {
                errors.push(`Marque non autorisée. Marques disponibles: ${brandValues.join(', ')}`);
            }
        }

        // Validation du statut
        if (!carData.status || typeof carData.status !== 'string') {
            errors.push('Le statut est requis');
        } else {
            const statusValues = Object.values(CAR_STATUS);
            if (!statusValues.includes(carData.status)) {
                errors.push(`Statut non autorisé. Statuts disponibles: ${statusValues.join(', ')}`);
            }
        }

        // Validation des détails (optionnel)
        if (carData.detail && typeof carData.detail !== 'string') {
            errors.push('Les détails doivent être une chaîne de caractères');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Valide uniquement le prix
     * @param {number|string} price - Prix à valider
     * @returns {boolean} True si valide
     */
    static validatePrice(price) {
        const priceNum = parseFloat(price);
        if (isNaN(priceNum)) return false;
        const config = AppConfig.validation.car;
        return priceNum >= config.minPrice && priceNum <= config.maxPrice;
    }

    /**
     * Valide uniquement la marque
     * @param {string} brand - Marque à valider
     * @returns {boolean} True si valide
     */
    static validateBrand(brand) {
        if (!brand || typeof brand !== 'string') return false;
        return Object.values(CAR_BRANDS).includes(brand);
    }
}

