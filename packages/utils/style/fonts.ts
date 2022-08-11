export const exoFontFamilyFromFontWeight = (weight: string) => {
		switch (weight) {
				case "500":
						return "Exo_500Medium";
				default:
						return "Exo_600SemiBold";
		}
};