# Bug Reports: Car Fuel Tracker

## 🐛 BUG-01: Duplicate vehicle names are indistinguishable in the dropdown list
* **Severity:** Minor
* **Priority:** Medium
* **Component:** Vehicle Management Module / UI

### Description:
The application successfully allows the creation of multiple vehicles with identical names (which is valid for users owning identical fleet cars). However, the vehicle selection dropdown displays only the raw text string, making it impossible for the user to distinguish between the created car instances.

### Steps to Reproduce:
1. Open the application: https://github.io
2. Click the "+ Додати авто" button.
3. Enter the name `Renault Megane` and confirm.
4. Click the "+ Додати авто" button again.
5. Enter the exact same name `Renault Megane` and confirm.
6. Open the "Виберіть авто" dropdown list.

### Actual Result:
The dropdown displays two identical rows reading `Renault Megane`. The user cannot know which profile contains which history log.

### Expected Result:
The system should provide a UX way to differentiate identical names. 
* *Suggested fix:* Append an incremental index (e.g., `Renault Megane (1)`) or add an optional field during car creation for a License Plate or VIN code.

---

## 🐛 BUG-02: Missing validation for empty space or standalone special-character vehicle names
* **Severity:** Low
* **Priority:** Medium
* **Component:** Vehicle Management Module / Validation

### Description:
The vehicle creation prompt/form lacks input filtering. It allows the user to save a car name consisting entirely of blank spaces or meaningless symbols, which leads to invisible or broken items in the UI dropdown.

### Steps to Reproduce:
1. Open the application.
2. Click the "+ Додати авто" button.
3. Input three spaces `   ` (or symbols like `!@#$%^&*`) and confirm.
4. Open the "Виберіть авто" dropdown.

### Actual Result:
An empty, unclickable row (or a row with raw symbols) appears in the dropdown menu, degrading the user interface layout.

### Expected Result:
The system must reject inputs consisting only of spaces or standalone special symbols. 

* **Suggested Fix (UI/UX Improvement):** Replace the raw text input prompt with an input field featuring an **autocomplete dropdown list**. When the user starts typing, the system should suggest valid car makes and models (e.g., typing "Vo" suggests "Volkswagen", "Volvo"). If a custom name is typed, it must pass a regex validation requiring at least 1 alphanumeric character.
