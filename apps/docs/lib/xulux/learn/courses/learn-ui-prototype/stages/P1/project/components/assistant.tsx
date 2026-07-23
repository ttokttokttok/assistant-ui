"use client";

import {
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";

export function Assistant() {
  return (
    <ThreadPrimitive.Root className="flex h-full min-w-0 flex-col">
      <header className="min-w-0 border-b border-[var(--border)] px-5 py-4">
        <p className="font-medium">My first assistant</p>
        <p className="text-sm text-[var(--muted-foreground)]">
          Built with assistant-ui primitives
        </p>
      </header>

      <ThreadPrimitive.Viewport className="flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <ThreadPrimitive.Empty>
          <div className="flex min-w-0 flex-1 items-center justify-center p-6 text-center sm:p-8">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold">How can I help?</h1>
              <p className="mt-2 break-words text-[var(--muted-foreground)]">
                Send a message to start the conversation.
              </p>
            </div>
          </div>
        </ThreadPrimitive.Empty>

        <ThreadPrimitive.Messages
          components={{
            UserMessage: UserMessage,
            AssistantMessage: AssistantMessage,
          }}
        />

        <ThreadPrimitive.ViewportFooter className="sticky bottom-0 mt-auto w-full min-w-0 bg-[var(--background)] p-4">
          <ComposerPrimitive.Root className="mx-auto flex w-full max-w-2xl min-w-0 gap-2 rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-2">
            <ComposerPrimitive.Input asChild>
              <textarea
                aria-label="Message"
                placeholder="Ask a question..."
                rows={1}
                className="field-sizing-content max-h-32 min-h-10 min-w-0 flex-1 resize-none bg-transparent px-3 py-2 outline-none"
              />
            </ComposerPrimitive.Input>
            <ComposerPrimitive.Send className="shrink-0 rounded-xl bg-[var(--foreground)] px-4 text-sm font-medium text-[var(--background)] disabled:opacity-40">
              Send
            </ComposerPrimitive.Send>
          </ComposerPrimitive.Root>
        </ThreadPrimitive.ViewportFooter>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
}

function UserMessage() {
  return (
    <MessagePrimitive.Root className="mx-auto flex w-full max-w-2xl min-w-0 justify-end px-4 py-2">
      <div className="max-w-[80%] rounded-2xl bg-[var(--muted)] px-4 py-3">
        <MessagePrimitive.Content />
      </div>
    </MessagePrimitive.Root>
  );
}

function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="mx-auto w-full max-w-2xl min-w-0 px-4 py-3">
      <MessagePrimitive.Content />
    </MessagePrimitive.Root>
  );
}
