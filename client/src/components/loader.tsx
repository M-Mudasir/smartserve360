import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <div className="dimension d-flex justify-content-center align-items-center ">
      <Spinner className='custom-spinner' animation="border" role="status">
      </Spinner>
    </div>
  );
};

export default Loader;
