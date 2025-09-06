// Browser-compatible crypto functions

/**
 * Synchronous hash function for compatibility
 */
function hashSync(data: string): string {
  // Simple hash function for demo purposes
  // In production, you might want to use a more robust solution
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

export interface MerkleLeaf {
  address: string;
  amount: string;
  season: number;
}

export interface MerkleProof {
  leaf: MerkleLeaf;
  proof: string[];
  root: string;
}

/**
 * Simple Merkle Tree implementation for reward distribution
 */
export class MerkleTree {
  private leaves: string[] = [];
  private tree: string[][] = [];

  constructor(leaves: MerkleLeaf[]) {
    this.leaves = leaves.map(leaf => this.hashLeaf(leaf));
    this.buildTree();
  }

  /**
   * Hash a single leaf
   */
  private hashLeaf(leaf: MerkleLeaf): string {
    const data = `${leaf.address}:${leaf.amount}:${leaf.season}`;
    return hashSync(data);
  }

  /**
   * Hash two nodes together
   */
  private hashNodes(left: string, right: string): string {
    return hashSync(left + right);
  }

  /**
   * Build the Merkle tree
   */
  private buildTree(): void {
    if (this.leaves.length === 0) {
      this.tree = [];
      return;
    }

    // Start with leaves
    this.tree = [this.leaves];

    // Build tree level by level
    let currentLevel = this.leaves;
    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];
      
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
        nextLevel.push(this.hashNodes(left, right));
      }
      
      this.tree.push(nextLevel);
      currentLevel = nextLevel;
    }
  }

  /**
   * Get the Merkle root
   */
  getRoot(): string {
    if (this.tree.length === 0) {
      return '';
    }
    return this.tree[this.tree.length - 1][0];
  }

  /**
   * Generate proof for a specific leaf
   */
  getProof(leaf: MerkleLeaf): string[] {
    const leafHash = this.hashLeaf(leaf);
    const leafIndex = this.leaves.indexOf(leafHash);
    
    if (leafIndex === -1) {
      throw new Error('Leaf not found in tree');
    }

    const proof: string[] = [];
    let currentIndex = leafIndex;

    for (let level = 0; level < this.tree.length - 1; level++) {
      const levelNodes = this.tree[level];
      const siblingIndex = currentIndex % 2 === 0 ? currentIndex + 1 : currentIndex - 1;
      
      if (siblingIndex < levelNodes.length) {
        proof.push(levelNodes[siblingIndex]);
      }
      
      currentIndex = Math.floor(currentIndex / 2);
    }

    return proof;
  }

  /**
   * Verify a Merkle proof
   */
  static verifyProof(leaf: MerkleLeaf, proof: string[], root: string): boolean {
    const tree = new MerkleTree([leaf]);
    const leafHash = tree.hashLeaf(leaf);
    
    let currentHash = leafHash;
    
    for (const proofElement of proof) {
      // Determine if proof element is left or right sibling
      const left = currentHash < proofElement ? currentHash : proofElement;
      const right = currentHash < proofElement ? proofElement : currentHash;
      currentHash = tree.hashNodes(left, right);
    }
    
    return currentHash === root;
  }
}

/**
 * Generate Merkle tree for season rewards
 */
export function generateSeasonMerkleTree(
  rewards: MerkleLeaf[]
): { tree: MerkleTree; root: string; proofs: Map<string, MerkleProof> } {
  const tree = new MerkleTree(rewards);
  const root = tree.getRoot();
  const proofs = new Map<string, MerkleProof>();

  // Generate proofs for all leaves
  for (const leaf of rewards) {
    const proof = tree.getProof(leaf);
    proofs.set(leaf.address, {
      leaf,
      proof,
      root,
    });
  }

  return { tree, root, proofs };
}

/**
 * Create sample rewards data for testing
 */
export function createSampleRewards(season: number): MerkleLeaf[] {
  const sampleAddresses = [
    '0x1234567890abcdef1234567890abcdef12345678',
    '0xabcdef1234567890abcdef1234567890abcdef12',
    '0x567890abcdef1234567890abcdef1234567890ab',
    '0x90abcdef1234567890abcdef1234567890abcdef',
  ];

  return sampleAddresses.map((address, index) => ({
    address,
    amount: (1000 + index * 500).toString(), // Different amounts
    season,
  }));
}
