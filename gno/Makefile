KEY = mykey2
BASE = teritori
REMOTE = https://rpc.gno.land:443
CHAIN_ID = portal-loop

.PHONY: add_social_feeds_realm add_utf16_pkg add_ujson_pkg add_flags_index_pkg add_dao_interfaces_pkg add_social_feed all

add_social_feeds_realm:
	gnokey maketx addpkg \
		-deposit="1ugnot" \
		-gas-fee="1ugnot" \
		-gas-wanted="50000000" \
		-broadcast="true" \
		-chainid="${CHAIN_ID}" \
		-remote="${REMOTE}" \
		-pkgdir="./r/social_feeds" \
		-pkgpath="gno.land/r/demo/${BASE}/social_feeds" \
		${KEY}

add_social_feed:
	gnokey maketx call \
		-pkgpath "gno.land/r/demo/${BASE}/social_feeds" \
		-func="CreateFeed" \
		-gas-fee="1000000ugnot" \
		-gas-wanted="3000000" \
		-remote="${REMOTE}" \
		-chainid="${CHAIN_ID}" \
		-broadcast \
		-args "teritori" \
		${KEY}

add_utf16_pkg:
	gnokey maketx addpkg \
		-deposit="1ugnot" \
		-gas-fee="1ugnot" \
		-gas-wanted="50000000" \
		-broadcast="true" \
		-chainid="${CHAIN_ID}" \
		-remote="${REMOTE}" \
		-pkgdir="./p/utf16" \
		-pkgpath="gno.land/p/demo/${BASE}/utf16" \
		${KEY}

add_ujson_pkg: 
	gnokey maketx addpkg \
		-deposit="1ugnot" \
		-gas-fee="1ugnot" \
		-gas-wanted="50000000" \
		-broadcast="true" \
		-chainid="${CHAIN_ID}" \
		-remote="${REMOTE}" \
		-pkgdir="./p/ujson" \
		-pkgpath="gno.land/p/demo/${BASE}/ujson" \
		${KEY}

add_flags_index_pkg:
	gnokey maketx addpkg \
		-deposit="1ugnot" \
		-gas-fee="1ugnot" \
		-gas-wanted="50000000" \
		-broadcast="true" \
		-chainid="${CHAIN_ID}" \
		-remote="${REMOTE}" \
		-pkgdir="./p/flags_index" \
		-pkgpath="gno.land/p/demo/${BASE}/flags_index" \
		${KEY}

add_dao_interfaces_pkg:
	gnokey maketx addpkg \
		-deposit="1ugnot" \
		-gas-fee="1ugnot" \
		-gas-wanted="50000000" \
		-broadcast="true" \
		-chainid="${CHAIN_ID}" \
		-remote="${REMOTE}" \
		-pkgdir="./p/dao_interfaces" \
		-pkgpath="gno.land/p/demo/${BASE}/dao_interfaces" \
		${KEY}

all: add_utf16_pkg add_ujson_pkg add_flags_index_pkg add_dao_interfaces_pkg add_social_feeds_realm add_social_feed
