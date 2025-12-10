import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Grid,
  TextField,
  Paper,
  IconButton,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useChatStore from "./chatStore";

const ChatApp = () => {
  const [input, setInput] = useState("");
  const [user, setUser] = useState("User 1");
  const { messages, addMessage, deleteMessage, clearAll } = useChatStore();

  const scrollRef = useRef();

  const handleSend = () => {
    if (input.trim() === "") return;
    addMessage(user, input.trim());
    setInput("");
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Grid container direction="column" spacing={2} p={2} maxWidth={600} margin="auto">
      <Grid item>
        <Typography variant="h4" align="center">
          Two Users Chat App
        </Typography>
      </Grid>

      {/* Select User */}
      <Grid item>
        <Select
          value={user}
          onChange={(e) => setUser(e.target.value)}
          fullWidth
        >
          <MenuItem value="User 1">User 1</MenuItem>
          <MenuItem value="User 2">User 2</MenuItem>
        </Select>
      </Grid>

      {/* Input Field */}
      <Grid item container spacing={1}>
        <Grid item xs={9}>
          <TextField
            fullWidth
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
        </Grid>
        <Grid item xs={3}>
          <Button fullWidth variant="contained" color="primary" onClick={handleSend}>
            Send
          </Button>
        </Grid>
      </Grid>

      {/* Clear All */}
      {messages.length > 0 && (
        <Grid item>
          <Button variant="contained" color="error" onClick={clearAll}>
            Clear All Messages
          </Button>
        </Grid>
      )}

      {/* Messages */}
      <Grid item sx={{ maxHeight: 400, overflowY: "auto", border: "1px solid #ccc", p: 1 }}>
        {messages.length === 0 ? (
          <Typography align="center">No messages yet</Typography>
        ) : (
          messages.map((msg) => (
            <Paper
              key={msg.id}
              sx={{
                p: 1,
                my: 1,
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: msg.user === "User 1" ? "#e0f7fa" : "#ffe0b2",
              }}
            >
              <Typography>
                <b>{msg.user}:</b> {msg.text}
              </Typography>
              <IconButton color="error" onClick={() => deleteMessage(msg.id)}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))
        )}
        <div ref={scrollRef} />
      </Grid>
    </Grid>
  );
};

export default ChatApp;
