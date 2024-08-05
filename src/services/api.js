import axios from "axios";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}api/`;

const getDefaultBackground = async () => {
  try {
    const result = await axios.get(API_URL + "get_default");
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};
const setDefaultBackground = async (_id) => {
  try {
    const response = await axios.post(API_URL + "set_default", { _id });
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const removeBackground = async (_id) => {
  try {
    const response = await axios.post(API_URL + "delete", { _id });
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getNewBackgroundsFromServer = async () => {
  try {
    const response = await axios.get(
      API_URL + "getBackgroundsFromExternalServer"
    );
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getAllBackgrounds = async () => {
  try {
    const results = await axios.get(API_URL + "backgrounds");
    return results;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export {
  getDefaultBackground,
  setDefaultBackground,
  removeBackground,
  getNewBackgroundsFromServer,
  getAllBackgrounds,
};
