import axios from "axios";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}api/`;

class UploadService {
  async uploadBackground(file) {
    const formData = new FormData();
    formData.append('backgroundFile', file);

    const config = { headers: {
        'Content-Type': 'multipart/form-data'
    }}

    const response = await axios.post(API_URL + "upload", formData, config);
    console.log(response.data);
    return response.data;
  }
}

export default new UploadService();
