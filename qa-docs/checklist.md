## 1. Dashboard & Core Analytics
- [x] Verify "Average consumption" (л/100км) recalculates correctly after adding a new log.
- [x] Verify "Monthly expenses" (грн) accurately sums up the costs of all records for the current month.
- [x] Verify total mileage updates correctly based on the latest log entry.
- [x] Verify that empty states (0.0 л/100км, 0 грн) are shown if there is no data.

## 2. Vehicle Management
- [x] Verify clicking "+ Додати авто" triggers the input mechanism (prompt or form).
- [x] Verify a new vehicle name appears instantly in the "Виберіть авто" dropdown list.
- [x] Verify that switching between different cars in the dropdown dynamically updates all dashboard statistics.
- [ ] Check system behavior when attempting to add a duplicate car name. **FAILED (See Bug Report #1)**
- [ ] Check system behavior when attempting to add a car with an empty name or special characters (`@#$%`). **FAILED (See Bug Report #2)**

## 3. Fuel Logging Form 
- [x] Verify that entering valid inputs (Current Mileage, Liters, Price per Liter) allows successful log creation.
- [x] Verify clicking "Зберегти запис" clears all input fields for the next entry.
- [x] Verify that the newly added entry immediately appears at the top of the "Історія заправок" list.
- [x] Verify that each history item displays correct details (Date, Mileage, Liters, Total Price).

## 4. Input Validation & Boundary Testing 
- [x] **Empty Fields:** Verify submission is blocked if any field (Mileage/Liters/Price) is empty.
- [x] **Negative Values:** Verify fields reject negative numbers (e.g., `-50`, `-5.5`).
- [ ]  **Text in Numbers:** Verify fields reject alphabetical characters (e.g., `abc`) and spaces. **FAILED (See Bug Report #3)**
- [x] **Boundary Values (Liters):** Verify application handles minimum positive value (`0.1` liter) and large inputs (`300` liters).
- [x] **Boundary Values (Price):** Verify application accepts standard decimal values (e.g., `54.50`).

## 5. Data Persistence & Settings 
- [x] **Local Storage:** Verify that all added cars and logs remain visible after reloading the page (F5).
- [x] **Data Wipe:** Verify clicking "Видалити ВСІ дані" wipes out all data from localStorage.
- [x] **Reset Stats:** Verify all dashboard numbers and history list reset to zero/empty instantly after data wipe.
- [x] Verify that a browser confirmation alert appears before deleting all data.

## 6. UI/UX & Responsive Design 
- [x] Verify all tabs (Dashboard, Мої авто, Історія, Налаштування) open the correct sections without errors.
- [x] Verify application layout scales correctly on mobile screens (widths 365px, 390px, 412px).
- [ ] Verify elements do not overlap, text remains readable, and buttons are clickable on mobile viewports. **FAILED (See Bug Report #4)**
- [ ] Check font and button behavior across different browsers (Chrome, Safari, Firefox).
