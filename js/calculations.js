export const totalFuel = (records) => {
    return records.reduce((total, record) => total + (record.liters * record.price), 0);
};

export const avgConsumption = (records) => {
    if (records.length < 2) return 0;
    const totalDistance = records[records.length - 1].distance - records[0].distance;
    const totalLiters = records.reduce((sum, record) => sum + record.liters, 0);
    return totalDistance > 0 ? (totalLiters / totalDistance * 100).toFixed(1) : 0;
};

export const getConsumptionColor = (consumption, avgConsumption) => {
    if (consumption === '-' || avgConsumption === 0) return '#ffffff'; // Білий
    
    const consumptionNum = parseFloat(consumption);
    const avgNum = parseFloat(avgConsumption);
    
    if (consumptionNum > avgNum * 1.1) {
        return '#ef4444';
    } else if (consumptionNum > avgNum) {
        return '#fbbf24';
    } else if (consumptionNum < avgNum * 0.9) {
        return '#a3e635';
    } else {
        return '#ffffff';
    }
};

// ==================== НОВІ ФУНКЦІЇ ДЛЯ МУЛЬТИАВТО ====================

// Розраховувати TCO (Total Cost of Ownership)
export const calculateTCO = (records, appStartDate) => {
    if (records.length === 0) return { total: 0, days: 0, daily: 0 };
    
    const totalExpense = totalFuel(records);
    const startDate = new Date(appStartDate);
    const today = new Date();
    const days = Math.max(1, Math.floor((today - startDate) / (1000 * 60 * 60 * 24)));
    const dailyCost = (totalExpense / days).toFixed(2);
    
    return {
        total: totalExpense.toFixed(2),
        days: days,
        daily: dailyCost
    };
};

// Отримати теку поточний пробіг
export const getCurrentMileage = (records) => {
    return records.length > 0 ? records[records.length - 1].distance : 0;
};

// ==================== ФУНКЦІЇ СЕРВІСНОЇ КНИЖКИ ====================

// Розраховувати статус сервісу
export const getMaintenanceStatus = (currentMileage, lastReplaced, interval) => {
    if (lastReplaced === 0) {
        // Ніколи не було замінено
        return {
            kmSinceReplacement: currentMileage,
            kmUntilNext: interval - currentMileage,
            percentage: (currentMileage / interval) * 100,
            status: 'initial' // Новий
        };
    }
    
    const kmSinceReplacement = currentMileage - lastReplaced;
    const kmUntilNext = interval - kmSinceReplacement;
    const percentage = (kmSinceReplacement / interval) * 100;
    
    let status = 'ok'; // Зелене
    if (kmUntilNext < 0) {
        status = 'overdue'; // Червоне - пора міняти
    } else if (kmUntilNext < 500) {
        status = 'warning'; // Жовте - скоро потрібна заміна
    }
    
    return {
        kmSinceReplacement,
        kmUntilNext,
        percentage: Math.min(percentage, 100),
        status
    };
};

// Отримати колір для статусу
export const getMaintenanceColor = (status) => {
    switch(status) {
        case 'ok': return '#a3e635'; // Зелене
        case 'warning': return '#fbbf24'; // Жовте
        case 'overdue': return '#ef4444'; // Червоне
        case 'initial': return '#64748b'; // Сіре
        default: return '#ffffff';  
    }
};