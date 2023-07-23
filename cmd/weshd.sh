cd ./go/cmd/weshd-app/
go env GOPATH/bin
CGO_CPPFLAGS="-Wno-error -Wno-nullability-completeness -Wno-expansion-to-defined -DHAVE_GETHOSTUUID=0"
gomobile bind -o ../../../ios/Frameworks/WeshFramework.xcframework -tags "fts5 sqlite sqlite_unlock_notify" -tags 'nowatchdog' -target ios -iosversion 13.0  
