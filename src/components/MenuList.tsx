import React from "react";
import {
  Grid,
  Box,
  Typography,
  CircularProgress,
  keyframes,
} from "@mui/material";
import MenuItem from "./MenuItem";
import { MenuItem as MenuItemType } from "../types";

interface MenuListProps {
  items: MenuItemType[];
  isLoading: boolean;
  onSelectItem: (item: MenuItemType) => void;
}

const bounceAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(20px);
  }
  60% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
`;

const MenuList: React.FC<MenuListProps> = ({
  items,
  isLoading,
  onSelectItem,
}) => {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          p: 4,
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          p: 4,
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
      {items.map((item, index) => (
        <Box
          sx={{
            width: { xs: "100%", sm: "50%", md: "32%" },
            animation: `${bounceAnimation} 0.5s ease-out ${
              index * 0.1
            }s forwards`,
          }}
          key={item.id}
        >
          <MenuItem item={item} onSelect={onSelectItem} />
        </Box>
      ))}
    </Grid>
  );
};

export default MenuList;
