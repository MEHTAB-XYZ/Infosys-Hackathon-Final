import React from 'react';
import { Grid as MuiGrid, GridProps } from '@mui/material';

const Grid2: React.FC<GridProps> = (props) => {
  return <MuiGrid container spacing={2} {...props} />;
};

export default Grid2;