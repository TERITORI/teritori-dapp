DELETE FROM teritori_collections WHERE network_id = '<networkID>';
DELETE FROM mints WHERE network_id = '<networkID>';
DELETE FROM trades WHERE network_id = '<networkID>';
DELETE FROM burns WHERE network_id = '<networkID>';
DELETE FROM listings WHERE network_id = '<networkID>';
DELETE FROM cancel_listings WHERE network_id = '<networkID>';
DELETE FROM transfer_nfts WHERE network_id = '<networkID>';
DELETE FROM send_nfts WHERE network_id = '<networkID>';
DELETE FROM update_nft_prices WHERE network_id = '<networkID>';
DELETE FROM activities WHERE network_id = '<networkID>';
DELETE FROM teritori_nfts WHERE network_id = '<networkID>';
DELETE FROM nfts WHERE network_id = '<networkID>';
DELETE FROM collections WHERE network_id = '<networkID>';
-- Feed
DELETE FROM posts WHERE network_id = '<networkID>';
-- DAO
DELETE FROM dao_members WHERE dao_network_id = '<networkID>';
DELETE FROM dao_proposals WHERE dao_network_id = '<networkID>';
DELETE FROM daos WHERE network_id = '<networkID>';
-- Cursor
DELETE FROM cursors WHERE network = '<networkID>' AND indexer_mode='<indexerMode>';
DELETE FROM apps WHERE network_id = '<networkID>' AND indexer_mode='<indexerMode>';
-- Quests
DELETE FROM quest_completions WHERE quest_network_id = '<networkID>';
DELETE FROM quests WHERE network_id = '<networkID>';
