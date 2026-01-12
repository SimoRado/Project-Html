/**
 * Gestionnaire d'erreurs centralisé
 * @module utils/errorHandler
 */

import { NotificationService } from './notifications.js';
import { ValidationError, StorageError, ImageProcessingError, ApiError } from '../errors/CustomErrors.js';

/**
 * Classe pour gérer les erreurs de manière centralisée
 */
export class ErrorHandler {
    /**
     * Gère une erreur et affiche un message approprié à l'utilisateur
     * @param {Error} error - L'erreur à gérer
     * @param {Object} options - Options supplémentaires
     * @param {boolean} options.showNotification - Afficher une notification (défaut: true)
     * @param {boolean} options.logToConsole - Logger dans la console (défaut: true)
     */
    static handle(error, options = {}) {
        const {
            showNotification = true,
            logToConsole = true
        } = options;

        // Logger l'erreur
        if (logToConsole) {
            console.error(`[${error.name || 'Error'}]`, error);
        }

        // Gérer selon le type d'erreur
        if (error instanceof ValidationError) {
            this.handleValidationError(error, showNotification);
        } else if (error instanceof StorageError) {
            this.handleStorageError(error, showNotification);
        } else if (error instanceof ImageProcessingError) {
            this.handleImageError(error, showNotification);
        } else if (error instanceof ApiError) {
            this.handleApiError(error, showNotification);
        } else {
            this.handleGenericError(error, showNotification);
        }

        // En production, envoyer à un service de logging
        if (this.isProduction()) {
            this.logToService(error);
        }
    }

    /**
     * Gère les erreurs de validation
     * @private
     */
    static handleValidationError(error, showNotification) {
        if (showNotification) {
            if (error.errors && error.errors.length > 0) {
                // Afficher toutes les erreurs de validation
                error.errors.forEach(err => {
                    NotificationService.error(err);
                });
            } else {
                NotificationService.error(error.message || 'Erreur de validation');
            }
        }
    }

    /**
     * Gère les erreurs de stockage
     * @private
     */
    static handleStorageError(error, showNotification) {
        if (showNotification) {
            NotificationService.error(
                'Erreur de stockage. Vos données pourraient ne pas être sauvegardées. ' +
                'Veuillez vérifier que votre navigateur autorise le stockage local.'
            );
        }
    }

    /**
     * Gère les erreurs de traitement d'image
     * @private
     */
    static handleImageError(error, showNotification) {
        if (showNotification) {
            NotificationService.error(error.message || 'Erreur lors du traitement de l\'image');
        }
    }

    /**
     * Gère les erreurs d'API
     * @private
     */
    static handleApiError(error, showNotification) {
        if (showNotification) {
            let message = 'Erreur de communication avec le serveur';
            
            if (error.statusCode === 401) {
                message = 'Vous devez être connecté pour effectuer cette action';
            } else if (error.statusCode === 403) {
                message = 'Vous n\'avez pas les permissions nécessaires';
            } else if (error.statusCode === 404) {
                message = 'Ressource non trouvée';
            } else if (error.statusCode === 500) {
                message = 'Erreur serveur. Veuillez réessayer plus tard';
            }
            
            NotificationService.error(message);
        }
    }

    /**
     * Gère les erreurs génériques
     * @private
     */
    static handleGenericError(error, showNotification) {
        if (showNotification) {
            const message = error.message || 'Une erreur inattendue s\'est produite';
            NotificationService.error(message);
        }
    }

    /**
     * Envoie l'erreur à un service de logging externe
     * @private
     */
    static logToService(error) {
        // Exemple d'intégration avec Sentry, LogRocket, etc.
        // if (window.Sentry) {
        //     window.Sentry.captureException(error);
        // }
        
        // Pour l'instant, on peut stocker dans localStorage pour debug
        try {
            const errorLog = JSON.parse(localStorage.getItem('error_log') || '[]');
            errorLog.push({
                timestamp: new Date().toISOString(),
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            // Garder seulement les 50 dernières erreurs
            const recentErrors = errorLog.slice(-50);
            localStorage.setItem('error_log', JSON.stringify(recentErrors));
        } catch (e) {
            // Ignorer les erreurs de logging
        }
    }

    /**
     * Vérifie si on est en production
     * @private
     */
    static isProduction() {
        return window.location.hostname !== 'localhost' && 
               window.location.hostname !== '127.0.0.1';
    }

    /**
     * Wrapper pour les fonctions async qui gère automatiquement les erreurs
     * @param {Function} asyncFn - Fonction async à wrapper
     * @returns {Function} Fonction wrappée
     */
    static wrapAsync(asyncFn) {
        return async (...args) => {
            try {
                return await asyncFn(...args);
            } catch (error) {
                this.handle(error);
                throw error; // Re-throw pour permettre la gestion en amont si nécessaire
            }
        };
    }
}

