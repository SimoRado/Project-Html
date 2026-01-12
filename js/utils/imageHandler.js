/**
 * Gestionnaire d'images pour l'upload et la validation
 * @module utils/imageHandler
 */

import { AppConfig } from '../config/app.config.js';
import { DEFAULT_VALUES } from '../constants/carConstants.js';

/**
 * Classe pour gérer les opérations sur les images
 */
export class ImageHandler {
    /**
     * Traite un fichier image uploadé
     * @param {File} file - Fichier image à traiter
     * @returns {Promise<string>} Promise qui résout avec l'URL de l'image (base64 ou chemin)
     * @throws {Error} Si le fichier est invalide
     */
    static async processImage(file) {
        if (!file) {
            return DEFAULT_VALUES.IMAGE;
        }

        // Validation du type
        const allowedTypes = AppConfig.validation.allowedImageTypes;
        if (!allowedTypes.includes(file.type)) {
            throw new Error(
                `Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`
            );
        }

        // Validation de la taille
        const maxSize = AppConfig.validation.maxImageSize;
        if (file.size > maxSize) {
            const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
            throw new Error(`Fichier trop volumineux. Taille maximale: ${maxSizeMB}MB`);
        }

        // Validation que c'est bien une image
        const isValidImage = await this.validateImageFile(file);
        if (!isValidImage) {
            throw new Error('Le fichier n\'est pas une image valide');
        }

        // Conversion en base64 pour le stockage local
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            
            reader.onerror = () => {
                reject(new Error('Erreur lors de la lecture du fichier'));
            };
            
            reader.readAsDataURL(file);
        });
    }

    /**
     * Valide qu'un fichier est bien une image
     * @param {File} file - Fichier à valider
     * @returns {Promise<boolean>} True si c'est une image valide
     */
    static validateImageFile(file) {
        return new Promise((resolve) => {
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);
            
            img.onload = () => {
                URL.revokeObjectURL(objectUrl);
                resolve(true);
            };
            
            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                resolve(false);
            };
            
            img.src = objectUrl;
        });
    }

    /**
     * Redimensionne une image si nécessaire
     * @param {string} imageSrc - Source de l'image (base64 ou URL)
     * @param {number} maxWidth - Largeur maximale
     * @param {number} maxHeight - Hauteur maximale
     * @param {number} quality - Qualité de compression (0-1)
     * @returns {Promise<string>} Promise qui résout avec l'image redimensionnée en base64
     */
    static async resizeImage(imageSrc, maxWidth = 1200, maxHeight = 800, quality = 0.8) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculer les nouvelles dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                try {
                    const resizedImage = canvas.toDataURL('image/jpeg', quality);
                    resolve(resizedImage);
                } catch (error) {
                    reject(new Error('Erreur lors du redimensionnement de l\'image'));
                }
            };

            img.onerror = () => {
                reject(new Error('Erreur lors du chargement de l\'image'));
            };

            img.src = imageSrc;
        });
    }

    /**
     * Obtient les dimensions d'une image
     * @param {string} imageSrc - Source de l'image
     * @returns {Promise<Object>} Promise qui résout avec {width, height}
     */
    static async getImageDimensions(imageSrc) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height
                });
            };
            
            img.onerror = () => {
                reject(new Error('Impossible de charger l\'image'));
            };
            
            img.src = imageSrc;
        });
    }
}

