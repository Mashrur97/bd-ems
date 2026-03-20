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

A full-stack election management prototype simulating the digitization of Bangladesh's national parliamentary election process. The system supports multiple user roles across the complete election workflow — from booth-level vote entry to official result declaration.

---

## 🧑‍💼 User Roles & Demo Credentials

| Role | Portal | ID | PIN |
|------|--------|----|-----|
| **Voter** | Voter Portal | NID: `1234567890123` | DOB: `1985-03-12` |
| **Asst. Presiding Officer** | Officer Login | `APO001` | `1111` |
| **Presiding Officer** | Officer Login | `PO001` | `2222` |
| **Asst. Returning Officer** | Officer Login | `ARO001` | `3333` |
| **Returning Officer** | Officer Login | `RO001` | `4444` |
| **Guest** | Live Results | No login required | — |

---

## ✨ Features

### 🗳️ Voter Portal
- NID + Date of Birth authentication
- Candidate selection with confirmation modal
- Real-time live results view
- Official voting receipt / slip

### 📺 Guest / Live Results
- Real-time national vote count
- Candidate result bars with live trickle simulation
- Constituency breakdown
- Fraud flag display
- Election timeline

### 📝 Asst. Presiding Officer
- Booth vote entry form
- Real-time ballot validation
  - Votes used ≤ ballots issued
  - Candidate total = ballots used
- Fraud detection (turnout deviation alert)
- Submitted booth results view

### 🏛️ Presiding Officer
- Station overview with tally
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
| Notifications | react-hot-toast |
| Deployment | Netlify |
| PWA | Web App Manifest |

---

## 📁 Project Structure

```
src/
├── data/
│   └── mockData.js          # Candidates, voters, officers, booths
├── store/
│   └── ElectionContext.jsx  # Global state & actions
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Sidebar.jsx
│   ├── VoteBar.jsx
│   ├── StatCard.jsx
│   ├── ConfirmModal.jsx
│   └── OfficerLogin.jsx
└── pages/
    ├── Landing.jsx
    ├── Guest.jsx
    ├── voter/
    │   ├── VoterLogin.jsx
    │   └── VoterDashboard.jsx
    └── officers/
        ├── APO.jsx / APODashboard.jsx
        ├── PO.jsx  / PODashboard.jsx
        ├── ARO.jsx / ARODashboard.jsx
        └── RO.jsx  / RODashboard.jsx
```

---

## 🚀 Running Locally

```bash
# clone the repo
git clone https://github.com/YOUR_USERNAME/bd-election.git
cd bd-election

# install dependencies
npm install

# start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔄 Election Workflow

```
Voter casts vote at booth
        ↓
APO enters booth vote counts → validates ballots
        ↓
PO verifies station results → submits to ARO
        ↓
ARO compiles constituency results → forwards to RO
        ↓
RO reviews & officially declares results
        ↓
Results published to public live feed
```

---

## ✅ Validation Rules

- Each voter can vote **only once**
- Ballots used **cannot exceed** issued ballots
- Candidate vote totals **must equal** ballots used
- Turnout deviation **> 20%** triggers fraud alert

---

## 📋 Project Context

This system was built as the **Term Project for CSE327 (Software Engineering)** at North South University. The project context is inspired by elections conducted under the **Bangladesh Election Commission**.

**Milestone 1** — SRS + System Design Models (Due: April 13, 2026)  
**Milestone 2** — Final Report + Prototype + Updated Models (TBA)

---

## 📄 License

For academic use only. © 2024 Bangladesh Election Commission (Simulated).
