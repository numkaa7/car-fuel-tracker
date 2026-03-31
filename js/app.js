import { records, saveAll, activeCar, getActiveCarRecords } from './storage.js';
import { updateDisplay } from './ui.js';

const form = document.getElementById('fuel-form');
form.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  
  // Перевіряємо чи вибране авто
  if (!activeCar) {
    alert('Будь ласка, спочатку додайте авто!');
    return;
  }
  
  const formData = new FormData(form);
  const data = {
    carId: activeCar,  // 🚗 ДОДАЄМО carId!
    distance: +formData.get('distance'),
    liters: +formData.get('liters'),
    price: +formData.get('price'),
    date: new Date().toISOString()
  };

  if (data.distance <= 0 || data.liters <= 0 || data.price <= 0) {
    alert('Будь ласка, введіть коректні числові значення для всіх полів.');
    return;
  }

  // Отримуємо тільки записи активного авто для перевірки
  const activeCarRecords = getActiveCarRecords();
  
  if (activeCarRecords.length > 0) {
    const lastRecord = activeCarRecords[activeCarRecords.length - 1];
    if (data.distance <= lastRecord.distance) {
      alert(`Помилка! Пробіг не може бути меншим або таким самим, як попередній (${lastRecord.distance} км).`);
      return;
    }
  }

  records.push(data);
  saveAll();  // 🔄 ЗМІНИЛИ saveRecords() на saveAll()
  updateDisplay();
  form.reset();
}

console.log('App initialized');