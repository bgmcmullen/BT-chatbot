import React from 'react';
import AnimalIconsImage from '../../assets/Animalicons.png';

const AnimalIcons: React.FC = () => {
  return (
    <div
      style={{
        position: 'relative',
        top: '60px',
        width: '542.77px',
        height: '410.56px',
        gap: '10px',

      }}
    >
      <img style={{
        width: 'inherit',
        height: 'inherit',
      }} src={AnimalIconsImage} alt='Animal Icons' />
    </div>
  );
};

export default AnimalIcons;
