/* eslint-disable */
import React, { useState, useEffect } from "react";
import Header from "../../layout/Header";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import useAppStore from "../../../store";
import Button from "@mui/material/Button";
import {
  getAllBackgrounds,
  getNewBackgroundsFromServer,
  removeBackground,
  setDefaultBackground,
} from "../../../services/api";
import { generateVideoURL } from "../../../utils/helper";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import "./Background.scss";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ROWS = [
  {
    _id: "66b076f2596ff5eb6788343a",
    url: "bluebackgroundtunnel.mp4",
    filename: "bluebackgroundtunnel.mp4",
    isDefault: false,
    __v: 0,
  },
  {
    _id: "66b076f2596ff5eb6788343b",
    url: "bluegrid.mp4",
    filename: "bluegrid.mp4",
    isDefault: false,
    __v: 0,
  },
  {
    _id: "66b076f2596ff5eb6788343c",
    url: "connectedlines.mp4",
    filename: "connectedlines.mp4",
    isDefault: false,
    __v: 0,
  },
  {
    _id: "66b076f2596ff5eb6788343d",
    url: "crazygrid.mp4",
    filename: "crazygrid.mp4",
    isDefault: false,
    __v: 0,
  },
  {
    _id: "66b076f2596ff5eb6788343e",
    url: "grid2.mp4",
    filename: "grid2.mp4",
    isDefault: false,
    __v: 0,
  },
  {
    _id: "66b076f2596ff5eb6788343f",
    url: "purplegridcar.mp4",
    filename: "purplegridcar.mp4",
    isDefault: false,
    __v: 0,
  },
  {
    _id: "66b076f2596ff5eb67883440",
    url: "scifi1.mp4",
    filename: "scifi1.mp4",
    isDefault: false,
    __v: 0,
  },
  {
    _id: "66b076f2596ff5eb67883441",
    url: "scifi2.mp4",
    filename: "scifi2.mp4",
    isDefault: false,
    __v: 0,
  },
  {
    _id: "66b076f2596ff5eb67883442",
    url: "scifi3.mp4",
    filename: "scifi3.mp4",
    isDefault: false,
    __v: 0,
  },
  {
    _id: "66b076f2596ff5eb67883443",
    url: "shapes1.mp4",
    filename: "shapes1.mp4",
    isDefault: false,
    __v: 0,
  },
  {
    _id: "66b076f2596ff5eb67883444",
    url: "triangles.mp4",
    filename: "triangles.mp4",
    isDefault: false,
    __v: 0,
  },
  {
    _id: "66b076f2596ff5eb67883445",
    url: "trianglesblue.mp4",
    filename: "trianglesblue.mp4",
    isDefault: false,
    __v: 0,
  },
  {
    _id: "66b076f2596ff5eb67883446",
    url: "tunnel.mp4",
    filename: "tunnel.mp4",
    isDefault: false,
    __v: 0,
  },
  {
    _id: "66b076f2596ff5eb67883447",
    url: "yellowvoid.mp4",
    filename: "yellowvoid.mp4",
    isDefault: false,
    __v: 0,
  },
  {
    _id: "66b122f3da5f426e9162f554",
    url: "movingblue.mp4",
    filename: "movingblue.mp4",
    isDefault: true,
    __v: 0,
  },
];

const Background = () => {
  const { setBackgroundUri } = useAppStore();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

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
              navigator.clipboard.writeText(generateVideoURL(params.row.url));
            }}
          >
            {/* {`${process.env.REACT_APP_APP_URL}public_view?background=${params.row.url}`} */}
            <video style={{ width: "60px", height: "60px" }}>
              <source src={generateVideoURL(params.row.url)} />
            </video>
            {generateVideoURL(params.row.url)}
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
                    setBackgroundUri(generateVideoURL(params.row.url));
                    alert("A new background has been successfully set!");
                    navigate("/");
                  }
                }}
              >
                Set Background
              </button>
              {/* {`  |  `} */}
              {/* <button
                onClick={async () => {
                  const { status } = await removeBackground(params.row._id);
                  if (status === 200) {
                    const results = await getAllBackgrounds();
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
              </button> */}
            </div>
          )
        );
      },
    },
  ];

  const fetchBackgrounds = async () => {
    const results = await getAllBackgrounds();
    const { data } = results;
    const rows = data.map((background, key) => {
      const { _id, url, isDefault } = background;

      return { id: key + 1, url, isDefault, _id };
    });

    setRows(rows);
  };
  useEffect(() => {
    (async () => {
      const results = await getAllBackgrounds();
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

  const onNewBackgoundPressButton = async () => {
    const { data } = await getNewBackgroundsFromServer();
    setOpen(true);
    setMessage("New backgrounds have been added!");
    await fetchBackgrounds();
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Header />
      {/* <Footer /> */}
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
            onClick={() => onNewBackgoundPressButton()}
          >
            Get New Backgrounds
          </Button>
        </Box>
        <Box sx={{ padding: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {rows?.map((item, index) => {
              return (
                <Box
                  className="video-box"
                  sx={{
                    height: "300px",
                    width: "300px",
                    position: "relative",
                    border: "1px solid #000",
                    margin: "10px",
                  }}
                >
                  <video
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  >
                    <source src={generateVideoURL(item?.url)} />
                  </video>
                  {item?.isDefault ? (
                    <Box
                      sx={{
                        position: "absolute",
                        padding: "4px",
                        top: 0,
                        left: 0,
                        backgroundColor: "#1976d2",
                        color: "white",
                        fontSize: "16px",
                        display: item?.isDefault ? "flex" : "none",
                      }}
                    >
                      Default
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "none",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      className="background-button-overlay"
                    >
                      <Button
                        // className="background-button"
                        variant="contained"
                        onClick={async () => {
                          const { status } = await setDefaultBackground(
                            item?._id
                          );
                          if (status === 200) {
                            setBackgroundUri(generateVideoURL(item?.url));
                            alert(
                              "A new background has been successfully set!"
                            );
                            navigate("/");
                          }
                        }}
                      >
                        Set Default
                      </Button>
                      <Button
                        // className="background-button"
                        variant="contained"
                        color="error"
                        onClick={async () => {
                          const { status } = await removeBackground(item?._id);
                          if (status === 200) {
                            await fetchBackgrounds();

                            alert(
                              "A background has been successfully removed!"
                            );
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            // rowsPerPageOptions={[10]}
            autoPageSize
          />*/}
        </Box>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Background;

// const handleChange = async (file) => {
//   setFileBlob(URL.createObjectURL(file));
//   setFile(file);
// };

// const handleUpload = async () => {
//   setLoading(true);
//   const { url, filename } = await UploadService.uploadBackground(file);
//   setBackgroundUri(`${process.env.REACT_APP_BACKEND_URL}static/${filename}`);
//   navigate("/");

//   return filename;
// };

// const handleTypeError = (err) => {
//   alert("Please upload only .mp4 file!");
//   console.log(err);
//   return;
// };
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
