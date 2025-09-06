# 🎯 Quiz3 - Web3 Knowledge Arena

A comprehensive Web3 trivia dApp built on the Aptos blockchain, featuring mobile-first design and vibrant gradient UI.

## ✨ Features

### 🎮 Game Mechanics
- **4 Categories**: Aptos ⚡, DeFi 💰, NFT 🎨, Zero-Knowledge 🔒
- **Timed Questions**: 15 seconds per question with visual countdown
- **Smart Scoring**: Base points + speed multiplier + streak bonus
- **Educational Cards**: Learn from wrong answers with explanations
- **Weekly Seasons**: Compete for APT rewards

### 🎨 UI/UX Design  
- **Mobile-First**: Responsive design optimized for mobile devices
- **Vibrant Gradients**: Purple-blue-cyan color palette
- **PWA Support**: Install as native mobile app
- **Micro-Animations**: Smooth transitions and hover effects
- **Accessibility**: High contrast and large touch targets

### ⛓️ Blockchain Integration
- **Aptos Testnet**: Smart contract deployment
- **Wallet Connection**: Aptos Wallet Adapter integration
- **Season Management**: On-chain merkle root verification
- **Reward Claims**: Secure APT token distribution

## 🏗️ Architecture

### Frontend (`/frontend`)
- **React + Vite**: Modern development setup
- **Tailwind CSS**: Utility-first styling
- **TypeScript**: Type-safe development
- **Aptos SDK**: Blockchain interactions

### Smart Contract (`/contract`)
- **Move Language**: Resource-oriented programming
- **Season Management**: Create and manage quiz seasons
- **Merkle Proofs**: Secure reward distribution
- **Anti-Double-Claim**: Built-in protection mechanisms

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Aptos CLI
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/0xumutkk/quiz3-dapp.git
   cd quiz3-dapp
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Smart Contract Deployment

1. **Compile the contract**
   ```bash
   cd contract
   aptos move compile --named-addresses trivia_game=default
   ```

2. **Deploy to testnet**
   ```bash
   aptos move publish --named-addresses trivia_game=default
   ```

## 📁 Project Structure

```
quiz3-dapp/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Main application pages
│   │   ├── lib/             # Utilities and Aptos config
│   │   ├── data/            # Question data and content
│   │   └── types/           # TypeScript definitions
│   ├── public/              # Static assets and PWA files
│   └── package.json
├── contract/                # Move smart contract
│   ├── sources/
│   │   └── trivia_game.move # Main contract logic
│   └── Move.toml
├── .gitignore
└── README.md
```

## 🎯 Game Flow

1. **Connect Wallet**: Use Aptos wallet adapter
2. **Select Category**: Choose from 4 Web3 topics  
3. **Answer Questions**: 5 questions per session, 15s each
4. **View Results**: See score breakdown and ranking
5. **Claim Rewards**: Top performers earn APT tokens weekly

## 🛠️ Development Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Smart Contract
npm run move:compile # Compile Move contract
npm run move:test    # Run Move tests
npm run move:publish # Deploy to testnet
```

## 🔧 Configuration

Environment variables in `/frontend/.env`:

```env
VITE_MODULE_ADDRESS="0x1"  # Contract address after deployment
VITE_APP_NETWORK="testnet"
VITE_NODE_URL="https://fullnode.testnet.aptoslabs.com/v1"
```

## 🎨 Design System

### Color Palette
- **Primary Gradient**: Purple → Blue → Cyan
- **Success**: Green tones
- **Warning**: Yellow/Orange
- **Error**: Red tones
- **Neutral**: Slate grays

### Components
- **Rounded Cards**: 2xl border radius
- **Gradient Buttons**: Interactive hover states
- **Progress Bars**: Animated timer displays
- **Educational Cards**: Slide-up animations

## 🏆 Scoring System

- **Base Score**: 100 points per correct answer
- **Speed Multiplier**: 0.5 + 0.5 × (time_left / 15)
- **Streak Bonus**: +10 × min(5, consecutive_correct)
- **Wrong Answer**: 0 points, resets streak
- **Tie Breaker**: Total response time

## 📱 PWA Features

- **Offline Support**: Service worker caching
- **Install Prompt**: Add to home screen
- **Native Feel**: Full-screen mobile experience
- **Background Sync**: Future feature for offline play

## 🔒 Security Features

- **Merkle Proofs**: Secure reward verification
- **Anti-Double-Claim**: Contract-level protection
- **Server-Side Timing**: Prevent client-side manipulation
- **Rate Limiting**: Anti-cheat mechanisms

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Aptos Labs**: For the incredible blockchain platform
- **Move Language**: For secure smart contract development  
- **Community**: For inspiration and feedback

---

🔗 **Links**:
- [Live Demo](https://quiz3-dapp.vercel.app) (Coming Soon)
- [Aptos Explorer](https://explorer.aptoslabs.com/) 
- [Documentation](https://aptos.dev/)

**Happy Learning! 🎓⚡**
