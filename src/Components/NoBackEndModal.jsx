import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';

const backendURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_BACKEND_URL : process.env.REACT_APP_PROD_BACKEND_URL
console.log(`l'url backend utilisé est: ${backendURL}`)

const NoBackEndModal = () => {
  const [isBackEndUp, setIsBackEndUp] = useState(true)

  useEffect(() => {
    console.log('check backend')
    const fetchBackEnd = async () => {
      try {
      await fetch(
        `${backendURL}`, { method: 'GET' }
      )
      } catch (error) {
        console.log(error)
        setIsBackEndUp(false)
      }
    }
    fetchBackEnd()
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