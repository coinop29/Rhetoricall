import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}api/`;

class TwilioService {
  async loadSMSList () {
    const response = await axios.post(API_URL + 'load', {});
    console.log(response.data)    
    return response.data;
  }
}

export default new TwilioService();