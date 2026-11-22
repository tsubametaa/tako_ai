import { r as redirect } from "../../chunks/exports.js";
//#region src/routes/+page.server.ts
var load = async () => {
	throw redirect(307, "/home");
};
//#endregion
export { load };

//# sourceMappingURL=_page.server.ts.js.map