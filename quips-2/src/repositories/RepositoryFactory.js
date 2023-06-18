import WhisperRepository from '@/repositories/WhisperRepository';
import ChatGPTRepository from "@/repositories/ChatGPTRepository";

const repositories = {
    'whisper': WhisperRepository,
    'chatGPT': ChatGPTRepository
}
export default {
    get: name => repositories[name]
};