package notablecontribution

import (
	"bufio"
	"bytes"
)

type verificationTask struct {
  user User
  notablecontribution NotableContribution
}

// MarshalJSON marshals the task contents to JSON.
func (t *verificationTask) MarshalJSON() ([]byte, error) {
	buf := new(bytes.Buffer)
	w := bufio.NewWriter(buf)

	w.Write(
		[]byte(`{"user":` + t.user.JSON() + `,"notablecontribution":` + t.notablecontribution.JSON() + `}`),
	)

	w.Flush()
	return buf.Bytes(), nil
}

func (t *verificationTask) ID() string {
  return t.user.ID + ":" + string(t.user.Type) + ":" + t.notablecontribution.ID + ":" + string(t.notablecontribution.Type)
}
