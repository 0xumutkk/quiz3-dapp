module nft_mint::nft_mint {
    use std::string::{Self, String};
    use std::option::{Self, Option};
    use aptos_framework::object::{Self, Object};
    use aptos_framework::signer;
    use aptos_token_objects::token::{Self, Token};
    use aptos_token_objects::collection::{Self, Collection};

    // Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;

    // Structs
    struct QuizNFTCollection has key {
        collection: Object<Collection>,
        initialized: bool,
    }

    // Initialize the NFT collection
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        // Check if already initialized
        assert!(!exists<QuizNFTCollection>(admin_addr), E_ALREADY_INITIALIZED);
        
        // Create collection
        let collection = object::create_object_from_account(admin);
        let collection_builder = collection::create_fixed_collection(
            &collection,
            string::utf8(b"Quiz3 NFT Collection"),
            string::utf8(b"Educational NFTs earned through Quiz3 trivia game"),
            string::utf8(b"https://quiz3.aptos.com/collection"),
            option::none(),
            option::none(),
        );

        // Create the main collection object
        let quiz_collection = QuizNFTCollection {
            collection,
            initialized: true,
        };

        move_to(admin, quiz_collection);
    }

    // Mint NFT for user
    public entry fun mint_nft(
        admin: &signer,
        user: address,
        name: String,
        description: String,
        image_url: String,
        rarity: String,
        category: String,
    ) {
        let admin_addr = signer::address_of(admin);
        let quiz_collection = borrow_global<QuizNFTCollection>(admin_addr);
        
        // Check if initialized
        assert!(quiz_collection.initialized, E_NOT_INITIALIZED);

        // Create token
        let token = object::create_object_from_account(admin);
        let token_builder = token::create(
            &token,
            &quiz_collection.collection,
            name,
            description,
            option::some(image_url),
            option::some(string::utf8(b"Quiz3 NFT")),
        );

        // Transfer token to user
        object::transfer(admin, token, user);
    }

    // View functions
    public fun get_collection_address(admin_addr: address): address {
        let quiz_collection = borrow_global<QuizNFTCollection>(admin_addr);
        object::object_address(&quiz_collection.collection)
    }

    public fun is_initialized(admin_addr: address): bool {
        exists<QuizNFTCollection>(admin_addr)
    }
}