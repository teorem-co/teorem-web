import { useHistory } from 'react-router';

import logo from '../../assets/images/logo.svg';

const NotFound = () => {
    const history = useHistory();

    return (
        <div className="not-found">
            <div>
                {/* Add image when its exported in Figma */}
                {/* <img className="not-found__img" src={Image from import} alt="not-found" /> */}
            </div>
            <div>
                <img className="not-found__logo" src={logo} alt="Teorem" />
            </div>
            <h1 className="not-found__title type--color--primary mb-4">
                Page not found
            </h1>
            <p className="not-found__subtitle type--base type--color--secondary mb-10">
                Sorry,looks like we sent you the wrong way. Let us guide you
                back!
            </p>
            <button
                onClick={() => history.goBack()}
                className="btn btn--sm btn--clear type--wgt--bold"
            >
                Back to home
            </button>
        </div>
    );
};

export default NotFound;
