import React from 'react';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import Opacity from '@material-ui/icons/Opacity';
import SvgIcon from '@material-ui/core/SvgIcon';

function PillIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M4.22 11.29l5.07-5.07a6 6 0 018.48 8.48l-5.07 5.07a6 6 0 01-8.48-8.48zm7.07 1.42l4.25-4.24a3.99 3.99 0 00-5.66 0L5.64 12.7a3.99 3.99 0 005.65 0z" />
    </SvgIcon>
  );
}

function SyringeIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M11.15 15.18l-1.06-1.06 1.06-1.06-1.06-1.06 1.06-1.06-1.06-1.06 1.77-1.77 6.36 6.36-1.77 1.77-1.06-1.06-1.06 1.06-1.06-1.06-1.06 1.06zM22.61 7.05L17 1.44l-1.41 1.41 1.41 1.41-2.12 2.12-1.41-1.41-1.42 1.42 1.42 1.41-7.78 7.78-2.12-.71L2.44 14l4.24 4.24 1.06-1.06-.71-2.12 7.78-7.78 1.41 1.42 1.42-1.42-1.41-1.41 2.12-2.12 1.41 1.41z" />
    </SvgIcon>
  );
}

const iconMap = {
  tablet: FiberManualRecord,
  pill: PillIcon,
  droplet: Opacity,
  syringe: SyringeIcon,
};

export default function MedIconDisplay({ icon = 'pill', color = '#7E57C2', size = 40 }) {
  const IconComponent = iconMap[icon] || PillIcon;
  return <IconComponent style={{ color, fontSize: size }} />;
}
