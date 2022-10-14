package indexerdb

type Quest struct {
	ID    string
	Title string
}

type QuestCompletion struct {
	QuestID string `gorm:"primaryKey"`
	UserID  string `gorm:"primaryKey"`

	Quest     *Quest
	Completed bool
}
