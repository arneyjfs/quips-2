import OpenAIClient from "@/repositories/Clients/OpenAIClient";
const resource = '/audio/transcriptions';


export default {
    post(audioURL) {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }

        const formData = new FormData();
        formData.append('model', 'whisper-1');
        formData.append('file', audioURL);

        return OpenAIClient.post(`${resource}`, formData, config);
    },

    // MANY OTHER ENDPOINT RELATED STUFFS
};
