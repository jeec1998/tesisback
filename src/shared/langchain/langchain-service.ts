import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LangChainService {
    private readonly llm: ChatGoogleGenerativeAI;
    constructor(configService: ConfigService) {
        const model =
            configService.get<string>('GEMINI_MODEL_NAME') ?? '<model name>';
        const apiKey =
            configService.get<string>('GEMINI_API_KEY') ?? '<api key>';
        this.llm = new ChatGoogleGenerativeAI({
            apiKey,
            model,
            temperature: 0.7,
        });
    }
    async generate(input: string): Promise<string> {
        try {
            const response = await this.llm.invoke(input);
            console.log('input ', response.usage_metadata?.input_tokens);
            console.log('output ', response.usage_metadata?.output_tokens);
            return this.extractJson(response.text);
        } catch (error) {
            console.error(error);
            throw new Error('Error inesperado en generar el refuerzo intentelo de nuevo');
        }
    }

    private extractJson(text: string): string {
        const startJson = text.indexOf('{');
        const endJson = text.lastIndexOf('}');
        if (startJson !== -1 && endJson !== -1) {
            const extractedJson = text.slice(startJson, endJson + 1);
            return extractedJson;
        }

        return '';
    }
}
