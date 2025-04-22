# Lean Coffee Timer

A simple and timer for facilitating Lean Coffee meetings.

## Features

- ⏱️ Customizable topic time settings
- ⏳ Extendable time for valuable discussions
- 🔔 Audio notifications when time is running low
- 🌓 Dark/light theme toggle
- 📱 Fully responsive design for all devices

## Usage

1. Set your desired topic time (default: 5 minutes)
2. Set your extension time (default: 2 minutes)
3. Click "Start Discussion" to begin the timer
4. When time is running low, you'll hear beep notifications
5. When time expires, you'll hear an alarm
6. Click "Extend Time" if the group wants to continue the discussion
7. Click "Reset" to start over with a new topic

## Development

### Prerequisites

- Node.js (v16+)
- `npm`

### Installation

```bash
# Clone the repository
git clone https://github.com/paulchiu/lean-coffee-timer.git
cd lean-coffee-timer

# Install dependencies
npm install
```

### Running locally

```bash
npm run dev
```

The application will be available at http://localhost:5173

### Building for production

```bash
npm run build
```

## Built with

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Shadcn](https://ui.shadcn.com/)

## License

MIT

## Learn More

For more information about Lean Coffee, visit [leancoffee.org](https://www.leancoffee.org)
