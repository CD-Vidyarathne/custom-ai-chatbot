"use client";

import { useEffect } from "react";
import ChatPage from "@/app/chat/page";

export default function EmbedPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.parent.postMessage({ type: "EMBED_LOADED" }, "*");
  }, []);

  return <ChatPage />;
}

