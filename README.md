# Healthcare Connect 🩺
### Rural Digital Health Platform

**Bringing healthcare services closer to the people who need them.**

Healthcare Connect is a web-based healthcare platform designed to make essential healthcare services more accessible, organized, and convenient, particularly for rural communities. The platform brings doctor discovery, appointment booking, health records, medicine-related services, and healthcare reminders together in one place.

Developed as both an academic project and a startup-oriented product, Healthcare Connect focuses on accessible design, practical healthcare workflows, and a responsive user experience.

<p align="center">
  <strong>Version 1.0.0 · Initial Functional Release</strong>
</p>

---

## 📌 About the Project

Accessing healthcare can involve several disconnected processes, from finding a doctor and booking an appointment to maintaining health records and remembering medicines.

Healthcare Connect aims to simplify these processes through a unified digital platform. It provides an interface for patients to access healthcare services and manage relevant information through a single application.

The project combines web development, backend API integration, and database management to establish a foundation for a more connected healthcare experience.

### 🎯 Objectives

- Make healthcare services easier to access through a digital platform.
- Simplify doctor discovery and appointment booking.
- Provide convenient access to patient health records.
- Bring medicine-related services and reminders into one application.
- Build a responsive, user-friendly experience for desktop and mobile devices.
- Establish a foundation for future healthcare technology enhancements.

## ✨ Features

### 🔐 Authentication and Accounts
- User registration and login.
- Token-based authentication for protected API requests.
- Role-aware navigation and access.

### 🩺 Doctor Discovery
- Browse available doctors.
- View doctor details and professional information.

### 📅 Appointment Booking
- Book appointments with doctors.
- Access appointment-related information.
- Support the patient appointment workflow.

### 📁 Health Records
- Retrieve health records associated with the logged-in patient.
- View available record details, including dates, descriptions, and doctor information.

### 💊 Medicines
- Access medicine-related information.
- Use available medicine and pharmacy search functionality.

### 🔔 Healthcare Reminders
- Access the platform's reminder functionality.

### 👤 Patient Profile
- Access patient profile information.

### 🚨 Emergency Contacts
- Access emergency contact functionality.

### 📱 Responsive User Interface
- Responsive layouts for desktop and mobile screens.
- Clean healthcare-focused design.
- Teal-and-white visual theme.

*The features above describe the implemented application modules. The depth of functionality may vary by module, and the initial release should not be interpreted as a certification of clinical or production readiness.*

---

## 🛠️ Technology Stack

| Component | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| UI and Layout | Bootstrap 5 |
| Icons | Bootstrap Icons |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Database Hosting | Aiven |
| Backend Hosting | Render |
| Frontend Hosting | Render Static Site |
| Development Environment | Visual Studio Code |
| Version Control | Git and GitHub |

---

## 🏗️ System Architecture

Healthcare Connect follows a client-server architecture.

```text
                  PATIENT / USER
                        |
                        v
              RESPONSIVE WEB FRONTEND
                HTML, CSS, JavaScript
                        |
                        v
                    REST API
                 Node.js + Express
                        |
                        v
                   MYSQL DATABASE
                       Aiven
```

### How It Works

1. Users interact with the web frontend through a browser.
2. The frontend sends requests to the backend API.
3. The backend processes requests and performs the required database operations.
4. MySQL stores and retrieves application data.
5. The backend returns responses that the frontend uses to display information.

Authentication tokens are used for protected API requests.

---

## 📂 Project Structure

```text
HealthCare-Connect--/
│
├── frontend/
│   ├── pages/
│   ├── css/
│   │   ├── reset.css
│   │   ├── variables.css
│   │   ├── utilities.css
│   │   ├── components.css
│   │   └── style.css
│   ├── js/
│   └── assests/
│       ├── doctors/
│       ├── icons/
│       └── images/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── package.json
│   └── server.js
│
└── database/
```

The structure above highlights the principal project directories and files.

---

## 🌐 Live Deployment

The application is deployed online, with the frontend, backend, and database hosted separately.

- **Live Application:** [Healthcare Connect](https://healthcare-connect-frontend-wjl4.onrender.com/)
- **Backend API:** [Healthcare Connect API](https://healthcare-connect-api.onrender.com/)
- **API Health Check:** [Check API Status](https://healthcare-connect-api.onrender.com/api/health)
- **GitHub Repository:** [HealthCare-Connect--](https://github.com/bhakti-10-bawake/HealthCare-Connect--)

### Hosting Infrastructure

- **Frontend:** Render Static Site
- **Backend:** Render Web Service
- **Database:** MySQL hosted on Aiven

The deployed application has been tested on desktop and mobile devices, including login and health-record retrieval.

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

Install the following tools:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- Access to a configured MySQL database

### 1. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/bhakti-10-bawake/HealthCare-Connect--.git
cd HealthCare-Connect--
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a local `.env` file inside the `backend` directory.

Configure the variables required by the backend for:

- Server port
- MySQL host, port, username, password, and database name
- JWT authentication secret
- Database SSL settings, when required

Use credentials for a database instance you are authorized to access. For a local database, configure the appropriate local settings; for Aiven, use its connection details and required SSL certificate configuration.

**Never commit database credentials, JWT secrets, private certificates, or other sensitive configuration to GitHub.** Keep local environment files private and configure production secrets through the hosting provider.

### 4. Start the Backend

For development:

```bash
npm run dev
```

Or start the server normally:

```bash
npm start
```

The backend must be able to connect to the configured MySQL database before database-dependent features can work.

### 5. Run the Frontend

Open the project in Visual Studio Code and use the Live Server extension to serve the frontend, beginning with the login page:

`frontend/pages/login.html`

Ensure the frontend API configuration points to the intended backend. The deployed application uses the hosted Render API; local development may require a separate API configuration.

---

## 🔬 Research and Development

The project includes research into papers related to the healthcare access problem and the broader healthcare domain.

This research informed the problem understanding and the motivation behind developing a unified digital healthcare platform.

The project also applies practical software development concepts, including frontend design, REST API integration, authentication, relational database operations, and cloud deployment.

---

## 👥 Team Members

Healthcare Connect is developed by a team of second-year B.Tech Computer Science and Engineering students at Sanjivani University.

| Sr. No. | Team Member | Responsibility |
|---:|---|---|
| 1 | **Bhakti Bawake** | Team Leader |
| 2 | Chaitali Jadhav | Team Member |
| 3 | Mitali Abnave | Team Member |
| 4 | Apurva Wabale | Team Member |

**Institution:** Sanjivani University  
**Department:** Computer Science and Engineering (CSE)  
**Academic Year:** Second Year, B.Tech

### Project Mentorship

- **Mentor:** Prof. Jyotimoyee Kalita
- **Project Guide:** Dr. Mahendra Gawali

---

## 🏷️ Version 1.0.0 — Initial Functional Release

Version 1.0.0 marks the first deployed functional release of Healthcare Connect.

### Release Highlights

- Frontend and backend deployed online.
- Hosted MySQL database connected through Aiven.
- Authentication integrated with protected API requests.
- Doctor discovery and appointment-related workflows implemented.
- Health-record retrieval working with the deployed database.
- Medicine, reminder, profile, and emergency-contact modules included.
- Responsive access tested on desktop and mobile devices.

This release establishes the initial working foundation for continued development and testing.

---

## 🔮 Future Scope

Potential improvements for future versions include:

- Telemedicine and online doctor consultations.
- Enhanced appointment notifications and scheduling workflows.
- Secure medical document uploads and downloads.
- Expanded pharmacy and medicine management capabilities.
- More comprehensive patient dashboards and health insights.
- Improved accessibility and multilingual support.
- Expanded automated testing, security hardening, and error monitoring.
- Further reliability improvements and production-readiness work.

These are potential future enhancements and are not presented as completed features of Version 1.0.0.

---

## 🤝 Contributions

Healthcare Connect is an evolving project. Suggestions, bug reports, and improvements are welcome.

For substantial changes, open an issue in the repository to discuss the proposed improvement before submitting a pull request.

Contributors should test their changes and avoid committing secrets or sensitive information.

---

## 🙌 Acknowledgements

We extend our sincere gratitude to **Prof. Jyotimoyee Kalita**, our mentor, and **Dr. Mahendra Gawali**, our project guide, for their guidance and support throughout the development of Healthcare Connect.

We also acknowledge Sanjivani University for providing the academic environment in which this project is being developed.

---

<p align="center">
  <strong>Healthcare Connect</strong><br>
  Making healthcare services more accessible, connected, and convenient.
</p>
