import { useCallback, useEffect } from 'react';

interface Props {
  children: JSX.Element | JSX.Element[];
  sideBarIsOpen: boolean;
  title: string;
  closeSidebar: () => void;
}

const NotificationsSidebar = (props: Props) => {
  const {
    sideBarIsOpen,
    title,
    children,
    closeSidebar,
  } = props;

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      closeSidebar();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, []);

  return (
    <div className="pos--abs">
      <div
        className={`cur--pointer sidebar__overlay ${
          !sideBarIsOpen ? 'sidebar__overlay--close' : ''
        }`}
        onClick={closeSidebar}
      ></div>

      <div
        className={`sidebar sidebar--secondary sidebar--secondary ${
          !sideBarIsOpen ? 'sidebar--secondary--close' : ''
        }`}
      >
        <div className="flex--primary flex--shrink">
          <div className="type--color--secondary">{title}</div>
          <div>
            <i
              className="icon icon--base icon--close icon--grey"
              onClick={closeSidebar}
            ></i>
          </div>
        </div>
        <div className="flex--grow mt-10">{children}</div>
      </div>
    </div>
  );
};

export default NotificationsSidebar;
