import { CheckCircle, Circle } from "@mui/icons-material";
import { Box, Tooltip, IconButton } from "@mui/material";
import { useState } from "react";

export default function GreenCheckmarkMUI() {
  const [isPublished, setIsPublished] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => {
    setIsPublished(!isPublished);
  };

  return (
    <Tooltip title={isPublished ? "Published - Click to unpublish" : "Unpublished - Click to publish"}>
      <IconButton
        size="small"
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          padding: 0,
          mr: 1,
          transition: 'transform 0.2s ease-in-out',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          '&:hover': {
            backgroundColor: 'transparent',
          }
        }}
      >
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CheckCircle
            sx={{
              color: isPublished ? 'success.main' : 'grey.400',
              fontSize: '1.25rem',
              position: 'absolute',
              top: '2px',
              transition: 'all 0.3s ease-in-out',
              opacity: isPublished ? 1 : 0.5,
              transform: isPublished ? 'rotate(0deg)' : 'rotate(180deg)',
            }}
          />
          <Circle
            sx={{
              color: 'white',
              fontSize: '1rem',
              ml: 0.125,
              transition: 'all 0.3s ease-in-out',
            }}
          />
        </Box>
      </IconButton>
    </Tooltip>
  );
}
