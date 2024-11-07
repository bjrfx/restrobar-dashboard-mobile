// ModalTemplate.jsx
import React, { useState } from 'react';
import { Modal, Box, Typography, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ModalTemplate = ({ 
  title, 
  content, 
  disableBackdropClick = false 
}) => {
  const [isOpen, setIsOpen] = useState(true); // Modal opens by default

  const handleClose = () => setIsOpen(false);

  return (
    <Modal 
      open={isOpen} 
      onClose={disableBackdropClick ? null : handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box 
        sx={{
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 400, 
          bgcolor: 'background.paper', 
          borderRadius: 2,
          boxShadow: 24, 
          p: 2,
          
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0 }}>
          <Typography id="modal-title" variant="h6">
            {title}
          </Typography>
          <IconButton onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 2 }} />

        <Typography id="modal-description" sx={{ mb: 4 }}>
          {content}
        </Typography>
      </Box>
    </Modal>
  );
};

export default ModalTemplate;