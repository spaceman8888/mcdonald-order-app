import React from 'react';
import { Tabs, Tab, Box, Paper } from '@mui/material';
import { MenuCategory } from '../types';

interface MenuCategoriesProps {
  categories: MenuCategory[];
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number) => void;
}

const MenuCategories: React.FC<MenuCategoriesProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    onSelectCategory(newValue);
  };

  return (
    <Paper elevation={2}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedCategory}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="메뉴 카테고리"
        >
          {categories.map((category) => (
            <Tab
              key={category.id}
              label={category.name}
              value={category.id}
            />
          ))}
        </Tabs>
      </Box>
    </Paper>
  );
};

export default MenuCategories;