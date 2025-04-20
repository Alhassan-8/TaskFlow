# TaskFlow 📋

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.11-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, feature-rich task management application built with React, TypeScript, and Shadcn UI. TaskFlow helps you organize your work, track progress, and boost productivity with an intuitive and beautiful interface.

## ✨ Key Features

### 🎨 Rich UI Components

- **Modern Design**: Clean, accessible UI components using Shadcn UI
- **Responsive Layout**: Seamless experience across all devices
- **Theme Support**: Dark/Light mode with smooth transitions
- **Interactive Elements**:
  - Toast notifications for system feedback
  - Modal dialogs for focused interactions
  - Custom form controls for better UX
  - Tooltips and popovers for additional information

### 📝 Task Management

- **Task Operations**: Create, edit, delete, and archive tasks
- **Organization**:
  - Categorize tasks with custom labels
  - Filter and sort by priority, due date, or status
  - Search functionality with instant results
- **Priority System**:
  - Multiple priority levels
  - Visual indicators for quick recognition
- **Time Management**:
  - Due date tracking with reminders
  - Time estimation and tracking
  - Calendar integration

### 📊 Data Visualization

- **Progress Tracking**:
  - Interactive charts for task completion
  - Burn-down charts for project progress
  - Customizable dashboards
- **Analytics**:
  - Task completion rates
  - Time spent analysis
  - Productivity trends

### 📋 Form Handling

- **Validation**:
  - Real-time form validation
  - Custom validation rules
  - Error messages with suggestions
- **Input Types**:
  - OTP input for secure verification
  - Date picker with range selection
  - Rich text editor for detailed descriptions

## 🛠️ Technology Stack

### Core Technologies

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**:
  - Tailwind CSS for utility-first styling
  - Shadcn UI for component library
  - CSS Modules for component-specific styles

### State Management & Data

- **Data Fetching**: React Query for efficient data management
- **Routing**: React Router for navigation
- **Form Management**:
  - React Hook Form for form handling
  - Zod for schema validation

### UI Components

- **Component Library**: Radix UI primitives
- **Icons**: Lucide React for consistent iconography
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion for smooth transitions

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or bun package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/TaskFlow.git
cd TaskFlow
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
bun install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
│   ├── utils/          # Helper functions
│   └── api/            # API client
├── pages/              # Page components
├── types/              # TypeScript definitions
├── styles/             # Global styles
├── App.tsx             # Main application
└── main.tsx            # Entry point
```

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run format` - Format code with Prettier

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the amazing component library
- [Radix UI](https://www.radix-ui.com/) for the primitive components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the fast build tool
- [React](https://reactjs.org/) for the amazing framework

## 📞 Support

For support, please open an issue in the GitHub repository or contact us at support@taskflow.com.

## 📚 Documentation

For detailed documentation, please visit our [documentation site](https://docs.taskflow.com).
