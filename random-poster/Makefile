KEY = MyKey
BASE = teritori
REMOTE = http://127.0.0.1:26657
CHAIN_ID = dev



add_post:
	echo CHANGE_FOR_YOUR_PASSWORD | gnokey maketx call \
		-pkgpath "gno.land/r/${BASE}/social_feeds" \
		-func="CreatePost" \
		-gas-fee="1000000ugnot" \
		-gas-wanted="3000000" \
		-remote="${REMOTE}" \
		-chainid="${CHAIN_ID}" \
		-broadcast \
		--insecure-password-stdin \
		-args 1 \
		-args 0 \
		-args 0 \
		-args "$(metadata)" \
		${KEY} 

all: add_utf16_pkg add_ujson_pkg add_flags_index_pkg add_dao_interfaces_pkg add_social_feeds_realm add_social_feed
