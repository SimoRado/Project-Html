/**
 * Service de notifications pour l'application
 * @module utils/notifications
 */

import { AppConfig } from '../config/app.config.js';

/**
 * Service de gestion des notifications
 */
export class NotificationService {
    /**
     * Affiche une notification
     * @param {string} message - Message à afficher
     * @param {string} type - Type de notification (success, error, info, warning)
     * @param {number} duration - Durée d'affichage en ms
     */
    static show(message, type = 'info', duration = null) {
        const notification = this.createNotification(message, type);
        const container = this.getOrCreateContainer();
        
        container.appendChild(notification);
        
        // Animation d'entrée
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Suppression automatique
        const autoRemove = setTimeout(() => {
            this.remove(notification);
        }, duration || AppConfig.ui.notificationDuration);
        
        // Stocker le timeout pour pouvoir l'annuler si nécessaire
        notification.dataset.timeout = autoRemove;
    }

    /**
     * Crée l'élément de notification
     * @private
     */
    static createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        const icon = this.getIcon(type);
        notification.innerHTML = `
            <div class="notification-content">
                ${icon ? `<span class="notification-icon">${icon}</span>` : ''}
                <span class="notification-message">${this.escapeHtml(message)}</span>
                <button class="notification-close" aria-label="Fermer" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        return notification;
    }

    /**
     * Obtient ou crée le conteneur de notifications
     * @private
     */
    static getOrCreateContainer() {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
            this.injectStyles();
        }
        return container;
    }

    /**
     * Injecte les styles CSS pour les notifications
     * @private
     */
    static injectStyles() {
        if (document.getElementById('notification-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
            }
            
            .notification {
                background: white;
                border-radius: 8px;
                padding: 16px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
                border-left: 4px solid #007bff;
            }
            
            .notification.show {
                opacity: 1;
                transform: translateX(0);
            }
            
            .notification-success {
                border-left-color: #28a745;
            }
            
            .notification-error {
                border-left-color: #dc3545;
            }
            
            .notification-warning {
                border-left-color: #ffc107;
            }
            
            .notification-info {
                border-left-color: #17a2b8;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification-icon {
                font-size: 20px;
            }
            
            .notification-message {
                flex: 1;
                color: #333;
                font-size: 14px;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 1;
            }
            
            .notification-close:hover {
                color: #333;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Obtient l'icône selon le type
     * @private
     */
    static getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || '';
    }

    /**
     * Échappe le HTML pour éviter les injections XSS
     * @private
     */
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Supprime une notification
     * @private
     */
    static remove(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }

    /**
     * Affiche une notification de succès
     * @param {string} message - Message à afficher
     */
    static success(message) {
        this.show(message, 'success');
    }

    /**
     * Affiche une notification d'erreur
     * @param {string} message - Message à afficher
     */
    static error(message) {
        this.show(message, 'error', 5000); // Plus long pour les erreurs
    }

    /**
     * Affiche une notification d'avertissement
     * @param {string} message - Message à afficher
     */
    static warning(message) {
        this.show(message, 'warning');
    }

    /**
     * Affiche une notification d'information
     * @param {string} message - Message à afficher
     */
    static info(message) {
        this.show(message, 'info');
    }
}

