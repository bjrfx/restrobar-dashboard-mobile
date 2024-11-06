// RequestNotificationPermission.js
import React, { useEffect, useState } from 'react';
import { Button, Snackbar } from '@mui/material';

const RequestNotificationPermission = () => {
  const [showPermissionAlert, setShowPermissionAlert] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(Notification.permission === 'granted');

  useEffect(() => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      setShowPermissionAlert(true);
    }
  }, []);

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    setPermissionGranted(permission === 'granted');
    setShowPermissionAlert(false);
  };

  return (
    <>
      {showPermissionAlert && (
        <Snackbar
          open={showPermissionAlert}
          message="Enable notifications for reservation alerts."
          action={
            <Button color="inherit" size="small" onClick={requestPermission}>
              Enable
            </Button>
          }
        />
      )}
    </>
  );
};

export default RequestNotificationPermission;
