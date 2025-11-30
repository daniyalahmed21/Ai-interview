import { transcribeAudio, generateSpeech } from "../speechService.js";
describe("SpeechService", () => {
    test("should transcribe audio chunk (mock)", async () => {
        const audioChunk = Buffer.from("fake-audio-data");
        const result = await transcribeAudio(audioChunk);
        expect(result.text).toBeDefined();
        expect(typeof result.text).toBe("string");
        expect(result.text.length).toBeGreaterThan(0);
    });
    test("should generate speech from text (mock)", async () => {
        const text = "Hello, this is a test question.";
        const result = await generateSpeech(text);
        expect(result.audioUrl).toBeDefined();
        expect(typeof result.audioUrl).toBe("string");
    });
});
//# sourceMappingURL=speechService.test.js.map