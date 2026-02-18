import { useEffect, useState } from 'react';
import MedIconDisplay from './MedIconDisplay';

export default function MedImage({
  image = '',
  icon = 'pill',
  iconColor = '#7E57C2',
  style = {},
  onClick = () => {},
  alt = '',
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [image]);

  if (!image || failed) {
    const size = parseInt(style.height || style.width) || 40;
    return (
      <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', ...style }}>
        <MedIconDisplay icon={icon} color={iconColor} size={size} />
      </div>
    );
  }

  return (
    <img
      onClick={onClick}
      src={image}
      style={style}
      onError={() => setFailed(true)}
      alt={alt}
    />
  );
}
