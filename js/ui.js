import { records, cars, activeCar, saveAll, setActiveCar, addCar, updateCar, deleteCar, restoreCarFromTrash, getActiveCar, getActiveCarRecords, trash } from './storage.js';
import { totalFuel, avgConsumption, getConsumptionColor, calculateTCO, getCurrentMileage, getMaintenanceStatus, getMaintenanceColor } from './calculations.js';
import { validateBrand, validateModel, validateYear, validateEngine, validateServiceInterval, validateCarData, validateLastReplaced } from './validation.js';

console.log('UI loaded. Cars:', cars, 'ActiveCar:', activeCar);

// ==================== БЛОКУВАННЯ СКРОЛУ МОДАЛОК ====================

function disableBodyScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
}

function enableBodyScroll() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
}

// ==================== МОБІЛЬНЕ МЕНЮ ====================

const menuToggle = document.getElementById('menu-toggle');
const navMobile = document.getElementById('nav-mobile');

if (menuToggle && navMobile) {
    menuToggle.addEventListener('click', () => {
        navMobile.classList.toggle('active');
    });
}

// Закривання меню при натисканні на посилання
document.querySelectorAll('.nav-mobile .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMobile.classList.remove('active');
    });
});

// Знаходимо елементи в HTML
const monthlySpentElement = document.getElementById('monthly-spent');
const currentMileageElement = document.getElementById('current-mileage');
const avgConsumptionElement = document.getElementById('avg-consumption');
const carSelector = document.getElementById('car-selector');
const addCarBtn = document.getElementById('add-car-btn');
const autoContent = document.getElementById('auto-content');

// Chart.js
let consumptionChart = null;
let currentChartRange = 'week'; // По замовчуванню

// ==================== ІНІЦІАЛІЗАЦІЯ СЕЛЕКТОРА АВТО ====================

function initializeCarSelector() {
    carSelector.innerHTML = '<option value="">Виберіть авто</option>';
    
    cars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.id;
        option.textContent = `${car.brand} ${car.model} (${car.year})`;
        if (car.id === activeCar) {
            option.selected = true;
        }
        carSelector.appendChild(option);
    });
}

// Обробник переключення авто
carSelector.addEventListener('change', (e) => {
    const carId = parseInt(e.target.value);
    if (carId) {
        setActiveCar(carId);
        updateDisplay();
        
        // 🔄 Оновлюємо поточну сторінку в реальному часі
        const activePage = document.querySelector('.page.active');
        if (activePage) {
            const pageId = activePage.id;
            if (pageId === 'history') {
                updateHistoryTable();
            } else if (pageId === 'auto') {
                initializeAutoPage();
            } else if (pageId === 'settings') {
                initializeSettings();
            }
        }
    }
});

// Обробник додавання авто
addCarBtn.addEventListener('click', () => {
    openAddCarModal();
});

// ==================== МОДАЛЬНЕ ВІКНО ДОДАВАННЯ АВТО ====================

function openAddCarModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Додати авто</h2>
            
            <div class="input-group">
                <label>Марка</label>
                <input type="text" id="modal-brand" placeholder="BMW">
            </div>
            
            <div class="input-group">
                <label>Модель</label>
                <input type="text" id="modal-model" placeholder="X5">
            </div>
            
            <div class="input-group">
                <label>Рік</label>
                <input type="number" id="modal-year" placeholder="2020">
            </div>
            
            <div class="input-group">
                <label>Об'єм двигуна (л)</label>
                <input type="text" id="modal-engine" placeholder="3.0">
            </div>
            
            <div class="input-group">
                <label>Тип пального</label>
                <select id="modal-fuel">
                    <option value="Бензин">Бензин</option>
                    <option value="Дизель">Дизель</option>
                    <option value="Газ">Газ</option>
                </select>
            </div>

            <hr style="margin: 20px 0; border: none; border-top: 1px solid var(--border-color);">
            <h3 style="font-size: 16px; margin-bottom: 15px;">⚙️ Дані обслуговування</h3>

            <div class="input-group">
                <label>Інтервал заміни масла (км)</label>
                <input type="number" id="modal-oil-interval" placeholder="10000" value="10000">
            </div>

            <div class="input-group">
                <label>Інтервал заміни фільтрів (км)</label>
                <input type="number" id="modal-filters-interval" placeholder="15000" value="15000">
            </div>
            
            <div class="modal-buttons">
                <button id="modal-save" class="modal-save-btn">Зберегти</button>
                <button id="modal-cancel" class="modal-cancel-btn">Скасувати</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    disableBodyScroll();
    
    // Закриття при кліку на фон (overlay)
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            enableBodyScroll();
            modal.remove();
        }
    });
    
    document.getElementById('modal-save').addEventListener('click', () => {
        const carData = {
            brand: document.getElementById('modal-brand').value,
            model: document.getElementById('modal-model').value,
            year: document.getElementById('modal-year').value,
            engine: document.getElementById('modal-engine').value,
            oilInterval: document.getElementById('modal-oil-interval').value,
            filtersInterval: document.getElementById('modal-filters-interval').value
        };
        
        const validation = validateCarData(carData);
        
        if (!validation.isValid) {
            alert(validation.errors.join('\n'));
            return;
        }
        
        const fuelType = document.getElementById('modal-fuel').value;
        const year = parseInt(carData.year);
        const oilInterval = parseInt(carData.oilInterval) || 10000;
        const filtersInterval = parseInt(carData.filtersInterval) || 15000;
        
        addCar(carData.brand.trim(), carData.model.trim(), year, carData.engine.trim(), fuelType, oilInterval, filtersInterval);
        initializeCarSelector();
        setActiveCar(cars[cars.length - 1].id);
        updateDisplay();
        enableBodyScroll();
        modal.remove();
    });
    
    document.getElementById('modal-cancel').addEventListener('click', () => {
        enableBodyScroll();
        modal.remove();
    });
}

// ==================== НАВІГАЦІЯ ====================

const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageName = link.dataset.page;
        showPage(pageName);
    });
});

const logo = document.querySelector('.logo-link');
logo.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('dashboard');
});

export function showPage(pageName) {
    pages.forEach(page => page.classList.remove('active'));
    
    const activePage = document.getElementById(pageName);
    if (activePage) {
        activePage.classList.add('active');
    }
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });
    
    if (pageName === 'history') {
        updateHistoryTable();
    } else if (pageName === 'auto') {
        initializeAutoPage();
    } else if (pageName === 'settings') {
        initializeSettings();
    }
}

// ==================== НАЛАШТУВАННЯ ====================

function initializeSettings() {
    const trashContainer = document.getElementById('trash-container');
    
    if (trash.length === 0) {
        trashContainer.innerHTML = `
            <div class="empty-state">
                <p>🎉 Немає видалених авто</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    trash.forEach(item => {
        html += `
            <div class="trash-item">
                <div class="trash-item-info">
                    <p>${item.brand} ${item.model} (${item.year})</p>
                    <p>Видалено: ${new Date(item.deletedAt).toLocaleDateString('uk-UA')}</p>
                    <p>Записів: ${item.records.length}</p>
                </div>
                <button onclick="window.restoreCarFromTrash(${item.id})" class="btn-restore">↩️ Відновити</button>
            </div>
        `;
    });
    
    trashContainer.innerHTML = html;
}

// ==================== ВОССТАНОВЛЕННЯ З TRASH ====================

window.restoreCarFromTrash = function(carId) {
    if (confirm('Відновити це авто та всі його записи?')) {
        restoreCarFromTrash(carId);
        initializeCarSelector();
        setActiveCar(carId);
        updateDisplay();
        initializeSettings();
    }
};

// ==================== СТОРІНКА "МОЄ АВТО" ====================

function initializeAutoPage() {
    const car = getActiveCar();
    
    if (!car) {
        autoContent.innerHTML = `
            <div class="empty-state">
                <p>🚗 Немає вибраного авто</p>
                <p>Додайте авто через кнопку в шапці</p>
            </div>
        `;
        return;
    }
    
    const activeRecords = getActiveCarRecords();
    const currentMileage = getCurrentMileage(activeRecords);
    const tco = calculateTCO(activeRecords, localStorage.getItem('appStartDate') || new Date().toISOString());
    
    // Отримуємо статус сервісу
    const oilStatus = getMaintenanceStatus(currentMileage, car.maintenance.oil.lastReplaced, car.maintenance.oil.interval);
    const filterStatus = getMaintenanceStatus(currentMileage, car.maintenance.filters.lastReplaced, car.maintenance.filters.interval);
    
    const getStatusClass = (status) => {
        const colorMap = {
            'ok': 'green',
            'warning': 'yellow',
            'overdue': 'red',
            'initial': 'gray'
        };
        return colorMap[status] || 'gray';
    };
    
    const renderProgressBar = (status, item) => {
        const barPercentage = Math.min(status.percentage, 100);
        const statusClass = getStatusClass(status.status);
        
        return `
            <div class="progress-container">
                <div class="progress-header">
                    <span class="progress-text">
                        Залишилось: <strong>${Math.max(0, status.kmUntilNext)} км</strong>
                    </span>
                    <span class="progress-text">${Math.round(barPercentage)}%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill ${statusClass}" style="width: ${barPercentage}%;"></div>
                </div>
                <p class="progress-text-small">
                    Наступна заміна: ~${(car.maintenance[item].lastReplaced || currentMileage) + car.maintenance[item].interval} км
                </p>
            </div>
        `;
    };
    
    autoContent.innerHTML = `
        <!-- ПРОФІЛЬ АВТО -->
        <div class="car-profile-card">
            <div class="car-profile-header">
                <div class="car-profile-info">
                    <h3>${car.brand} ${car.model}</h3>
                    <p>📅 Рік: ${car.year}</p>
                    <p>🔧 Об'єм: ${car.engine} л</p>
                    <p>⛽ Паливо: ${car.fuelType}</p>
                </div>
                <div class="car-profile-buttons">
                    <button onclick="window.editCar(${car.id})" class="btn-edit">✏️ Редагувати</button>
                    <button onclick="window.deleteCar(${car.id})" class="btn-delete">🗑️ Видалити</button>
                </div>
            </div>
        </div>
        
        <!-- СТАТИСТИКА -->
        <div class="card-row">
            <div class="card-stat">
                <p class="card-stat-label">Всього записів</p>
                <p class="card-stat-value">${activeRecords.length}</p>
            </div>
            
            <div class="card-stat">
                <p class="card-stat-label">Поточний пробіг</p>
                <p class="card-stat-value">${currentMileage} км</p>
            </div>
            
            <div class="card-stat">
                <p class="card-stat-label">Вартість/день</p>
                <p class="card-stat-value">${tco.daily} ₴</p>
            </div>
        </div>
        
        <!-- СЕРВІСНА КНИЖКА -->
        <div class="service-booklet">
            <h3>🔧 Сервісна книжка</h3>
            
            <!-- МАСЛО -->
            <div class="service-item oil${oilStatus.status !== 'ok' ? (oilStatus.status === 'warning' ? '-warning' : oilStatus.status === 'overdue' ? '-overdue' : '-initial') : ''}">
                <h4>🛢️ Масло</h4>
                ${renderProgressBar(oilStatus, 'oil')}
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="window.updateMaintenance(${car.id}, 'oil', ${currentMileage})" class="btn-maintenance">✅ Замінено</button>
                    <button onclick="window.editMaintenance(${car.id}, 'oil')" class="btn-maintenance">✏️ Редагувати</button>
                </div>
            </div>
            
            <!-- ФІЛЬТРИ -->
            <div class="service-item oil${filterStatus.status !== 'ok' ? (filterStatus.status === 'warning' ? '-warning' : filterStatus.status === 'overdue' ? '-overdue' : '-initial') : ''}">
                <h4>🔍 Фільтри</h4>
                ${renderProgressBar(filterStatus, 'filters')}
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="window.updateMaintenance(${car.id}, 'filters', ${currentMileage})" class="btn-maintenance">✅ Замінено</button>
                    <button onclick="window.editMaintenance(${car.id}, 'filters')" class="btn-maintenance">✏️ Редагувати</button>
                </div>
            </div>
        </div>
        
        <!-- ВАРТІСТЬ ВОЛОДІННЯ -->
        <div class="cost-ownership">
            <h3>💰 Вартість володіння</h3>
            <div class="cost-grid">
                <div class="cost-item">
                    <p>Всього витрачено</p>
                    <p>${tco.total} ₴</p>
                </div>
                <div class="cost-item">
                    <p>Період використання</p>
                    <p>${tco.days} днів</p>
                </div>
            </div>
        </div>
    `;
}

// ==================== ФУНКЦІЇ ВИДАЛЕННЯ/РЕДАГУВАННЯ ====================

function openEditCarModal(carId) {
    const car = cars.find(c => c.id === carId);
    if (!car) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Редагувати авто</h2>
            
            <div class="input-group">
                <label>Марка</label>
                <input type="text" id="modal-brand" value="${car.brand}">
            </div>
            
            <div class="input-group">
                <label>Модель</label>
                <input type="text" id="modal-model" value="${car.model}">
            </div>
            
            <div class="input-group">
                <label>Рік</label>
                <input type="number" id="modal-year" value="${car.year}">
            </div>
            
            <div class="input-group">
                <label>Об'єм двигуна (л)</label>
                <input type="number" id="modal-engine" value="${car.engine}" step="0.1">
            </div>
            
            <div class="input-group">
                <label>Тип пального</label>
                <select id="modal-fuel">
                    <option value="Бензин" ${car.fuelType === 'Бензин' ? 'selected' : ''}>Бензин</option>
                    <option value="Дизель" ${car.fuelType === 'Дизель' ? 'selected' : ''}>Дизель</option>
                    <option value="Газ" ${car.fuelType === 'Газ' ? 'selected' : ''}>Газ</option>
                </select>
            </div>

            <hr style="margin: 20px 0; border: none; border-top: 1px solid var(--border-color);">
            <h3 style="font-size: 16px; margin-bottom: 15px;">⚙️ Дані обслуговування</h3>

            <div class="input-group">
                <label>Інтервал заміни масла (км)</label>
                <input type="number" id="modal-oil-interval" value="${car.maintenance.oil.interval}">
            </div>

            <div class="input-group">
                <label>Інтервал заміни фільтрів (км)</label>
                <input type="number" id="modal-filters-interval" value="${car.maintenance.filters.interval}">
            </div>
            
            <div class="modal-buttons">
                <button id="modal-save" class="modal-save-btn">Зберегти</button>
                <button id="modal-cancel" class="modal-cancel-btn">Скасувати</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    disableBodyScroll();
    
    // Закриття при кліку на фон (overlay)
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            enableBodyScroll();
            modal.remove();
        }
    });
    
    document.getElementById('modal-save').addEventListener('click', () => {
        const carData = {
            brand: document.getElementById('modal-brand').value,
            model: document.getElementById('modal-model').value,
            year: document.getElementById('modal-year').value,
            engine: document.getElementById('modal-engine').value,
            oilInterval: document.getElementById('modal-oil-interval').value,
            filtersInterval: document.getElementById('modal-filters-interval').value
        };
        
        const validation = validateCarData(carData);
        
        if (!validation.isValid) {
            alert(validation.errors.join('\n'));
            return;
        }
        
        const fuelType = document.getElementById('modal-fuel').value;
        const year = parseInt(carData.year);
        const oilInterval = parseInt(carData.oilInterval) || car.maintenance.oil.interval;
        const filtersInterval = parseInt(carData.filtersInterval) || car.maintenance.filters.interval;
        
        updateCar(carId, carData.brand.trim(), carData.model.trim(), year, carData.engine.trim(), fuelType, oilInterval, filtersInterval);
        initializeCarSelector();
        initializeAutoPage();
        enableBodyScroll();
        modal.remove();
    });
    
    document.getElementById('modal-cancel').addEventListener('click', () => {
        enableBodyScroll();
        modal.remove();
    });
}

window.editCar = function(carId) {
    openEditCarModal(carId);
};

window.deleteCar = function(carId) {
    const car = cars.find(c => c.id === carId);
    if (!car) return;
    
    if (confirm(`Видалити авто "${car.brand} ${car.model}"? Дані можна буде відновити в Trash.`)) {
        deleteCar(carId);
        initializeCarSelector();
        updateDisplay();
        showPage('dashboard');
    }
};

// ==================== ТАБЛИЦЯ ІСТОРІЇ ====================

function updateHistoryTable() {
    const historyList = document.getElementById('history-list');
    const activeRecords = getActiveCarRecords();
    
    if (activeRecords.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <p>📊 Немає записів</p>
                <p>Додайте свій перший запис на Dashboard!</p>
            </div>
        `;
        return;
    }
    
    const monthGroups = {};
    activeRecords.forEach((record, index) => {
        if (!record.date) {
            if (!monthGroups['unknown']) {
                monthGroups['unknown'] = [];
            }
            monthGroups['unknown'].push({ record, index });
            return;
        }
        
        let recordDate = new Date(record.date);
        const year = recordDate.getFullYear();
        const month = String(recordDate.getMonth() + 1).padStart(2, '0');
        const monthKey = `${year}-${month}`;
        
        if (!monthGroups[monthKey]) {
            monthGroups[monthKey] = [];
        }
        monthGroups[monthKey].push({ record, index });
    });
    
    const sortedMonths = Object.keys(monthGroups).sort().reverse();
    
    let html = `<div style="margin-top: 20px;">`;
    
    sortedMonths.forEach(monthKey => {
        let monthName;
        if (monthKey === 'unknown') {
            monthName = 'Записи без дати';
        } else {
            const [year, month] = monthKey.split('-');
            monthName = new Date(year, month - 1).toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' });
        }
        
        html += `
            <div style="margin-bottom: 40px;">
                <div style="border-bottom: 2px solid var(--accent-green); margin-bottom: 20px;">    
                    <h3 style="color: var(--accent-green); font-size: 20px; display: inline-block; text-transform: capitalize;">
                        ${monthName}
                    </h3>
                    <h4 style="color: var(--text-secondary); font-size: 16px; display: inline-block;">
                        ${monthGroups[monthKey].length} записів | Всього витрачено: ${totalFuel(monthGroups[monthKey].map(item => item.record)).toFixed(2)} ₴ | Заправлено: ${monthGroups[monthKey].reduce((sum, item) => sum + item.record.liters, 0).toFixed(2)} л
                    </h4>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">
        `;
        
        monthGroups[monthKey].forEach(({ record, index }) => {
            const sum = (record.liters * record.price).toFixed(2);
            const consumption = index > 0 
                ? ((record.liters / (record.distance - activeRecords[index - 1].distance) * 100).toFixed(1))
                : '-';
            
            const avgConsumptionValue = avgConsumption(activeRecords);
            const consumptionColor = getConsumptionColor(consumption, avgConsumptionValue);
            
            html += `
                <div class="history-card">
                    <div class="card-actions">
                        <button onclick="window.deleteRecord(${index})" class="delete-record-btn">Видалити</button>
                    </div>
                    
                    <div class="card-header">
                        <span class="card-date-badge">
                            ${record.date ? new Date(record.date).toLocaleDateString('uk-UA') : '—'}
                        </span>
                        <span class="card-liters">🔋 ${record.liters} л</span>
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <div style="color: var(--text-muted); font-size: 12px; margin-bottom: 4px;">Пробіг</div>
                        <div style="font-size: 20px; font-weight: bold; color: var(--accent-green);">
                            ${record.distance} км
                        </div>
                    </div>
                    
                    <div class="card-stat-row">
                        <div class="card-stat-item">
                            <div class="card-stat-label">Ціна/л</div>
                            <div class="card-stat-value" style="color: #fff;">
                                ${record.price} ₴
                            </div>
                        </div>
                        <div class="card-stat-item">
                            <div class="card-stat-label">Витрати</div>
                            <div class="card-stat-value" style="color: var(--accent-green);">
                                ${sum} ₴
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-divider">
                        <div class="card-stat-label">Витрата л/100км</div>
                        <div class="consumption-value" style="color: ${consumptionColor};">
                            ${consumption === '-' ? '─' : consumption}
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    historyList.innerHTML = html;
}

// ==================== ГРАФІК ВИТРАТ ====================

// Обробник кліків на кнопки фільтрації графіка
document.querySelectorAll('.chart-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.chart-filter-btn').forEach(b => {
            b.style.background = '#64748b';
            b.style.color = '#fff';
        });
        
        e.target.style.background = 'var(--accent-green)';
        e.target.style.color = '#000';
        
        currentChartRange = e.target.dataset.range;
        updateConsumptionChart();
    });
});

// Обробник для кнопки "Видалити всі дані"
const clearDataBtn = document.getElementById('clear-data-btn');
if (clearDataBtn) {
    clearDataBtn.addEventListener('click', () => {
        if (confirm('⚠️ Це видалить ВСІ дані! Ви впевнені?')) {
            if (confirm('Остання перевірка - це дійсно ВСІ дані, включно з авто!')) {
                localStorage.clear();
                location.reload();
            }
        }
    });
}

function updateConsumptionChart() {
    const ctx = document.getElementById('consumption-chart');
    if (!ctx) return;
    
    const activeRecords = getActiveCarRecords();
    
    if (activeRecords.length === 0) {
        if (consumptionChart) {
            consumptionChart.destroy();
            consumptionChart = null;
        }
        return;
    }
    
    let filteredRecords = activeRecords;
    
    if (currentChartRange === 'week') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        filteredRecords = activeRecords.filter(record => {
            if (!record.date) return false;
            return new Date(record.date) >= sevenDaysAgo;
        });
    } else if (currentChartRange === 'month') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filteredRecords = activeRecords.filter(record => {
            if (!record.date) return false;
            return new Date(record.date) >= thirtyDaysAgo;
        });
    } else if (currentChartRange === 'year') {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        filteredRecords = activeRecords.filter(record => {
            if (!record.date) return false;
            return new Date(record.date) >= oneYearAgo;
        });
    }
    
    const labels = filteredRecords.map(record => record.date ? new Date(record.date).toLocaleDateString('uk-UA') : 'Дата невідома');
    const prices = filteredRecords.map(record => record.price);
    const liters = filteredRecords.map(record => record.liters);
    const expenses = filteredRecords.map(record => (record.liters * record.price).toFixed(2));
    
    if (consumptionChart) {
        consumptionChart.destroy();
    }
    
    consumptionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Витрати (грн)',
                    data: expenses,
                    borderColor: '#a3e635',
                    backgroundColor: 'rgba(163, 230, 53, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#a3e635',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'Ціна/л (грн)',
                    data: prices,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff',
                        font: { size: 12 },
                        usePointStyle: true,
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#94A3B8',
                        font: { size: 11 }
                    },
                    grid: {
                        color: 'rgba(45, 58, 79, 0.3)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: '#94A3B8',
                        font: { size: 11 }
                    },
                    grid: {
                        color: 'rgba(45, 58, 79, 0.2)',
                        drawBorder: false
                    }
                }
            }
        }
    });
}

// ==================== ВИДАЛЕННЯ ЗАПИСУ ====================

window.editMaintenance = function(carId, serviceType) {
    const car = cars.find(c => c.id === carId);
    if (!car) return;
    
    const serviceName = serviceType === 'oil' ? 'Масло' : 'Фільтри';
    const currentInterval = car.maintenance[serviceType].interval;
    const lastReplaced = car.maintenance[serviceType].lastReplaced;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Редагувати обслуговування: ${serviceName}</h2>
            
            <div class="input-group">
                <label>Інтервал (км)</label>
                <input type="number" id="edit-interval" value="${currentInterval}" placeholder="10000">
                <small style="color: var(--text-muted); margin-top: 5px; display: block;">
                    Через скільки км потрібна наступна заміна
                </small>
            </div>
            
            <div class="input-group">
                <label>Останній пробіг при заміні (км)</label>
                <input type="number" id="edit-last-replaced" value="${lastReplaced}" placeholder="0">
                <small style="color: var(--text-muted); margin-top: 5px; display: block;">
                    На якому км була остання заміна (0 = ніколи не міняли)
                </small>
            </div>
            
            <div class="modal-buttons">
                <button id="edit-save" class="modal-save-btn">Зберегти</button>
                <button id="edit-cancel" class="modal-cancel-btn">Скасувати</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    disableBodyScroll();
    
    // Закритття при кліку на фон
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            enableBodyScroll();
            modal.remove();
        }
    });
    
    document.getElementById('edit-save').addEventListener('click', () => {
        const newInterval = parseInt(document.getElementById('edit-interval').value);
        const newLastReplaced = parseInt(document.getElementById('edit-last-replaced').value) || 0;
        
        const intervalValidation = validateServiceInterval(newInterval, serviceType);
        if (!intervalValidation.isValid) {
            alert(intervalValidation.message);
            return;
        }
        
        const lastReplacedValidation = validateLastReplaced(newLastReplaced);
        if (!lastReplacedValidation.isValid) {
            alert(lastReplacedValidation.message);
            return;
        }
        
        car.maintenance[serviceType].interval = newInterval;
        car.maintenance[serviceType].lastReplaced = newLastReplaced;
        saveAll();
        initializeAutoPage();
        enableBodyScroll();
        modal.remove();
        alert(`✅ Параметри ${serviceName.toLowerCase()} оновлено!`);
    });
    
    document.getElementById('edit-cancel').addEventListener('click', () => {
        enableBodyScroll();
        modal.remove();
    });
};

window.updateMaintenance = function(carId, serviceType, currentMileage) {
    const car = cars.find(c => c.id === carId);
    if (!car) return;
    
    car.maintenance[serviceType].lastReplaced = currentMileage;
    saveAll();
    initializeAutoPage();
    alert(`✅ ${serviceType === 'oil' ? 'Масло' : 'Фільтри'} позначено як замінено на ${currentMileage} км`);
};

window.deleteRecord = function(index) {
    const activeRecords = getActiveCarRecords();
    const recordDate = activeRecords[index].date ? new Date(activeRecords[index].date).toLocaleDateString('uk-UA') : 'цей запис';
    
    if (confirm(`Ви впевнені, що хочете видалити запис від ${recordDate}?`)) {
        const globalIndex = records.findIndex(r => 
            r.carId === activeCar && r === activeRecords[index]
        );
        
        if (globalIndex !== -1) {
            records.splice(globalIndex, 1);
            saveAll();
            updateHistoryTable();
            updateDisplay();
        }
    }
};

// ==================== ОНОВЛЕННЯ ДИСПЛЕЯ ====================

export function updateDisplay() {
    const activeRecords = getActiveCarRecords();
    
    if (monthlySpentElement) {
        monthlySpentElement.textContent = totalFuel(activeRecords).toFixed(2);
    }
    if (currentMileageElement) {
        currentMileageElement.textContent = getCurrentMileage(activeRecords);
    }
    if (avgConsumptionElement) {
        avgConsumptionElement.textContent = avgConsumption(activeRecords);
    }
    
   
    updateConsumptionChart();
}

// Ініціалізація при завантаженні сторінки
initializeCarSelector();
updateDisplay();
