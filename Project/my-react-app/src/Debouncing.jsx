import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Button,
  List,
  ListItem,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ------------------------------
// Zustand Store (with LocalStorage)
// ------------------------------
const usePostStore = create(
  persist(
    (set, get) => ({
      posts: [],

      addPost: (text) =>
        set((state) => ({
          posts: [...state.posts, { id: Date.now(), text }],
        })),

      updatePost: (id, newText) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === id ? { ...p, text: newText } : p
          ),
        })),

      deletePost: (id) =>
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== id),
        })),

      searchQuery: "",
      setSearchQuery: (q) => set({ searchQuery: q }),

      filteredPosts: () => {
        const q = get().searchQuery.toLowerCase();
        return get().posts.filter((p) => p.text.toLowerCase().includes(q));
      },
    }),
    { name: "posts-storage" }
  )
);

// ------------------------------
// Custom Debounce Hook
// ------------------------------
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// ------------------------------
// MAIN COMPONENT
// ------------------------------
export default function DebouncingMUI() {
  const { addPost, updatePost, deletePost, filteredPosts, setSearchQuery } =
    usePostStore();

  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const handleAdd = () => {
    if (editId) {
      updatePost(editId, text);
      setEditId(null);
    } else {
      addPost(text);
    }
    setText("");
  };

  return (
    <Box sx={{ p: 4, width: 450, margin: "0 auto" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Debounce + Zustand + MUI
      </Typography>

      {/* Input */}
      <TextField
        label="Add or Update Post"
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleAdd}
        disabled={!text}
      >
        {editId ? "Update" : "Add"}
      </Button>

      {/* Search Input (Debounced) */}
      <TextField
        label="Search"
        fullWidth
        sx={{ mt: 3 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* List Items */}
      <List sx={{ mt: 2 }}>
        {filteredPosts().map((post) => (
          <ListItem
            key={post.id}
            sx={{
              border: "1px solid #ddd",
              mb: 1,
              borderRadius: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {post.text}

            <Box>
              <IconButton
                onClick={() => {
                  setText(post.text);
                  setEditId(post.id);
                }}
              >
                <EditIcon />
              </IconButton>

              <IconButton onClick={() => deletePost(post.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
