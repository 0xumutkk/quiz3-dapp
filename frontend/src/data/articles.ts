import { Category } from '@/types';

export interface EducationalArticle {
  id: string;
  category: Category;
  title: string;
  subtitle: string;
  readingTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: {
    introduction: string;
    sections: Array<{
      title: string;
      content: string;
      keyPoints: string[];
    }>;
    conclusion: string;
    relatedTopics: string[];
  };
  quizAnswers: {
    questionId: string;
    answer: string;
    explanation: string;
  }[];
}

export const EDUCATIONAL_ARTICLES: Record<Category, EducationalArticle> = {
  aptos: {
    id: 'aptos_comprehensive_guide',
    category: 'aptos',
    title: 'Aptos Blockchain: The Complete Guide to Next-Generation Blockchain Technology',
    subtitle: 'Everything you need to know about Aptos, from consensus mechanisms to parallel execution',
    readingTime: '12 min read',
    difficulty: 'intermediate',
    content: {
      introduction: `Aptos is a next-generation blockchain platform designed to address the scalability, security, and usability challenges that have plagued earlier blockchain networks. Built by former Meta (Facebook) employees who worked on the Diem project, Aptos represents a significant leap forward in blockchain technology with its innovative approach to consensus, parallel execution, and developer experience.`,
      sections: [
        {
          title: 'What is Aptos?',
          content: `Aptos is a Layer 1 blockchain that was officially launched in October 2022. The project was developed by Aptos Labs, a company founded by former Meta employees who previously worked on the Diem (formerly Libra) blockchain project. Aptos aims to create a blockchain that can handle the scale and complexity required for mainstream adoption while maintaining the security and decentralization principles that make blockchain technology valuable.`,
          keyPoints: [
            'Launched in October 2022 by former Meta employees',
            'Built to address scalability and usability challenges',
            'Designed for mainstream adoption',
            'Maintains security and decentralization principles'
          ]
        },
        {
          title: 'AptosBFT Consensus Mechanism',
          content: `Aptos uses a consensus mechanism called AptosBFT, which is based on Byzantine Fault Tolerance (BFT). This consensus protocol allows the network to reach agreement on the state of the blockchain even when up to one-third of the validators are malicious or fail. AptosBFT is designed to be both safe and live, meaning it guarantees that valid transactions will eventually be included in the blockchain and that the network will continue to make progress even under adverse conditions.`,
          keyPoints: [
            'Based on Byzantine Fault Tolerance (BFT)',
            'Can handle up to 1/3 malicious validators',
            'Guarantees safety and liveness',
            'Enables high throughput and low latency'
          ]
        },
        {
          title: 'Move Programming Language',
          content: `Aptos uses the Move programming language for smart contract development. Move was originally designed for the Diem project and is specifically built for blockchain applications. It's a resource-oriented language that treats digital assets as first-class citizens, making it easier to write secure smart contracts. Move's type system and resource model help prevent common blockchain vulnerabilities like reentrancy attacks and double-spending.`,
          keyPoints: [
            'Resource-oriented programming language',
            'Designed specifically for blockchain',
            'Prevents common vulnerabilities',
            'Treats digital assets as first-class citizens'
          ]
        },
        {
          title: 'Block-STM Parallel Execution',
          content: `One of Aptos' most innovative features is Block-STM (Block-based Software Transactional Memory), which enables parallel transaction execution. Traditional blockchains process transactions sequentially, which limits throughput. Block-STM allows Aptos to process multiple transactions simultaneously by detecting conflicts and resolving them automatically. This technology enables Aptos to achieve over 160,000 transactions per second (TPS) in theory.`,
          keyPoints: [
            'Enables parallel transaction processing',
            'Automatically detects and resolves conflicts',
            'Theoretical capacity of 160,000+ TPS',
            'Significantly improves blockchain throughput'
          ]
        },
        {
          title: 'APT Token and Economics',
          content: `APT is the native utility token of the Aptos blockchain. It's used for transaction fees, staking, and governance. The token has a total supply that's designed to be deflationary over time. Validators need to stake a minimum of 1,000,000 APT to participate in consensus, ensuring network security and validator commitment. APT holders can also participate in governance decisions that affect the future development of the network.`,
          keyPoints: [
            'Native utility token: APT',
            'Used for fees, staking, and governance',
            'Minimum 1,000,000 APT stake for validators',
            'Deflationary tokenomics over time'
          ]
        }
      ],
      conclusion: `Aptos represents a significant advancement in blockchain technology, combining innovative consensus mechanisms, parallel execution, and a developer-friendly programming language. With its focus on scalability, security, and usability, Aptos is well-positioned to support the next generation of decentralized applications. As the ecosystem continues to grow and mature, Aptos may play a crucial role in bringing blockchain technology to mainstream adoption.`,
      relatedTopics: [
        'Blockchain Scalability',
        'Consensus Mechanisms',
        'Smart Contract Development',
        'Layer 1 Blockchains',
        'Move Programming Language'
      ]
    },
    quizAnswers: [
      {
        questionId: 'aptos_1',
        answer: 'AptosBFT',
        explanation: 'Aptos uses AptosBFT, a Byzantine Fault Tolerant consensus protocol that enables high throughput and low latency.'
      },
      {
        questionId: 'aptos_2',
        answer: 'Move',
        explanation: 'Move is a resource-oriented programming language designed for safe and flexible smart contract development on Aptos.'
      },
      {
        questionId: 'aptos_3',
        answer: 'APT',
        explanation: 'APT is the native utility token used for transaction fees, staking, and governance on the Aptos network.'
      },
      {
        questionId: 'aptos_4',
        answer: '160,000+',
        explanation: 'Aptos can theoretically process over 160,000 TPS due to its parallel execution engine and optimistic concurrency control.'
      },
      {
        questionId: 'aptos_5',
        answer: 'Block-STM',
        explanation: 'Block-STM (Block-based Software Transactional Memory) enables parallel transaction execution by detecting conflicts and ensuring correctness.'
      },
      {
        questionId: 'aptos_6',
        answer: '2022',
        explanation: 'Aptos was officially launched in October 2022, marking a significant milestone in blockchain technology.'
      },
      {
        questionId: 'aptos_7',
        answer: 'Higher throughput',
        explanation: 'Aptos is designed for high throughput, capable of processing over 160,000 transactions per second.'
      },
      {
        questionId: 'aptos_8',
        answer: 'Byzantine Fault Tolerance',
        explanation: 'BFT stands for Byzantine Fault Tolerance, a consensus mechanism that can handle up to one-third of malicious nodes.'
      },
      {
        questionId: 'aptos_9',
        answer: 'All of the above',
        explanation: 'Aptos has used multiple testnet names including Devnet, Testnet, and AIT-3 for different phases of development.'
      },
      {
        questionId: 'aptos_10',
        answer: '1,000,000 APT',
        explanation: 'Aptos requires a minimum stake of 1,000,000 APT to become a validator, ensuring network security.'
      }
    ]
  },
  defi: {
    id: 'defi_comprehensive_guide',
    category: 'defi',
    title: 'DeFi Revolution: Understanding Decentralized Finance',
    subtitle: 'A complete guide to DeFi protocols, yield farming, and decentralized financial services',
    readingTime: '15 min read',
    difficulty: 'intermediate',
    content: {
      introduction: `Decentralized Finance (DeFi) represents one of the most significant innovations in the blockchain space, offering traditional financial services without intermediaries. DeFi protocols enable users to lend, borrow, trade, and earn yields on their digital assets in a permissionless and transparent manner. This ecosystem has grown from a niche experiment to a multi-billion dollar industry that's reshaping how we think about financial services.`,
      sections: [
        {
          title: 'What is DeFi?',
          content: `DeFi refers to financial services built on blockchain networks that operate without traditional intermediaries like banks or brokers. These services are typically open-source, permissionless, and transparent, allowing anyone with an internet connection to access financial products. DeFi protocols use smart contracts to automate financial operations, reducing costs and increasing efficiency while maintaining security through cryptographic verification.`,
          keyPoints: [
            'Financial services without traditional intermediaries',
            'Built on blockchain networks using smart contracts',
            'Open-source, permissionless, and transparent',
            'Accessible to anyone with internet connection'
          ]
        },
        {
          title: 'Automated Market Makers (AMMs)',
          content: `AMMs are a core component of DeFi that enable decentralized trading without order books. Instead of matching buyers and sellers, AMMs use mathematical formulas to determine asset prices based on the ratio of tokens in liquidity pools. Popular AMM protocols include Uniswap, SushiSwap, and PancakeSwap. These protocols allow users to trade tokens, provide liquidity, and earn fees from trading activity.`,
          keyPoints: [
            'Enable decentralized trading without order books',
            'Use mathematical formulas for price discovery',
            'Liquidity pools determine asset prices',
            'Users can earn fees by providing liquidity'
          ]
        },
        {
          title: 'Liquidity Provision and Impermanent Loss',
          content: `Liquidity providers deposit pairs of tokens into AMM pools to enable trading and earn fees. However, they face a risk called impermanent loss, which occurs when the price ratio of deposited tokens changes. This happens because AMMs automatically rebalance pools to maintain price ratios, potentially resulting in less value than simply holding the tokens separately. Understanding this risk is crucial for anyone considering liquidity provision.`,
          keyPoints: [
            'Liquidity providers earn fees from trading activity',
            'Impermanent loss occurs when token price ratios change',
            'AMMs automatically rebalance pools',
            'Risk management is essential for liquidity providers'
          ]
        },
        {
          title: 'Yield Farming and Governance',
          content: `Yield farming involves providing liquidity or staking tokens in DeFi protocols to earn rewards, often in the form of additional tokens. Many DeFi protocols distribute governance tokens to users, giving them voting rights over protocol decisions. This creates a decentralized governance model where token holders can influence protocol upgrades, parameter changes, and treasury management.`,
          keyPoints: [
            'Earn rewards by providing liquidity or staking',
            'Governance tokens provide voting rights',
            'Decentralized decision-making process',
            'Community-driven protocol development'
          ]
        },
        {
          title: 'DeFi Risks and Considerations',
          content: `While DeFi offers exciting opportunities, it also comes with significant risks. Smart contract bugs can lead to loss of funds, impermanent loss affects liquidity providers, and regulatory uncertainty creates additional challenges. Users should thoroughly research protocols, understand the risks, and never invest more than they can afford to lose. Diversification and risk management are key to successful DeFi participation.`,
          keyPoints: [
            'Smart contract vulnerabilities pose risks',
            'Impermanent loss affects liquidity providers',
            'Regulatory uncertainty remains a concern',
            'Risk management and diversification are essential'
          ]
        }
      ],
      conclusion: `DeFi represents a paradigm shift in financial services, offering unprecedented access to financial products and services. While the ecosystem continues to evolve and mature, it's important for users to understand both the opportunities and risks involved. As DeFi protocols become more sophisticated and secure, they may play an increasingly important role in the global financial system.`,
      relatedTopics: [
        'Automated Market Makers',
        'Liquidity Provision',
        'Yield Farming',
        'Decentralized Governance',
        'Smart Contract Security'
      ]
    },
    quizAnswers: [
      {
        questionId: 'defi_1',
        answer: 'Automated Market Maker',
        explanation: 'AMMs use mathematical formulas to price assets and enable decentralized trading without order books.'
      },
      {
        questionId: 'defi_2',
        answer: 'Temporary price volatility loss',
        explanation: 'Impermanent loss occurs when the price ratio of deposited tokens changes, resulting in less value than holding tokens separately.'
      },
      {
        questionId: 'defi_3',
        answer: 'Peer-to-peer token swapping',
        explanation: 'DEXs facilitate direct peer-to-peer cryptocurrency trading without intermediaries or custody of user funds.'
      },
      {
        questionId: 'defi_4',
        answer: 'Total Value Locked',
        explanation: 'TVL measures the total amount of cryptocurrency deposited in DeFi protocols and represents their adoption and trust.'
      },
      {
        questionId: 'defi_5',
        answer: 'Earning rewards by providing liquidity',
        explanation: 'Yield farming involves providing liquidity to DeFi protocols in exchange for token rewards, fees, or other incentives.'
      },
      {
        questionId: 'defi_6',
        answer: 'Community governance',
        explanation: 'DAOs enable decentralized governance where token holders vote on protocol changes, treasury management, and other important decisions.'
      },
      {
        questionId: 'defi_7',
        answer: 'A loan that must be repaid in the same transaction',
        explanation: 'Flash loans are uncollateralized loans that must be borrowed and repaid within a single transaction, enabling complex arbitrage strategies.'
      },
      {
        questionId: 'defi_8',
        answer: 'Annual Percentage Yield',
        explanation: 'APY represents the real rate of return earned on an investment, taking into account compound interest.'
      },
      {
        questionId: 'defi_9',
        answer: 'All of the above',
        explanation: 'DeFi liquidity providers face multiple risks including smart contract vulnerabilities, impermanent loss, and regulatory uncertainty.'
      },
      {
        questionId: 'defi_10',
        answer: 'To vote on protocol changes',
        explanation: 'Governance tokens give holders the right to vote on protocol upgrades, parameter changes, and treasury management decisions.'
      }
    ]
  },
  nft: {
    id: 'nft_comprehensive_guide',
    category: 'nft',
    title: 'NFTs: The Complete Guide to Non-Fungible Tokens',
    subtitle: 'Everything about NFTs, from creation to trading and utility applications',
    readingTime: '13 min read',
    difficulty: 'intermediate',
    content: {
      introduction: `Non-Fungible Tokens (NFTs) have revolutionized the digital asset landscape, creating new possibilities for ownership, creativity, and value exchange in the digital world. Unlike cryptocurrencies, which are fungible and interchangeable, NFTs are unique digital assets that represent ownership of specific items, content, or experiences. From digital art to gaming assets, NFTs are reshaping how we think about digital ownership and value.`,
      sections: [
        {
          title: 'What are NFTs?',
          content: `NFTs are unique digital tokens that represent ownership of specific digital or physical assets. Each NFT has a unique identifier and cannot be replicated or exchanged on a one-to-one basis like cryptocurrencies. NFTs are built on blockchain technology, which ensures their authenticity, ownership history, and scarcity. They can represent anything from digital art and music to virtual real estate and in-game items.`,
          keyPoints: [
            'Unique digital tokens representing ownership',
            'Cannot be replicated or exchanged one-to-one',
            'Built on blockchain for authenticity and provenance',
            'Can represent any type of digital or physical asset'
          ]
        },
        {
          title: 'NFT Standards: ERC-721 and ERC-1155',
          content: `The most common NFT standards on Ethereum are ERC-721 and ERC-1155. ERC-721 is designed for unique, single NFTs where each token is completely distinct. ERC-1155 is a more flexible standard that can handle multiple token types in a single contract, including both fungible and non-fungible tokens. This makes ERC-1155 ideal for gaming applications where you might have both unique items and stackable resources.`,
          keyPoints: [
            'ERC-721: Standard for unique, single NFTs',
            'ERC-1155: Flexible standard for multiple token types',
            'ERC-1155 supports both fungible and non-fungible tokens',
            'Different standards suit different use cases'
          ]
        },
        {
          title: 'NFT Metadata and IPFS Storage',
          content: `NFT metadata contains information about the NFT such as name, description, image URL, and other attributes. This metadata is often stored on IPFS (InterPlanetary File System), a decentralized storage network that ensures the data remains accessible even if the original server goes offline. IPFS uses content addressing, meaning the same content will always have the same address, ensuring data integrity and permanence.`,
          keyPoints: [
            'Metadata describes NFT properties and content',
            'IPFS provides decentralized, permanent storage',
            'Content addressing ensures data integrity',
            'Metadata remains accessible even if servers go offline'
          ]
        },
        {
          title: 'NFT Use Cases and Applications',
          content: `NFTs have found applications across numerous industries. Digital art and collectibles were the first major use case, but NFTs are now used in gaming for in-game items and characters, in music for album releases and concert tickets, in real estate for property deeds, and in identity verification for credentials and certificates. Utility NFTs provide access to exclusive content, services, or experiences beyond just ownership.`,
          keyPoints: [
            'Digital art and collectibles',
            'Gaming items and characters',
            'Music, tickets, and experiences',
            'Real estate and identity verification',
            'Utility NFTs for access and membership'
          ]
        },
        {
          title: 'NFT Marketplaces and Trading',
          content: `NFT marketplaces are platforms where users can discover, buy, sell, and trade NFTs. Popular marketplaces include OpenSea, Rarible, and Foundation. These platforms provide liquidity and price discovery for the NFT ecosystem. NFT royalties are automatic payments to original creators each time their NFT is resold on secondary markets, providing ongoing revenue streams for artists and creators.`,
          keyPoints: [
            'Marketplaces enable NFT discovery and trading',
            'Provide liquidity and price discovery',
            'NFT royalties benefit original creators',
            'Secondary market trading creates ongoing value'
          ]
        }
      ],
      conclusion: `NFTs represent a fundamental shift in how we think about digital ownership and value. As the technology continues to evolve and mature, we can expect to see even more innovative use cases and applications. From art and gaming to identity and real estate, NFTs are creating new possibilities for creators, collectors, and users across various industries.`,
      relatedTopics: [
        'Digital Art and Collectibles',
        'Gaming NFTs',
        'IPFS and Decentralized Storage',
        'NFT Marketplaces',
        'Blockchain Standards'
      ]
    },
    quizAnswers: [
      {
        questionId: 'nft_1',
        answer: 'Non-Fungible Token',
        explanation: 'NFTs are unique digital assets that represent ownership of specific items or content on the blockchain.'
      },
      {
        questionId: 'nft_2',
        answer: 'Both ERC-721 and ERC-1155',
        explanation: 'Both ERC-721 (single NFTs) and ERC-1155 (multi-token standard) are widely used for creating NFTs with different capabilities.'
      },
      {
        questionId: 'nft_3',
        answer: 'Decentralized storage',
        explanation: 'IPFS provides decentralized, immutable storage for NFT metadata, ensuring it remains accessible even if original servers fail.'
      },
      {
        questionId: 'nft_4',
        answer: 'Access to exclusive content',
        explanation: 'Utility NFTs provide holders with access to exclusive content, services, or experiences beyond just ownership of digital assets.'
      },
      {
        questionId: 'nft_5',
        answer: 'Creator earnings from resales',
        explanation: 'NFT royalties are automatic payments to original creators each time their NFT is resold on secondary markets.'
      },
      {
        questionId: 'nft_6',
        answer: 'ERC-721 is for single NFTs, ERC-1155 is for multiple',
        explanation: 'ERC-721 is designed for unique, single NFTs while ERC-1155 supports multiple token types in a single contract.'
      },
      {
        questionId: 'nft_7',
        answer: 'To describe the NFT properties and content',
        explanation: 'NFT metadata contains information about the NFT such as name, description, image URL, and other attributes.'
      },
      {
        questionId: 'nft_8',
        answer: 'In-game items and characters',
        explanation: 'Gaming NFTs often represent in-game items, characters, weapons, or land that players can own, trade, and use.'
      },
      {
        questionId: 'nft_9',
        answer: 'Decentralized and permanent storage',
        explanation: 'IPFS provides decentralized, content-addressed storage that ensures NFT images remain accessible even if the original server goes offline.'
      },
      {
        questionId: 'nft_10',
        answer: 'To buy, sell, and trade NFTs',
        explanation: 'NFT marketplaces are platforms where users can discover, buy, sell, and trade NFTs, providing liquidity and price discovery.'
      }
    ]
  },
  zk: {
    id: 'zk_comprehensive_guide',
    category: 'zk',
    title: 'Zero-Knowledge Proofs: The Future of Privacy and Scalability',
    subtitle: 'Understanding zk-SNARKs, zk-STARKs, and their applications in blockchain',
    readingTime: '14 min read',
    difficulty: 'advanced',
    content: {
      introduction: `Zero-Knowledge Proofs (ZKPs) represent one of the most powerful cryptographic innovations in blockchain technology, enabling privacy-preserving transactions and scalable solutions without compromising security. These cryptographic protocols allow one party to prove knowledge of information without revealing the information itself, opening up new possibilities for privacy, scalability, and verification in decentralized systems.`,
      sections: [
        {
          title: 'What are Zero-Knowledge Proofs?',
          content: `Zero-Knowledge Proofs are cryptographic protocols that enable one party (the prover) to convince another party (the verifier) that they know a specific piece of information without revealing what that information is. The three key properties of ZKPs are completeness (if the statement is true, the verifier will be convinced), soundness (if the statement is false, the verifier will reject it), and zero-knowledge (the verifier learns nothing beyond the fact that the statement is true).`,
          keyPoints: [
            'Prove knowledge without revealing information',
            'Three key properties: completeness, soundness, zero-knowledge',
            'Enable privacy-preserving verification',
            'Foundation for many blockchain innovations'
          ]
        },
        {
          title: 'zk-SNARKs: Succinct Non-Interactive Arguments',
          content: `zk-SNARKs (Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge) are a type of zero-knowledge proof that produces small, fast-to-verify proofs. The "succinct" property means the proof size is small regardless of the complexity of the original computation. The "non-interactive" property means the prover and verifier don't need to communicate back and forth. However, zk-SNARKs require a trusted setup ceremony to generate initial parameters.`,
          keyPoints: [
            'Small proof sizes regardless of computation complexity',
            'Non-interactive verification process',
            'Fast verification times',
            'Require trusted setup ceremony'
          ]
        },
        {
          title: 'zk-STARKs: Scalable Transparent Arguments',
          content: `zk-STARKs (Zero-Knowledge Scalable Transparent Arguments of Knowledge) are another type of zero-knowledge proof that offers different trade-offs compared to zk-SNARKs. The key advantage of zk-STARKs is that they don't require a trusted setup, making them more transparent and secure. However, they typically produce larger proof sizes than zk-SNARKs. STARKs are particularly useful in scenarios where transparency and avoiding trusted setups are priorities.`,
          keyPoints: [
            'No trusted setup required',
            'More transparent and secure',
            'Larger proof sizes than zk-SNARKs',
            'Better for transparency-critical applications'
          ]
        },
        {
          title: 'zk-Rollups: Scaling Blockchain with Zero-Knowledge',
          content: `zk-Rollups are Layer 2 scaling solutions that use zero-knowledge proofs to bundle many transactions into a single proof that can be verified on the main blockchain. This approach significantly reduces the computational load on the main chain while maintaining security through cryptographic verification. Popular zk-Rollup implementations include zkSync, StarkNet, and Polygon zkEVM, each offering different trade-offs in terms of compatibility, performance, and features.`,
          keyPoints: [
            'Bundle many transactions into single proofs',
            'Reduce main chain computational load',
            'Maintain security through cryptographic verification',
            'Enable high-throughput, low-cost transactions'
          ]
        },
        {
          title: 'Applications and Use Cases',
          content: `Zero-knowledge proofs have numerous applications beyond blockchain scaling. They're used for privacy-preserving transactions, identity verification without revealing personal information, confidential voting systems, and proving compliance without exposing sensitive data. In the context of blockchain, ZKPs enable private transactions, scalable rollups, and verifiable computation without revealing the underlying data or computation details.`,
          keyPoints: [
            'Privacy-preserving transactions',
            'Identity verification without data exposure',
            'Confidential voting and compliance',
            'Verifiable computation and data integrity'
          ]
        }
      ],
      conclusion: `Zero-Knowledge Proofs represent a fundamental advancement in cryptography that's enabling new possibilities for privacy, scalability, and verification in blockchain systems. As the technology continues to mature and become more efficient, we can expect to see even more innovative applications and use cases. From private transactions to scalable rollups, ZKPs are playing a crucial role in the evolution of blockchain technology.`,
      relatedTopics: [
        'Cryptographic Proofs',
        'Blockchain Scaling',
        'Privacy Technology',
        'Layer 2 Solutions',
        'Verifiable Computation'
      ]
    },
    quizAnswers: [
      {
        questionId: 'zk_1',
        answer: 'Zero Knowledge',
        explanation: 'Zero-Knowledge proofs allow one party to prove knowledge of information without revealing the information itself.'
      },
      {
        questionId: 'zk_2',
        answer: 'Privacy and succinctness',
        explanation: 'zk-SNARKs provide both privacy (hiding transaction details) and succinctness (very small proof sizes) for blockchain applications.'
      },
      {
        questionId: 'zk_3',
        answer: 'Small proof size',
        explanation: 'Succinct means the proof size is small and verification is fast, regardless of the complexity of the original computation.'
      },
      {
        questionId: 'zk_4',
        answer: 'Initial parameter generation',
        explanation: 'Trusted setup generates initial cryptographic parameters that must be created securely and the setup data must be destroyed.'
      },
      {
        questionId: 'zk_5',
        answer: 'Blockchain scaling',
        explanation: 'zk-rollups bundle many transactions into one, reducing blockchain congestion while maintaining security through zero-knowledge proofs.'
      },
      {
        questionId: 'zk_6',
        answer: 'Scalable Transparent ARgument of Knowledge',
        explanation: 'STARK stands for Scalable Transparent ARgument of Knowledge, a type of zero-knowledge proof that doesn\'t require a trusted setup.'
      },
      {
        questionId: 'zk_7',
        answer: 'Smaller proof sizes',
        explanation: 'zk-SNARKs typically produce smaller proof sizes compared to zk-STARKs, making them more efficient for certain applications.'
      },
      {
        questionId: 'zk_8',
        answer: 'Privacy-preserving transactions',
        explanation: 'Zero-knowledge proofs are commonly used to create privacy-preserving transactions where transaction details are hidden while maintaining verifiability.'
      },
      {
        questionId: 'zk_9',
        answer: 'To generate public parameters',
        explanation: 'Trusted setup ceremonies generate the initial public parameters needed for zk-SNARKs, and the setup data must be destroyed to maintain security.'
      },
      {
        questionId: 'zk_10',
        answer: 'Privacy preservation',
        explanation: 'Zero-knowledge proofs allow users to prove they have certain credentials or attributes without revealing the actual credential details, preserving privacy.'
      }
    ]
  }
};

// Helper function to get educational article for a category
export function getEducationalArticle(category: Category): EducationalArticle {
  return EDUCATIONAL_ARTICLES[category];
}

// Helper function to check if user should be recommended an article
export function shouldRecommendArticle(correctAnswers: number, totalQuestions: number): boolean {
  return correctAnswers < 6 && totalQuestions >= 10;
}
