import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import { MenuItem as MenuItemType } from '../types';

interface MenuItemProps {
  item: MenuItemType;
  onSelect: (item: MenuItemType) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onSelect }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
    >
      {item.image_url && (
        <CardMedia
          component="img"
          height="140"
          image={item.image_url}
          alt={item.name}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h6" component="div">
          {item.name}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: 40
          }}
        >
          {item.description || ''}
        </Typography>
        
        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary.main">
            {item.price.toLocaleString()}원
          </Typography>
          
          {item.calories && (
            <Chip 
              label={`${item.calories} kcal`} 
              size="small" 
              variant="outlined" 
            />
          )}
        </Box>
        
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => onSelect(item)}
        >
          담기
        </Button>
      </CardContent>
    </Card>
  );
};

export default MenuItem;