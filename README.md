# Prashikshan | AI Career Platform 🚀

Prashikshan is a comprehensive AI-powered educational platform designed to bridge the gap between academic learning and industry requirements. It provides students with personalized career preparation tools, including AI tutoring, resume building, interview practice, and internship opportunities.

## ✨ Key Features

- **AI Tutor:** Personalized learning assistance powered by Google Gemini to help students master concepts.
- **Resume Builder:** Interactive tool to create professional resumes tailored to industry standards.
- **Interview Practice:** AI-driven mock interviews with feedback on performance.
- **Student Dashboard:** Centralized hub for tracking progress, assessments, and activities.
- **Skill Assessment:** Quizzes and evaluations to identify strengths and areas for improvement.
- **Internships:** Portal to find and apply for relevant internship opportunities.
- **Analytics:** Detailed insights into learning progress and performance metrics.
- **Authentication:** Secure user management for students and administrators.

## 🛠️ Tech Stack

- **Frontend:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Framer Motion](https://www.framer.com/motion/) (Animations), [Lucide React](https://lucide.dev/) (Icons), [Recharts](https://recharts.org/) (Charts)
- **AI Integration:** [Google Generative AI (Gemini)](https://ai.google.dev/)
- **Backend & Auth:** [Firebase](https://firebase.google.com/) (Authentication, Firestore)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Hackmaass/Prashikshan.git
    cd prashikshan
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env.local` file in the root directory and add your API keys:

    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    # Add other Firebase config variables if needed
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

5.  **Build for production:**
    ```bash
    npm run build
    ```

## 📂 Project Structure

```
prashikshan/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Application pages (Dashboard, Auth, etc.)
│   ├── services/         # API services (Firebase, Gemini)
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component & Routing
│   └── main.tsx          # Entry point
├── public/               # Static assets
└── package.json          # Project dependencies and scripts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ by the Prashikshan Team.
