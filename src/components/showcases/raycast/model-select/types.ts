import type { ComponentType } from 'react';

// export type ModelOption = {
//   value: string;
//   label: string;
//   emoji: string;
// };
export type ModelIconProps = {
  size?: number;
  color?: string;
};

export type ModelOption = {
  value: string;
  label: string;
  emoji?: string;
  icon?: ComponentType<ModelIconProps>;
};