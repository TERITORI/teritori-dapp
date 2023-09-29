package multisig

import "time"

const clientMagic = "Login to Teritori Multisig Service"

func formatTime(t time.Time) string {
	return t.Format(time.RFC3339)
}

func parseTime(s string) (time.Time, error) {
	return time.Parse(time.RFC3339, s)
}
