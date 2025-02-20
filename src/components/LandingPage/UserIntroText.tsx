import React from 'react';
import { NavLink } from 'react-router-dom';

const UserIntroText: React.FC = () => {
  return (
    <div
      style={{
        width: '792px',
        height: '478px',
        position: 'relative',
        top: '65px',
        left: '0px',
        padding: '65px 0',
        gap: '16px',
        fontFamily: 'Roboto',
        fontSize: '90px',
        fontWeight: '600',
        color: '#16325C',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        whiteSpace: 'normal',
      }}
    >
      <h1
        style={{
          fontFamily: 'Roboto, sans-serif',
          width: '768px',
          height: '210px',
          border: '4px',
          padding: '8px',
          gap: '8px',
          fontSize: '70px',
          lineHeight: '105.03px',
          marginBottom: '20px',
        }}
      >
        Online Learning Made Fun
      </h1>
      <p
        style={{
          fontFamily: 'Roboto, sans-serif',
          // lineHeight: '1.5',
          // fontWeight: '400',
          width: '581px',
          height: '94px',
          fontSize: '40px',
          fontWeight: '500',
          lineHeight: '46.68px',
          color: '#16325C',
          textAlign: 'left',
          whiteSpace: 'normal',
        }}
      >
        Learn anytime, anywhere for grades K-12
      </p>
    </div>
  );
};

export default UserIntroText;
