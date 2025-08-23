/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UploadService from "../../../services/upload.service";
import useAppStore from "../../../store";
import config from "../../../config/environment";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}api/`;
const VIDEO_SERVER = config.VIDEO_SERVER;

const Footer = () => {
  const { backgroundUri, setBackgroundUri } = useAppStore();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [fileBlob, setFileBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const setDefaultBackground = async (_id) => {
    const response = await axios.post(API_URL + "set_default", { _id });
    return response;
  };

  const removeBackground = async (_id) => {
    const response = await axios.post(API_URL + "delete", { _id });
    return response;
  };

  const columns = [
    {
      field: "_id",
      headerName: "id",
      hide: true,
    },
    {
      field: "id",
      headerName: "No",
      width: 50,
      editable: false,
    },
    {
      field: "url",
      headerName: "File Name",
      width: 300,
      editable: false,
    },
    {
      field: "public",
      headerName: "Public URL",
      width: 300,
      flex: true,
      editable: false,
      renderCell: (params) => {
        return (
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
            onClick={() => {
              navigator.clipboard.writeText(`${VIDEO_SERVER}/${params.row.url}`);
            }}
          >
            <video style={{ width: "60px", height: "60px" }}>
              <source src={`${VIDEO_SERVER}/${params.row.url}`} />
            </video>
            {`${VIDEO_SERVER}/${params.row.url}`}
          </div>
        );
      },
    },
    {
      field: "isDefault",
      headerName: "Default",
      width: 70,
      editable: false,
      renderCell: (params) => {
        return <div>{params.row.isDefault ? "Yes" : "No"}</div>;
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 240,
      renderCell: (params) => {
        return (
          <div>
            <button
              onClick={async () => {
                const { status } = await setDefaultBackground(params.row._id);
                if (status === 200) {
                  setBackgroundUri(`${VIDEO_SERVER}/${params.row.url}`);
                  alert("A new background has been successfully set!");
                  navigate("/");
                }
              }}
            >
              Set Background
            </button>
            {`  |  `}
            <button
              onClick={async () => {
                const { status } = await removeBackground(params.row._id);
                if (status === 200) {
                  const results = await axios.get(API_URL + "backgrounds");
                  const { data } = results;
                  const rows = data.map((background, key) => {
                    const { _id, url, isDefault } = background;

                    return { id: key + 1, url, isDefault, _id };
                  });

                  setRows(rows);

                  await new Promise((resolve) => setTimeout(resolve, 500));

                  alert("A background has been successfully removed!");
                }
              }}
            >
              Remove
            </button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    (async () => {
      const results = await axios.get(API_URL + "backgrounds");
      const { data } = results;
      const rows = data.map((background, key) => {
        const { _id, url, isDefault } = background;

        return { id: key + 1, url, isDefault, _id };
      });

      setRows(rows);
    })();

    return () => {
      console.log("cleanup");
    };
  }, []);

  const handleChange = async (file) => {
    setFileBlob(URL.createObjectURL(file));
    setFile(file);
  };

  const handleUpload = async () => {
    setLoading(true);
    const { url, filename } = await UploadService.uploadBackground(file);
    // Use the video server for uploaded files
    setBackgroundUri(`${VIDEO_SERVER}/${filename}`);
    navigate("/");

    return filename;
  };

  const handleTypeError = (err) => {
    alert("Please upload only .mp4 file!");
    console.log(err);
    return;
  };

  return (
    <Box
      className="Footer"
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        className="Footer-header"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography variant="h6">Background Management</Typography>
        <Box>
          <input
            type="file"
            accept=".mp4"
            onChange={(e) => handleChange(e.target.files[0])}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              disabled={loading}
              sx={{ mr: 1 }}
            >
              {loading ? "Uploading..." : "Choose File"}
            </Button>
          </label>
          {file && (
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={loading}
            >
              Upload
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Current Background: {backgroundUri}
        </Typography>
        
        {fileBlob && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Preview:
            </Typography>
            <video
              controls
              style={{ width: "300px", height: "200px" }}
              src={fileBlob}
            />
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Available Backgrounds
          </Typography>
          <Box sx={{ maxHeight: "400px", overflow: "auto" }}>
            {rows.map((row, index) => (
              <Box
                key={row._id}
                sx={{
                  p: 2,
                  mb: 1,
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography variant="body2" sx={{ minWidth: "50px" }}>
                  {row.id}
                </Typography>
                <Typography variant="body2" sx={{ minWidth: "200px" }}>
                  {row.url}
                </Typography>
                <Chip
                  label={row.isDefault ? "Default" : "Not Default"}
                  color={row.isDefault ? "success" : "default"}
                  size="small"
                />
                <Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setBackgroundUri(`${VIDEO_SERVER}/${row.url}`);
                      alert("Background set successfully!");
                    }}
                    sx={{ mr: 1 }}
                  >
                    Set
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={async () => {
                      const { status } = await removeBackground(row._id);
                      if (status === 200) {
                        const results = await axios.get(API_URL + "backgrounds");
                        const { data } = results;
                        const newRows = data.map((background, key) => {
                          const { _id, url, isDefault } = background;
                          return { id: key + 1, url, isDefault, _id };
                        });
                        setRows(newRows);
                        alert("Background removed successfully!");
                      }
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
