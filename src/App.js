import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Navbar from "./components/navbar.component";
import Index from './components/index.component';
import Result from './components/result.component';

function App() {
	return (
		<div className="App">
			<Router>
				<div className="container" style={{"overflow":"auto"}}>
 				<Navbar />
				<Route exact path="/" component ={Index} />
				<Route path = "/result" component = {Result} />

				</div>

			</Router>
			


			
		</div>
	);
}

export default App;
