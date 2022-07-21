export const numberWithThousandsSeparator = (yourBigNumber) => {
	if(typeof yourBigNumber === "number") {
				return yourBigNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
		if(typeof yourBigNumber === "string") {
				return yourBigNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
}

export const thousandSeparatedToNumber = str => str.replaceAll(',', '')