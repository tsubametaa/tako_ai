

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.B_pk-Iua.js","_app/immutable/chunks/DMkmXFON.js"];
export const stylesheets = ["_app/immutable/assets/0.Bbv0EoW5.css"];
export const fonts = [];
