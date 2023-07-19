package main

import (
	_ "github.com/lib/pq"
	. "github.com/streamingfast/cli"
	"github.com/streamingfast/logging"
	"go.uber.org/zap"
)

var zlog, tracer = logging.RootLogger("teritori-sink", "github.com/TERITORI/sink/cmd/sink")

func init() {
	logging.InstantiateLoggers(logging.WithDefaultLevel(zap.InfoLevel))
}

func main() {
	Run("sink", "Teritori Sink Blockchain to Postgres",
		SinkSyncCmd,
		SinkCleanCmd,

		ConfigureViper("SINK"),
	)
}
