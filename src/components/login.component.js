import React from 'react';
import { GoogleLogin } from 'react-google-login';

const clientId = '236360147236-t3ublb9u5scpma5h1hl5fh8jfetjouab.apps.googleusercontent.com';

function Login(){
	const onSuccess = (res) => {
		console.log('[Login Success] currentUser:',res.profileObj);
		return(<p>Logged in!</p>);
	};

	const onFailure = (res) => {
		console.log('Login Failed] res:', res);
	};
	return(
		<div>
			<GoogleLogin
				clientId={clientId}
				buttonText="Login"
				onSuccess={onSuccess}
				onFailure={onFailure}
				cookiePolicy={'single_host_origin'}
				style={{marginTop: '100px' }}
				isSignedIn={true}
			/>
		</div>
	);
}

export default Login;
