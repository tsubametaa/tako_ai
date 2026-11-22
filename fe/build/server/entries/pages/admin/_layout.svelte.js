import "../../../chunks/server2.js";
import { o as AdminAppLayout } from "../../../chunks/admin.js";
//#region src/routes/admin/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	AdminAppLayout($$renderer, {
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