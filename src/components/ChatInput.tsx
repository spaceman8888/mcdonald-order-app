import React, { useRef, useState } from "react";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      await onSendMessage(message);
      setMessage("");
      inputRef.current?.focus();
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        alignItems: "center",
        mt: 2,
      }}
    >
      <TextField
        inputRef={inputRef}
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit(e);
          }
        }}
        placeholder="메시지를 입력하세요..."
        variant="outlined"
        disabled={isLoading}
        size="small"
        multiline
        sx={{ mr: 1 }}
      />
      <IconButton
        type="submit"
        color="primary"
        disabled={!message.trim() || isLoading}
        sx={{
          bgcolor: "primary.main",
          color: "white",
          "&:hover": {
            bgcolor: "primary.dark",
          },
          "&.Mui-disabled": {
            bgcolor: "grey.300",
            color: "grey.500",
          },
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <SendIcon />
        )}
      </IconButton>
    </Box>
  );
};

export default ChatInput;
