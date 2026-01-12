/**
 * Fonction debounce pour limiter la fréquence d'exécution
 * @module utils/debounce
 */

/**
 * Crée une fonction debounced qui retardera son exécution jusqu'à ce que
 * le délai spécifié se soit écoulé depuis le dernier appel
 * @param {Function} func - Fonction à debouncer
 * @param {number} wait - Délai en millisecondes
 * @param {boolean} immediate - Si true, exécute immédiatement au premier appel
 * @returns {Function} Fonction debounced
 */
export function debounce(func, wait, immediate = false) {
    let timeout;
    
    return function executedFunction(...args) {
        const context = this;
        
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        
        const callNow = immediate && !timeout;
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(context, args);
    };
}

/**
 * Crée une fonction throttled qui limite la fréquence d'exécution
 * @param {Function} func - Fonction à throttler
 * @param {number} limit - Délai minimum entre les exécutions en ms
 * @returns {Function} Fonction throttled
 */
export function throttle(func, limit) {
    let inThrottle;
    
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

