import { records, saveAll, activeCar, getActiveCarRecords } from './storage.js';
import { updateDisplay } from './ui.js';
import { validateFuelData } from './validation.js';

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
  const fuelData = {
    distance: parseFloat(formData.get('distance')),
    liters: parseFloat(formData.get('liters')),
    price: parseFloat(formData.get('price'))
  };

  const activeCarRecords = getActiveCarRecords();
  const lastDistance = activeCarRecords.length > 0 ? activeCarRecords[activeCarRecords.length - 1].distance : null;

  const validation = validateFuelData(fuelData, lastDistance);
  
  if (!validation.isValid) {
    alert(validation.errors.join('\n'));
    return;
  }

  const data = {
    carId: activeCar,  
    distance: fuelData.distance,
    liters: fuelData.liters,
    price: fuelData.price,
    date: new Date().toISOString()
  };

  records.push(data);
  saveAll();  
  updateDisplay();
  form.reset();
}

console.log('App initialized');