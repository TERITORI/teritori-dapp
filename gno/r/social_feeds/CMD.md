gnokey maketx addpkg  \
  -deposit="1ugnot" \
  -gas-fee="1ugnot" \
  -gas-wanted="50000000" \
  -broadcast="true" \
  -remote="https://rpc.gno.land:443" \
  -chainid="portal-loop" \
  -pkgdir="." \
  -pkgpath="gno.land/p/teritori/base64" \
  mykey2

gnokey maketx call \
    -pkgpath "gno.land/r/teritori/social_feeds" \
    -func "CreateFeed" \
    -gas-fee 1000000ugnot \
    -gas-wanted 3000000 \
    -remote="https://rpc.gno.land:443" \
    -chainid="portal-loop" \
    -broadcast \
    -args "teritori" \
    mykey2

gnokey maketx call \
    -pkgpath "gno.land/r/teritori/social_feeds" \
    -func "CreatePost" \
    -gas-fee 1000000ugnot \
    -gas-wanted 2000000 \
    -remote="https://rpc.gno.land:443" \
    -chainid="portal-loop" \
    -broadcast \
    -args "1" \
    -args "0" \
    -args "2" \
    -args '{"gifs": [], "files": [], "title": "", "message": "Hello world 2 !", "hashtags": [], "mentions": [], "createdAt": "2023-08-03T01:39:45.522Z", "updatedAt": "2023-08-03T01:39:45.522Z"}' \
    mykey2 

gnokey maketx call \
    -pkgpath "gno.land/r/teritori/social_feeds" \
    -func "TipPost" \
    -gas-fee 1000000ugnot \
    -gas-wanted 3000000 \
    -send "1000ugnot" \
    -remote="https://rpc.gno.land:443" \
    -chainid="portal-loop" \
    -broadcast \
    -args "1" \
    -args "1" \
    mykey2

gnokey maketx call \
    -pkgpath "gno.land/r/teritori/social_feeds" \
    -func "HidePostForMe" \
    -gas-fee 1000000ugnot \
    -gas-wanted 3000000 \
    -send "" \
    -broadcast \
    -args "1" \
    -args "1" \
    mykey2

// Query posts
gnokey query vm/qeval --data 'gno.land/r/teritori/social_feeds
GetPosts(1, "", []uint64{}, 0, 10)'


