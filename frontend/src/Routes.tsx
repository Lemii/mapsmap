import { Route, Routes } from 'react-router-dom';

import NotFound from './components/Generic/NotFound';
import Home from './components/Home';
import Overview from './components/Overview';
import CreateAccount from './components/Persons/CreateAccount';
import EditAccount from './components/Persons/EditAccount';
import MyAccount from './components/Persons/MyAccount';
import SignIn from './components/Persons/SignIn';
import ViewAccount from './components/Persons/ViewAccount';
import AddProblem from './components/Problems/AddProblem';
import EditProblem from './components/Problems/EditProblem';
import Problems from './components/Problems/Problems';
import ViewProblem from './components/Problems/ViewProblem';
import AddSolution from './components/Solutions/AddSolution';
import EditSolution from './components/Solutions/EditSolution';
import Solutions from './components/Solutions/Solutions';
import ViewSolution from './components/Solutions/ViewSolution';

export const AppRoutes = () => {
	return (
		<Routes>
			<Route path="*" element={<NotFound />} />
			<Route path="/" element={<Home />} />
			<Route path="/problems/*" element={<Problems />} />
			<Route path="/problems/add" element={<AddProblem />} />
			<Route path="/problems/edit/:id" element={<EditProblem />} />
			<Route path="/problems/view/:id" element={<ViewProblem />} />
			<Route path="/solutions/*" element={<Solutions />} />
			<Route path="/solutions/add/:id" element={<AddSolution />} />
			<Route path="/solutions/edit/:id" element={<EditSolution />} />
			<Route path="/solutions/view/:id" element={<ViewSolution />} />
			<Route path="/persons/add" element={<CreateAccount />} />
			<Route path="/persons/edit" element={<EditAccount />} />
			<Route path="/persons/sign-in" element={<SignIn />} />
			<Route path="/persons/view/me" element={<MyAccount />} />
			<Route path="/persons/view/:id" element={<ViewAccount />} />
			<Route path="/overview" element={<Overview />} />
		</Routes>
	);
};
