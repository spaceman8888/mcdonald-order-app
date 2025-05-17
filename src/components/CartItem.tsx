import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  ButtonGroup,
  Button,
  Divider,
  ListItem,
  ListItemText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
  index: number;
  onRemove: (index: number) => void;
  onChangeQuantity: (index: number, newQuantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  index,
  onRemove,
  onChangeQuantity
}) => {
  return (
    <>
      <ListItem
        alignItems="flex-start"
        secondaryAction={
          <IconButton 
            edge="end" 
            onClick={() => onRemove(index)}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        }
      >
        <ListItemText
          primary={
            <Typography variant="subtitle1" fontWeight="bold">
              {item.name}
            </Typography>
          }
          secondary={
            <Box sx={{ mt: 1 }}>
              {item.options.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  {item.options.map((option, i) => (
                    <Typography key={i} variant="body2" color="text.secondary">
                      + {option.name} ({option.price_adjustment > 0 ? '+' : ''}{option.price_adjustment.toLocaleString()}원)
                    </Typography>
                  ))}
                </Box>
              )}
              
              {item.special_instructions && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  요청사항: {item.special_instructions}
                </Typography>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <ButtonGroup size="small">
                  <Button
                    onClick={() => onChangeQuantity(index, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                  >
                    <RemoveIcon fontSize="small" />
                  </Button>
                  <Button disabled>
                    {item.quantity}
                  </Button>
                  <Button
                    onClick={() => onChangeQuantity(index, item.quantity + 1)}
                  >
                    <AddIcon fontSize="small" />
                  </Button>
                </ButtonGroup>
                
                <Typography variant="body1" fontWeight="bold">
                  {(item.price * item.quantity).toLocaleString()}원
                </Typography>
              </Box>
            </Box>
          }
        />
      </ListItem>
      <Divider component="li" />
    </>
  );
};

export default CartItem;