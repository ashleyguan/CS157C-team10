import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route,Redirect } from 'react-router-dom';
import Navbar from "./components/navbar.component";
import Login from './components/login.component';
import Logout from './components/logout.component';
import Index from './components/index.component';

function App() {
	return (
		<div className="App">
			<Router>
				<div className="container">
 				<Navbar />
				<Route exact path="/" component ={Index} />
				</div>
				

			</Router>
			


			
		</div>
	);
}

export default App;
