// Функція міграції старих даних
function migrateOldData() {
    const oldRecords = JSON.parse(localStorage.getItem('fuelRecords')) || [];
    const carProfile = JSON.parse(localStorage.getItem('carProfile')) || null;
    
    // Якщо є нові дані - не мігрувати
    if (localStorage.getItem('cars')) return;
    
    let needsReload = false;
    
    // Якщо немає старих даних - створити дефолтне авто
    if (oldRecords.length === 0 && !carProfile) {
        const defaultCar = {
            id: 1,
            brand: 'Моє авто',
            model: '',
            year: new Date().getFullYear(),
            engine: '',
            fuelType: 'Бензин',
            createdAt: new Date().toISOString(),
            maintenance: {
                oil: { lastReplaced: 0, interval: 10000, cost: 500 },
                filters: { lastReplaced: 0, interval: 15000, cost: 300 }
            }
        };
        localStorage.setItem('cars', JSON.stringify([defaultCar]));
        localStorage.setItem('fuelRecords', JSON.stringify([]));
        localStorage.setItem('activeCar', '1');
        localStorage.setItem('trash', JSON.stringify([]));
        localStorage.setItem('appStartDate', new Date().toISOString());
        needsReload = true;
        console.log('Created default car');
    } else {
        // Міграція старих даних
        const newCar = {
            id: 1,
            brand: carProfile?.brand || 'Моє авто',
            model: carProfile?.model || '',
            year: carProfile?.year || new Date().getFullYear(),
            engine: carProfile?.engine || '',
            fuelType: carProfile?.fuelType || 'Бензин',
            createdAt: new Date().toISOString(),
            maintenance: {
                oil: { lastReplaced: 0, interval: 10000, cost: 500 },
                filters: { lastReplaced: 0, interval: 15000, cost: 300 }
            }
        };
        
        const migratedRecords = oldRecords.map(record => ({
            ...record,
            carId: 1
        }));
        
        localStorage.setItem('cars', JSON.stringify([newCar]));
        localStorage.setItem('fuelRecords', JSON.stringify(migratedRecords));
        localStorage.setItem('activeCar', '1');
        localStorage.setItem('trash', JSON.stringify([]));
        localStorage.setItem('appStartDate', new Date().toISOString());
        localStorage.removeItem('carProfile');
        needsReload = true;
        console.log('Migrated old data');
    }
    
    if (needsReload && !window.__migrationDone) {
        window.__migrationDone = true;
        location.reload();
    }
}

// Запустити міграцію при завантаженні
migrateOldData();

// ==================== ДАНІ (ГЛОБАЛЬНІ) ====================

export let cars = JSON.parse(localStorage.getItem('cars')) || [];
export let records = JSON.parse(localStorage.getItem('fuelRecords')) || [];
export let trash = JSON.parse(localStorage.getItem('trash')) || [];
export let activeCar = parseInt(localStorage.getItem('activeCar')) || (cars.length > 0 ? cars[0].id : null);

// ==================== ВАЛІДАЦІЯ СТРУКТУРИ ====================

// Функція для додавання відсутніх властивостей до авто
function ensureCarMaintenance(car) {
    if (!car.maintenance) {
        car.maintenance = {
            oil: { lastReplaced: 0, interval: 10000, cost: 500 },
            filters: { lastReplaced: 0, interval: 15000, cost: 300 }
        };
    }
    if (!car.maintenance.oil) {
        car.maintenance.oil = { lastReplaced: 0, interval: 10000, cost: 500 };
    }
    if (!car.maintenance.filters) {
        car.maintenance.filters = { lastReplaced: 0, interval: 15000, cost: 300 };
    }
    return car;
}

// Валідувати всі авто при завантаженні
cars = cars.map(car => ensureCarMaintenance(car));
saveAll();

// ==================== ЗБЕРЕГТИ ВСІ ДАНІ ====================

export function saveAll() {
    localStorage.setItem('cars', JSON.stringify(cars));
    localStorage.setItem('fuelRecords', JSON.stringify(records));
    localStorage.setItem('trash', JSON.stringify(trash));
    localStorage.setItem('activeCar', activeCar.toString());
}

// ==================== АВТО - ОПЕРАЦІЇ ====================

export function getActiveCar() {
    const car = cars.find(car => car.id === activeCar);
    if (car) {
        ensureCarMaintenance(car);
    }
    return car;
}

export function setActiveCar(carId) {
    if (cars.find(car => car.id === carId)) {
        activeCar = carId;
        saveAll();
        return true;
    }
    return false;
}

export function addCar(brand, model, year, engine, fuelType, oilInterval = 10000, filtersInterval = 15000) {
    const newId = cars.length > 0 ? Math.max(...cars.map(c => c.id)) + 1 : 1;
    const newCar = {
        id: newId,
        brand,
        model,
        year,
        engine,
        fuelType,
        createdAt: new Date().toISOString(),
        maintenance: {
            oil: {
                lastReplaced: 0,
                interval: parseInt(oilInterval) || 10000,
                cost: 500
            },
            filters: {
                lastReplaced: 0,
                interval: parseInt(filtersInterval) || 15000,
                cost: 300
            }
        }
    };
    cars.push(newCar);
    saveAll();
    return newCar;
}

export function updateCar(carId, brand, model, year, engine, fuelType, oilInterval, filtersInterval) {
    const car = cars.find(c => c.id === carId);
    if (car) {
        car.brand = brand;
        car.model = model;
        car.year = year;
        car.engine = engine;
        car.fuelType = fuelType;
        if (oilInterval) car.maintenance.oil.interval = parseInt(oilInterval);
        if (filtersInterval) car.maintenance.filters.interval = parseInt(filtersInterval);
        saveAll();
        return true;
    }
    return false;
}

export function deleteCar(carId) {
    const carIndex = cars.findIndex(c => c.id === carId);
    if (carIndex === -1) return false;
    
    const deletedCar = cars.splice(carIndex, 1)[0];
    const carRecords = records.filter(r => r.carId === carId);
    
    const trashItem = {
        ...deletedCar,
        deletedAt: new Date().toISOString(),
        records: carRecords
    };
    trash.push(trashItem);
    
    // Видаляємо записи цього авто
    records = records.filter(r => r.carId !== carId);
    
    // Якщо видалене активне авто - переключитися на перше
    if (activeCar === carId) {
        activeCar = cars.length > 0 ? cars[0].id : null;
    }
    
    saveAll();
    return true;
}

export function restoreCarFromTrash(carId) {
    const trashIndex = trash.findIndex(t => t.id === carId);
    if (trashIndex === -1) return false;
    
    const restoredItem = trash.splice(trashIndex, 1)[0];
    
    // Повертаємо авто
    const restoredCar = {
        id: restoredItem.id,
        brand: restoredItem.brand,
        model: restoredItem.model,
        year: restoredItem.year,
        engine: restoredItem.engine,
        fuelType: restoredItem.fuelType,
        createdAt: restoredItem.createdAt
    };
    cars.push(restoredCar);
    
    // Повертаємо записи
    records.push(...restoredItem.records);
    
    saveAll();
    return true;
}

export function getCarRecords(carId) {
    return records.filter(r => r.carId === carId);
}

export function getActiveCarRecords() {
    return getCarRecords(activeCar);
}
