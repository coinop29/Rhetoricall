import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import { FileUploader } from "react-drag-drop-files";
import { useNavigate } from 'react-router-dom';
import UploadService from '../../../services/upload.service';
import useAppStore from "../../../store";
import "./Footer.scss";

export default function Footer() {
  const [file, setFile] = useState(null);
  const { backgroundUri, setBackgroundUri } = useAppStore();
  const navigate = useNavigate();

  const handleChange = async (file) => {
    console.log('uploading file ===>', file);
    const uri = await UploadService.uploadBackground(file);
    setBackgroundUri(`${process.env.REACT_APP_BACKEND_URL}static/${uri}`);
    console.log('uploaded filename is ====>', `${process.env.REACT_APP_BACKEND_URL}static/${uri}`);
    navigate('/')
    return uri;
  };

  const handleTypeError = (err) => {
    alert('Please upload only .mp4 file!');
    console.log(err);
    return;
  }
  return (
    <Box
      className="Footer"
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={["mp4"]}
          label='Upload or drop a mp4 file to replace the background'
          onTypeError={handleTypeError}
          />

        {/* <Container>
          <Typography variant="body1">SMS 3D Visualization</Typography>
          <Copyright />
        </Container> */}
      </Box>
    </Box>
  );
}
