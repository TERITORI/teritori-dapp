package multisig

import (
	"encoding/base64"
	"time"
)

func encodeTime(t time.Time) string {
	return t.UTC().Format(time.RFC3339)
}

func decodeTime(s string) (time.Time, error) {
	return time.Parse(time.RFC3339, s)
}

func encodeBytes(b []byte) string {
	return base64.RawURLEncoding.EncodeToString(b)
}

func decodeBytes(s string) ([]byte, error) {
	return base64.RawURLEncoding.DecodeString(s)
}
