# 🏛️ LOCAL VOICE — Citizen Problem Reporting Platform

**Connecting Citizens. Solving Problems.**

LOCAL VOICE is a digital bridge between local citizens and government authorities (MLA office, MP office, Municipality, Panchayat Secretary, and department heads). Citizens can easily raise local problems with descriptions in local languages, images, and AI assistance, and track them dynamically.

---

## 🚀 Key Features

*   **Citizen Portal**: Register, file complaints with image uploads, and pin locations on an interactive map.
*   **Authority Dashboard**: Accept, prioritize, update status, and reply to citizen queries.
*   **AI Civic Assistant (LOCAL HELP AI)**: Auto-suggests departments, drafts descriptions, and translates messages.
*   **Interactive Mapping**: Drop pins to highlight problem locations (powered by Leaflet.js).
*   **Real-time Timeline**: Track complaints from submission to final resolution.

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), Tailwind CSS, Framer Motion, React Router, Axios, React Hook Form, Leaflet
*   **Backend**: Java Spring Boot, Spring Security (JWT), Spring Data JPA
*   **Database**: MySQL
*   **Integrations**: Cloudinary (Image uploads), Gemini AI (Smart analysis & translations)

---

## ⚡ Quick Start (Demo Mode)

We have built a **zero-config Demo Mode** into the application so that you can run and experience it immediately without setting up MySQL, Cloudinary, or Gemini API keys.

1.  **Start Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

2.  **Demo Credentials** (available out-of-the-box):
    *   **Citizen**: `citizen@demo.com` / `Demo@1234`
    *   **Authority**: `authority@demo.com` / `Demo@1234`

If the backend is not running, the frontend will automatically gracefully downgrade to fully-simulated frontend mock data!

---

## ⚙️ Full Production Setup

To run the complete full-stack system with your own database and third-party integrations:

### 1. Database Setup
1. Open MySQL and execute the schema script:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
2. (Optional) Populate with seed data:
   ```bash
   mysql -u root -p < database/seed.sql
   ```

### 2. Backend Setup
1. Open [backend/src/main/resources/application.properties](file:///c:/Users/PRATAP/OneDrive/Desktop/Voice4Local/backend/src/main/resources/application.properties) and configure:
   *   **MySQL Database**: Update `spring.datasource.password` with your password.
   *   **Gemini AI**: Update `gemini.api.key` with your Google Gemini API key.
   *   **Cloudinary**: Update `cloudinary.cloud-name`, `cloudinary.api-key`, and `cloudinary.api-secret`.
2. Run the Spring Boot application:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The server will start on `http://localhost:8080` and auto-initialize the database tables and demo accounts.

### 3. Frontend Setup
1. Set the backend API URL in `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:8080
   ```
2. Start the Vite development server:
   ```bash
   cd frontend
   npm run dev
   ```

---

## 📂 Folder Structure

```
Voice4Local/
├── database/
│   ├── schema.sql         # Table creation script
│   └── seed.sql           # Initial citizen/authority seed data
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/localvoice/
│       ├── config/        # Security, CORS, Cloudinary, DatabaseInitializer
│       ├── controller/    # REST endpoints (Auth, Complaint, AI, Upload)
│       ├── dto/           # Request/Response payloads
│       ├── entity/        # JPA Entities (User, Complaint, Response)
│       ├── repository/    # JPA Repositories
│       ├── security/      # JWT processing & user service
│       └── service/       # Business logic (ComplaintService, AIService)
└── frontend/
    ├── package.json
    ├── tailwind.config.js
    └── src/
        ├── components/    # Reusable UI (Timelines, Maps, Uploaders)
        ├── context/       # Auth and Theme state providers
        ├── pages/         # Page Views (Home, Dashboards, Raise Form, Chat)
        └── services/      # Axios API integration layer
```

---

## 🔗 REST API Reference

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/auth/register` | `POST` | Public | Registers a new citizen / authority user |
| `/api/auth/login` | `POST` | Public | Authenticates and returns JWT token |
| `/api/auth/me` | `GET` | Authenticated | Gets current user's profile |
| `/api/complaints` | `POST` | CITIZEN | Registers a new complaint |
| `/api/complaints/my` | `GET` | CITIZEN | Retrieves all complaints of the logged-in citizen |
| `/api/complaints` | `GET` | AUTHORITY | Gets all complaints (supports search & filters) |
| `/api/complaints/{id}` | `GET` | Authenticated | Gets detailed complaint status & timeline |
| `/api/complaints/track/{complaintId}` | `GET` | Public | Tracks complaint by public ID or Phone number |
| `/api/complaints/{id}/status` | `PUT` | AUTHORITY | Updates status (SUBMITTED, UNDER_REVIEW, etc.) |
| `/api/complaints/{id}/response` | `POST` | AUTHORITY | Submits authority response/reply to the citizen |
| `/api/ai/analyze` | `POST` | Authenticated | Chats with LOCAL HELP AI |
| `/api/upload` | `POST` | Public | Uploads evidence images |
