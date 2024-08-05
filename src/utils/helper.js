const VIDEO_SERVER = `${process.env.REACT_APP_VIDEO_SERVER}`;

const abstractString = (str) => {
  const words = str.split(" ");
  return words.length > 6 ? words.slice(0, 6).join(" ") : str;
};

const generateVideoURL = (fileName) => {
  return `${VIDEO_SERVER}/${fileName}`;
};

export { abstractString, generateVideoURL };
