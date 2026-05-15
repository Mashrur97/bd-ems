# 🇧🇩 Bangladesh Election Management System

> Digital Election Management System for the Bangladesh Election Commission  
> **CSE327 — Software Engineering | North South University | Spring 2026**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-bd--ems--live.netlify.app-brightgreen?style=for-the-badge)](https://bd-ems-live.netlify.app/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Netlify](https://img.shields.io/badge/Deployed-Netlify-00c7b7?style=for-the-badge&logo=netlify)](https://netlify.com/)

---

## 🔗 Live Demo

**[https://bd-ems-live.netlify.app/](https://bd-ems-live.netlify.app/)**

> Installable as a PWA — open in Chrome and tap **"Add to Home Screen"**

---

## 📌 Overview

A full-stack election management prototype simulating the digitization of Bangladesh's national parliamentary election process. The system supports multiple user roles across the complete election workflow — from booth-level vote entry to official result declaration. The voting model is physical/paper-based: voters attend assisted voting centers, the APO manually enters vote counts, and the result flows through a chain of officers for verification and declaration.

---

## 🧑‍💼 User Roles & Demo Credentials

| Role | Portal | ID | PIN |
|------|--------|----|-----|
| **Voter** | Voter Portal | NID: `1234567890123` | DOB: `1 / January / 2006` |
| **Asst. Presiding Officer** | Officer Login | `APO001` | `1111` |
| **Presiding Officer** | Officer Login | `PO001` | `2222` |
| **Asst. Returning Officer** | Officer Login | `ARO001` | `3333` |
| **Returning Officer** | Officer Login | `RO001` | `4444` |
| **Guest** | Live Results | No login required | — |

---

## ✨ Features

### 🗳️ Voter Portal
- Public booth lookup by NID — no login required
- NID + Date of Birth login for account features
- Candidate selection with confirmation modal
- Real-time live results view
- Official voting receipt / slip
- Citizen incident reporting for assisted voting centers

### 📺 Guest / Live Results
- Real-time national vote count
- Candidate result bars with live trickle simulation
- Constituency breakdown
- Fraud flag display
- Election timeline

### 📢 Field Reports (Public)
- Community-submitted incident reports from assisted voting centers
- Photo evidence support
- Upvote-based credibility ranking — higher upvotes float to top
- Galaxy background with live feed sorted by community verification

### 📝 Asst. Presiding Officer
- Booth vote entry form
- Real-time ballot validation
  - Votes used ≤ ballots issued
  - Candidate total = ballots used
- Automated fraud detection (turnout deviation > 20% triggers flag)
- Submitted booth results view

### 🏛️ Presiding Officer
- Station overview with tally
- Hard block on verification until all booths are submitted
- Booth result verification
- Voter list with live status
- Incident reporting system

### 📋 Asst. Returning Officer
- Constituency result compilation
- Station-wise breakdown
- Fraud flag management
- Forward to Returning Officer

### ⚖️ Returning Officer
- Final constituency approval
- National overview
- Winner rankings
- Full system audit log
- Official result declaration

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| State | React Context API |
| Animations | ReactBits (Particles, LightRays, Galaxy, BlurText, DecryptedText) |
| Notifications | react-hot-toast |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT (role-based) |
| Deployment | Netlify (frontend) + Render (backend) |
| PWA | Web App Manifest |

---

## 📁 Project Structure
src/
├── store/
│   └── ElectionContext.jsx       # Global state & actions
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx                # Includes dev reset (click "Digital Bangladesh Vision 2077" x5)
│   ├── Sidebar.jsx
│   ├── VoteBar.jsx
│   └── OfficerLogin.jsx
├── reactbits/
│   ├── Particles.jsx
│   ├── LightRays.jsx
│   ├── Galaxy.jsx
│   ├── BlurText.jsx
│   └── DecryptedText.jsx
└── pages/
├── Landing.jsx
├── Guest.jsx
├── ReportFeed.jsx            # Public citizen incident feed
├── voter/
│   ├── VoterLogin.jsx        # Booth finder + optional login
│   └── VoterDashboard.jsx
└── officers/
├── APODashboard.jsx
├── PODashboard.jsx
├── ARODashboard.jsx
└── RODashboard.jsx

---

## 🚀 Running Locally

```bash
# clone the repo
git clone https://github.com/Mashrur97/bd-ems.git
cd bd-ems

# frontend
cd front
npm install
npm run dev

# backend (separate terminal)
cd back
npm install
node scripts/seed.js   # seed the database
node server.js
```

Frontend: [http://localhost:5173](http://localhost:5173)  
Backend: [http://localhost:5000](http://localhost:5000)

---

## 🔄 Election Workflow
Voter looks up polling station by NID (public, no login)
↓
Voter attends assigned assisted voting center
↓
APO enters booth vote counts → validates ballots
↓
PO verifies station results (blocked until all booths submitted)
↓
ARO compiles constituency results → forwards to RO
↓
RO reviews & officially declares results
↓
Results published to public live feed

---

## ✅ Validation Rules

- Each voter can vote **only once**
- Ballots used **cannot exceed** issued ballots
- Candidate vote totals **must equal** ballots used
- Turnout deviation **> 20%** triggers automatic fraud flag
- PO **cannot verify** a station with unsubmitted booths
- ARO **cannot compile** until all stations are verified
- RO **cannot declare** until ARO has compiled

---

## 🔧 Dev Tools

The footer contains a hidden database reset trigger for demo purposes. Click **"Digital Bangladesh Vision 2077"** five times to reseed the database to a clean state without opening a terminal.

---

## 📋 Project Context

This system was built as the **Term Project for CSE327 (Software Engineering)** at North South University. The project context is inspired by elections conducted under the **Bangladesh Election Commission**.

**Milestone 1** — SRS + System Design Models (Due: April 13, 2026)  
**Milestone 2** — Final Report + Prototype + Updated Models (Due: May 16, 2026)

---

## 📄 License

For academic use only. © 2026 Bangladesh Election Commission (Simulated).