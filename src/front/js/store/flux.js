const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			fetchApartments: async (location) => {
				const response = await fetch(process.env.BACKEND_URL +`/api/apartments?location=${location}`);
				const data = await response.json();
				return data;
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},
		
		// ----------------- Added below here ---------------
		
		logOut: () => {
			sessionStorage.removeItem('token');
			setStore({ token: null });
		},

		getMessage: async () => {
			try {
				const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
				const data = await resp.json();
				setStore({ message: data.message });
				return data;
			} catch (error) {
				console.log("Error loading message from backend", error);
			}
		},
		
		signUp: async (email, password) => {
			try {
				const req = await fetch('https://psychic-trout-v6v567rrxwv9hwxg4-3001.app.github.dev/api/signup', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ email: email, password: password })
				});
				if (!req.ok) {
					throw new Error(`HTTP error status: ${req.status}`);
				}
				const data = await req.json();
				console.log('data signing up user', data);
				return true;
			} catch (error) {
				console.log('error signing up user', error.message);
				return false;
			}
		},
		logIn: async (email, password) => {
			try {
				const req = await fetch('https://psychic-trout-v6v567rrxwv9hwxg4-3001.app.github.dev/api/signin', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ email: email, password: password })
				});
				if (!req.ok) {
					throw new Error(`HTTP error status: ${req.status}`);
				}
				const data = await req.json();
				sessionStorage.setItem("token", data.access_token);
				setStore({ token: data.access_token });
				console.log('data logging in user', data);
				return true;
			} catch (error) {
				console.log('error logging in user', error.message);
				return false;
			}
		},
		private: async () => {
			try {
				let options = {
					headers: {
						'Authorization': 'Bearer' + sessionStorage.getItem('token')
					}
				}
				let response = await fetch('https://psychic-trout-v6v567rrxwv9hwxg4-3001.app.github.dev/api/private', options)
				let data = await response.json()
			}
			catch (error) {
				console.log(error)
			}
		}

		}
	};
};

export default getState;
