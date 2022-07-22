// Query the name service
import {useEffect, useState} from "react"
import {getNonSigningClient} from "./cosmwasm"

// NSB : From a given name, returns if it exists through a queryContractSmart() with an unsigned cosmWasmClient
export const useCheckNameAvailability = (name) => {
		const [nameAvailable, setNameAvailable] = useState(false)
		const [nameError, setNameError] = useState(false)
		const [loading, setLoading] = useState(false)
		let cosmWasmClient = null

		useEffect(() => {
				const getToken = async () => {
						setLoading(true)

						const contract = process.env.PUBLIC_WHOAMI_ADDRESS as string
						// We just want to read, so we use a non-signing client
						cosmWasmClient = await getNonSigningClient()

						try {
								// If this query fails it means that the token does not exist.
								const token = await cosmWasmClient.queryContractSmart(contract, {
										nft_info: {
												token_id: name,
										},
								})
								return token.extension
						} catch (e) {
								// ---- If here, "cannot contract", so the token is considered as available
								return undefined
						}
				}

				getToken().then(tokenExtension => {
						// ------ Minted
						if(!tokenExtension) {
								setNameAvailable(true)
								setNameError(false)
						}
						// ------ Available
						else {
								setNameAvailable(false)
								setNameError(false)
						}
						setLoading(false)
				}).catch(e => {
						console.warn('ERROR getToken() : ', e)
						setLoading(false)
						setNameAvailable(false)
						setNameError(true)
				})
		}, [name])

		return {nameAvailable, nameError, loading}
}

