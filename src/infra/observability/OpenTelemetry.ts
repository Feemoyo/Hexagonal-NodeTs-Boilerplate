type SpanAttributes = Record<string, unknown>;

export function initOpenTelemetry() {
  console.log('[Observability] OpenTelemetry baseline enabled (console mode)');
}

export function runWithSpan<T>(name: string, fn: () => T, attributes?: SpanAttributes): T {
  const start = Date.now();

  try {
    const result = fn();
    console.log('[Trace]', { name, durationMs: Date.now() - start, attributes });
    return result;
  } catch (error) {
    console.error('[TraceError]', {
      name,
      durationMs: Date.now() - start,
      attributes,
      message: error instanceof Error ? error.message : 'unknown_error',
    });
    throw error;
  }
}
