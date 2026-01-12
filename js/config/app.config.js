/**
 * Configuration centralisée de l'application
 * @module config/app.config
 */

export const AppConfig = {
    /**
     * Configuration du stockage
     */
    storage: {
        cars: 'cars',
        reviews: 'reviews',
        users: 'users',
        settings: 'app_settings'
    },

    /**
     * Configuration de l'API
     */
    api: {
        baseUrl: process.env?.API_URL || '/api',
        timeout: 5000,
        retryAttempts: 3
    },

    /**
     * Configuration de l'interface utilisateur
     */
    ui: {
        itemsPerPage: 12,
        debounceDelay: 300,
        animationDuration: 300,
        notificationDuration: 3000
    },

    /**
     * Configuration de validation
     */
    validation: {
        maxImageSize: 5 * 1024 * 1024, // 5MB
        allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
        car: {
            minNameLength: 2,
            maxNameLength: 100,
            minPrice: 0,
            maxPrice: 10000000,
            allowedBrands: ['Porsche', 'BMW', 'Ferrari', 'Dacia', 'Renault', 'Peugeot', 'Volkswagen'],
            allowedStatuses: ['Rental', 'Buy', 'Rental/Buy']
        }
    },

    /**
     * Configuration des prix
     */
    price: {
        min: 0,
        max: 999999999,
        currency: 'MAD',
        currencySymbol: 'MAD'
    }
};

