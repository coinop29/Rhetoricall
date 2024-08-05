/* eslint-disable */
import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { FileUploader } from "react-drag-drop-files";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

import UploadService from "../../../services/upload.service";
import useAppStore from "../../../store";
import "./Footer.scss";
import Button from "@mui/material/Button";
const API_URL = `${process.env.REACT_APP_BACKEND_URL}api/`;
const VIDEO_SERVER = `${process.env.REACT_APP_VIDEO_SERVER}/`;

export default function Footer() {
  const [file, setFile] = useState(null);
  const [fileBlob, setFileBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const { backgroundUri, setBackgroundUri } = useAppStore();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);

  const setDefaultBackground = async (_id) => {
    const response = await axios.post(API_URL + "set_default", { _id });

    return response;
  };

  const removeBackground = async (_id) => {
    const response = await axios.post(API_URL + "delete", { _id });
    return response;
  };
  const getNewBackgroundsFromServer = async () => {
    const response = await axios.get(
      API_URL + "getBackgroundsFromExternalServer"
    );
    // return response;
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
            // onClick={() => {
            //   navigator.clipboard.writeText(
            //     `${process.env.REACT_APP_APP_URL}public_view?background=${params.row.url}`
            //   );
            // }}
          >
            {/* {`${process.env.REACT_APP_APP_URL}public_view?background=${params.row.url}`} */}
            <video style={{ width: "60px", height: "60px" }}>
              <source src={`${VIDEO_SERVER}${params.row.url}`} />
            </video>
            {`${VIDEO_SERVER}${params.row.url}`}
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
      editable: false,
      renderCell: (params) => {
        return (
          !params.row.isDefault && (
            <div>
              <button
                onClick={async () => {
                  const { status } = await setDefaultBackground(params.row._id);
                  if (status === 200) {
                    setBackgroundUri(`${VIDEO_SERVER}${params.row.url}`);
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
          )
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
    setBackgroundUri(`${process.env.REACT_APP_BACKEND_URL}static/${filename}`);
    navigate("/");

    return filename;
  };

  const handleTypeError = (err) => {
    alert("Please upload only .mp4 file!");
    console.log(err);
    return;
  };
  // const getVideos = () => {
  //   fetch("https://rhetoricall.site/backgroundvideos/")
  //     .then((response) => response.text())
  //     .then((data) => {
  //       const parser = new DOMParser();
  //       const doc = parser.parseFromString(data, "text/html");
  //       const links = Array.from(doc.querySelectorAll("a"))
  //         .map((link) => link.getAttribute("href"))
  //         .filter((href) => href.endsWith(".mp4"));
  //       console.log(links, data, response);
  //       // setVideos(links);
  //     });
  // };
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
        <Button
          // className="background-button"
          variant="contained"
          onClick={getNewBackgroundsFromServer}
        >
          Get New Backgrounds
        </Button>
        {/* {fileBlob ? (
          <Box
            sx={{
              py: 3,
              px: 2,

              width: "200px",
            }}
          >
            <video width="100%" height="100%">
              <source src={fileBlob} type="video/mp4" />
            </video>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={loading}
              >
                Upload
              </Button>
              <Button
                variant="outlined"
                sx={{ ml: "10px" }}
                onClick={() => setFileBlob(null)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <FileUploader
            handleChange={handleChange}
            name="file"
            types={["mp4"]}
            label="Upload or drop a mp4 file to replace the background"
            onTypeError={handleTypeError}
          />
        )} */}
        {/* <Container>
          <Typography variant="body1">SMS 3D Visualization</Typography>
          <Copyright />
        </Container> */}
      </Box>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10]}
          autoPageSize
        />
      </div>
    </Box>
  );
}
