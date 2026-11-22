export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	app_dir: "_app",
	app_path: "_app",
	assets: new Set([]),
	mime_types: {},
	client: {start:"_app/immutable/entry/start.77wmuo08.js",app:"_app/immutable/entry/app.B8LkH-fZ.js",imports:["_app/immutable/entry/start.77wmuo08.js","_app/immutable/entry/payload.DSmR2FwN.js","_app/immutable/chunks/BaNbYf_w.js","_app/immutable/chunks/DOstlOSD.js","_app/immutable/chunks/CVd_6mH-.js","_app/immutable/chunks/DMkmXFON.js","_app/immutable/chunks/W7ea1YAO.js","_app/immutable/entry/app.B8LkH-fZ.js","_app/immutable/chunks/DvkSqGBC.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
	
	nodes: [
		__memo(() => import('./nodes/0.js')),
		__memo(() => import('./nodes/1.js')),
		__memo(() => import('./nodes/2.js')),
		__memo(() => import('./nodes/3.js')),
		__memo(() => import('./nodes/4.js')),
		__memo(() => import('./nodes/5.js')),
		__memo(() => import('./nodes/6.js')),
		__memo(() => import('./nodes/7.js')),
		__memo(() => import('./nodes/8.js')),
		__memo(() => import('./nodes/9.js')),
		__memo(() => import('./nodes/10.js')),
		__memo(() => import('./nodes/11.js')),
		__memo(() => import('./nodes/12.js')),
		__memo(() => import('./nodes/13.js'))
	],
	remotes: {
		
	},
	routes: [
		{
			id: "/",
			pattern: /^\/$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 4 },
			endpoint: null
		},
		{
			id: "/admin",
			pattern: /^\/admin\/?$/,
			params: [],
			page: { layouts: [0,3,], errors: [1,,], leaf: 7 },
			endpoint: null
		},
		{
			id: "/admin/audit",
			pattern: /^\/admin\/audit\/?$/,
			params: [],
			page: { layouts: [0,3,], errors: [1,,], leaf: 8 },
			endpoint: null
		},
		{
			id: "/admin/chats",
			pattern: /^\/admin\/chats\/?$/,
			params: [],
			page: { layouts: [0,3,], errors: [1,,], leaf: 9 },
			endpoint: null
		},
		{
			id: "/admin/materi",
			pattern: /^\/admin\/materi\/?$/,
			params: [],
			page: { layouts: [0,3,], errors: [1,,], leaf: 10 },
			endpoint: null
		},
		{
			id: "/admin/students",
			pattern: /^\/admin\/students\/?$/,
			params: [],
			page: { layouts: [0,3,], errors: [1,,], leaf: 11 },
			endpoint: null
		},
		{
			id: "/(app)/chat",
			pattern: /^\/chat\/?$/,
			params: [],
			page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
			endpoint: null
		},
		{
			id: "/(app)/chat/[conversationId]",
			pattern: /^\/chat\/([^/]+?)\/?$/,
			params: [{"name":"conversationId","optional":false,"rest":false,"chained":false}],
			page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
			endpoint: null
		},
		{
			id: "/home",
			pattern: /^\/home\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 12 },
			endpoint: null
		},
		{
			id: "/login",
			pattern: /^\/login\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 13 },
			endpoint: null
		}
	],
	prerendered_routes: new Set([]),
	matchers: async () => {
		return {};
	},
	server_assets: {}
}
})();
