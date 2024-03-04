import { useEffect } from 'react';

//close filter dropdown on click outside of it
const useOutsideAlerter = (ref: any, handleOutsideClick: () => void) => {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                // Triggers closing of dropdown
                // alert("You clicked outside of me!");
                handleOutsideClick();
            }
        }

        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);
};

export default useOutsideAlerter;
