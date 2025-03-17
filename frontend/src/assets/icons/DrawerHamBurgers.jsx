import React from "react";

export const DrawerHamBurger = ({
  Icon,
  color,
  size,
  onClick,
  className = "",
}) => {
  return (
    <span onClick={onClick} className={className}>
      <Icon color={color} size={size} />
    </span>
  );
};

export const OpenDrawerIcon = ({ color, size }) => {
  return (
    <svg
      width={size}
      height={Math.round(size / 1.3)}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.971428 14.8571C0.434922 14.8571 -8.34465e-07 14.4414 -8.34465e-07 13.9286C-8.34465e-07 13.4157 0.434922 13 0.971428 13C1.50793 13 1.94286 13.4157 1.94286 13.9286C1.94286 14.4414 1.50793 14.8571 0.971428 14.8571Z"
        fill={color}
      />
      <path
        d="M0.971428 26C0.434922 26 -8.34465e-07 25.5843 -8.34465e-07 25.0714C-8.34465e-07 24.5586 0.434922 24.1429 0.971428 24.1429C1.50793 24.1429 1.94286 24.5586 1.94286 25.0714C1.94286 25.5843 1.50793 26 0.971428 26Z"
        fill={color}
      />
      <path
        d="M0.971428 1.85714C0.434922 1.85714 -8.34465e-07 1.44141 -8.34465e-07 0.928572C-8.34465e-07 0.415736 0.434922 0 0.971428 0C1.50793 0 1.94286 0.415736 1.94286 0.928572C1.94286 1.44141 1.50793 1.85714 0.971428 1.85714Z"
        fill={color}
      />
      <path
        d="M28.5121 8.74304L34 13.9889L28.5121 19.2347"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M31.256 1.22403H5.64564"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5.82857 13.9286H24.4876"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M31.256 25.7046H5.64564"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const CloseDrawerIcon = ({ color, size }) => {
  return (
    <svg
      width={size}
      height={Math.round(size / 1.3)}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.971443 14.8571C0.434938 14.8571 1.44243e-05 14.4414 1.44243e-05 13.9286C1.44243e-05 13.4157 0.434938 13 0.971443 13C1.50795 13 1.94287 13.4157 1.94287 13.9286C1.94287 14.4414 1.50795 14.8571 0.971443 14.8571Z"
        fill={color}
      />
      <path
        d="M0.971443 26C0.434938 26 1.44243e-05 25.5843 1.44243e-05 25.0714C1.44243e-05 24.5586 0.434938 24.1429 0.971443 24.1429C1.50795 24.1429 1.94287 24.5586 1.94287 25.0714C1.94287 25.5843 1.50795 26 0.971443 26Z"
        fill={color}
      />
      <path
        d="M0.971443 1.85714C0.434938 1.85714 1.44243e-05 1.44141 1.44243e-05 0.928572C1.44243e-05 0.415736 0.434938 0 0.971443 0C1.50795 0 1.94287 0.415736 1.94287 0.928572C1.94287 1.44141 1.50795 1.85714 0.971443 1.85714Z"
        fill={color}
      />
      <path
        d="M34 8.74304L28.5121 13.9889L34 19.2347"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M31.256 1.22403H5.64564"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5.82855 13.9286H24.4875"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M31.256 25.7046H5.64564"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
