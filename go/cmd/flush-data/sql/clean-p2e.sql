-- P2E
DELETE FROM p2e_daily_rewards WHERE network_id = '<networkID>';
DELETE FROM p2e_total_claimeds WHERE network_id = '<networkID>';
DELETE FROM p2e_leaderboards WHERE network_id = '<networkID>';
DELETE FROM p2e_squad_stakings WHERE network_id = '<networkID>';
-- Cursor
DELETE FROM cursors WHERE network = '<networkID>' AND indexer_mode='<indexerMode>';
DELETE FROM apps WHERE network_id = '<networkID>' AND indexer_mode='<indexerMode>';
