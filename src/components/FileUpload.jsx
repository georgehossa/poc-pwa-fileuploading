import { useState } from "react";
import {
  Button,
  Box,
  Paper,
  Typography,
  Alert,
  IconButton,
} from "@mui/material";
import {
  UploadFile,
  Image as ImageIcon,
  PictureAsPdf,
  Close as CloseIcon,
} from "@mui/icons-material";

const FileUpload = () => {
  const [preview, setPreview] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if file is either image or PDF
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        setError("Please select an image or PDF file");
        return;
      }

      // Store file information
      setFileInfo({
        name: file.name,
        type: file.type,
        size: (file.size / 1024 / 1024).toFixed(2), // Convert to MB
      });

      // Generate preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
          setError(null);
        };
        reader.readAsDataURL(file);
      } else {
        // For PDFs, we just show an icon
        setPreview(null);
      }
      setError(null);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setFileInfo(null);
    setError(null);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Upload Button */}
        <label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <Button
            variant="outlined"
            component="span"
            fullWidth
            startIcon={<UploadFile />}
          >
            Upload File
          </Button>
        </label>

        {/* File Preview/Info */}
        {fileInfo && (
          <Paper
            elevation={1}
            sx={{
              p: 2,
              position: "relative",
            }}
          >
            {/* Clear button */}
            <IconButton
              size="small"
              onClick={handleClear}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Preview for images */}
            {preview ? (
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "1/1",
                  borderRadius: 1,
                  overflow: "hidden",
                  mb: 2,
                }}
              >
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            ) : (
              // Icon for PDFs
              fileInfo.type === "application/pdf" && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <PictureAsPdf sx={{ fontSize: 64, color: "primary.main" }} />
                </Box>
              )
            )}

            {/* File information */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              {fileInfo.type.startsWith("image/") ? (
                <ImageIcon fontSize="small" />
              ) : (
                <PictureAsPdf fontSize="small" />
              )}
              <Typography variant="subtitle1">{fileInfo.name}</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary">
              Type: {fileInfo.type.split("/")[1].toUpperCase()}
              <br />
              Size: {fileInfo.size} MB
            </Typography>
          </Paper>
        )}

        {/* Error message */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default FileUpload;
