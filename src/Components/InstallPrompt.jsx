import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const InstallPrompt = () => {
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault(); // Prevent the default prompt from showing
      setInstallPromptEvent(event); // Save the event so we can trigger it later
      setOpen(true); // Open the modal to prompt the user
    };

    // Listen for the 'beforeinstallprompt' event to trigger the prompt
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (installPromptEvent) {
      installPromptEvent.prompt(); // Show the install prompt
      installPromptEvent.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        setOpen(false); // Close the modal after interaction
      });
    }
  };

  const handleClose = () => {
    setOpen(false); // Close the modal
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Install App</DialogTitle>
      <DialogContent>
        <p>Would you like to install the app to your device?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          No, Thanks
        </Button>
        <Button onClick={handleInstallClick} color="primary">
          Install
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstallPrompt;
