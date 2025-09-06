import { Category, Question, EducationalContent } from '@/types';

// Dummy question data - to be replaced with real content later
export const DUMMY_QUESTIONS: Record<Category, Question[]> = {
  aptos: [
    {
      id: 'aptos_1',
      category: 'aptos',
      text: 'What consensus mechanism does Aptos blockchain use?',
      choices: ['Proof of Work', 'Proof of Stake', 'AptosBFT', 'Delegated Proof of Stake'],
      answer_idx: 2,
      difficulty: 'medium',
      explanation: 'Aptos uses AptosBFT, a Byzantine Fault Tolerant consensus protocol that enables high throughput and low latency.'
    },
    {
      id: 'aptos_2', 
      category: 'aptos',
      text: 'Which programming language is primarily used for smart contracts on Aptos?',
      choices: ['Solidity', 'Rust', 'Move', 'JavaScript'],
      answer_idx: 2,
      difficulty: 'easy',
      explanation: 'Move is a resource-oriented programming language designed for safe and flexible smart contract development on Aptos.'
    },
    {
      id: 'aptos_3',
      category: 'aptos',
      text: 'What is the native token of the Aptos blockchain?',
      choices: ['APTOS', 'APT', 'APS', 'APTO'],
      answer_idx: 1,
      difficulty: 'easy',
      explanation: 'APT is the native utility token used for transaction fees, staking, and governance on the Aptos network.'
    },
    {
      id: 'aptos_4',
      category: 'aptos',
      text: 'What is the maximum theoretical TPS (Transactions Per Second) that Aptos can achieve?',
      choices: ['1,000', '10,000', '100,000', '160,000+'],
      answer_idx: 3,
      difficulty: 'hard',
      explanation: 'Aptos can theoretically process over 160,000 TPS due to its parallel execution engine and optimistic concurrency control.'
    },
    {
      id: 'aptos_5',
      category: 'aptos',
      text: 'What is the name of Aptos parallel execution engine?',
      choices: ['Block-STM', 'ParallelVM', 'ConcurrentEVM', 'AptosTX'],
      answer_idx: 0,
      difficulty: 'medium',
      explanation: 'Block-STM (Block-based Software Transactional Memory) enables parallel transaction execution by detecting conflicts and ensuring correctness.'
    }
  ],
  defi: [
    {
      id: 'defi_1',
      category: 'defi',
      text: 'What does AMM stand for in DeFi?',
      choices: ['Automated Market Maker', 'Advanced Money Management', 'Asset Management Module', 'Algorithmic Market Model'],
      answer_idx: 0,
      difficulty: 'medium',
      explanation: 'Automated Market Makers use mathematical formulas to price assets and enable decentralized trading without order books.'
    },
    {
      id: 'defi_2',
      category: 'defi',
      text: 'What is impermanent loss in DeFi liquidity provision?',
      choices: ['Permanent token loss', 'Temporary price volatility loss', 'Smart contract bug loss', 'Network congestion loss'],
      answer_idx: 1,
      difficulty: 'hard',
      explanation: 'Impermanent loss occurs when the price ratio of deposited tokens changes, resulting in less value than holding tokens separately.'
    },
    {
      id: 'defi_3',
      category: 'defi',
      text: 'What is the primary function of a decentralized exchange (DEX)?',
      choices: ['Centralized trading', 'Peer-to-peer token swapping', 'Token creation', 'Identity verification'],
      answer_idx: 1,
      difficulty: 'easy',
      explanation: 'DEXs facilitate direct peer-to-peer cryptocurrency trading without intermediaries or custody of user funds.'
    },
    {
      id: 'defi_4',
      category: 'defi',
      text: 'What does TVL stand for in DeFi protocols?',
      choices: ['Total Value Locked', 'Token Verification Level', 'Transaction Volume Limit', 'Time Value Liquidation'],
      answer_idx: 0,
      difficulty: 'easy',
      explanation: 'Total Value Locked measures the total amount of cryptocurrency deposited in DeFi protocols and represents their adoption and trust.'
    },
    {
      id: 'defi_5',
      category: 'defi',
      text: 'What is yield farming in DeFi?',
      choices: ['Mining cryptocurrencies', 'Earning rewards by providing liquidity', 'Creating new tokens', 'Validating transactions'],
      answer_idx: 1,
      difficulty: 'medium',
      explanation: 'Yield farming involves providing liquidity to DeFi protocols in exchange for token rewards, fees, or other incentives.'
    }
  ],
  nft: [
    {
      id: 'nft_1',
      category: 'nft',
      text: 'What does NFT stand for?',
      choices: ['New Financial Token', 'Non-Fungible Token', 'Network File Transfer', 'Next Generation Token'],
      answer_idx: 1,
      difficulty: 'easy',
      explanation: 'Non-Fungible Tokens are unique digital assets that represent ownership of specific items or content on the blockchain.'
    },
    {
      id: 'nft_2',
      category: 'nft',
      text: 'Which metadata standard is commonly used for NFTs on Ethereum?',
      choices: ['ERC-20', 'ERC-721', 'ERC-1155', 'Both ERC-721 and ERC-1155'],
      answer_idx: 3,
      difficulty: 'medium',
      explanation: 'Both ERC-721 (single NFTs) and ERC-1155 (multi-token standard) are widely used for creating NFTs with different capabilities.'
    },
    {
      id: 'nft_3',
      category: 'nft',
      text: 'What is the main advantage of storing NFT metadata on IPFS?',
      choices: ['Lower costs', 'Decentralized storage', 'Faster access', 'Better security'],
      answer_idx: 1,
      difficulty: 'medium',
      explanation: 'IPFS provides decentralized, immutable storage for NFT metadata, ensuring it remains accessible even if original servers fail.'
    },
    {
      id: 'nft_4',
      category: 'nft',
      text: 'What is a common use case for utility NFTs?',
      choices: ['Digital art collection', 'Access to exclusive content', 'Investment speculation', 'Profile pictures'],
      answer_idx: 1,
      difficulty: 'easy',
      explanation: 'Utility NFTs provide holders with access to exclusive content, services, or experiences beyond just ownership of digital assets.'
    },
    {
      id: 'nft_5',
      category: 'nft',
      text: 'What is NFT royalties?',
      choices: ['Initial sale price', 'Transaction fees', 'Creator earnings from resales', 'Platform commission'],
      answer_idx: 2,
      difficulty: 'easy',
      explanation: 'NFT royalties are automatic payments to original creators each time their NFT is resold on secondary markets.'
    }
  ],
  zk: [
    {
      id: 'zk_1',
      category: 'zk',
      text: 'What does ZK stand for in zero-knowledge proofs?',
      choices: ['Zero Knowledge', 'Zone Keeper', 'Zero Krypto', 'Zonal Key'],
      answer_idx: 0,
      difficulty: 'easy',
      explanation: 'Zero-Knowledge proofs allow one party to prove knowledge of information without revealing the information itself.'
    },
    {
      id: 'zk_2',
      category: 'zk',
      text: 'What is the main benefit of zk-SNARKs?',
      choices: ['Faster transactions', 'Lower fees', 'Privacy and succinctness', 'Better security'],
      answer_idx: 2,
      difficulty: 'medium',
      explanation: 'zk-SNARKs provide both privacy (hiding transaction details) and succinctness (very small proof sizes) for blockchain applications.'
    },
    {
      id: 'zk_3',
      category: 'zk',
      text: 'What does the "succinct" property mean in zk-SNARKs?',
      choices: ['Fast verification', 'Small proof size', 'High security', 'Easy setup'],
      answer_idx: 1,
      difficulty: 'medium',
      explanation: 'Succinct means the proof size is small and verification is fast, regardless of the complexity of the original computation.'
    },
    {
      id: 'zk_4',
      category: 'zk',
      text: 'What is a trusted setup in zero-knowledge systems?',
      choices: ['User verification', 'Initial parameter generation', 'Network validation', 'Smart contract deployment'],
      answer_idx: 1,
      difficulty: 'hard',
      explanation: 'Trusted setup generates initial cryptographic parameters that must be created securely and the setup data must be destroyed.'
    },
    {
      id: 'zk_5',
      category: 'zk',
      text: 'What is the main use case for zk-rollups?',
      choices: ['Privacy coins', 'Blockchain scaling', 'Smart contracts', 'Token creation'],
      answer_idx: 1,
      difficulty: 'medium',
      explanation: 'zk-rollups bundle many transactions into one, reducing blockchain congestion while maintaining security through zero-knowledge proofs.'
    }
  ]
};

// Educational content for wrong answers
export const EDUCATIONAL_CONTENT: Record<Category, Record<string, EducationalContent>> = {
  aptos: {
    consensus: {
      title: 'AptosBFT Consensus',
      explanation: 'AptosBFT is a Byzantine Fault Tolerant protocol that provides safety and liveness guarantees.',
      learnMoreUrl: 'https://aptos.dev/concepts/blockchain#consensus',
      relatedTopics: ['Byzantine Fault Tolerance', 'Consensus Mechanisms', 'Blockchain Security']
    },
    move_language: {
      title: 'Move Programming Language',
      explanation: 'Move was designed for safe resource management and formal verification in blockchain applications.',
      learnMoreUrl: 'https://aptos.dev/move/move-on-aptos',
      relatedTopics: ['Smart Contracts', 'Resource-Oriented Programming', 'Blockchain Development']
    },
    parallel_execution: {
      title: 'Block-STM Parallel Execution',
      explanation: 'Block-STM enables parallel transaction processing by detecting and resolving conflicts automatically.',
      learnMoreUrl: 'https://aptos.dev/concepts/blockchain#parallel-execution',
      relatedTopics: ['Transaction Processing', 'Blockchain Performance', 'Concurrency Control']
    }
  },
  defi: {
    amm: {
      title: 'Automated Market Makers',
      explanation: 'AMMs replace traditional order books with mathematical formulas for price discovery and trading.',
      learnMoreUrl: 'https://chain.link/education-hub/what-is-an-automated-market-maker-amm',
      relatedTopics: ['Liquidity Pools', 'Price Discovery', 'Decentralized Trading']
    },
    impermanent_loss: {
      title: 'Understanding Impermanent Loss',
      explanation: 'IL occurs when token price ratios change after depositing in liquidity pools, affecting LP returns.',
      learnMoreUrl: 'https://academy.binance.com/en/articles/impermanent-loss-explained',
      relatedTopics: ['Liquidity Provision', 'DeFi Risks', 'Yield Farming']
    },
    yield_farming: {
      title: 'Yield Farming Strategies',
      explanation: 'Earn rewards by providing liquidity, staking tokens, or participating in DeFi protocol incentives.',
      learnMoreUrl: 'https://defipulse.com/blog/what-is-yield-farming',
      relatedTopics: ['DeFi Rewards', 'Liquidity Mining', 'Token Incentives']
    }
  },
  nft: {
    standards: {
      title: 'NFT Token Standards',
      explanation: 'Different standards like ERC-721 and ERC-1155 provide various capabilities for NFT creation and management.',
      learnMoreUrl: 'https://ethereum.org/en/developers/docs/standards/tokens/',
      relatedTopics: ['Token Standards', 'Smart Contracts', 'Digital Assets']
    },
    metadata: {
      title: 'NFT Metadata and IPFS',
      explanation: 'IPFS ensures decentralized, permanent storage of NFT metadata and associated digital content.',
      learnMoreUrl: 'https://docs.ipfs.io/concepts/what-is-ipfs/',
      relatedTopics: ['Decentralized Storage', 'Content Addressing', 'NFT Infrastructure']
    },
    utility: {
      title: 'Utility NFTs and Use Cases',
      explanation: 'Beyond collectibles, NFTs can provide access, membership, gaming assets, and various digital utilities.',
      learnMoreUrl: 'https://opensea.io/blog/guides/non-fungible-tokens/',
      relatedTopics: ['Digital Ownership', 'Access Tokens', 'Gaming NFTs']
    }
  },
  zk: {
    zero_knowledge: {
      title: 'Zero-Knowledge Proof Fundamentals',
      explanation: 'Prove knowledge without revealing information - enabling privacy and verification simultaneously.',
      learnMoreUrl: 'https://ethereum.org/en/zero-knowledge-proofs/',
      relatedTopics: ['Cryptographic Proofs', 'Privacy Technology', 'Blockchain Privacy']
    },
    snarks: {
      title: 'zk-SNARKs Technology',
      explanation: 'Succinct Non-interactive Arguments of Knowledge enable efficient verification of complex computations.',
      learnMoreUrl: 'https://blog.ethereum.org/2016/12/05/zksnarks-in-a-nutshell',
      relatedTopics: ['Cryptographic Primitives', 'Proof Systems', 'Blockchain Scaling']
    },
    rollups: {
      title: 'zk-Rollup Scaling Solutions',
      explanation: 'Bundle transactions off-chain while maintaining security through zero-knowledge proofs on-chain.',
      learnMoreUrl: 'https://ethereum.org/en/developers/docs/scaling/zk-rollups/',
      relatedTopics: ['Layer 2 Solutions', 'Blockchain Scaling', 'Zero-Knowledge Technology']
    }
  }
};

// Helper function to get random questions for a category
export function getRandomQuestions(category: Category, count: number = 5): Question[] {
  const questions = DUMMY_QUESTIONS[category];
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, questions.length));
}

// Helper function to get educational content for a wrong answer
export function getEducationalContent(category: Category, questionId: string): EducationalContent | null {
  const question = DUMMY_QUESTIONS[category].find(q => q.id === questionId);
  if (!question || !question.explanation) return null;
  
  return {
    title: `About: ${question.text}`,
    explanation: question.explanation,
    relatedTopics: ['Web3 Education', 'Blockchain Technology', category.toUpperCase()]
  };
}
