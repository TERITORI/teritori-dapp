import React, {createContext, useState} from 'react'
import PropTypes from 'prop-types'

export const NSBContext = createContext({
		name: "",
		setName: undefined,
		signedUserIsOwner: false,
		setSignedUserIsOwner: undefined
})

const NSBContextProvider = ({children}) => {
		// The entered name
		const [name, setName] = useState("")
		const [signedUserIsOwner, setSignedUserIsOwner] = useState(false)


		return (
				<NSBContext.Provider
						value={{
								name,
								setName,
								signedUserIsOwner,
								setSignedUserIsOwner
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