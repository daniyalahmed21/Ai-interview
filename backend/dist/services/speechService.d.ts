interface TranscriptionResult {
    text: string;
}
interface SpeechResult {
    audioUrl: string;
}
export declare function transcribeAudio(audioChunk: Buffer): Promise<TranscriptionResult>;
export declare function generateSpeech(text: string): Promise<SpeechResult>;
export {};
//# sourceMappingURL=speechService.d.ts.map