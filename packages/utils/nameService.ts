// ========== (de)NS ==============

const densBaseUrl = "https://dens.vercel.app"

// Returns if the name is available
export const isNameAvailable = async (name): Promise<boolean> => {

		const requestInit: RequestInit =  {
				method: 'GET',
				headers: new Headers({
						'Content-Type':'application/json',
						'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
						'Access-Control-Allow-Origin':'*',
						'Access-Control-Allow-Methods':'GET, POST, PATCH, PUT, DELETE, OPTIONS'
				}),
				mode: 'cors',
				cache: 'default'
		}

				/*
				TODO: CORS issue !
				Access to fetch at 'https://dens.vercel.app/api/ids/f' from origin 'http://localhost:19006'
				has been blocked by CORS policy: Response to preflight request doesn't pass access control check: ' +
				'No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs,
				set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
		*/
		return fetch(densBaseUrl + "/api/ids/" + name, requestInit)
		.then(res => res.json())
		.then(data => {
				console.log("----------- res", data)
				return !data
		})
}
