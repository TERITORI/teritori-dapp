import React, {createContext, useState} from 'react'
import PropTypes from 'prop-types'

export const NSBContext = createContext({
		name: "",
		setName: undefined,
		signedUserIsOwner: false,
		setSignedUserIsOwner: undefined,
		nsbError: {title: "", text: ""},
		setNsbError: undefined
})

const NSBContextProvider = ({children}) => {
		// The entered name
		const [name, setName] = useState("")
		const [signedUserIsOwner, setSignedUserIsOwner] = useState(false)
		const [nsbError, setNsbError] = useState({title: "", text: ""})

		return (
				<NSBContext.Provider
						value={{
								name,
								setName,
								signedUserIsOwner,
								setSignedUserIsOwner,
								nsbError,
								setNsbError
						}}
				>
						{children}
				</NSBContext.Provider>
		)
}

NSBContextProvider.propTypes = {
		children: PropTypes.oneOfType([
				PropTypes.arrayOf(PropTypes.node),
				PropTypes.node
		])
}

export default NSBContextProvider