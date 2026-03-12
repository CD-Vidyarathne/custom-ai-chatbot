(function () {
  if (typeof window === "undefined") return;

  var NAMESPACE = "customWebChat";

  if (!window[NAMESPACE]) {
    window[NAMESPACE] = {};
  }

  var state = {
    initialized: false,
    iframe: null,
    container: null,
    options: null,
  };

  function createContainer() {
    if (state.container) return state.container;
    var container = document.createElement("div");
    container.id = "webchat-container";
    container.style.position = "fixed";
    container.style.bottom = "16px";
    container.style.right = "16px";
    container.style.zIndex = "2147483647";
    // Closed size matches the chat bubble (64x64) with minimal padding.
    container.style.width = "72px";
    container.style.height = "72px";
    container.style.border = "none";
    container.style.background = "transparent";
    container.style.overflow = "hidden";
    container.style.transition = "width 0.25s ease, height 0.25s ease";
    document.body.appendChild(container);
    state.container = container;
    return container;
  }

  function createIframe(src) {
    if (state.iframe) return state.iframe;
    var iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = "Chat";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.borderRadius = "9999px";
    iframe.style.boxShadow = "0 10px 30px rgba(0,0,0,0.25)";
    iframe.setAttribute("allow", "clipboard-read; clipboard-write");
    createContainer().appendChild(iframe);
    state.iframe = iframe;
    return iframe;
  }

  function normalizeHostUrl(hostUrl) {
    if (!hostUrl) return "";
    return hostUrl.replace(/\/+$/, "");
  }

  function setSizeForState(openOrClosed) {
    var container = createContainer();
    if (openOrClosed === "open") {
      container.style.width = "400px";
      container.style.height = "620px";
      if (state.iframe) {
        state.iframe.style.boxShadow = "none";
        state.iframe.style.border = "none";
      }
    } else {
      container.style.width = "96px";
      container.style.height = "96px";
      if (state.iframe) {
        state.iframe.style.boxShadow = "none";
        state.iframe.style.border = "none";
      }
    }
  }

  function handlePostMessage(event) {
    if (!event || !event.data || typeof event.data !== "object") return;
    var data = event.data;
    if (data.type === "SET_SIZE") {
      setSizeForState(data.state === "open" ? "open" : "closed");
    }
  }

  function init(options) {
    if (!options || typeof options !== "object") {
      throw new Error("customWebChat.init(options) requires an options object");
    }
    if (!options.hostUrl) {
      throw new Error('customWebChat.init: "hostUrl" is required');
    }
    if (!options.chatId) {
      throw new Error('customWebChat.init: "chatId" is required');
    }

    var host = normalizeHostUrl(options.hostUrl);
    var src = host + "/embed/" + encodeURIComponent(options.chatId);

    state.options = options;
    createIframe(src);
    setSizeForState("closed");

    if (!state.initialized) {
      window.addEventListener("message", handlePostMessage);
      state.initialized = true;
    }
  }

  window[NAMESPACE].init = init;
})(); 

