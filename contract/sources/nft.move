module quiz3::quiz_nft {
    use std::signer;
    use std::string::{Self, String};
    use std::option;
    use std::vector;
    use std::bcs;
    use aptos_framework::object;
    use aptos_token_objects::collection;
    use aptos_token_objects::aptos_token;

    const COLLECTION_NAME: vector<u8> = b"Quiz3 Rewards";
    const COLLECTION_DESCRIPTION: vector<u8> = b"NFTs earned by mastering Aptos trivia in Quiz3.";
    const COLLECTION_URL: vector<u8> = b"https://quiz3-dapp.vercel.app/";
    
    const E_NOT_ADMIN: u64 = 1;

    fun init_module(deployer: &signer) {
        // Create the "Quiz3 Rewards" collection, owned by the deployer.
        collection::create_unlimited_collection(
            deployer,
            string::utf8(COLLECTION_DESCRIPTION),
            string::utf8(COLLECTION_NAME),
            option::none(), // No royalty.
            string::utf8(COLLECTION_URL),
        );
    }

    /// Mints a new NFT and transfers it to the user.
    /// This can only be called by the module admin (`@quiz3`).
    /// The admin is responsible for verifying off-chain that the user has met the requirements (e.g., burned Q3P tokens).
    public entry fun mint_nft(
        admin: &signer,
        user_address: address,
        nft_name: String,
        nft_description: String,
        nft_uri: String
    ) {
        assert!(signer::address_of(admin) == @quiz3, E_NOT_ADMIN);
        
        let admin_addr = signer::address_of(admin);

        // Step 1: Mint the NFT to the admin's account.
        aptos_token::mint(
            admin,
            string::utf8(COLLECTION_NAME),
            nft_description,
            nft_name,
            nft_uri,
            vector::empty<string::String>(),
            vector::empty<string::String>(),
            vector::empty<vector<u8>>(),
        );

        // Step 2: Create a unique seed for the token address using BCS serialization.
        let seed = bcs::to_bytes(&string::utf8(COLLECTION_NAME));
        vector::append(&mut seed, bcs::to_bytes(&nft_name));
        
        // Step 3: Derive the token's object address using 2 arguments.
        let token_address = object::create_object_address(
            &admin_addr,
            seed
        );

        // Step 4: Convert the address to an Object type and transfer it to the user.
        let token_object = object::address_to_object<aptos_token::AptosToken>(token_address);
        object::transfer(admin, token_object, user_address);
    }
}
