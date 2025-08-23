import config from '../config/environment';

const abstractString = (str) => {
  const words = str.split(" ");
  return words.length > 6 ? words.slice(0, 6).join(" ") : str;
};

const generateVideoURL = (fileName) => {
  // If fileName is already a full URL, return it as is
  if (fileName && (fileName.startsWith('http://') || fileName.startsWith('https://'))) {
    return fileName;
  }
  
  // Otherwise, construct the URL using the app URL
  return `${config.APP_URL}${fileName}`;
};

export { abstractString, generateVideoURL };
