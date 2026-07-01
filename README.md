# 🚗 Car Fuel Tracker (with QA & Automation Framework)

A lightweight single-page web application designed for tracking vehicle mileage, fuel consumption, and operations expenses. 

* **Live Demo:** [https://numkaa7.github.io/car-fuel-tracker/](https://numkaa7.github.io/car-fuel-tracker/)

---

## 🛠 QA Engineering Implementation
This repository serves as a comprehensive portfolio demonstrating both **Manual** and **Automation QA** engineering best practices applied to a modern single-page web application.

### 1. Manual Testing Documentation 📄
All manual testing artifacts are thoroughly documented in a structured way:
* 📋 **[QA Checklist](./qa-docs/checklist.md)** — Comprehensive checklist tracking functional core logic, boundary values, and UI/UX constraints.
* 📊 **[Test Cases Matrix](./qa-docs/test_cases.md)** — Detailed tabular test matrix tracking positive, negative, and edge-case execution scenarios with specific test data.
* 🐛 **[Bug Reports](./qa-docs/bug_reports.md)** — Professional bug tickets documenting discovered UI layout constraints and UX anomalies, complete with proposed technical solutions (e.g., input autocomplete suggestions).

### 2. Automated E2E Testing (Playwright + TypeScript) 🤖
Core user workflows, business calculations, and validation fields are fully automated.
* **Framework:** Playwright
* **Language:** TypeScript
* **Test File:** `tests/fuel-tracker.spec.ts`

**Automated Scenarios Covered:**
* **TC-01:** Full-cycle car profile creation, fuel log submission, and dynamic dashboard math calculation checking (`40L * 55 UAH = 2200.00 UAH`).
* **TC-02:** Negative scenario validating that empty fields block form submission.
* **TC-03:** Validation check verifying that car creation forms reject empty inputs.
* **TC-04:** UX state tracking to handle duplicate vehicle names.
* **TC-06:** Security & data integrity flow validating universal data wipe via "Danger Zone" using browser confirm dialog interception.

---

## 💻 Tech Stack Used
* **QA & Automation:** Playwright, TypeScript, JavaScript (ES6+), Test Design (BVA, EP).
* **Development & Hosting:** HTML5, CSS3, DOM Manipulation, Local Storage API, GitHub Pages.
