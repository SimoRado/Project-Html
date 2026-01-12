/**
 * Classes d'erreur personnalisées pour l'application
 * @module errors/CustomErrors
 */

/**
 * Erreur de validation
 */
export class ValidationError extends Error {
    /**
     * @param {string} message - Message d'erreur
     * @param {Array<string>} errors - Liste des erreurs de validation
     */
    constructor(message, errors = []) {
        super(message);
        this.name = 'ValidationError';
        this.errors = errors;
    }
}

/**
 * Erreur de stockage
 */
export class StorageError extends Error {
    /**
     * @param {string} message - Message d'erreur
     */
    constructor(message) {
        super(message);
        this.name = 'StorageError';
    }
}

/**
 * Erreur de traitement d'image
 */
export class ImageProcessingError extends Error {
    /**
     * @param {string} message - Message d'erreur
     */
    constructor(message) {
        super(message);
        this.name = 'ImageProcessingError';
    }
}

/**
 * Erreur d'API
 */
export class ApiError extends Error {
    /**
     * @param {string} message - Message d'erreur
     * @param {number} [statusCode] - Code de statut HTTP
     */
    constructor(message, statusCode = null) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
    }
}

/**
 * Erreur de permission
 */
export class PermissionError extends Error {
    /**
     * @param {string} message - Message d'erreur
     */
    constructor(message) {
        super(message);
        this.name = 'PermissionError';
    }
}

