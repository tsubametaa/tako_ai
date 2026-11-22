import { a as derived, c as head, d as spread_props, f as stringify, h as attr, n as attr_style, s as ensure_array_like, t as attr_class, y as escape_html } from "./server2.js";
import { o as Icon, s as page } from "./theme.js";
import { c as Plus, o as User, s as Search } from "./shell.js";
import { n as Arrow_right, t as Book_open } from "./book-open.js";
import { n as Brain, t as Refresh_cw } from "./refresh-cw.js";
import { a as Card, c as authSessionController, f as clearAuthStorage, g as Eye, i as Dialog, l as ApiError, m as getStoredToken, n as Pagination, o as Input, p as getApiBaseUrl, r as Select, s as Button, u as apiRequest } from "./auth.js";
import "./navigation.js";
import { i as normalizeSitePathname, n as buildSitePath, r as buildSiteUrl, t as buildAuthLoginUrl } from "./subdomains.js";
//#region node_modules/@lucide/svelte/dist/icons/book-open-check.svelte
var __iconData$15 = {
	"name": "book-open-check",
	"size": 24,
	"node": [
		["path", { "d": "M12 5v16" }],
		["path", { "d": "m16 12 2 2 4-4" }],
		["path", { "d": "M22 6V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2h4.001A2 2 0 0022 17v-1.344" }]
	]
};
__iconData$15.node;
function Book_open_check($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$15 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/bot.svelte
var __iconData$14 = {
	"name": "bot",
	"size": 24,
	"node": [
		["path", { "d": "M12 8V4H8" }],
		["rect", {
			"width": "16",
			"height": "12",
			"x": "4",
			"y": "8",
			"rx": "2"
		}],
		["path", { "d": "M2 14h2" }],
		["path", { "d": "M20 14h2" }],
		["path", { "d": "M15 13v2" }],
		["path", { "d": "M9 13v2" }]
	]
};
__iconData$14.node;
function Bot($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$14 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/chart-column.svelte
var __iconData$13 = {
	"name": "chart-column",
	"size": 24,
	"node": [
		["path", { "d": "M3 3v16a2 2 0 0 0 2 2h16" }],
		["path", { "d": "M18 17V9" }],
		["path", { "d": "M13 17V5" }],
		["path", { "d": "M8 17v-3" }]
	],
	"aliases": ["bar-chart-3"]
};
__iconData$13.node;
function Chart_column($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$13 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/download.svelte
var __iconData$12 = {
	"name": "download",
	"size": 24,
	"node": [
		["path", { "d": "M12 15V3" }],
		["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
		["path", { "d": "m7 10 5 5 5-5" }]
	]
};
__iconData$12.node;
function Download($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$12 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/file-search.svelte
var __iconData$11 = {
	"name": "file-search",
	"size": 24,
	"node": [
		["path", { "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }],
		["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }],
		["circle", {
			"cx": "11.5",
			"cy": "14.5",
			"r": "2.5"
		}],
		["path", { "d": "M13.3 16.3 15 18" }]
	]
};
__iconData$11.node;
function File_search($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$11 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/flame.svelte
var __iconData$10 = {
	"name": "flame",
	"size": 24,
	"node": [["path", { "d": "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" }]]
};
__iconData$10.node;
function Flame($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$10 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/graduation-cap.svelte
var __iconData$9 = {
	"name": "graduation-cap",
	"size": 24,
	"node": [
		["path", { "d": "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" }],
		["path", { "d": "M22 10v6" }],
		["path", { "d": "M6 12.5V16a6 3 0 0 0 12 0v-3.5" }]
	]
};
__iconData$9.node;
function Graduation_cap($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$9 }]));
}
({
	"name": "house",
	"size": 24,
	"node": [["path", { "d": "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }], ["path", { "d": "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }]],
	"aliases": ["home"]
}).node;
({
	"name": "layout-dashboard",
	"size": 24,
	"node": [
		["rect", {
			"width": "7",
			"height": "9",
			"x": "3",
			"y": "3",
			"rx": "1"
		}],
		["rect", {
			"width": "7",
			"height": "5",
			"x": "14",
			"y": "3",
			"rx": "1"
		}],
		["rect", {
			"width": "7",
			"height": "9",
			"x": "14",
			"y": "12",
			"rx": "1"
		}],
		["rect", {
			"width": "7",
			"height": "5",
			"x": "3",
			"y": "16",
			"rx": "1"
		}]
	]
}).node;
({
	"name": "log-out",
	"size": 24,
	"node": [
		["path", { "d": "m16 17 5-5-5-5" }],
		["path", { "d": "M21 12H9" }],
		["path", { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }]
	]
}).node;
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/message-square-text.svelte
var __iconData$5 = {
	"name": "message-square-text",
	"size": 24,
	"node": [
		["path", { "d": "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" }],
		["path", { "d": "M7 11h10" }],
		["path", { "d": "M7 15h6" }],
		["path", { "d": "M7 7h8" }]
	]
};
__iconData$5.node;
function Message_square_text($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$5 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/pencil.svelte
var __iconData$4 = {
	"name": "pencil",
	"size": 24,
	"node": [["path", { "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" }], ["path", { "d": "m15 5 4 4" }]]
};
__iconData$4.node;
function Pencil($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$4 }]));
}
({
	"name": "shield-check",
	"size": 24,
	"node": [["path", { "d": "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }], ["path", { "d": "m9 12 2 2 4-4" }]]
}).node;
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/trash.svelte
var __iconData$2 = {
	"name": "trash",
	"size": 24,
	"node": [
		["path", { "d": "M10 11v6" }],
		["path", { "d": "M14 11v6" }],
		["path", { "d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }],
		["path", { "d": "M3 6h18" }],
		["path", { "d": "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]
	],
	"aliases": ["trash-2"]
};
__iconData$2.node;
function Trash($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$2 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/upload.svelte
var __iconData$1 = {
	"name": "upload",
	"size": 24,
	"node": [
		["path", { "d": "M12 3v12" }],
		["path", { "d": "m17 8-5-5-5 5" }],
		["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }]
	]
};
__iconData$1.node;
function Upload($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$1 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/users.svelte
var __iconData = {
	"name": "users",
	"size": 24,
	"node": [
		["path", { "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
		["path", { "d": "M16 3.128a4 4 0 0 1 0 7.744" }],
		["path", { "d": "M22 21v-2a4 4 0 0 0-3-3.87" }],
		["circle", {
			"cx": "9",
			"cy": "7",
			"r": "4"
		}]
	]
};
__iconData.node;
function Users($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData }]));
}
//#endregion
//#region src/lib/features/admin/domain/navigation.ts
var ADMIN_SECTIONS = [
	{
		id: "overview",
		subPath: "/",
		label: "Ringkasan",
		title: "Panel Admin & Guru",
		description: "Pusat kendali pengelolaan akun siswa, pemantauan log percakapan, materi kurikulum global, dan audit pengetahuan otomatis."
	},
	{
		id: "students",
		subPath: "/students",
		label: "Akun Siswa",
		title: "Kelola Akun Siswa",
		description: "Tambah akun siswa baru, perbarui nama/username/NIS dan kelas, reset kata sandi, atau hapus akun siswa.",
		backendEndpoint: "GET / POST / PUT / DELETE /api/v1/admin/students"
	},
	{
		id: "chats",
		subPath: "/chats",
		label: "Log Chat Siswa",
		title: "Log Percakapan Siswa & AI",
		description: "Pantau seluruh riwayat tanya-jawab siswa dengan TAKO AI, periksa sumber RAG, dan hapus percakapan atau pesan tertentu.",
		backendEndpoint: "GET / DELETE /api/v1/admin/chats"
	},
	{
		id: "materi",
		subPath: "/materi",
		label: "Materi Global",
		title: "Dokumen Materi Global (RAG)",
		description: "Unggah dan kelola dokumen acuan kurikulum yang dapat diakses seluruh siswa saat berdiskusi.",
		backendEndpoint: "POST / DELETE /api/v1/admin/rag/documents"
	},
	{
		id: "audit",
		subPath: "/audit",
		label: "Audit Auto-Learn",
		title: "Audit Materi Auto-Learned",
		description: "Tinjau dan bersihkan entri pengetahuan otomatis yang tersimpan dari interaksi pembelajaran.",
		backendEndpoint: "GET /api/v1/admin/rag/auto-learned"
	}
];
//#endregion
//#region src/lib/features/admin/infrastructure/adminAnalyticsApi.ts
async function fetchAdminAnalytics(days = 14, scope = "students") {
	const params = new URLSearchParams({
		days: String(days),
		scope
	});
	return await apiRequest(`/admin/chats/analytics?${params.toString()}`);
}
//#endregion
//#region src/lib/features/admin/infrastructure/adminRagApi.ts
async function uploadGlobalDocument(file, sourceTitle, topic) {
	const formData = new FormData();
	if (sourceTitle.trim()) formData.append("source_title", sourceTitle.trim());
	if (topic.trim()) formData.append("topic", topic.trim());
	formData.append("file", file, file.name);
	return await apiRequest("/admin/rag/documents", {
		method: "POST",
		body: formData
	});
}
async function fetchAutoLearnedDocs(limit = 50) {
	const res = await apiRequest(`/admin/rag/auto-learned?limit=${limit}`);
	if (Array.isArray(res)) return res;
	if (res && Array.isArray(res.items)) return res.items;
	if (res && Array.isArray(res.documents)) return res.documents;
	return [];
}
async function deleteAdminDocument(docId) {
	await apiRequest(`/admin/rag/documents/${encodeURIComponent(docId)}`, { method: "DELETE" });
}
//#endregion
//#region src/lib/features/admin/infrastructure/adminChatsApi.ts
async function fetchAdminChats(query = "", limit = 50) {
	const params = new URLSearchParams({ limit: String(limit) });
	if (query.trim()) params.set("q", query.trim());
	return (await apiRequest(`/admin/chats?${params.toString()}`)).items || [];
}
async function fetchAdminChatMessages(conversationId) {
	return await apiRequest(`/admin/chats/${encodeURIComponent(conversationId)}/messages`);
}
async function deleteAdminChatConversation(conversationId) {
	return await apiRequest(`/admin/chats/${encodeURIComponent(conversationId)}`, { method: "DELETE" });
}
async function deleteAdminChatMessage(conversationId, messageId) {
	await apiRequest(`/admin/chats/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(messageId)}`, { method: "DELETE" });
}
function resolveDownloadFilename(headerValue, fallback) {
	if (!headerValue) return fallback;
	const match = headerValue.match(/filename\*?=(?:UTF-8''|")?([^";\n]+)"?/i);
	if (!match?.[1]) return fallback;
	try {
		return decodeURIComponent(match[1].trim());
	} catch {
		return match[1].trim();
	}
}
async function exportAdminChatsJson(scope = "students") {
	const headers = new Headers({ Accept: "application/json" });
	const token = getStoredToken();
	if (token) headers.set("Authorization", `Bearer ${token}`);
	const res = await fetch(`${getApiBaseUrl()}/admin/chats/export?scope=${encodeURIComponent(scope)}`, {
		method: "GET",
		headers
	});
	if (!res.ok) {
		if (res.status === 401) clearAuthStorage();
		let message = "Gagal mengekspor riwayat chat ke JSON.";
		try {
			const body = await res.json();
			if (body?.error?.message) message = body.error.message;
			else if (body?.message) message = body.message;
		} catch {}
		throw new ApiError(res.status, {
			code: `HTTP_${res.status}`,
			message
		});
	}
	const blob = await res.blob();
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const filename = resolveDownloadFilename(res.headers.get("Content-Disposition"), `tako-ai-chat-history-${scope}-${today}.json`);
	const objectUrl = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = objectUrl;
	anchor.download = filename;
	document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();
	setTimeout(() => URL.revokeObjectURL(objectUrl), 1e3);
	return {
		filename,
		sizeBytes: blob.size
	};
}
//#endregion
//#region src/lib/features/admin/infrastructure/adminStudentsApi.ts
async function listAdminStudents(query = "", classId = "", page = 1, pageSize = 15) {
	const params = new URLSearchParams();
	if (query.trim()) params.set("q", query.trim());
	if (classId.trim()) params.set("class_id", classId.trim());
	params.set("page", String(Math.max(1, page)));
	params.set("page_size", String(pageSize));
	return apiRequest(`/admin/students?${params.toString()}`);
}
async function createAdminStudent(payload) {
	return (await apiRequest("/admin/students", {
		method: "POST",
		body: JSON.stringify(payload)
	})).student;
}
async function updateAdminStudent(id, payload) {
	return (await apiRequest(`/admin/students/${encodeURIComponent(id)}`, {
		method: "PUT",
		body: JSON.stringify(payload)
	})).student;
}
async function deleteAdminStudent(id) {
	await apiRequest(`/admin/students/${encodeURIComponent(id)}`, { method: "DELETE" });
}
//#endregion
//#region src/lib/features/admin/presentation/state/adminAnalytics.svelte.ts
var AdminAnalyticsController = class {
	days = 14;
	scope = "students";
	loading = false;
	errorMessage = null;
	data = null;
	async load() {
		this.loading = true;
		this.errorMessage = null;
		try {
			this.data = await fetchAdminAnalytics(this.days, this.scope);
		} catch (err) {
			this.errorMessage = err instanceof Error ? err.message : "Gagal memuat analitik penggunaan TAKO AI.";
		} finally {
			this.loading = false;
		}
	}
	setDays(nextDays) {
		if (this.days === nextDays) return;
		this.days = nextDays;
		this.load();
	}
	setScope(nextScope) {
		if (this.scope === nextScope) return;
		this.scope = nextScope;
		this.load();
	}
};
//#endregion
//#region src/lib/features/admin/presentation/state/adminRag.svelte.ts
var AdminRagController = class {
	sourceTitle = "";
	topic = "";
	selectedFile = null;
	uploading = false;
	uploadResult = null;
	uploadError = null;
	autoLearned = [];
	loadingAudit = false;
	auditError = null;
	setFile(files) {
		this.selectedFile = files && files.length > 0 ? files[0] : null;
		this.uploadError = null;
		this.uploadResult = null;
	}
	async submitGlobalUpload() {
		if (!this.selectedFile || this.uploading) {
			this.uploadError = "Pilih berkas materi terlebih dahulu.";
			return;
		}
		this.uploading = true;
		this.uploadError = null;
		this.uploadResult = null;
		try {
			const res = await uploadGlobalDocument(this.selectedFile, this.sourceTitle || this.selectedFile.name, this.topic);
			this.uploadResult = `Dokumen berhasil dikirim ke antrean OCR/RAG (Job ID: ${res.job_id || res.doc_id || "queued"}).`;
			this.selectedFile = null;
			this.sourceTitle = "";
			this.topic = "";
		} catch (err) {
			this.uploadError = err instanceof Error ? err.message : "Gagal mengunggah dokumen kurikulum global.";
		} finally {
			this.uploading = false;
		}
	}
	async loadAutoLearned() {
		this.loadingAudit = true;
		this.auditError = null;
		try {
			this.autoLearned = await fetchAutoLearnedDocs(50);
		} catch (err) {
			this.auditError = err instanceof Error ? err.message : "Gagal memuat daftar audit auto-learned dari backend.";
		} finally {
			this.loadingAudit = false;
		}
	}
	async removeDocument(docId) {
		if (!docId) return;
		this.auditError = null;
		try {
			await deleteAdminDocument(docId);
			this.autoLearned = this.autoLearned.filter((d) => (d.doc_id || d.id) !== docId);
		} catch (err) {
			this.auditError = err instanceof Error ? err.message : "Gagal menghapus dokumen.";
		}
	}
};
//#endregion
//#region src/lib/features/admin/presentation/state/adminChats.svelte.ts
var AdminChatsController = class {
	conversations = [];
	searchQuery = "";
	loadingList = false;
	exporting = false;
	selectedConversation = null;
	messages = [];
	loadingMessages = false;
	errorMessage = null;
	statusBanner = null;
	searchTimeout = null;
	async loadConversations() {
		this.loadingList = true;
		this.errorMessage = null;
		try {
			this.conversations = await fetchAdminChats(this.searchQuery, 50);
			if (this.selectedConversation && !this.conversations.some((c) => c.id === this.selectedConversation?.id)) {
				this.selectedConversation = null;
				this.messages = [];
			}
		} catch (err) {
			this.errorMessage = err instanceof Error ? err.message : "Gagal memuat log percakapan siswa dari backend.";
		} finally {
			this.loadingList = false;
		}
	}
	onSearchInput(query) {
		this.searchQuery = query;
		if (this.searchTimeout) clearTimeout(this.searchTimeout);
		this.searchTimeout = setTimeout(() => {
			this.loadConversations();
		}, 300);
	}
	async selectConversation(conv) {
		this.selectedConversation = conv;
		this.loadingMessages = true;
		this.errorMessage = null;
		this.statusBanner = null;
		try {
			const res = await fetchAdminChatMessages(conv.id);
			this.selectedConversation = res.conversation;
			this.messages = res.items || [];
		} catch (err) {
			this.errorMessage = err instanceof Error ? err.message : "Gagal memuat detail pesan percakapan.";
		} finally {
			this.loadingMessages = false;
		}
	}
	async removeConversation(convId) {
		this.errorMessage = null;
		this.statusBanner = null;
		try {
			const res = await deleteAdminChatConversation(convId);
			this.conversations = this.conversations.filter((c) => c.id !== convId);
			if (this.selectedConversation?.id === convId) {
				this.selectedConversation = null;
				this.messages = [];
			}
			this.statusBanner = res.aiSessionSynced ? "Percakapan siswa berhasil dihapus dari Supabase dan Astra DB (kka_lab)." : "Percakapan siswa berhasil dihapus dari database.";
		} catch (err) {
			this.errorMessage = err instanceof Error ? err.message : "Gagal menghapus percakapan.";
		}
	}
	async removeMessage(messageId) {
		if (!this.selectedConversation) return;
		const convId = this.selectedConversation.id;
		this.errorMessage = null;
		this.statusBanner = null;
		try {
			await deleteAdminChatMessage(convId, messageId);
			this.messages = this.messages.filter((m) => m.id !== messageId);
			this.conversations = this.conversations.map((c) => c.id === convId ? {
				...c,
				messageCount: Math.max(0, c.messageCount - 1)
			} : c);
			this.statusBanner = "Pesan berhasil dihapus dari log percakapan.";
		} catch (err) {
			this.errorMessage = err instanceof Error ? err.message : "Gagal menghapus pesan.";
		}
	}
	async exportJson(scope = "students") {
		if (this.exporting) return;
		this.exporting = true;
		this.errorMessage = null;
		this.statusBanner = null;
		try {
			const { filename } = await exportAdminChatsJson(scope);
			this.statusBanner = `Seluruh riwayat chat berhasil diekspor ke ${filename}.`;
		} catch (err) {
			this.errorMessage = err instanceof Error ? err.message : "Gagal mengekspor riwayat chat ke JSON.";
		} finally {
			this.exporting = false;
		}
	}
};
//#endregion
//#region src/lib/features/admin/presentation/state/adminStudents.svelte.ts
var AdminStudentsController = class {
	students = [];
	classes = [];
	searchQuery = "";
	selectedClassId = "";
	page = 1;
	pageSize = 15;
	totalItems = 0;
	totalPages = 1;
	loading = false;
	saving = false;
	deletingId = null;
	errorMessage = null;
	statusBanner = null;
	formError = null;
	formOpen = false;
	editingStudent = null;
	deleteTarget = null;
	searchTimer = null;
	async load() {
		this.loading = true;
		this.errorMessage = null;
		try {
			const res = await listAdminStudents(this.searchQuery, this.selectedClassId, this.page, this.pageSize);
			const rawItems = res.items ?? [];
			this.classes = res.classes ?? [];
			if (res.pagination) {
				this.students = rawItems;
				this.page = res.pagination.page;
				this.pageSize = res.pagination.pageSize;
				this.totalItems = res.pagination.totalItems;
				this.totalPages = Math.max(1, res.pagination.totalPages);
			} else {
				this.totalItems = rawItems.length;
				this.totalPages = Math.max(1, Math.ceil(rawItems.length / this.pageSize));
				if (this.page > this.totalPages) this.page = this.totalPages;
				const start = (this.page - 1) * this.pageSize;
				this.students = rawItems.slice(start, start + this.pageSize);
			}
		} catch (err) {
			this.errorMessage = err instanceof Error ? err.message : "Gagal memuat daftar akun siswa.";
		} finally {
			this.loading = false;
		}
	}
	onSearchInput(value) {
		this.searchQuery = value;
		this.page = 1;
		if (this.searchTimer) clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {
			this.load();
		}, 280);
	}
	onClassFilterChange(classId) {
		this.selectedClassId = classId;
		this.page = 1;
		this.load();
	}
	goToPage(nextPage) {
		const clamped = Math.max(1, Math.min(nextPage, this.totalPages));
		if (clamped === this.page || this.loading) return;
		this.page = clamped;
		this.load();
	}
	setPageSize(nextSize) {
		if (!Number.isFinite(nextSize) || nextSize < 5 || nextSize === this.pageSize) return;
		this.pageSize = nextSize;
		this.page = 1;
		this.load();
	}
	openCreate() {
		this.editingStudent = null;
		this.formError = null;
		this.formOpen = true;
	}
	openEdit(student) {
		this.editingStudent = student;
		this.formError = null;
		this.formOpen = true;
	}
	closeForm() {
		if (this.saving) return;
		this.formOpen = false;
		this.editingStudent = null;
		this.formError = null;
	}
	async submitForm(payload) {
		this.saving = true;
		this.formError = null;
		this.statusBanner = null;
		this.errorMessage = null;
		try {
			if (this.editingStudent) {
				const updated = await updateAdminStudent(this.editingStudent.id, payload);
				this.statusBanner = payload.password ? `Akun ${updated.fullName} dan kata sandi barunya berhasil diperbarui.` : `Data akun ${updated.fullName} berhasil diperbarui.`;
			} else {
				const created = await createAdminStudent(payload);
				this.page = 1;
				this.statusBanner = `Akun siswa ${created.fullName} (@${created.username}) berhasil dibuat.`;
			}
			this.formOpen = false;
			this.editingStudent = null;
			await this.load();
		} catch (err) {
			this.formError = err instanceof Error ? err.message : "Gagal menyimpan akun siswa.";
		} finally {
			this.saving = false;
		}
	}
	openDelete(student) {
		this.deleteTarget = student;
	}
	closeDelete() {
		if (this.deletingId) return;
		this.deleteTarget = null;
	}
	async confirmDelete() {
		const target = this.deleteTarget;
		if (!target || this.deletingId) return;
		this.deletingId = target.id;
		this.errorMessage = null;
		this.statusBanner = null;
		try {
			await deleteAdminStudent(target.id);
			if (this.students.length === 1 && this.page > 1) this.page -= 1;
			this.statusBanner = `Akun siswa ${target.fullName} (@${target.username}) berhasil dihapus.`;
			this.deleteTarget = null;
			await this.load();
		} catch (err) {
			this.errorMessage = err instanceof Error ? err.message : "Gagal menghapus akun siswa.";
		} finally {
			this.deletingId = null;
		}
	}
};
//#endregion
//#region src/lib/features/admin/presentation/pages/AdminAppLayout.svelte
function AdminAppLayout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		const activeSubPath = derived(() => normalizeSitePathname("admin", page.url.pathname));
		derived(() => ADMIN_SECTIONS.map((section) => ({
			id: section.id,
			href: buildSitePath("admin", page.url, section.subPath),
			label: section.label,
			active: activeSubPath() === section.subPath
		})));
		derived(() => ADMIN_SECTIONS.find((section) => section.subPath === activeSubPath())?.title ?? "Panel Admin & Guru");
		derived(() => buildSiteUrl("home", page.url, "/"));
		derived(() => buildSiteUrl("chat", page.url, "/"));
		derived(() => buildAuthLoginUrl(page.url, buildSiteUrl("admin", page.url, activeSubPath())));
		derived(() => authSessionController.user?.name || "Guru Pengampu");
		derived(() => authSessionController.user?.username ? `@${authSessionController.user.username} • Guru` : "Guru Pengampu KKA");
		$$renderer.push(`<!--[-1--><div class="flex min-h-dvh items-center justify-center bg-background text-sm font-semibold text-muted">Memverifikasi akses guru TAKO AI…</div>`);
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/features/admin/presentation/components/ClassComparisonChart.svelte
function ClassComparisonChart($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { classes = [], loading = false } = $$props;
		let hoveredClass = null;
		const maxQuestions = derived(() => Math.max(1, ...classes.map((c) => c.totalQuestions)));
		const totalAllQuestions = derived(() => classes.reduce((acc, c) => acc + c.totalQuestions, 0));
		Card($$renderer, {
			class: "flex flex-col gap-4 p-5",
			children: ($$renderer) => {
				$$renderer.push(`<div class="flex flex-wrap items-start justify-between gap-2"><div><h3 class="text-sm font-extrabold text-ink md:text-base">Perbandingan Penggunaan Antar Kelas</h3> <p class="mt-0.5 text-xs font-medium text-muted">Klasifikasi jumlah pertanyaan &amp; siswa aktif tiap kelas (Normal vs Deep Think).</p></div> <span class="neo-badge bg-surface-soft px-2 py-0.5 text-[10.5px] text-ink tabular-nums">${escape_html(classes.length)} kelas</span></div> `);
				if (loading && classes.length === 0) $$renderer.push(`<!--[0--><div class="flex h-[228px] items-center justify-center rounded-xl border-2 border-dashed border-border-subtle bg-surface-soft text-xs font-bold text-muted">Memuat perbandingan kelas…</div>`);
				else if (classes.length === 0) {
					$$renderer.push(`<!--[1--><div class="flex h-[228px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-subtle bg-surface-soft px-4 text-center">`);
					Graduation_cap($$renderer, {
						class: "h-6 w-6 text-muted",
						"aria-hidden": "true"
					});
					$$renderer.push(`<!----> <p class="text-xs font-extrabold text-ink">Belum ada data kelas terdaftar</p> <p class="text-[11px] text-muted">Tambahkan siswa beserta kelasnya di menu Akun Siswa agar perbandingan muncul di sini.</p></div>`);
				} else {
					$$renderer.push(`<!--[-1--><div class="flex max-h-[268px] flex-col gap-2.5 overflow-y-auto pr-1"><!--[-->`);
					const each_array = ensure_array_like(classes);
					for (let idx = 0, $$length = each_array.length; idx < $$length; idx++) {
						let cl = each_array[idx];
						const widthPct = cl.totalQuestions / maxQuestions() * 100;
						const umumPct = cl.totalQuestions > 0 ? cl.umumCount / cl.totalQuestions * 100 : 0;
						const deepPct = cl.totalQuestions > 0 ? 100 - umumPct : 0;
						const isHovered = hoveredClass === cl.className;
						$$renderer.push(`<div${attr_class(`relative rounded-xl border-2 p-2.5 transition ${isHovered ? "border-line bg-surface-soft shadow-[2px_2px_0px_var(--neo-shadow-color)]" : "border-border-subtle bg-surface"}`)} role="group"${attr("aria-label", `Kelas ${stringify(cl.className)}: ${stringify(cl.totalQuestions)} pertanyaan`)}><div class="mb-1.5 flex items-center justify-between gap-2 text-xs"><div class="flex min-w-0 items-center gap-2"><span class="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-line bg-mustard px-1 text-[10px] font-extrabold text-on-mustard tabular-nums">#${escape_html(idx + 1)}</span> <span class="truncate font-extrabold text-ink">${escape_html(cl.className)}</span> `);
						if (cl.registeredStudents > 0) $$renderer.push(`<!--[0--><span class="hidden text-[10.5px] font-semibold text-muted sm:inline tabular-nums">(${escape_html(cl.activeStudents)}/${escape_html(cl.registeredStudents)} siswa aktif)</span>`);
						else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></div> <div class="shrink-0 text-right tabular-nums"><span class="font-extrabold text-ink">${escape_html(cl.totalQuestions)}</span> <span class="text-[10.5px] font-semibold text-muted">tanya`);
						if (totalAllQuestions() > 0) $$renderer.push(`<!--[0-->• ${escape_html(cl.sharePercent)}%`);
						else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></span></div></div> <div class="h-3 w-full overflow-hidden rounded-full border border-line/40 bg-surface-soft">`);
						if (cl.totalQuestions > 0) {
							$$renderer.push(`<!--[0--><div class="flex h-full overflow-hidden rounded-full transition-all duration-300"${attr_style(`width: ${stringify(Math.max(4, widthPct))}%;`)}>`);
							if (cl.umumCount > 0) $$renderer.push(`<!--[0--><div class="h-full bg-primary"${attr_style(`width: ${stringify(umumPct)}%;`)}${attr("title", `Mode Umum: ${stringify(cl.umumCount)}`)}></div>`);
							else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> `);
							if (cl.terstrukturCount > 0) $$renderer.push(`<!--[0--><div class="h-full bg-mustard"${attr_style(`width: ${stringify(deepPct)}%;`)}${attr("title", `Deep Think: ${stringify(cl.terstrukturCount)}`)}></div>`);
							else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></div> <div class="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-semibold text-muted tabular-nums"><span>Umum: <strong class="text-ink">${escape_html(cl.umumCount)}</strong> • Deep Think: <strong class="text-ink">${escape_html(cl.terstrukturCount)}</strong></span> <span>${escape_html(cl.totalConversations)} sesi chat</span></div></div>`);
					}
					$$renderer.push(`<!--]--></div>`);
				}
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
	});
}
//#endregion
//#region src/lib/features/admin/presentation/components/TopTopicsSummary.svelte
function TopTopicsSummary($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { topics = [], totalQuestions = 0, loading = false } = $$props;
		const maxCount = derived(() => Math.max(1, ...topics.map((t) => t.questionCount)));
		Card($$renderer, {
			class: "flex flex-col gap-4 p-5",
			children: ($$renderer) => {
				$$renderer.push(`<div class="flex flex-wrap items-start justify-between gap-3"><div><h3 class="text-sm font-extrabold text-ink md:text-base">Ringkasan Topik yang Paling Banyak Ditanya Siswa</h3> <p class="mt-0.5 text-xs font-medium text-muted">Dikelompokkan dari sumber materi RAG &amp; kata kunci pertanyaan di seluruh percakapan siswa.</p></div> <span class="neo-badge bg-mustard px-2.5 py-0.5 text-[10.5px] text-on-mustard tabular-nums">${escape_html(topics.length)} topik terdeteksi</span></div> `);
				if (loading && topics.length === 0) $$renderer.push(`<!--[0--><div class="flex h-36 items-center justify-center rounded-xl border-2 border-dashed border-border-subtle bg-surface-soft text-xs font-bold text-muted">Menganalisis topik pertanyaan siswa…</div>`);
				else if (topics.length === 0) {
					$$renderer.push(`<!--[1--><div class="flex h-36 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-subtle bg-surface-soft px-4 text-center">`);
					Book_open_check($$renderer, {
						class: "h-6 w-6 text-muted",
						"aria-hidden": "true"
					});
					$$renderer.push(`<!----> <p class="text-xs font-extrabold text-ink">Belum ada topik pertanyaan yang terekam</p> <p class="text-[11px] text-muted">Ringkasan topik terpopuler akan muncul otomatis begitu siswa berdiskusi dengan TAKO AI.</p></div>`);
				} else {
					$$renderer.push(`<!--[-1--><div class="grid grid-cols-1 gap-3 md:grid-cols-2"><!--[-->`);
					const each_array = ensure_array_like(topics);
					for (let idx = 0, $$length = each_array.length; idx < $$length; idx++) {
						let item = each_array[idx];
						const barPct = item.questionCount / maxCount() * 100;
						$$renderer.push(`<div class="flex flex-col justify-between gap-2.5 rounded-xl border-2 border-line bg-surface-soft p-3.5 shadow-[2px_2px_0px_var(--neo-shadow-color)]"><div class="flex flex-col gap-2"><div class="flex items-start justify-between gap-2"><div class="flex min-w-0 items-center gap-2"><span${attr_class(`inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-lg border-2 border-line px-1.5 text-[11px] font-extrabold tabular-nums ${idx === 0 ? "bg-mustard text-on-mustard" : "bg-surface text-ink"}`)}>#${escape_html(idx + 1)}</span> <h4 class="truncate text-sm font-extrabold text-ink"${attr("title", item.topic)}>${escape_html(item.topic)}</h4></div> <div class="shrink-0 text-right tabular-nums"><span class="text-sm font-extrabold text-ink">${escape_html(item.questionCount)}</span> <span class="text-[11px] font-bold text-muted">tanya`);
						if (totalQuestions > 0) $$renderer.push(`<!--[0-->(${escape_html(item.sharePercent)}%)`);
						else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></span></div></div> <div class="h-2.5 w-full overflow-hidden rounded-full border border-line/40 bg-surface"><div${attr_class(`h-full rounded-full ${idx === 0 ? "bg-mustard" : "bg-primary"}`)}${attr_style(`width: ${stringify(Math.max(5, barPct))}%;`)}></div></div> <div class="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-muted"><span class="tabular-nums">${escape_html(item.studentCount)} siswa bertanya</span> `);
						if (item.terstrukturCount > 0) {
							$$renderer.push(`<!--[0--><span class="inline-flex items-center gap-1 rounded-md border border-line/30 bg-mustard-soft px-1.5 py-0.5 text-[10px] font-bold text-ink tabular-nums">`);
							Brain($$renderer, {
								class: "h-3 w-3",
								"aria-hidden": "true"
							});
							$$renderer.push(`<!----> <span>${escape_html(item.terstrukturCount)} Deep Think</span></span>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> <!--[-->`);
						const each_array_1 = ensure_array_like(item.topClasses);
						for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
							let clsBadge = each_array_1[$$index];
							$$renderer.push(`<span class="rounded-md border border-border-subtle bg-surface px-1.5 py-0.5 text-[10px] font-bold text-ink">${escape_html(clsBadge)}</span>`);
						}
						$$renderer.push(`<!--]--></div></div> `);
						if (item.sampleQuestions.length > 0) {
							$$renderer.push(`<!--[0--><div class="border-t border-border-subtle pt-2"><p class="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-muted">Contoh pertanyaan terbaru:</p> <ul class="flex flex-col gap-1"><!--[-->`);
							const each_array_2 = ensure_array_like(item.sampleQuestions);
							for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
								let q = each_array_2[$$index_1];
								$$renderer.push(`<li class="line-clamp-1 text-[11.5px] font-medium text-ink">“${escape_html(q)}”</li>`);
							}
							$$renderer.push(`<!--]--></ul></div>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></div>`);
					}
					$$renderer.push(`<!--]--></div>`);
				}
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
	});
}
//#endregion
//#region src/lib/features/admin/presentation/components/UsageTimelineChart.svelte
function UsageTimelineChart($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { points = [], days = 14, periodQuestions = 0, loading = false } = $$props;
		let hoveredIdx = null;
		const SVG_W = 640;
		const PAD_LEFT = 36;
		const PAD_TOP = 16;
		const PLOT_W = 590;
		const PLOT_H = 182;
		const maxTotal = derived(() => {
			const peak = Math.max(1, ...points.map((p) => p.total));
			if (peak <= 4) return 4;
			return Math.ceil(peak / 4) * 4;
		});
		const yTicks = derived(() => [
			maxTotal(),
			Math.round(maxTotal() * .75),
			Math.round(maxTotal() * .5),
			Math.round(maxTotal() * .25),
			0
		]);
		const xLabelStep = derived(() => days >= 30 ? 5 : days >= 14 ? 2 : 1);
		const bars = derived(() => {
			const n = Math.max(points.length, 1);
			const slotW = PLOT_W / n;
			const barW = Math.min(26, Math.max(8, slotW * .62));
			return points.map((pt, idx) => {
				const cx = PAD_LEFT + slotW * idx + slotW / 2;
				const x = cx - barW / 2;
				const totalH = pt.total / maxTotal() * PLOT_H;
				const umumH = pt.umum / maxTotal() * PLOT_H;
				const deepH = Math.max(0, totalH - umumH);
				const yBottom = 198;
				return {
					...pt,
					idx,
					cx,
					x,
					barW,
					slotX: PAD_LEFT + slotW * idx,
					slotW,
					umumY: yBottom - umumH,
					umumH,
					deepY: yBottom - totalH,
					deepH,
					showTick: idx % xLabelStep() === 0 || idx === n - 1
				};
			});
		});
		const activePoint = derived(() => null);
		Card($$renderer, {
			class: "flex flex-col gap-4 p-5",
			children: ($$renderer) => {
				$$renderer.push(`<div class="flex flex-wrap items-start justify-between gap-3"><div><h3 class="text-sm font-extrabold text-ink md:text-base">Tren Pertanyaan Harian ke TAKO AI (${escape_html(days)} Hari Terakhir)</h3> <p class="mt-0.5 text-xs font-medium text-muted">Total <strong class="font-extrabold text-ink tabular-nums">${escape_html(periodQuestions)}</strong> pertanyaan dalam periode ini (Mode Umum vs Deep Think).</p></div> <div class="flex flex-wrap items-center gap-3 text-[11px] font-bold text-ink"><span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-[3px] border border-line bg-primary" aria-hidden="true"></span> <span>Mode Umum</span></span> <span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-[3px] border border-line bg-mustard" aria-hidden="true"></span> <span>Deep Think</span></span></div></div> `);
				if (loading && points.length === 0) $$renderer.push(`<!--[0--><div class="flex h-[228px] items-center justify-center rounded-xl border-2 border-dashed border-border-subtle bg-surface-soft text-xs font-bold text-muted">Memuat grafik aktivitas harian…</div>`);
				else if (points.length === 0 || periodQuestions === 0) {
					$$renderer.push(`<!--[1--><div class="flex h-[228px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-subtle bg-surface-soft px-4 text-center">`);
					Chart_column($$renderer, {
						class: "h-6 w-6 text-muted",
						"aria-hidden": "true"
					});
					$$renderer.push(`<!----> <p class="text-xs font-extrabold text-ink">Belum ada aktivitas chat pada ${escape_html(days)} hari terakhir</p> <p class="max-w-sm text-[11px] text-muted">Grafik akan terisi otomatis ketika siswa mulai mengajukan pertanyaan ke TAKO AI.</p></div>`);
				} else {
					$$renderer.push(`<!--[-1--><div class="relative w-full" role="region" aria-label="Grafik penggunaan AI harian">`);
					if (activePoint()) $$renderer.push(`<!--[0--><div class="pointer-events-none absolute top-1 z-20 min-w-[168px] -translate-x-1/2 rounded-xl border-2 border-line bg-surface px-3 py-2 text-[11px] shadow-[3px_3px_0px_var(--neo-shadow-color)]"${attr_style(`left: ${stringify(Math.min(82, Math.max(18, activePoint().cx / SVG_W * 100)))}%;`)}><p class="mb-1 border-b border-border-subtle pb-1 font-extrabold text-ink">${escape_html(activePoint().label)} (${escape_html(activePoint().date)})</p> <div class="flex items-center justify-between gap-3"><span class="inline-flex items-center gap-1.5 text-muted"><span class="h-2 w-2 rounded-[2px] bg-primary" aria-hidden="true"></span> <span>Mode Umum</span></span> <strong class="font-extrabold text-ink tabular-nums">${escape_html(activePoint().umum)}</strong></div> <div class="flex items-center justify-between gap-3"><span class="inline-flex items-center gap-1.5 text-muted"><span class="h-2 w-2 rounded-[2px] bg-mustard" aria-hidden="true"></span> <span>Deep Think</span></span> <strong class="font-extrabold text-ink tabular-nums">${escape_html(activePoint().terstruktur)}</strong></div> <div class="mt-1 flex items-center justify-between gap-3 border-t border-border-subtle pt-1 text-[10.5px]"><span class="font-bold text-muted">Total (${escape_html(activePoint().activeStudents)} siswa)</span> <strong class="font-extrabold text-ink tabular-nums">${escape_html(activePoint().total)}</strong></div></div>`);
					else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <svg viewBox="0 0 640 228" class="h-auto w-full select-none overflow-visible" role="img" aria-label="Diagram batang penggunaan AI harian"><!--[-->`);
					const each_array = ensure_array_like(yTicks());
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let tick = each_array[$$index];
						const y = 198 - tick / maxTotal() * PLOT_H;
						$$renderer.push(`<line${attr("x1", PAD_LEFT)}${attr("x2", 626)}${attr("y1", y)}${attr("y2", y)} stroke="var(--border-subtle)"${attr("stroke-dasharray", tick === 0 ? void 0 : "4 4")} stroke-width="1"></line><text${attr("x", 28)}${attr("y", y + 3.5)} text-anchor="end" fill="var(--muted)" font-size="10" font-weight="600">${escape_html(tick)}</text>`);
					}
					$$renderer.push(`<!--]--><!--[-->`);
					const each_array_1 = ensure_array_like(bars());
					for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
						let b = each_array_1[$$index_1];
						const isHovered = hoveredIdx === b.idx;
						$$renderer.push(`<g tabindex="0" role="button"${attr("aria-label", `${stringify(b.label)}: ${stringify(b.total)} pertanyaan (${stringify(b.umum)} umum, ${stringify(b.terstruktur)} deep think)`)} class="cursor-pointer outline-none"><rect${attr("x", b.slotX)}${attr("y", PAD_TOP)}${attr("width", b.slotW)}${attr("height", PLOT_H)} rx="6"${attr("fill", isHovered ? "var(--surface-soft)" : "transparent")}></rect>`);
						if (b.umumH > 0) $$renderer.push(`<!--[0--><rect${attr("x", b.x)}${attr("y", b.umumY)}${attr("width", b.barW)}${attr("height", b.umumH)} rx="3" fill="var(--primary)" stroke="var(--border)"${attr("stroke-width", isHovered ? "1.5" : "1")}></rect>`);
						else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
						if (b.deepH > 0) $$renderer.push(`<!--[0--><rect${attr("x", b.x)}${attr("y", b.deepY)}${attr("width", b.barW)}${attr("height", b.deepH)} rx="3" fill="var(--mustard)" stroke="var(--border)"${attr("stroke-width", isHovered ? "1.5" : "1")}></rect>`);
						else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
						if (b.showTick) $$renderer.push(`<!--[0--><text${attr("x", b.cx)}${attr("y", 220)} text-anchor="middle"${attr("fill", isHovered ? "var(--text)" : "var(--muted)")} font-size="10"${attr("font-weight", isHovered ? "800" : "600")}>${escape_html(b.label)}</text>`);
						else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></g>`);
					}
					$$renderer.push(`<!--]--></svg></div>`);
				}
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
	});
}
//#endregion
//#region src/lib/features/admin/presentation/pages/AdminOverviewPage.svelte
function AdminOverviewPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctrl = new AdminAnalyticsController();
		const dayOptions = [
			7,
			14,
			30
		];
		const quickModules = derived(() => ADMIN_SECTIONS.filter((section) => section.id !== "overview").map((section) => ({
			...section,
			href: buildSitePath("admin", page.url, section.subPath)
		})));
		head("1yr724i", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Ringkasan Analitik AI - Admin TAKO</title>`);
			});
		});
		$$renderer.push(`<div class="flex flex-col gap-5">`);
		Card($$renderer, {
			class: "flex flex-wrap items-center justify-between gap-4 p-5",
			children: ($$renderer) => {
				$$renderer.push(`<div><h2 class="text-lg font-extrabold text-ink md:text-xl">Ringkasan Penggunaan TAKO AI</h2> <p class="mt-0.5 text-xs font-medium text-muted">Pantau tren pertanyaan siswa, perbandingan keaktifan antar kelas, dan topik KKA paling banyak ditanyakan.</p></div> <div class="flex flex-wrap items-center gap-2"><div class="inline-flex rounded-xl border-2 border-line bg-surface-soft p-0.5" role="group" aria-label="Rentang waktu grafik"><!--[-->`);
				const each_array = ensure_array_like(dayOptions);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let d = each_array[$$index];
					$$renderer.push(`<button type="button"${attr("disabled", ctrl.loading, true)}${attr_class(`rounded-lg px-2.5 py-1 text-xs font-extrabold transition ${ctrl.days === d ? "bg-mustard text-on-mustard shadow-[1.5px_1.5px_0px_var(--neo-shadow-color)]" : "text-muted hover:text-ink"}`)}>${escape_html(d)} Hari</button>`);
				}
				$$renderer.push(`<!--]--></div> <div class="inline-flex rounded-xl border-2 border-line bg-surface-soft p-0.5" role="group" aria-label="Filter akun"><button type="button"${attr("disabled", ctrl.loading, true)}${attr_class(`rounded-lg px-2.5 py-1 text-xs font-extrabold transition ${ctrl.scope === "students" ? "bg-primary text-on-primary shadow-[1.5px_1.5px_0px_var(--neo-shadow-color)]" : "text-muted hover:text-ink"}`)}>Hanya Siswa</button> <button type="button"${attr("disabled", ctrl.loading, true)}${attr_class(`rounded-lg px-2.5 py-1 text-xs font-extrabold transition ${ctrl.scope === "all" ? "bg-primary text-on-primary shadow-[1.5px_1.5px_0px_var(--neo-shadow-color)]" : "text-muted hover:text-ink"}`)}>Semua Akun</button></div> `);
				Button($$renderer, {
					variant: "secondary",
					size: "sm",
					disabled: ctrl.loading,
					onclick: () => ctrl.load(),
					children: ($$renderer) => {
						Refresh_cw($$renderer, {
							class: `h-4 w-4 ${ctrl.loading ? "animate-spin" : ""}`,
							"aria-hidden": "true"
						});
						$$renderer.push(`<!----> <span>Muat Ulang</span>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div>`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		if (ctrl.errorMessage) $$renderer.push(`<!--[0--><p role="alert" class="rounded-xl border-2 border-danger bg-danger/10 px-4 py-2.5 text-xs font-bold text-danger">${escape_html(ctrl.errorMessage)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="grid grid-cols-2 gap-3.5 lg:grid-cols-4">`);
		Card($$renderer, {
			class: "flex flex-col gap-1 p-4",
			children: ($$renderer) => {
				$$renderer.push(`<div class="flex items-center justify-between text-xs font-bold text-muted"><span>Total Pertanyaan</span> `);
				Message_square_text($$renderer, {
					class: "h-4 w-4 text-primary",
					"aria-hidden": "true"
				});
				$$renderer.push(`<!----></div> <p class="text-2xl font-extrabold text-ink tabular-nums">${escape_html(ctrl.data ? ctrl.data.summary.totalQuestions : "—")}</p> <p class="text-[11px] font-medium text-muted tabular-nums">${escape_html(ctrl.data ? `${ctrl.data.summary.totalConversations} sesi percakapan` : "Memuat data…")}</p>`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Card($$renderer, {
			class: "flex flex-col gap-1 p-4",
			children: ($$renderer) => {
				$$renderer.push(`<div class="flex items-center justify-between text-xs font-bold text-muted"><span>Siswa Aktif Bertanya</span> `);
				Users($$renderer, {
					class: "h-4 w-4 text-primary",
					"aria-hidden": "true"
				});
				$$renderer.push(`<!----></div> <p class="text-2xl font-extrabold text-ink tabular-nums">${escape_html(ctrl.data ? ctrl.data.summary.activeStudents : "—")} `);
				if (ctrl.data && ctrl.data.summary.totalRegisteredStudents > 0) $$renderer.push(`<!--[0--><span class="text-sm font-bold text-muted">/ ${escape_html(ctrl.data.summary.totalRegisteredStudents)}</span>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></p> <p class="text-[11px] font-medium text-muted">Kelas teraktif: <strong class="text-ink">${escape_html(ctrl.data?.summary.topClassName ?? "—")}</strong></p>`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Card($$renderer, {
			class: "flex flex-col gap-1 p-4",
			children: ($$renderer) => {
				$$renderer.push(`<div class="flex items-center justify-between text-xs font-bold text-muted"><span>Penggunaan Deep Think</span> `);
				Brain($$renderer, {
					class: "h-4 w-4 text-mustard",
					"aria-hidden": "true"
				});
				$$renderer.push(`<!----></div> <p class="text-2xl font-extrabold text-ink tabular-nums">${escape_html(ctrl.data ? `${ctrl.data.summary.deepThinkPercent}%` : "—")}</p> <p class="text-[11px] font-medium text-muted tabular-nums">${escape_html(ctrl.data ? `${ctrl.data.summary.terstrukturCount} Deep Think • ${ctrl.data.summary.umumCount} Umum` : "Memuat rasio mode…")}</p>`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Card($$renderer, {
			class: "flex flex-col gap-1 p-4",
			children: ($$renderer) => {
				$$renderer.push(`<div class="flex items-center justify-between text-xs font-bold text-muted"><span>Topik Paling Populer</span> `);
				Flame($$renderer, {
					class: "h-4 w-4 text-mustard",
					"aria-hidden": "true"
				});
				$$renderer.push(`<!----></div> <p class="line-clamp-1 text-lg font-extrabold text-ink"${attr("title", ctrl.data?.summary.topTopicName)}>${escape_html(ctrl.data?.summary.topTopicName ?? "—")}</p> <p class="text-[11px] font-medium text-muted">Berdasarkan materi RAG &amp; pertanyaan</p>`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div> <div class="grid grid-cols-1 gap-5 xl:grid-cols-12"><div class="xl:col-span-7">`);
		UsageTimelineChart($$renderer, {
			points: ctrl.data?.dailyUsage ?? [],
			days: ctrl.days,
			periodQuestions: ctrl.data?.summary.periodQuestions ?? 0,
			loading: ctrl.loading
		});
		$$renderer.push(`<!----></div> <div class="xl:col-span-5">`);
		ClassComparisonChart($$renderer, {
			classes: ctrl.data?.classUsage ?? [],
			loading: ctrl.loading
		});
		$$renderer.push(`<!----></div></div> `);
		TopTopicsSummary($$renderer, {
			topics: ctrl.data?.topTopics ?? [],
			totalQuestions: ctrl.data?.summary.totalQuestions ?? 0,
			loading: ctrl.loading
		});
		$$renderer.push(`<!----> <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
		const each_array_1 = ensure_array_like(quickModules());
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let item = each_array_1[$$index_1];
			$$renderer.push(`<a${attr("href", item.href)} class="neo-control flex items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3 text-left transition hover:bg-surface-soft"><div class="flex min-w-0 items-center gap-2.5"><div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-line bg-surface-soft text-ink">`);
			if (item.id === "students") {
				$$renderer.push("<!--[0-->");
				Users($$renderer, {
					class: "h-4 w-4",
					"aria-hidden": "true"
				});
			} else if (item.id === "chats") {
				$$renderer.push("<!--[1-->");
				Message_square_text($$renderer, {
					class: "h-4 w-4",
					"aria-hidden": "true"
				});
			} else if (item.id === "materi") {
				$$renderer.push("<!--[2-->");
				Book_open($$renderer, {
					class: "h-4 w-4",
					"aria-hidden": "true"
				});
			} else {
				$$renderer.push("<!--[-1-->");
				File_search($$renderer, {
					class: "h-4 w-4",
					"aria-hidden": "true"
				});
			}
			$$renderer.push(`<!--]--></div> <span class="truncate text-xs font-extrabold text-ink">${escape_html(item.label)}</span></div> `);
			Arrow_right($$renderer, {
				class: "h-4 w-4 shrink-0 text-muted",
				"aria-hidden": "true"
			});
			$$renderer.push(`<!----></a>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
//#region src/lib/features/admin/presentation/components/StudentFormDialog.svelte
function StudentFormDialog($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open, student, classes, saving, errorMessage, onclose, onsubmit } = $$props;
		let fullName = "";
		let username = "";
		let identifier = "";
		let classId = "";
		let password = "";
		const isEdit = derived(() => student !== null);
		const dialogTitle = derived(() => isEdit() ? "Edit Akun Siswa" : "Tambah Akun Siswa Baru");
		const classOptions = derived(() => [{
			value: "",
			label: "Belum ditetapkan ke kelas"
		}, ...classes.map((cls) => ({
			value: cls.id,
			label: cls.name,
			badge: cls.gradeLevel || void 0
		}))]);
		{
			function footer($$renderer) {
				Button($$renderer, {
					variant: "secondary",
					size: "sm",
					disabled: saving,
					onclick: onclose,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Batal`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Button($$renderer, {
					type: "submit",
					form: "student-account-form",
					variant: "primary",
					size: "sm",
					disabled: saving,
					children: ($$renderer) => {
						$$renderer.push(`<!---->${escape_html(saving ? "Menyimpan…" : isEdit() ? "Simpan Perubahan" : "Buat Akun Siswa")}`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			}
			Dialog($$renderer, {
				open,
				title: dialogTitle(),
				onclose,
				footer,
				children: ($$renderer) => {
					$$renderer.push(`<form id="student-account-form" class="flex flex-col gap-3.5">`);
					if (errorMessage) $$renderer.push(`<!--[0--><p role="alert" class="rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2 text-xs font-bold text-danger">${escape_html(errorMessage)}</p>`);
					else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <div class="flex flex-col gap-1.5"><label for="student-fullname" class="text-xs font-bold text-ink">Nama Lengkap <span class="text-danger">*</span></label> `);
					Input($$renderer, {
						id: "student-fullname",
						value: fullName,
						placeholder: "Contoh: Nino Nakano",
						disabled: saving,
						oninput: (e) => fullName = e.currentTarget.value
					});
					$$renderer.push(`<!----></div> <div class="grid grid-cols-1 gap-3 sm:grid-cols-2"><div class="flex flex-col gap-1.5"><label for="student-username" class="text-xs font-bold text-ink">Username Login <span class="text-danger">*</span></label> `);
					Input($$renderer, {
						id: "student-username",
						value: username,
						placeholder: "Contoh: 052000",
						disabled: saving,
						oninput: (e) => username = e.currentTarget.value
					});
					$$renderer.push(`<!----></div> <div class="flex flex-col gap-1.5"><label for="student-identifier" class="text-xs font-bold text-ink">NIS / Identitas</label> `);
					Input($$renderer, {
						id: "student-identifier",
						value: identifier,
						placeholder: "mis. 05200",
						disabled: saving,
						oninput: (e) => identifier = e.currentTarget.value
					});
					$$renderer.push(`<!----></div></div> <div class="flex flex-col gap-1.5"><label for="student-class" class="text-xs font-bold text-ink">Kelas</label> `);
					Select($$renderer, {
						id: "student-class",
						ariaLabel: "Pilih kelas siswa",
						value: classId,
						options: classOptions(),
						placeholder: "Belum ditetapkan ke kelas",
						disabled: saving,
						onchange: (val) => classId = val
					});
					$$renderer.push(`<!----></div> <div class="flex flex-col gap-1.5"><label for="student-password" class="text-xs font-bold text-ink">${escape_html(isEdit() ? "Reset Kata Sandi (Opsional)" : "Kata Sandi Awal")} `);
					if (!isEdit()) $$renderer.push(`<!--[0--><span class="text-danger">*</span>`);
					else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></label> <div class="relative">`);
					Input($$renderer, {
						id: "student-password",
						type: "password",
						value: password,
						placeholder: isEdit() ? "Kosongkan jika tidak ingin mengubah" : "Minimal 4 karakter",
						class: "pr-11",
						disabled: saving,
						oninput: (e) => password = e.currentTarget.value
					});
					$$renderer.push(`<!----> <button type="button" class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted hover:bg-surface-soft hover:text-ink"${attr("aria-label", "Lihat sandi")}>`);
					$$renderer.push("<!--[-1-->");
					Eye($$renderer, {
						class: "h-4 w-4",
						"aria-hidden": "true"
					});
					$$renderer.push(`<!--]--></button></div> `);
					if (isEdit()) $$renderer.push(`<!--[0--><p class="text-[11px] font-medium text-muted">Isi kolom ini hanya jika ingin mereset kata sandi siswa.</p>`);
					else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div></form>`);
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
//#region src/lib/features/admin/presentation/pages/AdminStudentsPage.svelte
function AdminStudentsPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctrl = new AdminStudentsController();
		const classFilterOptions = derived(() => [{
			value: "",
			label: "Semua Kelas"
		}, ...ctrl.classes.map((cls) => ({
			value: cls.id,
			label: cls.name,
			badge: cls.gradeLevel || void 0
		}))]);
		head("1iggmrf", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Kelola Akun Siswa - TAKO AI</title>`);
			});
		});
		$$renderer.push(`<div class="flex flex-col gap-5">`);
		Card($$renderer, {
			class: "flex flex-wrap items-center justify-between gap-4 p-5 md:p-6",
			children: ($$renderer) => {
				$$renderer.push(`<div class="flex items-center gap-3"><div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-line bg-mustard text-on-mustard shadow-[2px_2px_0px_var(--neo-shadow-color)]">`);
				Users($$renderer, {
					class: "h-5 w-5",
					"aria-hidden": "true"
				});
				$$renderer.push(`<!----></div> <div><div class="flex flex-wrap items-center gap-2"><h2 class="text-lg font-extrabold text-ink md:text-xl">Kelola Akun Siswa</h2> <span class="rounded-lg border border-line/30 bg-surface-soft px-2 py-0.5 text-xs font-extrabold text-ink">${escape_html(ctrl.totalItems)} siswa</span></div> <p class="text-xs font-medium text-muted">Tambah akun baru, ubah kelas &amp; profil, reset kata sandi, atau hapus akses akun siswa.</p></div></div> <div class="flex flex-wrap items-center gap-2">`);
				Button($$renderer, {
					variant: "secondary",
					size: "sm",
					disabled: ctrl.loading,
					onclick: () => ctrl.load(),
					children: ($$renderer) => {
						Refresh_cw($$renderer, {
							class: "h-4 w-4",
							"aria-hidden": "true"
						});
						$$renderer.push(`<!----> <span>${escape_html(ctrl.loading ? "Memuat…" : "Muat Ulang")}</span>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Button($$renderer, {
					variant: "primary",
					size: "sm",
					onclick: () => ctrl.openCreate(),
					children: ($$renderer) => {
						Plus($$renderer, {
							class: "h-4 w-4",
							"aria-hidden": "true"
						});
						$$renderer.push(`<!----> <span>Tambah Siswa</span>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div>`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		if (ctrl.errorMessage) $$renderer.push(`<!--[0--><p role="alert" class="rounded-xl border-2 border-danger bg-danger/10 px-4 py-2.5 text-xs font-bold text-danger">${escape_html(ctrl.errorMessage)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (ctrl.statusBanner) $$renderer.push(`<!--[0--><p class="rounded-xl border-2 border-line bg-mustard-soft px-4 py-2.5 text-xs font-bold text-ink">${escape_html(ctrl.statusBanner)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		Card($$renderer, {
			class: "flex flex-col gap-4 p-4 sm:p-5",
			children: ($$renderer) => {
				$$renderer.push(`<div class="grid grid-cols-1 gap-3 sm:grid-cols-12"><div class="relative sm:col-span-8">`);
				Input($$renderer, {
					value: ctrl.searchQuery,
					placeholder: "Cari nama siswa, username, NIS, atau kelas…",
					class: "pl-9 text-xs sm:text-sm",
					oninput: (e) => ctrl.onSearchInput(e.currentTarget.value)
				});
				$$renderer.push(`<!----> `);
				Search($$renderer, {
					class: "pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted/80",
					"aria-hidden": "true"
				});
				$$renderer.push(`<!----></div> <div class="sm:col-span-4">`);
				Select($$renderer, {
					ariaLabel: "Filter berdasarkan kelas",
					value: ctrl.selectedClassId,
					options: classFilterOptions(),
					placeholder: "Semua Kelas",
					onchange: (val) => ctrl.onClassFilterChange(val)
				});
				$$renderer.push(`<!----></div></div> `);
				if (ctrl.loading) $$renderer.push(`<!--[0--><p class="py-10 text-center text-xs font-bold text-muted">Memuat data akun siswa dari Supabase…</p>`);
				else if (ctrl.students.length === 0) {
					$$renderer.push(`<!--[1--><div class="flex flex-col items-center gap-3 py-10 text-center"><p class="text-sm font-bold text-ink">Belum ada akun siswa yang cocok</p> <p class="max-w-sm text-xs font-medium text-muted">Coba ubah kata kunci pencarian atau tambahkan akun siswa baru agar siswa dapat login ke TAKO AI.</p> `);
					Button($$renderer, {
						variant: "primary",
						size: "sm",
						onclick: () => ctrl.openCreate(),
						children: ($$renderer) => {
							Plus($$renderer, {
								class: "h-4 w-4",
								"aria-hidden": "true"
							});
							$$renderer.push(`<!----> <span>Tambah Akun Siswa</span>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div>`);
				} else {
					$$renderer.push(`<!--[-1--><div class="hidden overflow-x-auto rounded-xl border-2 border-line md:block"><table class="w-full border-collapse text-left text-sm"><thead class="border-b-2 border-line bg-surface-soft text-xs font-extrabold text-muted uppercase"><tr><th class="px-4 py-3">Siswa</th><th class="px-4 py-3">Username</th><th class="px-4 py-3">NIS / ID</th><th class="px-4 py-3">Kelas</th><th class="px-4 py-3 text-right">Aksi</th></tr></thead><tbody class="divide-y divide-line/20 bg-surface"><!--[-->`);
					const each_array = ensure_array_like(ctrl.students);
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let student = each_array[$$index];
						$$renderer.push(`<tr class="transition hover:bg-surface-soft/50"><td class="px-4 py-3"><div class="flex items-center gap-2.5"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-line bg-sage/25 text-ink">`);
						User($$renderer, {
							class: "h-4 w-4",
							"aria-hidden": "true"
						});
						$$renderer.push(`<!----></span> <span class="font-bold text-ink">${escape_html(student.fullName)}</span></div></td><td class="px-4 py-3 font-mono text-xs font-semibold text-ink">@${escape_html(student.username || "-")}</td><td class="px-4 py-3 text-xs font-medium text-muted">${escape_html(student.identifier || "-")}</td><td class="px-4 py-3">`);
						if (student.className) {
							$$renderer.push(`<!--[0--><span class="inline-flex items-center gap-1 rounded-lg border border-line/35 bg-mustard-soft px-2.5 py-1 text-xs font-bold text-ink">`);
							Graduation_cap($$renderer, {
								class: "h-3.5 w-3.5 shrink-0",
								"aria-hidden": "true"
							});
							$$renderer.push(`<!----> <span>${escape_html(student.className)}</span></span>`);
						} else $$renderer.push(`<!--[-1--><span class="text-xs font-medium text-muted">Belum diatur</span>`);
						$$renderer.push(`<!--]--></td><td class="px-4 py-3"><div class="flex items-center justify-end gap-2"><button type="button" class="inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border-2 border-line bg-surface px-2.5 py-1 text-xs font-bold text-ink transition hover:bg-mustard hover:text-on-mustard">`);
						Pencil($$renderer, {
							class: "h-3.5 w-3.5",
							"aria-hidden": "true"
						});
						$$renderer.push(`<!----> <span>Edit</span></button> <button type="button" class="inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border-2 border-danger/60 bg-danger/10 px-2.5 py-1 text-xs font-bold text-danger transition hover:bg-danger hover:text-white">`);
						Trash($$renderer, {
							class: "h-3.5 w-3.5",
							"aria-hidden": "true"
						});
						$$renderer.push(`<!----> <span>Hapus</span></button></div></td></tr>`);
					}
					$$renderer.push(`<!--]--></tbody></table></div> <div class="flex flex-col gap-3 md:hidden"><!--[-->`);
					const each_array_1 = ensure_array_like(ctrl.students);
					for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
						let student = each_array_1[$$index_1];
						$$renderer.push(`<div class="flex flex-col gap-3 rounded-xl border-2 border-line bg-surface-soft p-3.5"><div class="flex items-start justify-between gap-2"><div class="flex min-w-0 items-center gap-2.5"><span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-line bg-sage/25 text-ink">`);
						User($$renderer, {
							class: "h-4 w-4",
							"aria-hidden": "true"
						});
						$$renderer.push(`<!----></span> <div class="min-w-0"><p class="truncate text-sm font-extrabold text-ink">${escape_html(student.fullName)}</p> <p class="truncate font-mono text-xs font-medium text-muted">@${escape_html(student.username || "-")}${escape_html(student.identifier ? ` • NIS ${student.identifier}` : "")}</p></div></div></div> <div class="flex items-center justify-between gap-2 border-t border-line/15 pt-2.5">`);
						if (student.className) {
							$$renderer.push(`<!--[0--><span class="inline-flex items-center gap-1 rounded-lg border border-line/35 bg-mustard-soft px-2.5 py-1 text-[11px] font-bold text-ink">`);
							Graduation_cap($$renderer, {
								class: "h-3.5 w-3.5 shrink-0",
								"aria-hidden": "true"
							});
							$$renderer.push(`<!----> <span>${escape_html(student.className)}</span></span>`);
						} else $$renderer.push(`<!--[-1--><span class="text-xs font-medium text-muted">Kelas belum diatur</span>`);
						$$renderer.push(`<!--]--> <div class="flex items-center gap-1.5"><button type="button" class="inline-flex min-h-[34px] items-center gap-1 rounded-lg border-2 border-line bg-surface px-2.5 text-xs font-bold text-ink">`);
						Pencil($$renderer, {
							class: "h-3.5 w-3.5",
							"aria-hidden": "true"
						});
						$$renderer.push(`<!----> <span>Edit</span></button> <button type="button" class="inline-flex min-h-[34px] items-center gap-1 rounded-lg border-2 border-danger/60 bg-danger/10 px-2.5 text-xs font-bold text-danger">`);
						Trash($$renderer, {
							class: "h-3.5 w-3.5",
							"aria-hidden": "true"
						});
						$$renderer.push(`<!----> <span>Hapus</span></button></div></div></div>`);
					}
					$$renderer.push(`<!--]--></div> `);
					Pagination($$renderer, {
						page: ctrl.page,
						pageSize: ctrl.pageSize,
						totalItems: ctrl.totalItems,
						totalPages: ctrl.totalPages,
						disabled: ctrl.loading,
						itemLabel: "siswa",
						onpagechange: (p) => ctrl.goToPage(p),
						onpagesizechange: (size) => ctrl.setPageSize(size)
					});
					$$renderer.push(`<!---->`);
				}
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div> `);
		StudentFormDialog($$renderer, {
			open: ctrl.formOpen,
			student: ctrl.editingStudent,
			classes: ctrl.classes,
			saving: ctrl.saving,
			errorMessage: ctrl.formError,
			onclose: () => ctrl.closeForm(),
			onsubmit: (payload) => ctrl.submitForm(payload)
		});
		$$renderer.push(`<!----> `);
		{
			function footer($$renderer) {
				Button($$renderer, {
					variant: "secondary",
					size: "sm",
					disabled: ctrl.deletingId !== null,
					onclick: () => ctrl.closeDelete(),
					children: ($$renderer) => {
						$$renderer.push(`<!---->Batal`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Button($$renderer, {
					variant: "danger",
					size: "sm",
					disabled: ctrl.deletingId !== null,
					onclick: () => ctrl.confirmDelete(),
					children: ($$renderer) => {
						$$renderer.push(`<!---->${escape_html(ctrl.deletingId ? "Menghapus…" : "Ya, Hapus Akun")}`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			}
			Dialog($$renderer, {
				open: ctrl.deleteTarget !== null,
				title: "Hapus Akun Siswa?",
				onclose: () => ctrl.closeDelete(),
				footer,
				children: ($$renderer) => {
					if (ctrl.deleteTarget) $$renderer.push(`<!--[0--><p class="leading-relaxed text-ink">Akun <strong>${escape_html(ctrl.deleteTarget.fullName)}</strong> (<code>@${escape_html(ctrl.deleteTarget.username)}</code>) akan dihapus permanen dari database sekolah dan tidak bisa lagi login ke TAKO AI.</p>`);
					else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				},
				$$slots: {
					footer: true,
					default: true
				}
			});
		}
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region src/lib/features/admin/presentation/pages/AdminChatsPage.svelte
function AdminChatsPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctrl = new AdminChatsController();
		const overviewHref = derived(() => buildSitePath("admin", page.url, "/"));
		function formatDateTime(iso) {
			try {
				return new Intl.DateTimeFormat("id-ID", {
					dateStyle: "medium",
					timeStyle: "short",
					timeZone: "Asia/Jakarta"
				}).format(new Date(iso));
			} catch {
				return iso;
			}
		}
		head("1jvkn0y", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Log Chat Siswa - Admin KKA</title>`);
			});
		});
		$$renderer.push(`<div class="flex flex-col gap-5">`);
		Card($$renderer, {
			class: "flex flex-wrap items-center justify-between gap-4 p-5 md:p-6",
			children: ($$renderer) => {
				$$renderer.push(`<div class="flex items-center gap-3"><div class="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-line bg-mustard text-on-mustard shadow-[2px_2px_0px_var(--neo-shadow-color)]">`);
				Message_square_text($$renderer, {
					class: "h-5 w-5",
					"aria-hidden": "true"
				});
				$$renderer.push(`<!----></div> <div><h2 class="text-lg font-extrabold text-ink md:text-xl">Log Percakapan Siswa dengan AI</h2> <p class="text-xs font-medium text-muted">Tinjau interaksi siswa dan hapus riwayat chat (tersinkronisasi ke Supabase &amp; Astra DB <code class="font-mono text-ink">kka_lab</code>)</p></div></div> <div class="flex flex-wrap items-center gap-2">`);
				Button($$renderer, {
					variant: "accent",
					size: "sm",
					disabled: ctrl.exporting,
					onclick: () => ctrl.exportJson("students"),
					children: ($$renderer) => {
						Download($$renderer, {
							class: "h-4 w-4",
							"aria-hidden": "true"
						});
						$$renderer.push(`<!----> <span>${escape_html(ctrl.exporting ? "Mengekspor…" : "Export JSON")}</span>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Button($$renderer, {
					variant: "secondary",
					size: "sm",
					disabled: ctrl.loadingList,
					onclick: () => ctrl.loadConversations(),
					children: ($$renderer) => {
						Refresh_cw($$renderer, {
							class: "h-4 w-4",
							"aria-hidden": "true"
						});
						$$renderer.push(`<!----> <span>${escape_html(ctrl.loadingList ? "Memuat…" : "Muat Ulang")}</span>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> <a${attr("href", overviewHref())} class="neo-control inline-flex min-h-9.5 items-center bg-surface-soft px-3.5 py-1.5 text-xs font-bold text-ink hover:bg-surface">Ringkasan</a></div>`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		if (ctrl.errorMessage) $$renderer.push(`<!--[0--><p class="rounded-xl border-2 border-danger bg-danger/10 px-4 py-2.5 text-xs font-bold text-danger">${escape_html(ctrl.errorMessage)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (ctrl.statusBanner) $$renderer.push(`<!--[0--><p class="rounded-xl border-2 border-line bg-mustard/20 px-4 py-2.5 text-xs font-bold text-ink">${escape_html(ctrl.statusBanner)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="grid grid-cols-1 gap-5 lg:grid-cols-12">`);
		Card($$renderer, {
			class: "flex flex-col gap-3.5 p-4 lg:col-span-5",
			children: ($$renderer) => {
				$$renderer.push(`<div class="relative w-full">`);
				Input($$renderer, {
					value: ctrl.searchQuery,
					placeholder: "Cari nama siswa, NIS, username, atau judul chat…",
					class: "pl-9 text-xs",
					oninput: (e) => ctrl.onSearchInput(e.currentTarget.value)
				});
				$$renderer.push(`<!----> `);
				Search($$renderer, {
					class: "pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted/80",
					"aria-hidden": "true"
				});
				$$renderer.push(`<!----></div> `);
				if (ctrl.loadingList) $$renderer.push(`<!--[0--><p class="py-6 text-center text-xs font-bold text-muted">Memuat daftar percakapan siswa…</p>`);
				else if (ctrl.conversations.length === 0) $$renderer.push(`<!--[1--><p class="py-6 text-center text-xs font-medium text-muted">Belum ada percakapan siswa yang ditemukan.</p>`);
				else {
					$$renderer.push(`<!--[-1--><div class="flex max-h-[540px] flex-col gap-2.5 overflow-y-auto pr-1"><!--[-->`);
					const each_array = ensure_array_like(ctrl.conversations);
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let conv = each_array[$$index];
						const isSelected = ctrl.selectedConversation?.id === conv.id;
						$$renderer.push(`<div${attr_class(`flex flex-col gap-2 rounded-xl border-2 border-line p-3 transition ${isSelected ? "bg-mustard/15 shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)]" : "bg-surface-soft hover:bg-surface"}`)}><div class="flex items-start justify-between gap-2"><button type="button" class="flex-1 text-left"><p class="line-clamp-1 text-xs font-extrabold text-ink">${escape_html(conv.title)}</p> <p class="mt-0.5 text-[11px] font-bold text-primary">${escape_html(conv.studentName)} `);
						if (conv.username) $$renderer.push(`<!--[0--><span class="text-muted">(@${escape_html(conv.username)})</span>`);
						else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						if (conv.identifier) $$renderer.push(`<!--[0--><span class="text-muted">• ${escape_html(conv.identifier)}</span>`);
						else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></p></button> <button type="button" class="neo-control inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-danger hover:bg-danger hover:text-white" title="Hapus percakapan ini"${attr("aria-label", `Hapus percakapan ${stringify(conv.title)}`)}>`);
						Trash($$renderer, {
							class: "h-3.5 w-3.5",
							"aria-hidden": "true"
						});
						$$renderer.push(`<!----></button></div> <div class="flex items-center justify-between text-[10.5px] font-medium text-muted"><span>${escape_html(conv.messageCount)} pesan</span> <span>${escape_html(formatDateTime(conv.lastActivityAt))}</span></div></div>`);
					}
					$$renderer.push(`<!--]--></div>`);
				}
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		Card($$renderer, {
			class: "flex flex-col gap-4 p-5 lg:col-span-7",
			children: ($$renderer) => {
				if (!ctrl.selectedConversation) {
					$$renderer.push(`<!--[0--><div class="flex min-h-[320px] flex-col items-center justify-center gap-2 text-center">`);
					Message_square_text($$renderer, {
						class: "h-8 w-8 text-muted",
						"aria-hidden": "true"
					});
					$$renderer.push(`<!----> <p class="text-sm font-extrabold text-ink">Pilih Percakapan Siswa di Panel Kiri</p> <p class="max-w-sm text-xs text-muted">Klik salah satu ruang percakapan untuk memeriksa seluruh log pertanyaan siswa dan jawaban AI beserta sumber materinya.</p></div>`);
				} else {
					$$renderer.push(`<!--[-1--><div class="flex flex-wrap items-center justify-between gap-3 border-b-2 border-line pb-3"><div><h3 class="text-sm font-extrabold text-ink md:text-base">${escape_html(ctrl.selectedConversation.title)}</h3> <p class="text-xs font-medium text-muted">Siswa: <strong class="text-ink">${escape_html(ctrl.selectedConversation.studentName)}</strong> `);
					if (ctrl.selectedConversation.identifier) $$renderer.push(`<!--[0-->(${escape_html(ctrl.selectedConversation.identifier)})`);
					else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> • Sesi AI: <code class="font-mono text-[11px]">${escape_html(ctrl.selectedConversation.aiSessionId)}</code></p></div> `);
					Button($$renderer, {
						variant: "danger",
						size: "sm",
						onclick: () => ctrl.selectedConversation && ctrl.removeConversation(ctrl.selectedConversation.id),
						children: ($$renderer) => {
							Trash($$renderer, {
								class: "h-3.5 w-3.5",
								"aria-hidden": "true"
							});
							$$renderer.push(`<!----> <span>Hapus Room</span>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div> `);
					if (ctrl.loadingMessages) $$renderer.push(`<!--[0--><p class="py-8 text-center text-xs font-bold text-muted">Memuat transkrip percakapan…</p>`);
					else if (ctrl.messages.length === 0) $$renderer.push(`<!--[1--><p class="py-8 text-center text-xs font-medium text-muted">Tidak ada pesan di dalam percakapan ini.</p>`);
					else {
						$$renderer.push(`<!--[-1--><div class="flex max-h-[500px] flex-col gap-3 overflow-y-auto pr-1"><!--[-->`);
						const each_array_1 = ensure_array_like(ctrl.messages);
						for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
							let msg = each_array_1[$$index_2];
							$$renderer.push(`<div${attr_class(`flex flex-col gap-2 rounded-xl border-2 border-line p-3.5 ${msg.role === "user" ? "bg-surface-soft" : "bg-surface shadow-[2px_2px_0px_var(--neo-shadow-color)]"}`)}><div class="flex items-center justify-between gap-2"><div class="flex items-center gap-2"><span${attr_class(`inline-flex h-6 w-6 items-center justify-center rounded-lg border border-line ${msg.role === "user" ? "bg-sage/30 text-ink" : "bg-mustard text-on-mustard"}`)}>`);
							if (msg.role === "user") {
								$$renderer.push("<!--[0-->");
								User($$renderer, {
									class: "h-3.5 w-3.5",
									"aria-hidden": "true"
								});
							} else {
								$$renderer.push("<!--[-1-->");
								Bot($$renderer, {
									class: "h-3.5 w-3.5",
									"aria-hidden": "true"
								});
							}
							$$renderer.push(`<!--]--></span> <span class="text-xs font-extrabold text-ink">${escape_html(msg.role === "user" ? ctrl.selectedConversation.studentName : "TAKO AI")}</span> <span class="text-[10.5px] text-muted">• ${escape_html(formatDateTime(msg.createdAt))}</span></div> <button type="button" class="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-danger hover:bg-danger/10" title="Hapus pesan ini">`);
							Trash($$renderer, {
								class: "h-3 w-3",
								"aria-hidden": "true"
							});
							$$renderer.push(`<!----> <span>Hapus</span></button></div> <p class="whitespace-pre-wrap text-xs leading-relaxed text-ink">${escape_html(msg.content || "(Pesan kosong / dibatalkan)")}</p> `);
							if (msg.sources && msg.sources.length > 0) {
								$$renderer.push(`<!--[0--><div class="flex flex-wrap gap-1.5 border-t border-line/40 pt-2"><!--[-->`);
								const each_array_2 = ensure_array_like(msg.sources);
								for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
									let src = each_array_2[$$index_1];
									$$renderer.push(`<span class="rounded-lg border border-line bg-surface-soft px-2 py-0.5 text-[10px] font-bold text-muted">Sumber: ${escape_html(src.title)} `);
									if (src.topic) $$renderer.push(`<!--[0-->(${escape_html(src.topic)})`);
									else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--></span>`);
								}
								$$renderer.push(`<!--]--></div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div>`);
						}
						$$renderer.push(`<!--]--></div>`);
					}
					$$renderer.push(`<!--]-->`);
				}
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div></div>`);
	});
}
//#endregion
//#region src/lib/features/admin/presentation/pages/AdminMateriPage.svelte
function AdminMateriPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctrl = new AdminRagController();
		const overviewHref = derived(() => buildSitePath("admin", page.url, "/"));
		head("1lmefkn", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Materi Global - Tako Admin</title>`);
			});
		});
		Card($$renderer, {
			class: "flex flex-col items-start gap-5 p-6 md:p-8",
			children: ($$renderer) => {
				$$renderer.push(`<div class="flex items-center gap-3"><div class="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-line bg-mustard text-on-mustard shadow-[2px_2px_0px_var(--neo-shadow-color)]">`);
				Book_open($$renderer, {
					class: "h-5 w-5",
					"aria-hidden": "true"
				});
				$$renderer.push(`<!----></div> <div><h2 class="text-xl font-extrabold text-ink">Unggah Modul Kurikulum Global (Scope: Kelas)</h2> <p class="text-xs font-medium text-muted">Terhubung ke <code class="rounded bg-surface-soft px-1.5 py-0.5 font-mono text-ink">POST /api/v1/admin/rag/documents</code> (Khusus akun Guru)</p></div></div> <div class="grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-2"><div class="flex flex-col gap-1.5"><label for="global-doc-title" class="text-xs font-extrabold text-ink">Judul Modul / Buku Ajar</label> `);
				Input($$renderer, {
					id: "global-doc-title",
					value: ctrl.sourceTitle,
					placeholder: "Contoh: Modul KKA Bab 3 - Machine Learning",
					oninput: (e) => ctrl.sourceTitle = e.currentTarget.value
				});
				$$renderer.push(`<!----></div> <div class="flex flex-col gap-1.5"><label for="global-doc-topic" class="text-xs font-extrabold text-ink">Topik / Bab</label> `);
				Input($$renderer, {
					id: "global-doc-topic",
					value: ctrl.topic,
					placeholder: "Contoh: Data Latih dan Data Uji",
					oninput: (e) => ctrl.topic = e.currentTarget.value
				});
				$$renderer.push(`<!----></div></div> <div class="flex w-full max-w-2xl flex-col gap-2"><label for="global-doc-file" class="text-xs font-extrabold text-ink">Berkas Dokumen (PDF, PNG, JPG, WEBP, TXT, MD — Maks 20 MB)</label> <input id="global-doc-file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md" class="neo-control w-full rounded-xl border-2 border-line bg-surface-soft p-2.5 text-xs font-bold text-ink"/></div> `);
				if (ctrl.uploadError) $$renderer.push(`<!--[0--><p class="rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2 text-xs font-bold text-danger">${escape_html(ctrl.uploadError)}</p>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (ctrl.uploadResult) $$renderer.push(`<!--[0--><p class="rounded-xl border-2 border-line bg-mustard/20 px-3.5 py-2 text-xs font-bold text-ink">${escape_html(ctrl.uploadResult)}</p>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="flex flex-wrap items-center gap-3">`);
				Button($$renderer, {
					variant: "primary",
					disabled: ctrl.uploading || !ctrl.selectedFile,
					onclick: () => ctrl.submitGlobalUpload(),
					children: ($$renderer) => {
						Upload($$renderer, {
							class: "h-4 w-4",
							"aria-hidden": "true"
						});
						$$renderer.push(`<!----> <span>${escape_html(ctrl.uploading ? "Mengunggah ke Server AI…" : "Unggah Materi Global")}</span>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> <a${attr("href", overviewHref())} class="neo-control inline-flex min-h-[44px] items-center bg-surface-soft px-4 py-2 text-sm font-bold text-ink hover:bg-surface">Kembali ke Ringkasan</a></div>`);
			},
			$$slots: { default: true }
		});
	});
}
//#endregion
//#region src/lib/features/admin/presentation/pages/AdminAuditPage.svelte
function AdminAuditPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctrl = new AdminRagController();
		const overviewHref = derived(() => buildSitePath("admin", page.url, "/"));
		head("1eh67iq", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Audit Auto-Learn - Tako Admin</title>`);
			});
		});
		Card($$renderer, {
			class: "flex flex-col items-start gap-5 p-6 md:p-8",
			children: ($$renderer) => {
				$$renderer.push(`<div class="flex w-full flex-wrap items-center justify-between gap-3"><div class="flex items-center gap-3"><div class="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-line bg-sage/30 text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)]">`);
				File_search($$renderer, {
					class: "h-5 w-5",
					"aria-hidden": "true"
				});
				$$renderer.push(`<!----></div> <div><h2 class="text-xl font-extrabold text-ink">Audit Pengetahuan Auto-Learned</h2> <p class="text-xs font-medium text-muted">Terhubung ke <code class="rounded bg-surface-soft px-1.5 py-0.5 font-mono text-ink">GET /api/v1/admin/rag/auto-learned</code></p></div></div> `);
				Button($$renderer, {
					variant: "secondary",
					size: "sm",
					disabled: ctrl.loadingAudit,
					onclick: () => ctrl.loadAutoLearned(),
					children: ($$renderer) => {
						Refresh_cw($$renderer, {
							class: "h-4 w-4",
							"aria-hidden": "true"
						});
						$$renderer.push(`<!----> <span>${escape_html(ctrl.loadingAudit ? "Memuat…" : "Muat Ulang")}</span>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div> `);
				if (ctrl.auditError) $$renderer.push(`<!--[0--><p class="rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2 text-xs font-bold text-danger">${escape_html(ctrl.auditError)}</p>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (ctrl.loadingAudit) $$renderer.push(`<!--[0--><p class="text-sm font-bold text-muted">Memuat entri auto-learned dari server AI…</p>`);
				else if (ctrl.autoLearned.length === 0) $$renderer.push(`<!--[1--><p class="text-sm font-medium text-muted">Belum ada catatan auto-learned yang tersimpan di korpus saat ini.</p>`);
				else {
					$$renderer.push(`<!--[-1--><div class="flex w-full flex-col gap-3"><!--[-->`);
					const each_array = ensure_array_like(ctrl.autoLearned);
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let item = each_array[$$index];
						const docId = item.doc_id || item.id || "";
						$$renderer.push(`<div class="flex flex-col justify-between gap-3 rounded-xl border-2 border-line bg-surface-soft p-4 md:flex-row md:items-center"><div class="flex flex-col gap-1"><span class="text-sm font-extrabold text-ink">${escape_html(item.source_title || item.title || docId)}</span> `);
						if (item.topic) $$renderer.push(`<!--[0--><span class="text-xs font-bold text-muted">Topik: ${escape_html(item.topic)}</span>`);
						else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						if (item.excerpt || item.content) $$renderer.push(`<!--[0--><p class="text-xs text-ink/80">${escape_html(item.excerpt || item.content)}</p>`);
						else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></div> `);
						if (docId) {
							$$renderer.push("<!--[0-->");
							Button($$renderer, {
								variant: "danger",
								size: "sm",
								onclick: () => ctrl.removeDocument(docId),
								children: ($$renderer) => {
									Trash($$renderer, {
										class: "h-4 w-4",
										"aria-hidden": "true"
									});
									$$renderer.push(`<!----> <span>Hapus</span>`);
								},
								$$slots: { default: true }
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></div>`);
					}
					$$renderer.push(`<!--]--></div>`);
				}
				$$renderer.push(`<!--]--> <a${attr("href", overviewHref())} class="neo-control inline-flex min-h-[44px] items-center bg-surface-soft px-4 py-2 text-sm font-bold text-ink hover:bg-surface">Kembali ke Ringkasan</a>`);
			},
			$$slots: { default: true }
		});
	});
}
//#endregion
export { AdminOverviewPage as a, AdminStudentsPage as i, AdminMateriPage as n, AdminAppLayout as o, AdminChatsPage as r, AdminAuditPage as t };

//# sourceMappingURL=admin.js.map