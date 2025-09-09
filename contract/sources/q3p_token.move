module quiz3::q3p_token {
    use std::signer;
    use std::string::{Self};
    use aptos_framework::coin::{Self, MintCapability, BurnCapability, FreezeCapability};

    /// This is the type that we will use to manage the coin.
    struct Q3PToken {}

    const E_NOT_ADMIN: u64 = 1;

    /// A resource to hold the capabilities for the module admin.
    struct Capabilities has key {
        mint_cap: MintCapability<Q3PToken>,
        burn_cap: BurnCapability<Q3PToken>,
        freeze_cap: FreezeCapability<Q3PToken>,
    }

    /// The module initializer is called once when the module is published.
    /// It creates the metadata for the token and moves capabilities to the deployer.
    fun init_module(deployer: &signer) {
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<Q3PToken>(
            deployer,
            string::utf8(b"Quiz3 Point Token"),
            string::utf8(b"Q3P"),
            8, // decimals
            true, // monitor_supply is true
        );
        move_to(deployer, Capabilities { mint_cap, burn_cap, freeze_cap });
    }

    /// Mints new tokens for a user. Can only be called by the module deployer.
    public entry fun mint(admin: &signer, recipient: address, amount: u64) acquires Capabilities {
        assert!(signer::address_of(admin) == @quiz3, E_NOT_ADMIN);
        let caps = borrow_global<Capabilities>(@quiz3);
        let coins = coin::mint(amount, &caps.mint_cap);
        coin::deposit(recipient, coins);
    }

    /// Burns tokens from a user's account. The user must sign this transaction.
    public entry fun burn(user: &signer, amount: u64) acquires Capabilities {
        let caps = borrow_global<Capabilities>(@quiz3);
        coin::burn_from(signer::address_of(user), amount, &caps.burn_cap);
    }

    /// Allows a user to register for the coin, creating a CoinStore for Q3PToken.
    public entry fun register(account: &signer) {
        coin::register<Q3PToken>(account);
    }

    /// Allows a user to claim 100 Q3P tokens once (for demo purposes).
    /// Registers if needed and mints 100 tokens.
    public entry fun claim_points(user: &signer) acquires Capabilities {
        let user_addr = signer::address_of(user);
        if (!coin::is_account_registered<Q3PToken>(user_addr)) {
            coin::register<Q3PToken>(user);
        };
        let caps = borrow_global<Capabilities>(@quiz3);
        let coins = coin::mint(100, &caps.mint_cap);
        coin::deposit(user_addr, coins);
    }

    /// Allows a user to claim their earned Q3P tokens from quiz gameplay.
    /// Registers if needed and mints the specified amount of tokens.
    public entry fun claim_earned_points(user: &signer, amount: u64) acquires Capabilities {
        let user_addr = signer::address_of(user);
        if (!coin::is_account_registered<Q3PToken>(user_addr)) {
            coin::register<Q3PToken>(user);
        };
        let caps = borrow_global<Capabilities>(@quiz3);
        let coins = coin::mint(amount, &caps.mint_cap);
        coin::deposit(user_addr, coins);
    }

    #[view]
    public fun get_balance(owner: address): u64 {
        if (!coin::is_account_registered<Q3PToken>(owner)) {
            0
        } else {
            coin::balance<Q3PToken>(owner)
        }
    }
}
