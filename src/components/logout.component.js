import React from 'react';
import { GoogleLogout } from 'react-google-login';

const clientId = '236360147236-t3ublb9u5scpma5h1hl5fh8jfetjouab.apps.googleusercontent.com';

function Logout() {
	const onSuccess = () => {
	console.log('Logged out successfully');
	};

	return (
		<div>
			<GoogleLogout
			clientId={clientId}
			buttonText="Logout"
			onLogoutSuccess={onSuccess}
			></GoogleLogout>
		</div>
	);
}

export default Logout;
