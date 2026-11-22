import "../../../../../chunks/server2.js";
import { t as ChatRoomPage } from "../../../../../chunks/chat.js";
//#region src/routes/(app)/chat/[conversationId]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		ChatRoomPage($$renderer, { conversationId: data.conversationId });
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map