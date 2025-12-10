import React, { useRef, useState } from "react";

import { Delete, CloudDownload } from "@mui/icons-material";
import {
  Box,
  Grid,
  TextField,
  IconButton,
  LinearProgress,
  InputAdornment,
} from "@mui/material";

const FileUploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadProgress(0);
      // Optionally, initiate the upload process here and update progress
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleDownload = () => {
    // Implement file download logic here
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    fileInputRef.current.value = null; // Clear the input value
    // Optionally, implement file deletion logic here
  };

  return (
    <Grid item xs={12} mb={2}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <TextField
        placeholder="Drop files here or click to browse through your machine."
        variant="outlined"
        fullWidth
        value={selectedFile ? selectedFile.name : ""}
        onClick={handleUploadClick}
        InputProps={{
          readOnly: true,
          endAdornment: selectedFile && (
            <InputAdornment
              position="end"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  color="primary" // Set the color to primary
                />
              </Box>
              <IconButton onClick={handleDownload} aria-label="download">
                <CloudDownload />
              </IconButton>
              <IconButton onClick={handleDelete} aria-label="delete">
                <Delete />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Grid>
  );
};

export default FileUploadComponent;
