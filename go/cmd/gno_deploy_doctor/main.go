package main

import (
	"context"
	"flag"
	"fmt"

	"github.com/Khan/genqlient/graphql"
	"github.com/TERITORI/teritori-dapp/go/pkg/gnoindexerql"
	"github.com/davecgh/go-spew/spew"
)

type addPkgEntry struct {
	tx       *gnoindexerql.GetAddPackageTxsTransactionsTransaction
	msg      *gnoindexerql.GetAddPackageTxsTransactionsTransactionMessagesTransactionMessageValueMsgAddPackage
	msgIndex int
}

func main() {
	indexerURL := flag.String("indexer", "http://localhost:8546/graphql/query", "indexer grapqhl endpoint")
	flag.Parse()
	arg := flag.Arg(0)

	ctx := context.Background()
	gqlClient := graphql.NewClient(*indexerURL, nil)
	res, err := gnoindexerql.GetAddPackageTxs(ctx, gqlClient)
	if err != nil {
		panic(err)
	}

	byPath := map[string][]*addPkgEntry{}
	for _, vtx := range res.Transactions {
		tx := vtx
		for msgIndex, msg := range tx.Messages {
			switch val := msg.Value.(type) {
			case *gnoindexerql.GetAddPackageTxsTransactionsTransactionMessagesTransactionMessageValueMsgAddPackage:
				pkgPath := val.Package.Path
				byPath[pkgPath] = append(byPath[pkgPath], &addPkgEntry{
					tx:       &tx,
					msg:      val,
					msgIndex: msgIndex,
				})
			}
		}
	}

	if arg == "" {
		spew.Dump(byPath)
		return
	}

	slice := byPath[arg]
	if len(slice) == 0 {
		fmt.Println(arg, "not found")
		return
	}

	entry := slice[len(slice)-1]
	fmt.Println(entry.tx.Response.Log)
}
