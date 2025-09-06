module trivia_game::trivia_game {
    use std::error;
    use std::signer;
    use std::vector;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};
    use aptos_std::smart_vector::{Self, SmartVector};

    /// Errors
    const E_NOT_INITIALIZED: u64 = 1;
    const E_SEASON_NOT_FOUND: u64 = 2;
    const E_ALREADY_CLAIMED: u64 = 3;
    const E_INVALID_PROOF: u64 = 4;
    const E_UNAUTHORIZED: u64 = 5;
    const E_SEASON_NOT_READY_FOR_CLAIMS: u64 = 6;

    /// Season status
    const SEASON_ACTIVE: u8 = 1;
    const SEASON_ENDED: u8 = 2;
    const SEASON_CLAIMS_OPEN: u8 = 3;

    /// Season structure
    struct Season has key, store, copy, drop {
        id: u64,
        start_at: u64,
        end_at: u64,
        status: u8,
        merkle_root: vector<u8>,
    }

    /// User claim record
    struct ClaimRecord has store, drop {
        user: address,
        amount: u64,
        claimed: bool,
        claimed_tx: vector<u8>,
    }

    /// Game state resource
    struct GameState has key {
        admin: address,
        current_season_id: u64,
        seasons: Table<u64, Season>,
        claims: Table<u64, Table<address, ClaimRecord>>, // season_id -> user -> ClaimRecord
    }

    /// Events
    #[event]
    struct SeasonRootSet has drop, store {
        season_id: u64,
        merkle_root: vector<u8>,
        timestamp: u64,
    }

    #[event]
    struct RewardClaimed has drop, store {
        season_id: u64,
        user: address,
        amount: u64,
        timestamp: u64,
    }

    #[event]
    struct SeasonCreated has drop, store {
        season_id: u64,
        start_at: u64,
        end_at: u64,
        timestamp: u64,
    }

    /// Initialize the game module
    fun init_module(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        move_to(admin, GameState {
            admin: admin_addr,
            current_season_id: 0,
            seasons: table::new(),
            claims: table::new(),
        });
    }

    /// Create a new season (admin only)
    public entry fun create_season(
        admin: &signer,
        start_at: u64,
        end_at: u64,
    ) acquires GameState {
        let admin_addr = signer::address_of(admin);
        let game_state = borrow_global_mut<GameState>(@trivia_game);
        
        assert!(game_state.admin == admin_addr, error::permission_denied(E_UNAUTHORIZED));
        
        game_state.current_season_id = game_state.current_season_id + 1;
        let season_id = game_state.current_season_id;
        
        let season = Season {
            id: season_id,
            start_at,
            end_at,
            status: SEASON_ACTIVE,
            merkle_root: vector::empty(),
        };
        
        table::add(&mut game_state.seasons, season_id, season);
        table::add(&mut game_state.claims, season_id, table::new());
        
        event::emit(SeasonCreated {
            season_id,
            start_at,
            end_at,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Set merkle root for a season (admin only)
    public entry fun set_season_root(
        admin: &signer,
        season_id: u64,
        merkle_root: vector<u8>,
    ) acquires GameState {
        let admin_addr = signer::address_of(admin);
        let game_state = borrow_global_mut<GameState>(@trivia_game);
        
        assert!(game_state.admin == admin_addr, error::permission_denied(E_UNAUTHORIZED));
        assert!(table::contains(&game_state.seasons, season_id), error::not_found(E_SEASON_NOT_FOUND));
        
        let season = table::borrow_mut(&mut game_state.seasons, season_id);
        season.merkle_root = merkle_root;
        season.status = SEASON_CLAIMS_OPEN;
        
        event::emit(SeasonRootSet {
            season_id,
            merkle_root,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Claim rewards for a season
    public entry fun claim(
        user: &signer,
        season_id: u64,
        amount: u64,
        proof: vector<vector<u8>>,
    ) acquires GameState {
        let user_addr = signer::address_of(user);
        let game_state = borrow_global_mut<GameState>(@trivia_game);
        
        assert!(table::contains(&game_state.seasons, season_id), error::not_found(E_SEASON_NOT_FOUND));
        
        let season = table::borrow(&game_state.seasons, season_id);
        assert!(season.status == SEASON_CLAIMS_OPEN, error::invalid_state(E_SEASON_NOT_READY_FOR_CLAIMS));
        
        let claims_table = table::borrow_mut(&mut game_state.claims, season_id);
        
        // Check if already claimed
        if (table::contains(claims_table, user_addr)) {
            let claim_record = table::borrow(claims_table, user_addr);
            assert!(!claim_record.claimed, error::invalid_state(E_ALREADY_CLAIMED));
        };
        
        // Verify merkle proof (simplified - in production, implement full merkle proof verification)
        assert!(verify_merkle_proof(user_addr, amount, proof, season.merkle_root), error::invalid_argument(E_INVALID_PROOF));
        
        // Update claim record
        let claim_record = ClaimRecord {
            user: user_addr,
            amount,
            claimed: true,
            claimed_tx: vector::empty(), // Will be set by transaction hash
        };
        
        if (table::contains(claims_table, user_addr)) {
            *table::borrow_mut(claims_table, user_addr) = claim_record;
        } else {
            table::add(claims_table, user_addr, claim_record);
        };
        
        event::emit(RewardClaimed {
            season_id,
            user: user_addr,
            amount,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Simplified merkle proof verification (placeholder implementation)
    fun verify_merkle_proof(
        _user: address,
        _amount: u64,
        _proof: vector<vector<u8>>,
        _root: vector<u8>,
    ): bool {
        // TODO: Implement actual merkle proof verification
        // For now, return true for testing purposes
        true
    }

    // View functions

    /// Get current season info
    #[view]
    public fun get_current_season(): Season acquires GameState {
        let game_state = borrow_global<GameState>(@trivia_game);
        *table::borrow(&game_state.seasons, game_state.current_season_id)
    }

    /// Get season by ID
    #[view]
    public fun get_season(season_id: u64): Season acquires GameState {
        let game_state = borrow_global<GameState>(@trivia_game);
        assert!(table::contains(&game_state.seasons, season_id), error::not_found(E_SEASON_NOT_FOUND));
        *table::borrow(&game_state.seasons, season_id)
    }

    /// Check if user has claimed for a season
    #[view]
    public fun has_claimed(user: address, season_id: u64): bool acquires GameState {
        let game_state = borrow_global<GameState>(@trivia_game);
        if (!table::contains(&game_state.claims, season_id)) {
            return false
        };
        
        let claims_table = table::borrow(&game_state.claims, season_id);
        if (!table::contains(claims_table, user)) {
            return false
        };
        
        let claim_record = table::borrow(claims_table, user);
        claim_record.claimed
    }

    /// Get user's claim record for a season
    #[view]
    public fun get_user_claim(user: address, season_id: u64): ClaimRecord acquires GameState {
        let game_state = borrow_global<GameState>(@trivia_game);
        assert!(table::contains(&game_state.claims, season_id), error::not_found(E_SEASON_NOT_FOUND));
        
        let claims_table = table::borrow(&game_state.claims, season_id);
        *table::borrow(claims_table, user)
    }

    /// Get current season ID
    #[view]
    public fun get_current_season_id(): u64 acquires GameState {
        let game_state = borrow_global<GameState>(@trivia_game);
        game_state.current_season_id
    }
}
