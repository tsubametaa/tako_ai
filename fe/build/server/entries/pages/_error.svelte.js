import "../../chunks/server2.js";
import { s as page } from "../../chunks/theme.js";
import { t as ErrorPage } from "../../chunks/shell.js";
//#region src/routes/+error.svelte
function _error($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		ErrorPage($$renderer, {
			status: page.status,
			message: page.error?.message
		});
	});
}
//#endregion
export { _error as default };

//# sourceMappingURL=_error.svelte.js.map