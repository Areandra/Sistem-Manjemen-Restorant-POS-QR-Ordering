# Restaurant POS & QR Ordering Management System

A modern Restaurant Management System designed to streamline operations for restaurants, cafes, and food courts. This system integrates POS, Session-based QR Ordering, Table Management, and Kitchen Order Tickets into a single real-time platform.

---

![Node.js](https://img.shields.io/badge/Node.js-20+-green) ![npm](https://img.shields.io/badge/npm-10+-blue) ![AdonisJS](https://img.shields.io/badge/AdonisJS-6-%236E4AFF) ![React](https://img.shields.io/badge/React-19-61DAFB) ![InertiaJS](https://img.shields.io/badge/InertiaJS-React-purple) ![TypeScript](https://img.shields.io/badge/TypeScript-5-%233178C6) ![Vite](https://img.shields.io/badge/Vite-6-yellow) ![MySQL](https://img.shields.io/badge/Database-MySQL%2FMariaDB-blue) ![QRCode](https://img.shields.io/badge/QR_Code-qrcode-green) ![ChartJS](https://img.shields.io/badge/Chart-ChartJS-orange) ![MariaDB](https://img.shields.io/badge/MariaDB-10.4+-orange) ![License](https://img.shields.io/badge/license-MIT-red)

---

## ⚙️ Environment & Tool Requirements

### System Requirements (Used in Project)

* **Node.js:**
Version **≥ 20.x** *(LTS recommended, stable example: 20.11.0 or higher, and successfully tested on 24.11.0)*
* **npm:**
Following Node.js *(LTS recommended, successfully tested on 11.6.4)*.
* **MySQL/MariaDB:**
Recommended version **MariaDB 10.4.32+** or **MySQL 8.x**.
*(Project tested and runs smoothly on MariaDB 10.4.32, but compatibility with MySQL 8 and above is also good for JSON features & data integrity)*
* **OS:**
Tested running on **Windows 11** & **Ubuntu 24.04.3 LTS**.

### Recommended Development Tools

* **Code Editor:**
[VSCode](https://code.visualstudio.com/)
* **Database Client GUI:**
[phpMyAdmin (XAMPP)](https://www.apachefriends.org/) or [DBeaver](https://dbeaver.io/)
* **Package Manager:**
npm (Node.js default)
* **Git:**
[Git Bash](https://gitforwindows.org/) for cloning etc.

#### Optional for development workflow:

* **ngrok/localtunnel** *(testing from mobile outside LAN)*
* **Docker Desktop** *(if you want to isolate MySQL/MariaDB/Node)*

---

## 🚦 Installation & Setup Steps

### 1. **Clone & Install**

```bash
git clone https://github.com/Areandra/Sistem-Manjemen-Restorant-POS-QR-Ordering.git
cd Sistem-Manjemen-Restorant-POS-QR-Ordering
npm install
cp .env.example .env

```

### 2. **Generate Application Key**

```bash
node ace generate:key

```

### 3. **Configure .env**

Edit the `.env` file:

```env
HOST=192.168.x.x
PORT=3333
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=db_name
DB_USER=root
DB_PASSWORD=your_db_password
SUPER_PASSWORD=your_super_password

```

> **MANDATORY:** Use your LAN IP so other devices can access the application for QR Order testing.

---

### ⚠️ Disclaimer Before Database Migration

* **MIGRATION may FAIL** if the *database container*, *DB version*, or *default config* varies *(example: `notNullable` columns **without default values** on some engines/databases/containers will error). Perform manual fixes on the migration files if necessary*.
* Ensure *user/permission/database* are correct, and **create the database MANUALLY** if the migration errors because the DB doesn't exist yet.
* Re-check schema and environment *if deploying to Docker with a database image other than MariaDB 10.4.x/MySQL 8.x* (check migration error logs!).

---

### 4. **Run Database Migration**

```bash
node ace migration:run

```

### 5. **Build (Optional for Production)**

```bash
npm run build

```

### 6. **Run Developer Server**

```bash
npm run dev

```

Access the application in browser: `http://<HOST>:<PORT>`

---

## 🔑 **Admin Creation & Admin Commands**

### Admin Creation & Management Flow

After the server is running & database is ready, create/configure the admin using the following CLI commands:

```bash
node ace app:admin create

```

* Enter `SUPER_PASSWORD` matching your `.env` when prompted.
* You must fill in the **name**, **email**, and **password** for the admin.
* Only **ONE** active admin is allowed in the system (*if one exists, the command cannot be run unless you destroy/reset*).

#### Other Admin Commands

* **Reset Admin Password**
```bash
node ace app:admin password-reset <admin_email>

```


> Will request the super password and the new password.


* **Delete Admin**
```bash
node ace app:admin destroy <admin_email>

```


> Can only be executed if you want to wipe the main admin (super password required).



> Ensure the admin email matches what is recorded in the database!

### 📋 Notes:

* All admin actions are done via CLI (not the web interface).
* SUPER_PASSWORD must be remembered and kept safe!
* If admin creation or migration errors, check the terminal error logs & ensure database/config are correct.

---

## 📱 QR Order Disclaimer

> **The QR Order feature uses a unique QR per session/order (not static per table), so each session has a specific URI & history. To test the QR, ENSURE the application is accessed via LAN IP (`HOST` in `.env`) and other devices are on the same network, NOT via `localhost`/`127.0.0.1`.**

---

## 📝 Main Flow & Features

### Roles & Core Flow

* **Admin:** Initial setup, user/table/menu management.
* **Cashier:** Session opening, order listing, payment processing, session closing.
* **Customer:** Scan QR (per session), create orders, monitor order status & bill directly via their own device.
* **Kitchen:** Monitor incoming orders, update production status for each order/session.

### Usage Flow

1. **Admin sets up** restaurant data: tables, categories, menus, and other users.
2. **Cashier** Opens a Session from an empty table.
3. **Customer arrives**, scans SESSION QR, accesses menu, orders independently.
4. **Cashier**, ordering can also be done at the cashier station.
5. **Orders enter** the cashier & kitchen systems in real-time.
6. **Cashier** confirms, processes payment, closes the order session.
7. **Kitchen** updates order status (cooking-served-completed).

### Complete Features:

* CLI Admin: create/reset password/destroy
* QR Session Ordering: Unique QR per session/many_order (not one QR per table)
* Master CRUD: menu, tables, user roles, reports, order history
* Transactions: order, pay, close session, digital billing
* Roles & Authorization: SUPER_PASSWORD, role logic
* Realtime Notifications: React/Inertia SPA, refresh only occurs if data processing is done on another device
* Statistics: sales charts, session/table performance
* Modular Commands: lint, build, serve, test, typecheck, etc.

---

### Developer Commands

* `npm run dev` → Run development server
* `npm run build` → Build for production
* `npm run lint` → Check code style
* `npm run test` → Run unit tests
* `npm run typecheck` → TypeScript check

---

## Contribution & License

Please fork/pull request/issue to contribute.
License: [MIT].

---

## Contact

* **Owner:** Areandra
* **Repo:** [https://github.com/Areandra/Sistem-Manjemen-Restorant-POS-QR-Ordering](https://github.com/Areandra/Sistem-Manjemen-Restorant-POS-QR-Ordering)
* **LinkedIn:** [https://www.linkedin.com/in/muhammad-ariel-4899312a0/](https://www.linkedin.com/in/muhammad-ariel-4899312a0/)
