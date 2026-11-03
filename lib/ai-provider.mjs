/** @param {string|undefined} mode @param {unknown} mockProvider */
export function selectAiProvider(mode, mockProvider) {
  if (!mode || mode === "mock") return mockProvider;
  throw new Error(`AI provider "${mode}" is configured but has no server adapter installed.`);
}
