import CloudsImage from '../../assets/CloudsImage.png';

const BackgroundClouds = () => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundImage: `url(${CloudsImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#CDEBFB',
      }}
    >
      <img
        src={CloudsImage}
        alt='Background Clouds'
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'relative',
          top: 0,
          left: 0,

          opacity: 0.5,
        }}
      />
    </div>
  );
};

export default BackgroundClouds;
