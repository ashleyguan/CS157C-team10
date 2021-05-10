import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route,Redirect } from 'react-router-dom';
import Navbar from "./components/navbar.component";
import Index from './components/index.component';
import Result from './components/result.component';

function App() {
	return (
		<div className="App">
			<Router>
				<div className="container">
 				<Navbar />
				<Route exact path="/" component ={Index} />
				<Route path = "/result" component = {Result} />
				</div>
			</Router>
			


			
		</div>
	);
}

export default App;
