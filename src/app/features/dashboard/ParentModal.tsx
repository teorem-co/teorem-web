import React, {useState} from 'react';
import { Modal } from 'react-bootstrap';
import {PROFILE_PATHS} from "../../routes";
import {t} from "i18next";
import {Link} from "react-router-dom";
import { Backdrop } from '@mui/material';

const ParentModal = () => {
  const [isShow, invokeModal] = useState(true);

  const closeModal = () => {
    return invokeModal(false);
  };

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isShow}
    >
      <Modal show={isShow} style={{zIndex: "10000"}}>
        <Modal.Header style={{textAlign: "center"}}>
          {t('CHILDLESS_PARENT_NOTE.TITLE')}
        </Modal.Header>
        <Modal.Body>
          <br/>
        </Modal.Body>
        <Modal.Footer style={{display: "flex", justifyContent: "space-between"}}>
          <button className="btn btn--base btn--primary">
            <Link
              className="w--50 mb-4 type--center btn--modal btn--primary"
              to={PROFILE_PATHS.MY_PROFILE_CHILD_INFO}
            >
              {t('MY_PROFILE.PROFILE_SETTINGS.DESCRIPTION')}
            </Link>
          </button>
          <button onClick={closeModal} className="btn btn--base btn--ghost">
            {t('IGNORE')}
          </button>
        </Modal.Footer>
      </Modal>
    </Backdrop>
  );
};

export default ParentModal;
