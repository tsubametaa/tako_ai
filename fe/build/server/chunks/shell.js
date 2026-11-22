import { a as derived, c as head, d as spread_props, f as stringify, h as attr, s as ensure_array_like, t as attr_class, y as escape_html } from "./server2.js";
import { n as themeController, o as Icon, s as page, t as ThemeToggle } from "./theme.js";
import { a as Card, c as authSessionController, i as Dialog, o as Input, s as Button, u as apiRequest } from "./auth.js";
import { n as goto } from "./navigation.js";
import { r as buildSiteUrl, t as buildAuthLoginUrl } from "./subdomains.js";
//#region src/lib/features/shell/presentation/state/drawer.svelte.ts
var SIDEBAR_COLLAPSED_KEY = "kka_sidebar_collapsed";
var DrawerController = class {
	mobileOpen = false;
	desktopCollapsed = false;
	get open() {
		return this.mobileOpen;
	}
	set open(val) {
		this.mobileOpen = val;
	}
	init() {
		if (typeof window === "undefined") return;
		try {
			const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
			if (stored !== null) this.desktopCollapsed = stored === "true";
		} catch {}
	}
	toggleMobile() {
		this.mobileOpen = !this.mobileOpen;
	}
	openDrawer() {
		this.mobileOpen = true;
	}
	closeDrawer() {
		this.mobileOpen = false;
	}
	toggleDesktop() {
		this.desktopCollapsed = !this.desktopCollapsed;
		this.saveDesktopPref();
	}
	collapseDesktop() {
		this.desktopCollapsed = true;
		this.saveDesktopPref();
	}
	extendDesktop() {
		this.desktopCollapsed = false;
		this.saveDesktopPref();
	}
	saveDesktopPref() {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(this.desktopCollapsed));
		} catch {}
	}
};
var drawerController = new DrawerController();
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/bot-message-square.svelte
var __iconData$12 = {
	"name": "bot-message-square",
	"size": 24,
	"node": [
		["path", { "d": "M12 6V2H8" }],
		["path", { "d": "M15 11v2" }],
		["path", { "d": "M2 12h2" }],
		["path", { "d": "M20 12h2" }],
		["path", { "d": "M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" }],
		["path", { "d": "M9 11v2" }]
	]
};
__iconData$12.node;
function Bot_message_square($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$12 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/circle-question-mark.svelte
var __iconData$11 = {
	"name": "circle-question-mark",
	"size": 24,
	"node": [
		["circle", {
			"cx": "12",
			"cy": "12",
			"r": "10"
		}],
		["path", { "d": "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }],
		["path", { "d": "M12 17h.01" }]
	],
	"aliases": ["help-circle", "circle-help"]
};
__iconData$11.node;
function Circle_question_mark($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$11 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/ellipsis-vertical.svelte
var __iconData$10 = {
	"name": "ellipsis-vertical",
	"size": 24,
	"node": [
		["circle", {
			"cx": "12",
			"cy": "12",
			"r": "1"
		}],
		["circle", {
			"cx": "12",
			"cy": "5",
			"r": "1"
		}],
		["circle", {
			"cx": "12",
			"cy": "19",
			"r": "1"
		}]
	],
	"aliases": ["more-vertical"]
};
__iconData$10.node;
function Ellipsis_vertical($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$10 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/message-square.svelte
var __iconData$9 = {
	"name": "message-square",
	"size": 24,
	"node": [["path", { "d": "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" }]]
};
__iconData$9.node;
function Message_square($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$9 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/palette.svelte
var __iconData$8 = {
	"name": "palette",
	"size": 24,
	"node": [
		["path", { "d": "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" }],
		["circle", {
			"cx": "13.5",
			"cy": "6.5",
			"r": ".5",
			"fill": "currentColor"
		}],
		["circle", {
			"cx": "17.5",
			"cy": "10.5",
			"r": ".5",
			"fill": "currentColor"
		}],
		["circle", {
			"cx": "6.5",
			"cy": "12.5",
			"r": ".5",
			"fill": "currentColor"
		}],
		["circle", {
			"cx": "8.5",
			"cy": "7.5",
			"r": ".5",
			"fill": "currentColor"
		}]
	]
};
__iconData$8.node;
function Palette($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$8 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/panel-left-close.svelte
var __iconData$7 = {
	"name": "panel-left-close",
	"size": 24,
	"node": [
		["rect", {
			"width": "18",
			"height": "18",
			"x": "3",
			"y": "3",
			"rx": "2"
		}],
		["path", { "d": "M9 3v18" }],
		["path", { "d": "m16 15-3-3 3-3" }]
	],
	"aliases": ["sidebar-close"]
};
__iconData$7.node;
function Panel_left_close($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$7 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/panel-left-open.svelte
var __iconData$6 = {
	"name": "panel-left-open",
	"size": 24,
	"node": [
		["rect", {
			"width": "18",
			"height": "18",
			"x": "3",
			"y": "3",
			"rx": "2"
		}],
		["path", { "d": "M9 3v18" }],
		["path", { "d": "m14 9 3 3-3 3" }]
	],
	"aliases": ["sidebar-open"]
};
__iconData$6.node;
function Panel_left_open($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$6 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/panel-left.svelte
var __iconData$5 = {
	"name": "panel-left",
	"size": 24,
	"node": [["rect", {
		"width": "18",
		"height": "18",
		"x": "3",
		"y": "3",
		"rx": "2"
	}], ["path", { "d": "M9 3v18" }]],
	"aliases": ["sidebar"]
};
__iconData$5.node;
function Panel_left($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$5 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/plus.svelte
var __iconData$4 = {
	"name": "plus",
	"size": 24,
	"node": [["path", { "d": "M5 12h14" }], ["path", { "d": "M12 5v14" }]]
};
__iconData$4.node;
function Plus($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$4 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/search.svelte
var __iconData$3 = {
	"name": "search",
	"size": 24,
	"node": [["path", { "d": "m21 21-4.34-4.34" }], ["circle", {
		"cx": "11",
		"cy": "11",
		"r": "8"
	}]]
};
__iconData$3.node;
function Search($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$3 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/settings.svelte
var __iconData$2 = {
	"name": "settings",
	"size": 24,
	"node": [["path", { "d": "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" }], ["circle", {
		"cx": "12",
		"cy": "12",
		"r": "3"
	}]]
};
__iconData$2.node;
function Settings($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$2 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/user.svelte
var __iconData$1 = {
	"name": "user",
	"size": 24,
	"node": [["path", { "d": "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }], ["circle", {
		"cx": "12",
		"cy": "7",
		"r": "4"
	}]]
};
__iconData$1.node;
function User($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$1 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/x.svelte
var __iconData = {
	"name": "x",
	"size": 24,
	"node": [["path", { "d": "M18 6 6 18" }], ["path", { "d": "m6 6 12 12" }]]
};
__iconData.node;
function X($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData }]));
}
//#endregion
//#region src/lib/features/shell/presentation/components/ChatHeader.svelte
function ChatHeader($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { title = "Percakapan Baru", onopenmenu } = $$props;
		const toggleTitle = derived(() => drawerController.desktopCollapsed ? "Buka bilah samping" : "Tutup bilah samping");
		$$renderer.push(`<header class="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b-2 border-line bg-surface px-4 lg:px-6"><div class="flex items-center gap-3 min-w-0"><button type="button"${attr_class(`neo-control flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface text-ink hover:bg-surface-soft ${drawerController.desktopCollapsed ? "lg:flex" : "lg:hidden"}`)}${attr("aria-label", toggleTitle())}${attr("title", toggleTitle())}>`);
		Panel_left($$renderer, {
			class: "h-5 w-5 lg:hidden",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----> `);
		Panel_left_open($$renderer, {
			class: "hidden h-5 w-5 text-primary lg:block",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----></button> <div class="flex flex-col min-w-0"><h1 class="truncate text-base font-bold text-ink md:text-lg"${attr("title", title)}>${escape_html(title)}</h1> <span class="text-xs font-semibold text-muted">TAKO AI</span></div></div> <div class="flex items-center gap-2">`);
		ThemeToggle($$renderer, {
			preference: themeController.preference,
			resolved: themeController.resolved,
			oncycle: () => themeController.cycleTheme()
		});
		$$renderer.push(`<!----></div></header>`);
	});
}
//#endregion
//#region src/lib/features/shell/presentation/components/AppShell.svelte
function AppShell($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { sidebar, children } = $$props;
		$$renderer.push(`<div class="relative flex h-dvh w-full overflow-hidden bg-background">`);
		if (drawerController.mobileOpen) $$renderer.push(`<!--[0--><div class="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity lg:hidden" role="presentation"></div>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <aside${attr_class(`fixed inset-y-0 left-0 z-50 flex h-dvh shrink-0 flex-col overflow-hidden border-line bg-surface-soft transition-all duration-300 ease-in-out lg:static lg:z-auto lg:h-full ${drawerController.mobileOpen ? "w-72 translate-x-0 border-r-2 shadow-[6px_0px_0px_var(--neo-shadow-color)]" : "-translate-x-full lg:translate-x-0"} ${drawerController.desktopCollapsed ? "lg:w-0 lg:overflow-hidden lg:border-r-0 lg:opacity-0 pointer-events-none lg:pointer-events-none" : "lg:w-72 lg:border-r-2 lg:opacity-100"}`)} aria-label="Panel riwayat percakapan"><div class="flex h-full w-72 shrink-0 flex-col overflow-hidden">`);
		if (sidebar) {
			$$renderer.push("<!--[0-->");
			sidebar($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></aside> <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
//#region src/lib/features/conversations/domain/conversation.ts
function getJakartaDateKey(date) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Jakarta",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(date);
}
function groupConversationsByDate(conversations, now = /* @__PURE__ */ new Date()) {
	const todayKey = getJakartaDateKey(now);
	const yesterdayKey = getJakartaDateKey(/* @__PURE__ */ new Date(now.getTime() - 864e5));
	const sevenDaysAgo = now.getTime() - 6048e5;
	const thirtyDaysAgo = now.getTime() - 2592e6;
	const groups = {
		"Hari ini": [],
		"Kemarin": [],
		"7 hari terakhir": [],
		"30 hari terakhir": [],
		"Lebih lama": []
	};
	const sorted = [...conversations].sort((a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime());
	for (const conv of sorted) {
		const convDate = new Date(conv.lastActivityAt);
		const convKey = getJakartaDateKey(convDate);
		const convTime = convDate.getTime();
		if (convKey === todayKey) groups["Hari ini"].push(conv);
		else if (convKey === yesterdayKey) groups["Kemarin"].push(conv);
		else if (convTime >= sevenDaysAgo) groups["7 hari terakhir"].push(conv);
		else if (convTime >= thirtyDaysAgo) groups["30 hari terakhir"].push(conv);
		else groups["Lebih lama"].push(conv);
	}
	const result = [];
	for (const label of [
		"Hari ini",
		"Kemarin",
		"7 hari terakhir",
		"30 hari terakhir",
		"Lebih lama"
	]) if (groups[label].length > 0) result.push({
		label,
		conversations: groups[label]
	});
	return result;
}
//#endregion
//#region src/lib/features/conversations/infrastructure/apiConversationRepository.ts
function mapConversation(dto) {
	return {
		id: dto.id,
		title: dto.title,
		createdAt: dto.createdAt,
		lastActivityAt: dto.lastActivityAt || dto.updatedAt || dto.createdAt
	};
}
var ApiConversationRepository = class {
	async list() {
		return ((await apiRequest("/conversations?limit=50")).items || []).map(mapConversation);
	}
	async getById(id) {
		try {
			const res = await apiRequest(`/conversations/${encodeURIComponent(id)}/messages?limit=1`);
			return res.conversation ? mapConversation(res.conversation) : null;
		} catch {
			return null;
		}
	}
	async search(query) {
		const trimmed = query.trim();
		if (!trimmed) return this.list();
		return ((await apiRequest(`/conversations?limit=50&q=${encodeURIComponent(trimmed)}`)).items || []).map(mapConversation);
	}
	async create(initialTitle) {
		return mapConversation(await apiRequest("/conversations", {
			method: "POST",
			body: JSON.stringify({
				clientConversationId: crypto.randomUUID(),
				title: initialTitle.trim().slice(0, 60) || "Percakapan Baru"
			})
		}));
	}
	async rename(id, newTitle) {
		return mapConversation(await apiRequest(`/conversations/${encodeURIComponent(id)}`, {
			method: "PATCH",
			body: JSON.stringify({ title: newTitle.trim().slice(0, 100) })
		}));
	}
	async delete(id) {
		await apiRequest(`/conversations/${encodeURIComponent(id)}`, { method: "DELETE" });
	}
};
//#endregion
//#region src/lib/features/conversations/presentation/state/conversationList.svelte.ts
var ConversationListController = class {
	repository;
	searchTimeout = null;
	activeSearchSeq = 0;
	conversations = [];
	searchQuery = "";
	loading = false;
	activeId = null;
	renameTarget = null;
	deleteTarget = null;
	#groups = derived(() => groupConversationsByDate(this.conversations));
	get groups() {
		return this.#groups();
	}
	set groups($$value) {
		return this.#groups($$value);
	}
	constructor(repository = new ApiConversationRepository()) {
		this.repository = repository;
	}
	async load() {
		this.loading = true;
		try {
			this.conversations = await this.repository.list();
		} catch {
			this.conversations = [];
		} finally {
			this.loading = false;
		}
	}
	onSearchInput(query) {
		this.searchQuery = query;
		if (this.searchTimeout) clearTimeout(this.searchTimeout);
		const currentSeq = ++this.activeSearchSeq;
		this.searchTimeout = setTimeout(async () => {
			this.loading = true;
			try {
				const results = await this.repository.search(query);
				if (currentSeq === this.activeSearchSeq) this.conversations = results;
			} finally {
				if (currentSeq === this.activeSearchSeq) this.loading = false;
			}
		}, 300);
	}
	openRename(conv) {
		this.renameTarget = conv;
	}
	closeRename() {
		this.renameTarget = null;
	}
	async confirmRename(newTitle) {
		if (!this.renameTarget) return;
		const trimmed = newTitle.trim();
		if (!trimmed) return;
		const updated = await this.repository.rename(this.renameTarget.id, trimmed);
		this.conversations = this.conversations.map((c) => c.id === updated.id ? updated : c);
		this.closeRename();
	}
	openDelete(conv) {
		this.deleteTarget = conv;
	}
	closeDelete() {
		this.deleteTarget = null;
	}
	async confirmDelete() {
		if (!this.deleteTarget) return null;
		const deletedId = this.deleteTarget.id;
		await this.repository.delete(deletedId);
		this.conversations = this.conversations.filter((c) => c.id !== deletedId);
		this.closeDelete();
		return deletedId;
	}
	async createNew(initialTitle) {
		const created = await this.repository.create(initialTitle);
		this.upsert(created);
		return created;
	}
	upsert(conv) {
		if (this.conversations.some((c) => c.id === conv.id)) this.conversations = this.conversations.map((c) => c.id === conv.id ? conv : c);
		else this.conversations = [conv, ...this.conversations];
	}
};
var conversationListController = new ConversationListController();
//#endregion
//#region src/lib/features/conversations/presentation/components/ConversationItem.svelte
function ConversationItem($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { conversation, active = false, onselect, onrename, ondelete } = $$props;
		let showMenu = false;
		$$renderer.push(`<div${attr_class(`group relative flex min-h-[44px] w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${active ? "border-2 border-line bg-surface font-bold text-ink shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)]" : "border-2 border-transparent text-ink hover:border-line/40 hover:bg-surface/60"}`)}><a${attr("href", `/chat/${stringify(conversation.id)}`)}${attr("aria-current", active ? "page" : void 0)} class="flex min-h-[40px] flex-1 items-center gap-2.5 truncate">`);
		Message_square($$renderer, {
			class: `h-4 w-4 shrink-0 ${active ? "text-mustard" : "text-muted"}`,
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----> <span class="truncate">${escape_html(conversation.title)}</span></a> <div class="relative"><button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted opacity-80 hover:bg-surface-soft hover:text-ink hover:opacity-100 group-hover:opacity-100"${attr("aria-label", `Opsi percakapan ${stringify(conversation.title)}`)}${attr("aria-expanded", showMenu)}>`);
		Ellipsis_vertical($$renderer, {
			class: "h-4 w-4",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----></button> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
//#region src/lib/features/conversations/presentation/components/ConversationList.svelte
function ConversationList($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { groups = [], activeId = null, onselect, onrename, ondelete } = $$props;
		$$renderer.push(`<div class="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-2">`);
		if (groups.length === 0) $$renderer.push(`<!--[0--><div class="p-4 text-center text-xs text-muted">Belum ada riwayat percakapan.</div>`);
		else {
			$$renderer.push(`<!--[-1--><!--[-->`);
			const each_array = ensure_array_like(groups);
			for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
				let group = each_array[$$index_1];
				$$renderer.push(`<div class="flex flex-col gap-1"><span class="px-3 text-[11px] font-bold uppercase tracking-wider text-muted/80">${escape_html(group.label)}</span> <div class="flex flex-col gap-0.5"><!--[-->`);
				const each_array_1 = ensure_array_like(group.conversations);
				for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
					let conv = each_array_1[$$index];
					ConversationItem($$renderer, {
						conversation: conv,
						active: conv.id === activeId,
						onselect,
						onrename,
						ondelete
					});
				}
				$$renderer.push(`<!--]--></div></div>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/features/conversations/presentation/components/ChatSidebar.svelte
function ChatSidebar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { groups = [], activeId = null, searchQuery = "", userName = "Siswa Kelas X", userSubtitle = "KKA - SMKN / SMAN", onsearch, onnewchat, onselect, onrename, ondelete, onclose, oncollapse, onopensettings, onlogout } = $$props;
		let showProfileMenu = false;
		$$renderer.push(`<div class="flex h-full w-full flex-col justify-between overflow-hidden"><div class="flex flex-col gap-3 p-3 border-b-2 border-line"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><div class="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-line bg-mustard text-xs font-extrabold text-on-mustard shadow-[2px_2px_0px_var(--neo-shadow-color)]" aria-hidden="true">T</div> <span class="text-sm font-extrabold tracking-tight text-ink">TAKO <span class="text-primary">AI</span></span></div> <button type="button" class="neo-control inline-flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-ink hover:bg-surface-soft lg:hidden" aria-label="Tutup panel riwayat">`);
		X($$renderer, {
			class: "h-5 w-5",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----></button> <button type="button" class="neo-control hidden h-9 w-9 items-center justify-center rounded-xl bg-surface text-ink hover:bg-surface-soft lg:inline-flex" aria-label="Tutup bilah samping" title="Tutup bilah samping">`);
		Panel_left_close($$renderer, {
			class: "h-5 w-5",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----></button></div> `);
		Button($$renderer, {
			variant: "primary",
			class: "w-full justify-center",
			onclick: () => onnewchat?.(),
			children: ($$renderer) => {
				Plus($$renderer, {
					class: "h-4 w-4",
					"aria-hidden": "true"
				});
				$$renderer.push(`<!----> <span>Percakapan baru</span>`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> <div class="relative w-full">`);
		Input($$renderer, {
			value: searchQuery,
			placeholder: "Cari percakapan…",
			class: "pl-9 text-xs",
			oninput: (e) => onsearch?.(e.currentTarget.value)
		});
		$$renderer.push(`<!----> `);
		Search($$renderer, {
			class: "pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted/80",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----></div></div> `);
		ConversationList($$renderer, {
			groups,
			activeId,
			onselect,
			onrename,
			ondelete
		});
		$$renderer.push(`<!----> <div class="flex items-center justify-between border-t-2 border-line p-3 bg-surface"><div class="flex items-center gap-2.5 min-w-0"><div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-line bg-sage/30 text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)]">`);
		User($$renderer, {
			class: "h-4 w-4",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----></div> <div class="flex flex-col min-w-0"><span class="truncate text-xs font-bold text-ink">${escape_html(userName)}</span> <span class="text-[10px] font-medium text-muted">${escape_html(userSubtitle)}</span></div></div> <div class="relative"><button type="button" class="neo-control inline-flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-ink hover:bg-mustard hover:text-on-mustard" aria-label="Menu akun dan pengaturan"${attr("aria-expanded", showProfileMenu)}>`);
		Ellipsis_vertical($$renderer, {
			class: "h-4 w-4",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----></button> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div></div>`);
	});
}
//#endregion
//#region src/lib/features/conversations/presentation/components/RenameDialog.svelte
function RenameDialog($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { conversation, oncancel, onsave } = $$props;
		let titleInput = "";
		function handleSubmit() {
			const trimmed = titleInput.trim();
			if (trimmed) onsave(trimmed);
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			{
				function footer($$renderer) {
					Button($$renderer, {
						variant: "secondary",
						size: "sm",
						onclick: oncancel,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Batal`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Button($$renderer, {
						variant: "primary",
						size: "sm",
						disabled: !titleInput.trim(),
						onclick: handleSubmit,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Simpan`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				}
				Dialog($$renderer, {
					open: Boolean(conversation),
					title: "Ubah Judul Percakapan",
					onclose: oncancel,
					footer,
					children: ($$renderer) => {
						$$renderer.push(`<div class="flex flex-col gap-2"><label for="rename-input" class="text-xs font-medium text-muted">Judul baru (maks. 100 karakter)</label> `);
						Input($$renderer, {
							id: "rename-input",
							maxlength: 100,
							placeholder: "Masukkan judul percakapan...",
							onkeydown: (e) => {
								if (e.key === "Enter") handleSubmit();
							},
							get value() {
								return titleInput;
							},
							set value($$value) {
								titleInput = $$value;
								$$settled = false;
							}
						});
						$$renderer.push(`<!----></div>`);
					},
					$$slots: {
						footer: true,
						default: true
					}
				});
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
//#region src/lib/features/conversations/presentation/components/DeleteDialog.svelte
function DeleteDialog($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { conversation, oncancel, onconfirm } = $$props;
		{
			function footer($$renderer) {
				Button($$renderer, {
					variant: "secondary",
					size: "sm",
					onclick: oncancel,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Batal`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Button($$renderer, {
					variant: "danger",
					size: "sm",
					onclick: onconfirm,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Hapus`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			}
			Dialog($$renderer, {
				open: Boolean(conversation),
				title: "Hapus percakapan ini?",
				onclose: oncancel,
				footer,
				children: ($$renderer) => {
					$$renderer.push(`<p class="text-sm text-ink leading-relaxed">Percakapan <strong class="text-ink font-semibold">"${escape_html(conversation?.title)}"</strong> beserta seluruh pesan di dalamnya akan dihapus. Tindakan ini tidak dapat dibatalkan.</p>`);
				},
				$$slots: {
					footer: true,
					default: true
				}
			});
		}
	});
}
//#endregion
//#region src/lib/features/settings/domain/settings.ts
var SETTINGS_TABS = [
	{
		id: "account",
		label: "Akun",
		description: "Informasi profil siswa dan identitas kelas"
	},
	{
		id: "personalization",
		label: "Personalisasi AI",
		description: "Sesuaikan gaya dan kedalaman penjelasan jawaban asisten"
	},
	{
		id: "theme",
		label: "Tema",
		description: "Pilihan mode tampilan dan palet warna visual"
	},
	{
		id: "help",
		label: "Bantuan",
		description: "Panduan belajar KKA dan pertanyaan umum"
	},
	{
		id: "settings",
		label: "Pengaturan",
		description: "Preferensi sistem dan informasi aplikasi"
	}
];
//#endregion
//#region src/lib/features/settings/presentation/components/GeneralSettingsTab.svelte
function GeneralSettingsTab($$renderer) {
	$$renderer.push(`<div class="flex flex-col gap-4"><div class="flex items-center justify-between rounded-xl border-2 border-line bg-surface p-3.5 shadow-[2px_2px_0px_var(--neo-shadow-color)]"><div class="flex flex-col"><span class="text-xs font-bold text-ink">Bahasa Antarmuka</span> <span class="text-[11px] text-muted">Bahasa yang digunakan dalam aplikasi</span></div> <span class="neo-badge bg-mustard px-2.5 py-1 text-xs text-on-mustard">Bahasa Indonesia</span></div> <div class="flex items-center justify-between rounded-xl border-2 border-line bg-surface p-3.5 shadow-[2px_2px_0px_var(--neo-shadow-color)]"><div class="flex flex-col"><span class="text-xs font-bold text-ink">Versi Aplikasi</span> <span class="text-[11px] text-muted">Svelte 5 + SvelteKit + Neo-Brutalism</span></div> <span class="text-xs font-mono font-bold text-muted">v1.1-edu</span></div></div>`);
}
//#endregion
//#region src/lib/features/settings/presentation/components/SettingsModal.svelte
function SettingsModal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, activeTab = "settings", userDisplayName = "Siswa Kelas X", userUsername = "siswa.x01", userClassName = "", userGradeLevel = "", userRole = "student", onclose } = $$props;
		let currentTab = "settings";
		if (open) {
			$$renderer.push(`<!--[0--><div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs md:p-8 lg:p-12" role="presentation"><div role="dialog" aria-modal="true" aria-labelledby="settings-dialog-title" class="neo-box flex h-auto max-h-[92vh] md:max-h-[740px] w-full max-w-2xl md:max-w-[720px] lg:max-w-3xl flex-col overflow-hidden border-2 border-line bg-surface shadow-[8px_8px_0px_var(--neo-shadow-color)]"><div class="flex items-center justify-between border-b-2 border-line bg-surface-soft px-4 py-2.5 md:px-6 md:py-3"><div class="flex items-center gap-2.5 md:gap-3"><div class="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-xl border-2 border-line bg-mustard text-on-mustard shadow-[2px_2px_0px_var(--neo-shadow-color)]">`);
			Settings($$renderer, {
				class: "h-4 w-4 md:h-5 md:w-5",
				"aria-hidden": "true"
			});
			$$renderer.push(`<!----></div> <div><h2 id="settings-dialog-title" class="text-sm font-extrabold text-ink md:text-base leading-tight">Pengaturan &amp; Preferensi</h2> <p class="text-[10.5px] md:text-[11px] text-muted">Personalisasi jawaban TAKO AI, tema visual, dan profil akun</p></div></div> <button type="button" class="neo-control inline-flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-xl bg-surface text-ink hover:bg-danger hover:text-white" aria-label="Tutup pengaturan">`);
			X($$renderer, {
				class: "h-4 w-4",
				"aria-hidden": "true"
			});
			$$renderer.push(`<!----></button></div> <div class="flex border-b-2 border-line bg-surface-soft/60 px-4 py-2 md:px-6 md:py-2.5 gap-2 md:gap-2.5 overflow-x-auto no-scrollbar"><!--[-->`);
			const each_array = ensure_array_like(SETTINGS_TABS);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let tab = each_array[$$index];
				$$renderer.push(`<button type="button"${attr_class(`neo-control inline-flex min-h-[36px] items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs md:text-[13px] font-extrabold transition whitespace-nowrap ${currentTab === tab.id ? "border-2 border-line bg-mustard text-on-mustard shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)]" : "border-2 border-line/30 bg-surface text-ink/80 hover:text-ink hover:border-line hover:bg-surface shadow-none"}`)}>`);
				if (tab.id === "account") {
					$$renderer.push("<!--[0-->");
					User($$renderer, {
						class: "h-4 w-4",
						"aria-hidden": "true"
					});
				} else if (tab.id === "personalization") {
					$$renderer.push("<!--[1-->");
					Bot_message_square($$renderer, {
						class: "h-4 w-4",
						"aria-hidden": "true"
					});
				} else if (tab.id === "theme") {
					$$renderer.push("<!--[2-->");
					Palette($$renderer, {
						class: "h-4 w-4",
						"aria-hidden": "true"
					});
				} else if (tab.id === "help") {
					$$renderer.push("<!--[3-->");
					Circle_question_mark($$renderer, {
						class: "h-4 w-4",
						"aria-hidden": "true"
					});
				} else {
					$$renderer.push("<!--[-1-->");
					Settings($$renderer, {
						class: "h-4 w-4",
						"aria-hidden": "true"
					});
				}
				$$renderer.push(`<!--]--> <span>${escape_html(tab.label)}</span></button>`);
			}
			$$renderer.push(`<!--]--></div> <div class="flex-1 overflow-y-auto p-3.5 md:p-4 text-sm text-ink">`);
			$$renderer.push("<!--[-1-->");
			GeneralSettingsTab($$renderer, {});
			$$renderer.push(`<!--]--></div> <div class="flex items-center justify-end border-t-2 border-line bg-surface-soft px-4 py-2 md:px-6 md:py-2.5">`);
			Button($$renderer, {
				variant: "secondary",
				size: "sm",
				onclick: onclose,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Tutup`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/features/shell/presentation/pages/ChatAppLayout.svelte
function ChatAppLayout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		let settingsOpen = false;
		let settingsActiveTab = "settings";
		const userDisplayName = derived(() => authSessionController.user?.name || "Siswa Kelas X");
		const userUsername = derived(() => authSessionController.user?.username || authSessionController.user?.email || "siswa.x01");
		const userClassName = derived(() => authSessionController.user?.className || "");
		const userGradeLevel = derived(() => authSessionController.user?.gradeLevel || "");
		const userRole = derived(() => authSessionController.user?.role || "student");
		const userSubtitle = derived(() => authSessionController.user ? `@${userUsername()} • ${userClassName() || (userRole() === "teacher" ? "Guru" : "Siswa")}` : "KKA");
		async function handleSelect(id) {
			drawerController.closeDrawer();
			await goto(`/chat/${id}`);
		}
		async function handleNewChat() {
			drawerController.closeDrawer();
			await goto("/chat");
		}
		async function handleDeleteConfirm() {
			const deletedId = await conversationListController.confirmDelete();
			if (deletedId && page.url.pathname.includes(deletedId)) await goto("/chat");
		}
		async function handleLogout() {
			drawerController.closeDrawer();
			await authSessionController.logout();
			const loginUrl = buildAuthLoginUrl(page.url);
			if (loginUrl.startsWith("/")) {
				await goto(loginUrl);
				return;
			}
			window.location.href = loginUrl;
		}
		{
			function sidebar($$renderer) {
				ChatSidebar($$renderer, {
					groups: conversationListController.groups,
					activeId: conversationListController.activeId,
					searchQuery: conversationListController.searchQuery,
					userName: userDisplayName(),
					userSubtitle: userSubtitle(),
					onsearch: (q) => conversationListController.onSearchInput(q),
					onnewchat: handleNewChat,
					onselect: handleSelect,
					onrename: (conv) => conversationListController.openRename(conv),
					ondelete: (conv) => conversationListController.openDelete(conv),
					onclose: () => drawerController.closeDrawer(),
					oncollapse: () => drawerController.collapseDesktop(),
					onopensettings: (tab) => {
						settingsActiveTab = tab;
						settingsOpen = true;
						drawerController.closeDrawer();
					},
					onlogout: handleLogout
				});
			}
			AppShell($$renderer, {
				sidebar,
				children: ($$renderer) => {
					if (children) {
						$$renderer.push("<!--[0-->");
						children($$renderer);
						$$renderer.push(`<!---->`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				},
				$$slots: {
					sidebar: true,
					default: true
				}
			});
		}
		$$renderer.push(`<!----> `);
		RenameDialog($$renderer, {
			conversation: conversationListController.renameTarget,
			oncancel: () => conversationListController.closeRename(),
			onsave: (title) => conversationListController.confirmRename(title)
		});
		$$renderer.push(`<!----> `);
		DeleteDialog($$renderer, {
			conversation: conversationListController.deleteTarget,
			oncancel: () => conversationListController.closeDelete(),
			onconfirm: handleDeleteConfirm
		});
		$$renderer.push(`<!----> `);
		SettingsModal($$renderer, {
			open: settingsOpen,
			activeTab: settingsActiveTab,
			userDisplayName: userDisplayName(),
			userUsername: userUsername(),
			userClassName: userClassName(),
			userGradeLevel: userGradeLevel(),
			userRole: userRole(),
			onclose: () => settingsOpen = false
		});
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region src/lib/features/shell/presentation/pages/ErrorPage.svelte
function ErrorPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { status, message } = $$props;
		const homeHref = derived(() => buildSiteUrl("home", page.url, "/"));
		const heading = derived(() => status === 404 ? "Halaman tidak ditemukan" : "Terjadi kendala saat memuat halaman");
		head("d7v7v9", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(status)} - Tako KKA</title>`);
			});
		});
		$$renderer.push(`<main class="flex min-h-dvh items-center justify-center bg-background px-4 py-12 text-ink">`);
		Card($$renderer, {
			class: "flex w-full max-w-md flex-col items-start gap-4 p-6 md:p-8",
			children: ($$renderer) => {
				$$renderer.push(`<span class="rounded-lg border-2 border-line bg-mustard px-2.5 py-1 text-xs font-extrabold text-on-mustard">HTTP ${escape_html(status)}</span> <h1 class="text-2xl font-extrabold text-ink">${escape_html(heading())}</h1> <p class="text-sm leading-relaxed font-medium text-muted">${escape_html(message || "Periksa kembali alamat URL yang dibuka atau kembali ke halaman utama.")}</p> <div class="flex flex-wrap gap-3 pt-1"><a href="/" class="neo-control inline-flex min-h-[44px] items-center bg-primary px-4 py-2 text-sm font-bold text-on-primary">Kembali ke Beranda Situs</a> <a${attr("href", homeHref())} class="neo-control inline-flex min-h-[44px] items-center bg-surface-soft px-4 py-2 text-sm font-bold text-ink hover:bg-surface">Ke Beranda Tako</a></div>`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></main>`);
	});
}
//#endregion
export { X as a, Plus as c, Panel_left_close as d, Message_square as f, ChatHeader as i, Panel_left as l, ChatAppLayout as n, User as o, drawerController as p, conversationListController as r, Search as s, ErrorPage as t, Panel_left_open as u };

//# sourceMappingURL=shell.js.map