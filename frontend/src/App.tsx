import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppLayout from './components/Layout';
import { UserContext } from './contexts/userContext';
import { AppRoutes } from './Routes';
import { Credentials } from './types';
import { getFromLocalStorage, removeItemFromStorage, setToLocalStorage } from './utils/storage';

const App = () => {
	const [userCredentials, setUserCredentials] = useState<Credentials | null>(getFromLocalStorage('credentials'));
	const navigate = useNavigate();

	const updateUserCredentials = (credentials: Credentials | null) => {
		setUserCredentials(credentials);

		if (credentials) {
			setToLocalStorage(credentials, 'credentials');
		}
	};

	const signOut = () => {
		removeItemFromStorage('credentials');
		setUserCredentials(null);
		navigate('/persons/sign-in');
	};

	return (
		<div className="App">
			<UserContext.Provider value={{ userCredentials, updateUserCredentials, signOut }}>
				<AppLayout>
					<AppRoutes />
				</AppLayout>
			</UserContext.Provider>
		</div>
	);
};

export default App;
