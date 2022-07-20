//TODO: Ugly, have to work on this

interface NameMetadata {
		label: string
		displayedLabel: string
		value: string|null|undefined
}

export const dataTest = [
		{label: "name", displayedLabel: "Name", value: "T"},
		{label: "publicName", displayedLabel: "Public name", value: "Test.teritori"},
		{label: "imageUrl", displayedLabel: "Image URL", value: "https://example.com/assets/logo/svg/dfbgsdjgbdoigsdg/jhgoieugezignegpoe/feiehngi"},
]

export const defaultNameData = [
		<NameMetadata>{label: "name", displayedLabel: "Name", value: undefined},
		<NameMetadata>{label: "email", displayedLabel: "Email", value: undefined},
		<NameMetadata>{label: "publicName", displayedLabel: "Public name", value: undefined},
		<NameMetadata>{label: "publicBio", displayedLabel: "Public bio", value: undefined},
		<NameMetadata>{label: "imageUrl", displayedLabel: "Image URL", value: undefined},
		<NameMetadata>{label: "website", displayedLabel: "Website", value: undefined},
		<NameMetadata>{label: "twitter", displayedLabel: "Twitter", value: undefined},
		<NameMetadata>{label: "discord", displayedLabel: "Discord", value: undefined},
		<NameMetadata>{label: "telegramUsername", displayedLabel: "Telegram username", value: undefined},
		<NameMetadata>{label: "keybaseIo", displayedLabel: "keybase.io", value: undefined},
		<NameMetadata>{label: "validatorOperatorAddress", displayedLabel: "Validator operator address", value: undefined},
]