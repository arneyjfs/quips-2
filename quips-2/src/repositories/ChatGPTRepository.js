import OpenAIClient from "@/repositories/Clients/OpenAIClient";
import {SystemContext} from "@/stores/chatGPTSystemContext";

const resource = '/chat/completions';


export default {
    generate_repsonse(messages) {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const data = {
            "model": "gpt-3.5-turbo",
            "messages": messages.concat([{"role": "user", "content": 'Instruction: generate JSON suggestions'}])
        }

        return OpenAIClient.post(`${resource}`, data, config);
    },

    // MANY OTHER ENDPOINT RELATED STUFFS
};
