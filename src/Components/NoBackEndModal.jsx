import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import API from '../services/API';

const NoBackEndModal = () => {
  const [isBackEndUp, setIsBackEndUp] = useState(true)

  useEffect(() => {
    API.get().then(
      setIsBackEndUp(true)
    ).catch(err => {
      console.log(err);
      setIsBackEndUp(false);
    });
  }, [])

  return (
    <>
      <Modal title={"No Back-End"} visible={!isBackEndUp}>
        <p>
          The Back-End is down!
        </p>
      </Modal>
    </>
  );
};

export default NoBackEndModal;