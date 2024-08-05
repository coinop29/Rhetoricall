/* eslint-disable */
import * as React from "react";
import { useState, useEffect, Suspense } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ReactPlayer from "react-player";

import { Box, CircularProgress } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";
import Button from "@mui/material/Button";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  EffectComposer,
  Selection,
  Select,
  Outline,
} from "@react-three/postprocessing";

import { Cube } from "../../models/Cube";
import { ECube1 } from "../../models/Explode_Cube1";

import useAppStore from "../../../store";
import smallestloop from "../../../assets/audios/smallestloop.mp3";
import "./Home.scss";
import { getDefaultBackground } from "../../../services/api";
import { abstractString, generateVideoURL } from "../../../utils/helper";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Home({ socket }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [play, setPlay] = useState(false);
  const {
    backgroundUri,
    explode,
    cube,
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

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleBackground = () => {
    navigate("/background");
  };

  const generateRandomFont = () =>
    `/fonts/font (${Math.ceil(Math.random() * 11)}).ttf`;

  useEffect(() => {
    socket.on("messageIncoming", (data) => {
      setPlay(true);
      setReset(true);
      const { filtered } = data;
      addHistory(filtered);
      const display = abstractString(filtered);
      setExplode(display);

      setMessage(filtered);
      handleClick();
    });
    (async () => {
      let url = "";
      if (pathname === "/public_view" && searchParams.get("background")) {
        url = searchParams.get("background");
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
      socket.off("messageIncoming");
    };
  }, []);

  useEffect(() => {
    if (play) {
      audio.play();
      audio.loop = true;
    }
  }, [play]);

  console.log(generateVideoURL(backgroundUri));

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <CircularProgress />
      <Box sx={{ height: "100%", width: "100%" }}>
        <ReactPlayer
          url={generateVideoURL(backgroundUri)}
          // url={
          //   "https://rhetoricall.site/backgroundvideos/bluebackgroundtunnel.mp4"
          // }
          loop={true}
          playing={true}
          muted={true}
          width="100%"
          height="100%"
          style={{ position: "absolute", top: "0px", left: "0px" }}
        />
        <div className="canvas-container">
          <Canvas
            gl={{
              antialias: true,
              powerPreference: "high-performance",
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
                    visibleEdgeColor={"yellow"}
                    hiddenEdgeColor={"yellow"}
                    edgeStrength={5}
                  />
                </EffectComposer>

                <Select enabled>
                  {explode && (
                    <ECube1 font={generateRandomFont()} socket={socket} />
                  )}
                  {cube.length > 0 &&
                    cube.map((item, key) => (
                      <Cube index={key} key={key} font={generateRandomFont()} />
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
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </Stack>
  );
}
