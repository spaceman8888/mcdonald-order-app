import React from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import MenuItem from './MenuItem';
import { MenuItem as MenuItemType } from '../types';

interface MenuListProps {
  items: MenuItemType[];
  isLoading: boolean;
  onSelectItem: (item: MenuItemType) => void;
}

const MenuList: React.FC<MenuListProps> = ({ items, isLoading, onSelectItem }) => {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          p: 4
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          p: 4
        }}
      >
        <Typography variant="body1" color="text.secondary">
          표시할 메뉴가 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={1} sx={{ p: 1 }}>
      {items.map((item) => (
        <Box sx={{ width: { xs: '100%', sm: '50%', md: '30%' }, p: 1 }} key={item.id}>
          <MenuItem item={item} onSelect={onSelectItem} />
        </Box>
      ))}
    </Grid>
  );
};

export default MenuList;