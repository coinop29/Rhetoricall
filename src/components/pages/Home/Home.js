/* eslint-disable */
import React, { useState, useEffect, Suspense } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Box, Snackbar, Stack, Button, Chip } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  EffectComposer,
  Selection,
  Select,
  Outline,
} from '@react-three/postprocessing';

import useAppStore from '../../../store';
import smallestloop from '../../../assets/audios/smallestloop.mp3';
import './Home.scss';
import { getDefaultBackground } from '../../../services/api';
import { abstractString, generateVideoURL } from '../../../utils/helper';
import { Message3D } from '../../commonComponents';
import { 
  isImageMessage, 
  getDisplayText, 
  processIncomingMessage,
  getDisplayMode,
  getImageGenerationStatus
} from '../../../utils/messageUtils';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Home({ socket }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [play, setPlay] = useState(false);
  const [socketMessages, setSocketMessages] = useState([]);
  const [currentDisplayMode, setCurrentDisplayMode] = useState('text');
  const {
    backgroundUri,
    addHistory,
    setExplode,
    setReset,
    setBackgroundUri,
  } = useAppStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const audio = new Audio(smallestloop);
  audio.loop = true;

  // State to keep track of the selected message index
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleBackground = () => {
    navigate('/background');
  };

  // Handler to update selected message index
  const handleSelectMessage = (index) => {
    setSelectedMessageIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    // Listen for incoming messages
    socket.on('messageIncoming', (data) => {
      setPlay(true);
      setReset(true);
      const { filtered } = data;
      
      // Process the incoming message
      const processedMessage = processIncomingMessage(filtered);
      addHistory(processedMessage);
      
      // Handle both text and image messages
      let displayText = processedMessage.text;
      if (processedMessage.type === 'image') {
        displayText = 'Image message received';
      }
      
      const display = abstractString(displayText);
      setExplode(display);

      setMessage(getDisplayText(processedMessage));

      // Append new message to the array
      setSocketMessages((prevMessages) => {
        const messages = [...prevMessages, processedMessage];
        if (messages.length > 5) {
          messages.shift(); // Limit to last 5 messages
        }
        return messages;
      });

      handleClick();
    });

    // Listen for display mode changes
    socket.on('displayModeChanged', (data) => {
      const { mode } = data;
      setCurrentDisplayMode(mode);
      console.log('Display mode changed to:', mode);
    });

    (async () => {
      let url = '';
      if (pathname === '/public_view' && searchParams.get('background')) {
        url = searchParams.get('background');
      } else {
        try {
          const result = await getDefaultBackground();
          const { data } = result;
          url = data.url;
          setBackgroundUri(`${url}`);
        } catch (e) {
          console.log(e);
        }
      }
    })();

    return () => {
      socket.off('messageIncoming');
      socket.off('displayModeChanged');
    };
  }, []);

  useEffect(() => {
    if (play) {
      audio.play();
      audio.loop = true;
    }
  }, [play]);

  // Get status color for display mode chip
  const getStatusColor = (mode) => {
    return mode === 'image' ? 'success' : 'default';
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Box sx={{ height: '100%', width: '100%' }}>
        <ReactPlayer
          url={generateVideoURL(backgroundUri)}
          loop={true}
          playing={true}
          muted={true}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: '0px', left: '0px' }}
        />
        
        {/* Display Mode Indicator */}
        <Box sx={{ 
          position: 'absolute', 
          top: '20px', 
          right: '20px', 
          zIndex: 1000 
        }}>
          <Chip
            label={`Mode: ${currentDisplayMode.toUpperCase()}`}
            color={getStatusColor(currentDisplayMode)}
            variant="filled"
            sx={{ 
              backgroundColor: currentDisplayMode === 'image' ? '#4caf50' : '#757575',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>
        
        <div className="canvas-container">
          <Canvas
            gl={{
              antialias: true,
              powerPreference: 'high-performance',
            }}
            camera={{
              position: [0, 0, 30],
              fov: 60,
              near: 0.1,
              far: 2000,
            }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} />
            <OrbitControls enableDamping dampingFactor={0.05} />
            <Suspense fallback={null}>
              <Selection enabled>
                <EffectComposer enabled autoClear={false}>
                  <Outline
                    visibleEdgeColor={'yellow'}
                    hiddenEdgeColor={'yellow'}
                    edgeStrength={5}
                  />
                </EffectComposer>

                <Select enabled>
                  {/* Render all messages using Message3D component */}
                  {socketMessages.map((msg, index) => (
                    <Message3D
                      key={index}
                      message={msg}
                      position={[0, index * -3, 0]} // Adjust spacing for images
                      scale={isImageMessage(msg) ? [1, 1, 1] : [0.9, 1, 0.5]} // Different scales for images vs text
                      color="#2f24c1"
                      selected={selectedMessageIndex === index}
                      onClick={() => handleSelectMessage(index)}
                    />
                  ))}
                </Select>
              </Selection>
            </Suspense>
          </Canvas>
        </div>
        <Button
          className="background-button"
          variant="contained"
          onClick={handleBackground}
        >
          Background
        </Button>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </Stack>
  );
}
