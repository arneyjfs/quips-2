
import axios from "axios";
import {authToken} from "../../../.env_private";

const baseDomain = "https://api.openai.com/v1";
const baseURL = `${baseDomain}`; // Incase of /api/v1;

// ALL DEFUALT CONFIGURATION HERE

export default axios.create({
  baseURL,
  headers: {
    "Authorization": "Bearer " + authToken,
  },
});