import { useHistory } from 'react-router';

import logo from '../../assets/images/logo.png';

const NotFound = () => {
    const history = useHistory();

    return (
        <div className="not-found">
            <div className="not-found__img"></div>
            <div className="not__found__logo mb-20">
                <img className="img" src={logo} alt="Teorem" />
            </div>
            <h1 className="type--xxl mb-4">Page not found</h1>
            <p className="type--base  mb-10">
                Sorry,looks like we sent you the wrong way. <br /> Let us guide
                you back!
            </p>
            <button
                onClick={() => history.goBack()}
                className="btn btn--clear btn--clear"
            >
                Back to home
            </button>
        </div>
    );
};

export default NotFound;
