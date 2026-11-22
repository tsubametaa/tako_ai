import "../../../chunks/server2.js";
import { n as ChatAppLayout } from "../../../chunks/shell.js";
//#region src/routes/(app)/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	ChatAppLayout($$renderer, {
		children: ($$renderer) => {
			children?.($$renderer);
			$$renderer.push(`<!---->`);
		},
		$$slots: { default: true }
	});
}
//#endregion
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map