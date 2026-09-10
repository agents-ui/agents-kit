/**
 * What the chat says when there is no model behind it.
 *
 * Demo mode exists so the gallery can be tried without a model or secret: the
 * screen, the streaming, the history all behave as they do with a model, and
 * only the words are canned. Each answer says so, quietly, so nobody mistakes
 * it for a model's.
 */

type DemoAnswer = { match: RegExp; reply: string };

const ANSWERS: DemoAnswer[] = [
  {
    match: /starter|what (is|does) this|about this app|boardui/i,
    reply:
      "This is BoardUI's free chat starter inside Agents Kit: streaming messages, local history, transcript actions, and the animated composer are installed as source you own. This gallery answer is canned and stays entirely in your browser.",
  },
  {
    match: /product update|announcement|release notes|changelog/i,
    reply:
      "Here's a product update in three sentences. This release adds BoardUI's free streaming chat, four thinking indicators, and the animated composer loader to Agents Kit. Every component installs as source, including the local demo transport. This answer is canned so the preview never calls an external API.",
  },
  {
    match: /names?\b.*\b(app|product|scheduling|startup|company)|name ideas|suggest.*names/i,
    reply:
      "Five names for a scheduling app: Slotwise, Tidemark, Cadence, Dayline, and Meridian. Slotwise says what it does, while Cadence and Meridian carry a rhythm. This is a canned local demo answer.",
  },
  {
    match: /key|api|openrouter|openai|anthropic|provider|model/i,
    reply:
      "This gallery preview intentionally has no provider, model, secret, or API route. Its bundled transport emits the same UI message stream from a short local script.",
  },
  {
    match: /hello|hi\b|hey|good (morning|afternoon|evening)/i,
    reply:
      "Hello. I'm the starter's local demo assistant. Try asking what this starter does or request a short product update.",
  },
];

const FALLBACK =
  "I'm a local scripted preview, and that question is not in the demo set. Try asking what this starter does or request a short product update.";

export function pickDemoAnswer(prompt: string): string {
  return ANSWERS.find((answer) => answer.match.test(prompt))?.reply ?? FALLBACK;
}
