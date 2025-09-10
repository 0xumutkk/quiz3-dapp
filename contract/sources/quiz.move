module quiz3::quiz {
    use std::signer;
    use std::vector;
    use aptos_std::table::{Self, Table};
    use std::bcs;
    use std::hash;
    use quiz3::q3p_token;

    // Error codes
    const E_NOT_ADMIN: u64 = 1;
    const E_INVALID_PROOF: u64 = 2;
    const E_ALREADY_CLAIMED: u64 = 3;
    const E_INVALID_SEASON: u64 = 4;
    const E_INVALID_AMOUNT: u64 = 5;
    const E_INVALID_ROOT_LENGTH: u64 = 6;
    const E_ALREADY_INITIALIZED: u64 = 7;

    // Constants
    const ADMIN: address = @quiz3;
    const MERKLE_ROOT_LENGTH: u64 = 32; // SHA3-256 produces 32 bytes


    /// Resource to store merkle roots for each season
    struct SeasonMerkleRoots has key {
        roots: Table<u64, vector<u8>>, // season -> merkle_root
    }

    /// Resource to track claimed rewards per user per season
    struct UserClaims has key {
        claims: Table<u64, bool>, // season -> claimed
        claimed_seasons: vector<u64>, // list of seasons user has claimed
    }

    /// Initialize the quiz module
    fun init_module(deployer: &signer) {
        let deployer_addr = signer::address_of(deployer);
        assert!(deployer_addr == ADMIN, E_NOT_ADMIN);
        
        // Check if already initialized to prevent double initialization
        assert!(!exists<SeasonMerkleRoots>(ADMIN), E_ALREADY_INITIALIZED);
        
        move_to(deployer, SeasonMerkleRoots {
            roots: table::new<u64, vector<u8>>(),
        });
    }

    /// Set merkle root for a specific season (admin only)
    public entry fun set_season_merkle_root(
        admin: &signer,
        season: u64,
        merkle_root: vector<u8>
    ) acquires SeasonMerkleRoots {
        let admin_addr = signer::address_of(admin);
        assert!(admin_addr == ADMIN, E_NOT_ADMIN);
        
        // Validate merkle root length (should be 32 bytes for SHA3-256)
        assert!(vector::length(&merkle_root) == MERKLE_ROOT_LENGTH, E_INVALID_ROOT_LENGTH);
        
        let roots = borrow_global_mut<SeasonMerkleRoots>(ADMIN);
        
        // Use upsert for compatibility
        table::upsert(&mut roots.roots, season, merkle_root);
    }

    /// Get merkle root for a specific season
    #[view]
    public fun get_season_merkle_root(season: u64): vector<u8> acquires SeasonMerkleRoots {
        let roots = borrow_global<SeasonMerkleRoots>(ADMIN);
        if (table::contains(&roots.roots, season)) {
            *table::borrow(&roots.roots, season)
        } else {
            vector::empty<u8>()
        }
    }

    /// Claim rewards using merkle proof
    public entry fun claim_rewards(
        user: &signer,
        season: u64,
        amount: u64,
        merkle_proof: vector<vector<u8>>
    ) acquires SeasonMerkleRoots, UserClaims {
        let user_addr = signer::address_of(user);
        
        // Validate amount
        assert!(amount > 0, E_INVALID_AMOUNT);
        
        // Check if user has already claimed for this season
        if (!exists<UserClaims>(user_addr)) {
            move_to(user, UserClaims {
                claims: table::new<u64, bool>(),
                claimed_seasons: vector::empty<u64>(),
            });
        };
        
        let user_claims = borrow_global_mut<UserClaims>(user_addr);
        assert!(!table::contains(&user_claims.claims, season), E_ALREADY_CLAIMED);
        
        // Verify merkle proof
        assert!(verify_merkle_proof(user_addr, season, amount, merkle_proof), E_INVALID_PROOF);
        
        // Mark as claimed
        table::upsert(&mut user_claims.claims, season, true);
        vector::push_back(&mut user_claims.claimed_seasons, season);
        
        // Mint Q3P tokens to user
        q3p_token::claim_earned_points(user, amount);
    }

    /// Verify merkle proof on-chain with proper ordering
    fun verify_merkle_proof(
        user_addr: address,
        season: u64,
        amount: u64,
        merkle_proof: vector<vector<u8>>
    ): bool acquires SeasonMerkleRoots {
        // Get the stored merkle root for this season
        let roots = borrow_global<SeasonMerkleRoots>(ADMIN);
        assert!(table::contains(&roots.roots, season), E_INVALID_SEASON);
        let expected_root = *table::borrow(&roots.roots, season);
        
        // Create leaf hash by concatenating data
        let leaf_data = bcs::to_bytes(&user_addr);
        let amount_data = bcs::to_bytes(&amount);
        let season_data = bcs::to_bytes(&season);
        
        // Concatenate all data
        let leaf_data_mut = leaf_data;
        vector::append(&mut leaf_data_mut, amount_data);
        vector::append(&mut leaf_data_mut, season_data);
        let leaf_hash = hash::sha3_256(leaf_data_mut);
        
        // Verify proof by reconstructing the root using canonical ordering
        let current_hash = leaf_hash;
        let proof = merkle_proof;
        
        let proof_mut = proof;
        let current_hash_mut = current_hash;
        
        while (vector::length(&proof_mut) > 0) {
            let sibling = vector::pop_back(&mut proof_mut);
            
            // Use canonical ordering: always append in the same order for consistency
            let combined = vector::empty<u8>();
            let combined_mut = combined;
            vector::append(&mut combined_mut, current_hash_mut);
            vector::append(&mut combined_mut, sibling);
            
            current_hash_mut = hash::sha3_256(combined_mut);
        };
        
        // Check if the computed root matches the stored root
        current_hash_mut == expected_root
    }

    /// Check if user has claimed rewards for a specific season
    #[view]
    public fun has_user_claimed(user_addr: address, season: u64): bool acquires UserClaims {
        if (!exists<UserClaims>(user_addr)) {
            return false
        };
        
        let user_claims = borrow_global<UserClaims>(user_addr);
        if (table::contains(&user_claims.claims, season)) {
            *table::borrow(&user_claims.claims, season)
        } else {
            false
        }
    }

    /// Get user's claimed seasons list
    #[view]
    public fun get_user_claimed_seasons(user_addr: address): vector<u64> acquires UserClaims {
        if (!exists<UserClaims>(user_addr)) {
            return vector::empty<u64>()
        };
        
        let user_claims = borrow_global<UserClaims>(user_addr);
        user_claims.claimed_seasons
    }

    /// Get total number of seasons user has claimed
    #[view]
    public fun get_user_claim_count(user_addr: address): u64 acquires UserClaims {
        if (!exists<UserClaims>(user_addr)) {
            return 0
        };
        
        let user_claims = borrow_global<UserClaims>(user_addr);
        vector::length(&user_claims.claimed_seasons)
    }

    /// Emergency function to remove a season's merkle root (admin only)
    public entry fun remove_season_merkle_root(
        admin: &signer,
        season: u64
    ) acquires SeasonMerkleRoots {
        let admin_addr = signer::address_of(admin);
        assert!(admin_addr == ADMIN, E_NOT_ADMIN);
        
        let roots = borrow_global_mut<SeasonMerkleRoots>(ADMIN);
        if (table::contains(&roots.roots, season)) {
            table::remove(&mut roots.roots, season);
        };
    }

    /// Get all available seasons (admin only)
    #[view]
    public fun get_all_seasons(): vector<u64> {
        // Note: This is a simplified version. In practice, you might want to
        // maintain a separate list of seasons for efficient iteration
        vector::empty<u64>()
    }

    /// Check if a season exists
    #[view]
    public fun season_exists(season: u64): bool acquires SeasonMerkleRoots {
        let roots = borrow_global<SeasonMerkleRoots>(ADMIN);
        table::contains(&roots.roots, season)
    }
}