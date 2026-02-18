import React from 'react';
import LocalPharmacy from '@material-ui/icons/LocalPharmacy';
import Opacity from '@material-ui/icons/Opacity';
import SvgIcon from '@material-ui/core/SvgIcon';

function PillIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M4.22 11.29l5.07-5.07a6 6 0 018.48 8.48l-5.07 5.07a6 6 0 01-8.48-8.48zm7.07 1.42l4.25-4.24a3.99 3.99 0 00-5.66 0L5.64 12.7a3.99 3.99 0 005.65 0z" />
    </SvgIcon>
  );
}

const iconMap = {
  tablet: LocalPharmacy,
  pill: PillIcon,
  droplet: Opacity,
};

export default function MedIconDisplay({ icon = 'pill', color = '#7E57C2', size = 40 }) {
  const IconComponent = iconMap[icon] || PillIcon;
  return <IconComponent style={{ color, fontSize: size }} />;
}
