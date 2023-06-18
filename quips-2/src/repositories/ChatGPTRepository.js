import OpenAIClient from "@/repositories/Clients/OpenAIClient";

const resource = '/chat/completions';


export default {
    post(messages) {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const data = {
            "model": "gpt-3.5-turbo",
            "messages": messages
        }

        return OpenAIClient.post(`${resource}`, data, config);
    },

    // MANY OTHER ENDPOINT RELATED STUFFS
};
