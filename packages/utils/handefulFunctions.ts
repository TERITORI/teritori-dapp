// Returns your given number (string or number), but with comma as a thousand separator (string)
export const numberWithThousandsSeparator = (yourBigNumber): string => {
	if(typeof yourBigNumber === "number") {
				return yourBigNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
		if(typeof yourBigNumber === "string") {
				return yourBigNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
}

export const thousandSeparatedToNumber = (str):string => str.replaceAll(',', '')