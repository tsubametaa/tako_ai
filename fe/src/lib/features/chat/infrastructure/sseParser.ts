export interface ParsedSSEEvent {
  id?: string;
  event?: string;
  data: string;
}

export class SSEStreamParser {
  private buffer = '';

  push(chunk: string): ParsedSSEEvent[] {
    this.buffer += chunk;
    const events: ParsedSSEEvent[] = [];

    // Split on double newlines (both \r\n and \n)
    const blocks = this.buffer.split(/(?:\r?\n){2}/);

    // The last block might be incomplete, preserve it in the buffer
    this.buffer = blocks.pop() ?? '';

    for (const block of blocks) {
      if (!block.trim()) continue;

      let id: string | undefined;
      let event: string | undefined;
      const dataLines: string[] = [];

      const lines = block.split(/\r?\n/);
      for (const line of lines) {
        if (line.startsWith(':')) {
          // Ignore comments / heartbeats
          continue;
        }
        if (line.startsWith('id:')) {
          id = line.slice(3).trim();
        } else if (line.startsWith('event:')) {
          event = line.slice(6).trim();
        } else if (line.startsWith('data:')) {
          dataLines.push(line.slice(5).trimStart());
        }
      }

      if (dataLines.length > 0 || event || id) {
        events.push({
          id,
          event,
          data: dataLines.join('\n'),
        });
      }
    }

    return events;
  }

  flush(): ParsedSSEEvent[] {
    if (!this.buffer.trim()) {
      this.buffer = '';
      return [];
    }
    const remaining = this.buffer;
    this.buffer = '';
    return this.push(remaining + '\n\n');
  }
}

