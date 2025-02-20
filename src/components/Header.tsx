/* eslint-disable react-refresh/only-export-components */
/// <reference types="vite-plugin-svgr/client" />

import React from 'react';
import { ReactComponent as Logo } from '../assets/BridingTechLogo.svg';
const Header: React.FC = () => {
  return (
    <header
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'white',
        padding: '8px 16px 8px 16px',
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Logo
            style={{ height: '40px', width: 'auto', marginRight: '10px' }}
          />
          <span
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#FF6B00',
              marginRight: '5px',
            }}
          >
            Bridging
          </span>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#02AAEB',
              marginRight: '5px',
            }}
          >
            Tech
          </span>
          <span
            style={{ fontSize: '18px', fontWeight: 'bold', color: '#45C717' }}
          >
            Ed
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;