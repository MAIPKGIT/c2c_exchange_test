# ER Diagram
![image](https://github.com/user-attachments/assets/4f17d448-b39b-407a-a7a8-d82d3b85fbf5)

# Requirement
- Code Editor
- XAMPP
- phpMyAdmin

# Tech Stack
- **Backend:** Node.js + Express
- **ORM:** Sequelize
- **Database:** MySQL (ผ่าน XAMPP/phpMyAdmin)
- **Tool:** Postman, Table Logging, Axios
- **API Style:** RESTful

### 1️⃣ ติดตั้ง XAMPP

- ดาวน์โหลดและติดตั้ง [XAMPP](https://www.apachefriends.org/index.html)
- เปิด `MySQL` และ `Apache` ผ่าน Control Panel ของ XAMPP

### 2️⃣ สร้างฐานข้อมูล `c2c_exchange`

- เข้า `http://localhost/phpmyadmin`
- สร้างฐานข้อมูลใหม่ชื่อ: `c2c_exchange`

### 3️⃣ Clone Project
- เปิด Terminal ขึ้นมา
```bash
git clone https://github.com/MAIPKGIT/c2c_exchange_test.git
```

### 4️⃣ ติดตั้ง Dependencies
```
cd c2c_exchange_test
npm install
```

### 5️⃣ Run App
```
node app.js
```

### 6️⃣ Test Seed
- New Terminal ขึ้นมา
```
cd c2c_exchange_test
node seeders/seed.js
```
![image](https://github.com/user-attachments/assets/6e306e83-dad4-456b-8208-ae19d6e26941)
