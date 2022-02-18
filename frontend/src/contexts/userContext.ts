import { createContext } from 'react';

import { UserContextType } from '../types';

export const UserContext = createContext<UserContextType>({
	userCredentials: null,
	updateUserCredentials: () => null,
	signOut: () => null,
});
