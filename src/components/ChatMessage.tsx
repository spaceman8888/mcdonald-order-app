import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import { ChatMessage as ChatMessageType } from '../types';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import PersonIcon from '@mui/icons-material/Person';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2
      }}
    >
      {!isUser && (
        <Avatar 
          sx={{ 
            bgcolor: 'primary.main', 
            mr: 1,
            width: 32, 
            height: 32
          }}
        >
          <FastfoodIcon fontSize="small" />
        </Avatar>
      )}
      
      <Paper
        elevation={1}
        sx={{
          p: 2,
          maxWidth: '70%',
          bgcolor: isUser ? 'primary.light' : 'grey.100',
          color: isUser ? 'white' : 'text.primary',
          borderRadius: isUser ? '20px 5px 20px 20px' : '5px 20px 20px 20px',
        }}
      >
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{message.content}</Typography>
      </Paper>
      
      {isUser && (
        <Avatar 
          sx={{ 
            bgcolor: 'grey.400', 
            ml: 1,
            width: 32, 
            height: 32
          }}
        >
          <PersonIcon fontSize="small" />
        </Avatar>
      )}
    </Box>
  );
};

export default ChatMessage;
