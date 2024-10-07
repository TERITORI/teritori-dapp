KEY = MyKey
BASE = teritori
REMOTE = http://127.0.0.1:26657
CHAIN_ID = dev

.PHONY: add_social_feeds_realm add_utf16_pkg add_ujson_pkg add_flags_index_pkg add_dao_interfaces_pkg add_social_feed all

add_gh_verify_realm:
	gnokey maketx addpkg \
		-deposit="1ugnot" \
		-gas-fee="1ugnot" \
		-gas-wanted="50000000" \
		-broadcast="true" \
		-chainid="${CHAIN_ID}" \
		-remote="${REMOTE}" \
		-pkgdir="./r/gnoland/ghverify" \
		-pkgpath="gno.land/r/${BASE}/ghverify" \
		${KEY}

request_verification:
	gnokey maketx call \
		-pkgpath "gno.land/r/${BASE}/ghverify" \
		-func="RequestVerification" \
		-gas-fee="1000000ugnot" \
		-gas-wanted="3000000" \
		-remote="${REMOTE}" \
		-chainid="${CHAIN_ID}" \
		-broadcast \
		-args "villaquiranm" \
		MyKey

check_current_feeds:
	gnokey query vm/qeval --data 'gno.land/r/${BASE}/ghverify.GnorkleEntrypoint("request")'
		-remote="${REMOTE}" \
		${KEY}

set_owner:
	gnokey maketx call \
		-pkgpath "gno.land/r/${BASE}/ghverify" \
		-func="SetOwner" \
		-gas-fee="1000000ugnot" \
		-gas-wanted="3000000" \
		-remote="${REMOTE}" \
		-chainid="${CHAIN_ID}" \
		-broadcast \
		-args "g1yr5sts6w9k2arsuk858lh6phegcfvg0y4d0pgf" \
		${KEY}

verify:
	gnokey maketx call \
		-pkgpath "gno.land/r/${BASE}/ghverify" \
		-func="GnorkleEntrypoint" \
		-gas-fee="1000000ugnot" \
		-gas-wanted="3000000" \
		-remote="${REMOTE}" \
		-chainid="${CHAIN_ID}" \
		-broadcast \
		-args "ingest,g1pwxuhltfqxcumjmuquuue6y3f2g3f2d0rcq52x,OK" \
		${KEY}
relay_verify:
	gnokey maketx call \
		-pkgpath "gno.land/r/${BASE}/ghverify" \
		-func="GnorkleEntrypoint" \
		-gas-fee="1000000ugnot" \
		-gas-wanted="3000000" \
		-remote="${REMOTE}" \
		-chainid="${CHAIN_ID}" \
		-broadcast \
		-args "relay,gpub1pgfj7ard9eg82cjtv4u4xetrwqer2dntxyfzxz3pqgfakcapzvuux7vug9vagyjmvj6k2w2xu723qnue69z9r7wlt9c6zeyxvt8,dd4b4012daddb14fe7587f4bbb5bef5f16d123032e5c6dc718528907c8f71ee267c1a051328d42991fe6f82cdba424efd3866251cf9411c8f38ebb1e144f10ce,ingest,g14vxq5e5pt5sev7rkz2ej438scmxtylnzv5vnkw,OK" \
		newkey

check:
	gnokey maketx call \
		-pkgpath "gno.land/r/${BASE}/ghverify" \
		-func="GnorkleEntrypoint" \
		-gas-fee="1000000ugnot" \
		-gas-wanted="3000000" \
		-remote="${REMOTE}" \
		-chainid="${CHAIN_ID}" \
		-broadcast \
		-args "request" \
		${KEY}

send:
	gnokey maketx send \
		-gas-fee="1000000ugnot" \
		-gas-wanted="3000000" \
		-remote="${REMOTE}" \
		-chainid="${CHAIN_ID}" \
		-send="100000ugnot" \
		-to "g1yr5sts6w9k2arsuk858lh6phegcfvg0y4d0pgf" \
		-broadcast \
		${KEY}

		