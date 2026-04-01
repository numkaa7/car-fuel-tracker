// ==================== ВАЛІДАЦІЯ ДАНИХ ====================

/**
 * Валідація марки авто
 * @param {string} brand - Марка авто
 * @returns {object} { isValid: boolean, message: string }
 */
export function validateBrand(brand) {
    const trimmed = brand.trim();
    
    if (!trimmed) {
        return { isValid: false, message: 'Будь ласка, введіть марку авто' };
    }
    
    if (trimmed.length < 2) {
        return { isValid: false, message: 'Марка авто має бути не менше 2 символів' };
    }
    
    if (trimmed.length > 50) {
        return { isValid: false, message: 'Марка авто не може бути довше 50 символів' };
    }
    
    return { isValid: true, message: '' };
}

/**
 * Валідація моделі авто
 * @param {string} model - Модель авто
 * @returns {object} { isValid: boolean, message: string }
 */
export function validateModel(model) {
    const trimmed = model.trim();
    
    if (!trimmed) {
        return { isValid: true, message: '' }; // Модель необов'язкова
    }
    
    if (trimmed.length > 50) {
        return { isValid: false, message: 'Модель авто не може бути довше 50 символів' };
    }
    
    return { isValid: true, message: '' };
}

/**
 * Валідація року выпуску авто
 * @param {number} year - Рік выпуску
 * @returns {object} { isValid: boolean, message: string }
 */
export function validateYear(year) {
    const yearNum = parseInt(year);
    const currentYear = new Date().getFullYear();
    
    if (isNaN(yearNum)) {
        return { isValid: false, message: 'Рік має бути числом' };
    }
    
    if (yearNum < 1900) {
        return { isValid: false, message: 'Рік не може бути раніше 1900' };
    }
    
    if (yearNum > currentYear + 1) {
        return { isValid: false, message: `Рік не може бути пізніше ${currentYear + 1}` };
    }
    
    return { isValid: true, message: '' };
}

/**
 * Валідація об'єму двигуна
 * @param {string|number} engine - Об'єм двигуна
 * @returns {object} { isValid: boolean, message: string }
 */
export function validateEngine(engine) {
    const engineNum = parseFloat(engine);
    
    if (isNaN(engineNum)) {
        return { isValid: false, message: 'Об\'єм двигуна має бути числом' };
    }
    
    if (engineNum <= 0) {
        return { isValid: false, message: 'Об\'єм двигуна має бути більше 0' };
    }
    
    if (engineNum > 20) {
        return { isValid: false, message: 'Об\'єм двигуна не може перевищувати 20 л' };
    }
    
    return { isValid: true, message: '' };
}

/**
 * Валідація інтервалу обслуговування
 * @param {number} interval - Інтервал в км
 * @param {string} serviceType - Тип обслуговування ('oil' або 'filters')
 * @returns {object} { isValid: boolean, message: string }
 */
export function validateServiceInterval(interval, serviceType) {
    const intervalNum = parseInt(interval);
    const serviceName = serviceType === 'oil' ? 'масла' : 'фільтрів';
    
    if (isNaN(intervalNum)) {
        return { isValid: false, message: `Інтервал ${serviceName} має бути числом` };
    }
    
    if (intervalNum < 1000) {
        return { isValid: false, message: `Інтервал ${serviceName} має бути не менше 1000 км` };
    }
    
    if (intervalNum > 100000) {
        return { isValid: false, message: `Інтервал ${serviceName} не може перевищувати 100000 км` };
    }
    
    return { isValid: true, message: '' };
}

/**
 * Валідація даних про паливо - пробіг
 * @param {number} distance - Пробіг в км
 * @param {number} lastDistance - Попередній пробіг в км (опціонально)
 * @returns {object} { isValid: boolean, message: string }
 */
export function validateDistance(distance, lastDistance = null) {
    const distanceNum = parseFloat(distance);
    
    if (isNaN(distanceNum) || distanceNum <= 0) {
        return { isValid: false, message: 'Пробіг має бути числом більше 0' };
    }
    
    if (distanceNum > 5000000) {
        return { isValid: false, message: 'Пробіг занадто великий (більше 5 млн км)' };
    }
    
    if (lastDistance !== null && distanceNum <= lastDistance) {
        return { isValid: false, message: `Пробіг не може бути меншим або таким самим, як попередній (${lastDistance} км)` };
    }
    
    return { isValid: true, message: '' };
}

/**
 * Валідація ціни паливу
 * @param {number} price - Ціна за літр
 * @returns {object} { isValid: boolean, message: string }
 */
export function validateFuelPrice(price) {
    const priceNum = parseFloat(price);
    
    if (isNaN(priceNum) || priceNum <= 0) {
        return { isValid: false, message: 'Ціна паливу має бути числом більше 0' };
    }
    
    if (priceNum > 1000) {
        return { isValid: false, message: 'Ціна паливу не може перевищувати 1000 ₴/л' };
    }
    
    return { isValid: true, message: '' };
}

/**
 * Валідація обсягу паливо
 * @param {number} liters - Кількість літрів
 * @returns {object} { isValid: boolean, message: string }
 */
export function validateFuelLiters(liters) {
    const litersNum = parseFloat(liters);
    
    if (isNaN(litersNum) || litersNum <= 0) {
        return { isValid: false, message: 'Обсяг паливо має бути числом більше 0' };
    }
    
    if (litersNum > 500) {
        return { isValid: false, message: 'Обсяг паливо не може перевищувати 500 л' };
    }
    
    return { isValid: true, message: '' };
}

/**
 * Валідація останнього пробігу при заміні
 * @param {number} lastReplaced - Пробіг при замені
 * @returns {object} { isValid: boolean, message: string }
 */
export function validateLastReplaced(lastReplaced) {
    const lastReplacedNum = parseInt(lastReplaced);
    
    if (isNaN(lastReplacedNum)) {
        return { isValid: false, message: 'Пробіг при замені має бути числом' };
    }
    
    if (lastReplacedNum < 0) {
        return { isValid: false, message: 'Пробіг при замені не може бути від\'ємним' };
    }
    
    if (lastReplacedNum > 5000000) {
        return { isValid: false, message: 'Пробіг при замені занадто великий' };
    }
    
    return { isValid: true, message: '' };
}

/**
 * Валідація всіх даних авто при додаванні
 * @param {object} carData - Дані авто
 * @returns {object} { isValid: boolean, errors: array }
 */
export function validateCarData(carData) {
    const errors = [];
    
    const brandValidation = validateBrand(carData.brand);
    if (!brandValidation.isValid) errors.push(brandValidation.message);
    
    const modelValidation = validateModel(carData.model);
    if (!modelValidation.isValid) errors.push(modelValidation.message);
    
    const yearValidation = validateYear(carData.year);
    if (!yearValidation.isValid) errors.push(yearValidation.message);
    
    if (carData.engine) {
        const engineValidation = validateEngine(carData.engine);
        if (!engineValidation.isValid) errors.push(engineValidation.message);
    }
    
    if (carData.oilInterval) {
        const oilValidation = validateServiceInterval(carData.oilInterval, 'oil');
        if (!oilValidation.isValid) errors.push(oilValidation.message);
    }
    
    if (carData.filtersInterval) {
        const filtersValidation = validateServiceInterval(carData.filtersInterval, 'filters');
        if (!filtersValidation.isValid) errors.push(filtersValidation.message);
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Валідація всіх даних про паливо при додаванні запису
 * @param {object} fuelData - Дані про паливо
 * @param {number} lastDistance - Попередній пробіг (опціонально)
 * @returns {object} { isValid: boolean, errors: array }
 */
export function validateFuelData(fuelData, lastDistance = null) {
    const errors = [];
    
    const distanceValidation = validateDistance(fuelData.distance, lastDistance);
    if (!distanceValidation.isValid) errors.push(distanceValidation.message);
    
    const priceValidation = validateFuelPrice(fuelData.price);
    if (!priceValidation.isValid) errors.push(priceValidation.message);
    
    const litersValidation = validateFuelLiters(fuelData.liters);
    if (!litersValidation.isValid) errors.push(litersValidation.message);
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}
