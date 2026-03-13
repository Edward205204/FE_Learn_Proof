import type { HomeCourseCard } from '@/schemas/course.schema'

const BASE: Omit<
  HomeCourseCard,
  | 'id'
  | 'title'
  | 'slug'
  | 'thumbnail'
  | 'price'
  | 'originalPrice'
  | 'shortDesc'
  | 'createdAt'
  | 'category'
  | 'creator'
  | 'overallAnalytics'
> = {
  isFree: false,
  level: 'BEGINNER'
}

export const MOCK_TRENDING: HomeCourseCard[] = [
  {
    ...BASE,
    id: 't1',
    title: 'Nền tảng Blockchain 2024',
    slug: 'nen-tang-blockchain-2024',
    thumbnail: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&q=80',
    price: 49.99,
    originalPrice: 89.99,
    level: 'BEGINNER',
    shortDesc: 'Học Blockchain từ số 0 đến chuyên gia',
    createdAt: new Date('2024-11-01'),
    category: { name: 'Blockchain', slug: 'blockchain' },
    creator: { fullName: 'Lê Bình', avatar: null },
    overallAnalytics: { avgRating: 4.8, totalStudents: 3200, avgInterestScore: 9.2 }
  },
  {
    ...BASE,
    id: 't2',
    title: 'Khám phá Web3',
    slug: 'kham-pha-web3',
    thumbnail: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=400&q=80',
    price: 64.99,
    originalPrice: null,
    level: 'INTERMEDIATE',
    shortDesc: 'DApp, Smart Contract và DeFi từ A-Z',
    createdAt: new Date('2024-10-15'),
    category: { name: 'Web3', slug: 'web3' },
    creator: { fullName: 'Danbi Chen', avatar: null },
    overallAnalytics: { avgRating: 4.7, totalStudents: 2150, avgInterestScore: 8.9 }
  },
  {
    ...BASE,
    id: 't3',
    title: 'Hợp đồng nâng cao',
    slug: 'hop-dong-nang-cao',
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80',
    price: 89.0,
    originalPrice: 129.0,
    level: 'ADVANCED',
    shortDesc: 'Solidity nâng cao & Security Audit',
    createdAt: new Date('2024-09-20'),
    category: { name: 'Smart Contract', slug: 'smart-contract' },
    creator: { fullName: 'Nguyen Thanh', avatar: null },
    overallAnalytics: { avgRating: 4.9, totalStudents: 980, avgInterestScore: 9.5 }
  },
  {
    ...BASE,
    id: 't4',
    title: 'Giao dịch Crypto',
    slug: 'giao-dich-crypto',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80',
    price: 39.99,
    originalPrice: 69.99,
    level: 'BEGINNER',
    shortDesc: 'Chiến lược giao dịch tiền điện tử',
    createdAt: new Date('2024-12-01'),
    category: { name: 'Trading', slug: 'trading' },
    creator: { fullName: 'Mia Vu', avatar: null },
    overallAnalytics: { avgRating: 4.6, totalStudents: 5400, avgInterestScore: 8.7 }
  },
  {
    ...BASE,
    id: 't5',
    title: 'NFT & Metaverse',
    slug: 'nft-metaverse',
    thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80',
    price: 0,
    originalPrice: null,
    isFree: true,
    level: 'BEGINNER',
    shortDesc: 'Tạo & bán NFT trên OpenSea',
    createdAt: new Date('2024-08-10'),
    category: { name: 'NFT', slug: 'nft' },
    creator: { fullName: 'Alex Park', avatar: null },
    overallAnalytics: { avgRating: 4.4, totalStudents: 8900, avgInterestScore: 8.5 }
  }
]

export const MOCK_TOP_SELLING: HomeCourseCard[] = [
  {
    ...BASE,
    id: 's1',
    title: 'Giao dịch Bitcoin',
    slug: 'giao-dich-bitcoin',
    thumbnail: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&q=80',
    price: 59.99,
    originalPrice: 99.99,
    level: 'BEGINNER',
    shortDesc: 'Mua bán Bitcoin an toàn & hiệu quả',
    createdAt: new Date('2024-07-01'),
    category: { name: 'Bitcoin', slug: 'bitcoin' },
    creator: { fullName: 'Lê Lucas Chan', avatar: null },
    overallAnalytics: { avgRating: 4.7, totalStudents: 12000, avgInterestScore: 8.3 }
  },
  {
    ...BASE,
    id: 's2',
    title: 'Ethereum nâng cao',
    slug: 'ethereum-nang-cao',
    thumbnail: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=400&q=80',
    price: 74.99,
    originalPrice: null,
    level: 'INTERMEDIATE',
    shortDesc: 'EVM, Gas & Layer 2 Solutions',
    createdAt: new Date('2024-06-15'),
    category: { name: 'Ethereum', slug: 'ethereum' },
    creator: { fullName: 'Nguyen Group', avatar: null },
    overallAnalytics: { avgRating: 4.8, totalStudents: 9800, avgInterestScore: 8.9 }
  },
  {
    ...BASE,
    id: 's3',
    title: 'Newcomer Blockchain',
    slug: 'newcomer-blockchain',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80',
    price: 0,
    originalPrice: null,
    isFree: true,
    level: 'BEGINNER',
    shortDesc: 'Bắt đầu từ con số 0',
    createdAt: new Date('2024-12-10'),
    category: { name: 'Blockchain', slug: 'blockchain' },
    creator: { fullName: 'Lucas Tran', avatar: null },
    overallAnalytics: { avgRating: 4.5, totalStudents: 7600, avgInterestScore: 7.9 }
  },
  {
    ...BASE,
    id: 's4',
    title: 'Giải thuật DeFi',
    slug: 'giai-thuat-defi',
    thumbnail: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&q=80',
    price: 84.99,
    originalPrice: 129.99,
    level: 'ADVANCED',
    shortDesc: 'Yield Farming, Liquidity & AMM',
    createdAt: new Date('2024-05-20'),
    category: { name: 'DeFi', slug: 'defi' },
    creator: { fullName: 'Lucas Fintech', avatar: null },
    overallAnalytics: { avgRating: 4.9, totalStudents: 6200, avgInterestScore: 9.1 }
  },
  {
    ...BASE,
    id: 's5',
    title: 'Kỹ thuật Solidity',
    slug: 'ky-thuat-solidity',
    thumbnail: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&q=80',
    price: 69.0,
    originalPrice: 99.0,
    level: 'INTERMEDIATE',
    shortDesc: 'Lập trình Smart Contract chuyên sâu',
    createdAt: new Date('2024-04-01'),
    category: { name: 'Solidity', slug: 'solidity' },
    creator: { fullName: 'Dev Master', avatar: null },
    overallAnalytics: { avgRating: 4.6, totalStudents: 5100, avgInterestScore: 8.4 }
  }
]

export const MOCK_NEWEST: HomeCourseCard[] = [
  {
    ...BASE,
    id: 'n1',
    title: 'TON Blockchain 2025',
    slug: 'ton-blockchain-2025',
    thumbnail: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&q=80',
    price: 54.99,
    originalPrice: null,
    level: 'BEGINNER',
    shortDesc: 'Xây dựng ứng dụng trên TON Network',
    createdAt: new Date('2025-01-15'),
    category: { name: 'TON', slug: 'ton' },
    creator: { fullName: 'Kai Nguyen', avatar: null },
    overallAnalytics: { avgRating: 4.5, totalStudents: 320, avgInterestScore: 8.1 }
  },
  {
    ...BASE,
    id: 'n2',
    title: 'AI + Web3 Integration',
    slug: 'ai-web3-integration',
    thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80',
    price: 79.99,
    originalPrice: 119.99,
    level: 'ADVANCED',
    shortDesc: 'Kết hợp AI và công nghệ Blockchain',
    createdAt: new Date('2025-01-10'),
    category: { name: 'AI/Web3', slug: 'ai-web3' },
    creator: { fullName: 'Dr. Sarah AI', avatar: null },
    overallAnalytics: { avgRating: 4.7, totalStudents: 210, avgInterestScore: 9.0 }
  },
  {
    ...BASE,
    id: 'n3',
    title: 'ZK Proof Căn bản',
    slug: 'zk-proof-can-ban',
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80',
    price: 0,
    originalPrice: null,
    isFree: true,
    level: 'INTERMEDIATE',
    shortDesc: 'Zero-Knowledge Proof từ đầu',
    createdAt: new Date('2025-01-05'),
    category: { name: 'Cryptography', slug: 'cryptography' },
    creator: { fullName: 'ZK Labs', avatar: null },
    overallAnalytics: { avgRating: 4.6, totalStudents: 180, avgInterestScore: 8.7 }
  },
  {
    ...BASE,
    id: 'n4',
    title: 'Multi-Chain Wallet Dev',
    slug: 'multi-chain-wallet-dev',
    thumbnail: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&q=80',
    price: 69.99,
    originalPrice: null,
    level: 'ADVANCED',
    shortDesc: 'Xây dựng ví đa chuỗi với React',
    createdAt: new Date('2024-12-28'),
    category: { name: 'Development', slug: 'development' },
    creator: { fullName: 'WalletDev', avatar: null },
    overallAnalytics: { avgRating: 4.8, totalStudents: 290, avgInterestScore: 8.9 }
  },
  {
    ...BASE,
    id: 'n5',
    title: 'DAO Governance',
    slug: 'dao-governance',
    thumbnail: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&q=80',
    price: 44.99,
    originalPrice: 64.99,
    level: 'INTERMEDIATE',
    shortDesc: 'Thiết kế & vận hành tổ chức DAO',
    createdAt: new Date('2024-12-20'),
    category: { name: 'DAO', slug: 'dao' },
    creator: { fullName: 'Gov Expert', avatar: null },
    overallAnalytics: { avgRating: 4.4, totalStudents: 150, avgInterestScore: 7.8 }
  }
]

export const MOCK_TOP_RATED: HomeCourseCard[] = [
  {
    ...BASE,
    id: 'r1',
    title: 'Hợp đồng nâng cao',
    slug: 'hop-dong-nang-cao',
    thumbnail: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&q=80',
    price: 89.0,
    originalPrice: 129.0,
    level: 'ADVANCED',
    shortDesc: 'Solidity Security & Gas Optimization',
    createdAt: new Date('2024-05-01'),
    category: { name: 'Smart Contract', slug: 'smart-contract' },
    creator: { fullName: 'Nguyen Thanh', avatar: null },
    overallAnalytics: { avgRating: 4.98, totalStudents: 1200, avgInterestScore: 9.5 }
  },
  {
    ...BASE,
    id: 'r2',
    title: 'DeFi Mastery',
    slug: 'defi-mastery',
    thumbnail: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=400&q=80',
    price: 94.99,
    originalPrice: null,
    level: 'ADVANCED',
    shortDesc: 'Chiến lược DeFi cho chuyên gia',
    createdAt: new Date('2024-03-01'),
    category: { name: 'DeFi', slug: 'defi' },
    creator: { fullName: 'DeFi Pro', avatar: null },
    overallAnalytics: { avgRating: 4.95, totalStudents: 3400, avgInterestScore: 9.3 }
  },
  {
    ...BASE,
    id: 'r3',
    title: 'Ethereum nâng cao',
    slug: 'ethereum-nang-cao',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80',
    price: 74.99,
    originalPrice: null,
    level: 'INTERMEDIATE',
    shortDesc: 'EVM, Gas & Layer 2 Solutions',
    createdAt: new Date('2024-06-15'),
    category: { name: 'Ethereum', slug: 'ethereum' },
    creator: { fullName: 'Nguyen Group', avatar: null },
    overallAnalytics: { avgRating: 4.92, totalStudents: 9800, avgInterestScore: 8.9 }
  },
  {
    ...BASE,
    id: 'r4',
    title: 'Nền tảng Blockchain 2024',
    slug: 'nen-tang-blockchain-2024',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80',
    price: 49.99,
    originalPrice: 89.99,
    level: 'BEGINNER',
    shortDesc: 'Học Blockchain từ số 0 đến chuyên gia',
    createdAt: new Date('2024-11-01'),
    category: { name: 'Blockchain', slug: 'blockchain' },
    creator: { fullName: 'Lê Bình', avatar: null },
    overallAnalytics: { avgRating: 4.88, totalStudents: 3200, avgInterestScore: 9.2 }
  },
  {
    ...BASE,
    id: 'r5',
    title: 'Giao dịch Crypto Pro',
    slug: 'giao-dich-crypto-pro',
    thumbnail: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&q=80',
    price: 59.0,
    originalPrice: 89.0,
    level: 'INTERMEDIATE',
    shortDesc: 'Technical Analysis & Risk Management',
    createdAt: new Date('2024-09-01'),
    category: { name: 'Trading', slug: 'trading' },
    creator: { fullName: 'Trade Master', avatar: null },
    overallAnalytics: { avgRating: 4.85, totalStudents: 4100, avgInterestScore: 8.8 }
  }
]
