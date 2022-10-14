package quests

import (
	_ "embed"
	"encoding/json"

	"github.com/pkg/errors"
)

//go:embed quests.json
var questsJSONBytes []byte

type EmbeddedQuest struct {
	ID    string `json:"id"`
	Title string `json:"title"`
}

func Quests() ([]EmbeddedQuest, error) {
	var embeddedQuests []EmbeddedQuest
	if err := json.Unmarshal(questsJSONBytes, &embeddedQuests); err != nil {
		return nil, errors.Wrap(err, "failed to unmarshal quests")
	}
	return embeddedQuests, nil
}
