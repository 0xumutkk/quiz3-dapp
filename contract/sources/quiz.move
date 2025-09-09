module quiz3::quiz {
    use std::signer;
    use std::vector;
    use std::table::{Self, Table};
    use std::bcs;
    use std::hash;
    use quiz3::q3p_token;

    // Error codes
    const E_NOT_ADMIN: u64 = 1;
    const E_INVALID_PROOF: u64 = 2;
    const E_ALREADY_CLAIMED: u64 = 3;
    const E_INVALID_SEASON: u64 = 4;
    const E_INVALID_AMOUNT: u64 = 5;

    // Admin address
    const ADMIN: address = @quiz3;

    /// Resource to store merkle roots for each season
    struct SeasonMerkleRoots has key {
        roots: Table<u64, vector<u8>>, // season -> merkle_root
    }

    /// Resource to track claimed rewards per user per season
    struct UserClaims has key {
        claims: Table<u64, bool>, // season -> claimed
    }

    /// Initialize the quiz module
    fun init_module(deployer: &signer) {
        assert!(signer::address_of(deployer) == ADMIN, E_NOT_ADMIN);
        
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
        assert!(signer::address_of(admin) == ADMIN, E_NOT_ADMIN);
        
        let roots = borrow_global_mut<SeasonMerkleRoots>(ADMIN);
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
        
        // Check if user has already claimed for this season
        if (!exists<UserClaims>(user_addr)) {
            move_to(user, UserClaims {
                claims: table::new<u64, bool>(),
            });
        };
        
        let user_claims = borrow_global_mut<UserClaims>(user_addr);
        assert!(!table::contains(&user_claims.claims, season), E_ALREADY_CLAIMED);
        
        // Verify merkle proof
        assert!(verify_merkle_proof(user_addr, season, amount, merkle_proof), E_INVALID_PROOF);
        
        // Mark as claimed
        table::upsert(&mut user_claims.claims, season, true);
        
        // Mint Q3P tokens to user
        q3p_token::claim_earned_points(user, amount);
    }

    /// Verify merkle proof on-chain
    fun verify_merkle_proof(
        user_addr: address,
        season: u64,
        amount: u64,
        merkle_proof: vector<vector<u8>>
    ): bool acquires SeasonMerkleRoots {
        // Get the stored merkle root for this season
        let roots = borrow_global<SeasonMerkleRoots>(ADMIN);
        assert!(table::contains(&roots.roots, season), E_INVALID_SEASON);
        let expected_root = table::borrow(&roots.roots, season);
        
        // Create leaf hash
        let leaf_data = bcs::to_bytes(&user_addr);
        vector::append(&mut leaf_data, bcs::to_bytes(&amount));
        vector::append(&mut leaf_data, bcs::to_bytes(&season));
        let leaf_hash = hash::sha3_256(leaf_data);
        
        // Verify proof by reconstructing the root
        let current_hash = leaf_hash;
        let proof_len = vector::length(&merkle_proof);
        
        let i = 0;
        while (i < proof_len) {
            let proof_element = *vector::borrow(&merkle_proof, i);
            
            // Hash the two nodes together (order doesn't matter for merkle trees)
            let combined = current_hash;
            vector::append(&mut combined, proof_element);
            current_hash = hash::sha3_256(combined);
            
            i = i + 1;
        };
        
        // Check if the computed root matches the stored root
        current_hash == *expected_root
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

    /// Get user's claim status for all seasons
    #[view]
    public fun get_user_claim_status(user_addr: address): vector<u64> acquires UserClaims {
        let claimed_seasons = vector::empty<u64>();
        
        if (!exists<UserClaims>(user_addr)) {
            return claimed_seasons
        };
        
        let user_claims = borrow_global<UserClaims>(user_addr);
        let claims = &user_claims.claims;
        
        // Note: This is a simplified version. In practice, you might want to
        // iterate through all possible seasons or maintain a separate list
        claimed_seasons
    }

    /// Emergency function to remove a season's merkle root (admin only)
    public entry fun remove_season_merkle_root(
        admin: &signer,
        season: u64
    ) acquires SeasonMerkleRoots {
        assert!(signer::address_of(admin) == ADMIN, E_NOT_ADMIN);
        
        let roots = borrow_global_mut<SeasonMerkleRoots>(ADMIN);
        if (table::contains(&roots.roots, season)) {
            table::remove(&mut roots.roots, season);
        };
    }
}
