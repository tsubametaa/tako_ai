import { a as derived, c as head, d as spread_props, f as stringify, h as attr, p as html, s as ensure_array_like, t as attr_class, y as escape_html } from "./server2.js";
import { o as Icon } from "./theme.js";
import { a as X, i as ChatHeader, p as drawerController, r as conversationListController } from "./shell.js";
import { t as Arrow_down } from "./arrow-down.js";
import { n as Arrow_right, t as Book_open } from "./book-open.js";
import { n as Brain, t as Refresh_cw } from "./refresh-cw.js";
import { _ as Circle_exclamation_point, c as authSessionController, d as apiStream, h as Loader_circle, u as apiRequest, v as Chevron_down } from "./auth.js";
import { n as goto } from "./navigation.js";
import DOMPurify from "dompurify";
import { marked } from "marked";
//#region node_modules/@lucide/svelte/dist/icons/clock.svelte
var __iconData$8 = {
	"name": "clock",
	"size": 24,
	"node": [["circle", {
		"cx": "12",
		"cy": "12",
		"r": "10"
	}], ["path", { "d": "M12 6v6l4 2" }]]
};
__iconData$8.node;
function Clock($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$8 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/copy.svelte
var __iconData$7 = {
	"name": "copy",
	"size": 24,
	"node": [["rect", {
		"width": "14",
		"height": "14",
		"x": "8",
		"y": "8",
		"rx": "2",
		"ry": "2"
	}], ["path", { "d": "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }]]
};
__iconData$7.node;
function Copy($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$7 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/external-link.svelte
var __iconData$6 = {
	"name": "external-link",
	"size": 24,
	"node": [
		["path", { "d": "M15 3h6v6" }],
		["path", { "d": "M10 14 21 3" }],
		["path", { "d": "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }]
	]
};
__iconData$6.node;
function External_link($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$6 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/file-code.svelte
var __iconData$5 = {
	"name": "file-code",
	"size": 24,
	"node": [
		["path", { "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }],
		["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }],
		["path", { "d": "M10 12.5 8 15l2 2.5" }],
		["path", { "d": "m14 12.5 2 2.5-2 2.5" }]
	]
};
__iconData$5.node;
function File_code($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$5 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/file-text.svelte
var __iconData$4 = {
	"name": "file-text",
	"size": 24,
	"node": [
		["path", { "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }],
		["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }],
		["path", { "d": "M10 9H8" }],
		["path", { "d": "M16 13H8" }],
		["path", { "d": "M16 17H8" }]
	]
};
__iconData$4.node;
function File_text($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$4 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/paperclip.svelte
var __iconData$3 = {
	"name": "paperclip",
	"size": 24,
	"node": [["path", { "d": "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551" }]]
};
__iconData$3.node;
function Paperclip($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$3 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/presentation.svelte
var __iconData$2 = {
	"name": "presentation",
	"size": 24,
	"node": [
		["path", { "d": "M2 3h20" }],
		["path", { "d": "M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" }],
		["path", { "d": "m7 21 5-5 5 5" }]
	]
};
__iconData$2.node;
function Presentation($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$2 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/send.svelte
var __iconData$1 = {
	"name": "send",
	"size": 24,
	"node": [["path", { "d": "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" }], ["path", { "d": "m21.854 2.147-10.94 10.939" }]]
};
__iconData$1.node;
function Send($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$1 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/square.svelte
var __iconData = {
	"name": "square",
	"size": 24,
	"node": [["rect", {
		"width": "18",
		"height": "18",
		"x": "3",
		"y": "3",
		"rx": "2"
	}]]
};
__iconData.node;
function Square($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData }]));
}
//#endregion
//#region src/lib/features/chat/domain/generation.ts
var MAX_MESSAGE_CHARACTERS = 4e3;
var GENERATION_STATUS_LABELS = {
	loading: "Memuat percakapan…",
	empty: "Mulai percakapan baru",
	idle: "Siap",
	submitting: "Mengirim pesan…",
	queued: "Pertanyaanmu sedang menunggu giliran.",
	retrieving: "Sedang mencari materi yang relevan…",
	generating: "Menulis respons…",
	completed: "Respons selesai",
	cancelled: "Respons dihentikan",
	failed: "Respons gagal dimuat",
	reconnecting: "Koneksi terputus. Sedang menyambungkan kembali…"
};
//#endregion
//#region src/lib/features/chat/domain/attachment.ts
var ALLOWED_FILE_EXTENSIONS = [
	".pdf",
	".png",
	".jpg",
	".jpeg",
	".webp",
	".txt",
	".md"
];
var ALLOWED_MIME_TYPES = [
	"application/pdf",
	"image/png",
	"image/jpeg",
	"image/webp",
	"text/plain",
	"text/markdown"
];
function getAttachmentType(fileName, mimeType) {
	const lowerName = fileName.toLowerCase();
	if (lowerName.endsWith(".pdf") || mimeType === "application/pdf") return "pdf";
	if (lowerName.endsWith(".ppt") || lowerName.endsWith(".pptx") || mimeType?.includes("presentation") || mimeType?.includes("powerpoint")) return "ppt";
	if (lowerName.endsWith(".doc") || lowerName.endsWith(".docx") || mimeType?.includes("word") || mimeType?.includes("officedocument.wordprocessingml")) return "docx";
	if (lowerName.endsWith(".md") || mimeType === "text/markdown") return "md";
	if (lowerName.endsWith(".txt") || mimeType === "text/plain") return "txt";
	return "other";
}
function formatFileSize(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
	return `${(bytes / 1048576).toFixed(1)} MB`;
}
function validateAttachmentFile(file) {
	const extension = "." + file.name.split(".").pop()?.toLowerCase();
	const isAllowedExt = ALLOWED_FILE_EXTENSIONS.includes(extension);
	const isAllowedMime = ALLOWED_MIME_TYPES.some((mime) => file.type.startsWith(mime));
	if (!isAllowedExt && !isAllowedMime) return {
		valid: false,
		error: `Format berkas "${file.name}" tidak didukung. Unggah PDF, PNG, JPG, WEBP, TXT, atau MD.`
	};
	if (file.size > 20971520) return {
		valid: false,
		error: `Ukuran berkas "${file.name}" melebihi batas maksimum 20 MB (${formatFileSize(file.size)}).`
	};
	return { valid: true };
}
//#endregion
//#region src/lib/features/chat/infrastructure/sseParser.ts
var SSEStreamParser = class {
	buffer = "";
	push(chunk) {
		this.buffer += chunk;
		const events = [];
		const blocks = this.buffer.split(/(?:\r?\n){2}/);
		this.buffer = blocks.pop() ?? "";
		for (const block of blocks) {
			if (!block.trim()) continue;
			let id;
			let event;
			const dataLines = [];
			const lines = block.split(/\r?\n/);
			for (const line of lines) {
				if (line.startsWith(":")) continue;
				if (line.startsWith("id:")) id = line.slice(3).trim();
				else if (line.startsWith("event:")) event = line.slice(6).trim();
				else if (line.startsWith("data:")) dataLines.push(line.slice(5).trimStart());
			}
			if (dataLines.length > 0 || event || id) events.push({
				id,
				event,
				data: dataLines.join("\n")
			});
		}
		return events;
	}
	flush() {
		if (!this.buffer.trim()) {
			this.buffer = "";
			return [];
		}
		const remaining = this.buffer;
		this.buffer = "";
		return this.push(remaining + "\n\n");
	}
};
//#endregion
//#region src/lib/features/chat/infrastructure/apiChatGateway.ts
function mapSource(dto) {
	return {
		id: dto.id,
		title: dto.title,
		section: dto.topic || dto.label,
		page: Array.isArray(dto.pages) && dto.pages.length > 0 ? dto.pages[0] : void 0,
		snippet: dto.excerpt || "",
		url: dto.url || void 0
	};
}
function mapMessage(dto) {
	return {
		id: dto.id,
		role: dto.role,
		content: dto.content,
		timestamp: dto.createdAt,
		sources: (dto.sources || []).map(mapSource),
		isCancelled: dto.status === "cancelled",
		clientRequestId: dto.clientRequestId
	};
}
var ApiChatGateway = class {
	activeControllers = /* @__PURE__ */ new Map();
	activeGenerations = /* @__PURE__ */ new Map();
	async loadMessages(conversationId) {
		return ((await apiRequest(`/conversations/${encodeURIComponent(conversationId)}/messages?limit=50`)).items || []).map(mapMessage);
	}
	async uploadAttachments(attachments) {
		if (!attachments || attachments.length === 0) return;
		for (const att of attachments) {
			if (!att.rawFile) continue;
			const formData = new FormData();
			formData.append("source_title", att.name);
			formData.append("file", att.rawFile, att.name);
			await apiRequest("/rag/documents", {
				method: "POST",
				body: formData
			});
		}
	}
	async sendMessage(options) {
		const { conversationId, content, clientRequestId, mode = "umum", attachments, onToken, onStatus, onSources, onConversationUpdated } = options;
		if (attachments && attachments.length > 0) {
			onStatus("retrieving");
			await this.uploadAttachments(attachments);
		}
		const questionText = content.trim() || (attachments && attachments.length > 0 ? `Tolong bantu jelaskan materi dari berkas ${attachments.map((a) => a.name).join(", ")} yang baru saya unggah.` : "");
		const abortController = new AbortController();
		this.activeControllers.set(conversationId, abortController);
		try {
			const response = await apiStream(`/conversations/${encodeURIComponent(conversationId)}/messages`, {
				clientRequestId,
				content: questionText,
				mode,
				consentToTraining: false
			}, abortController.signal);
			if (!response.body) throw new Error("Stream respons dari server kosong.");
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			const parser = new SSEStreamParser();
			while (true) {
				const { value, done } = await reader.read();
				if (done) break;
				const textChunk = decoder.decode(value, { stream: true });
				const events = parser.push(textChunk);
				this.processEvents(events, conversationId, {
					onToken,
					onStatus,
					onSources,
					onConversationUpdated
				});
			}
			const trailing = parser.flush();
			this.processEvents(trailing, conversationId, {
				onToken,
				onStatus,
				onSources,
				onConversationUpdated
			});
		} finally {
			this.activeControllers.delete(conversationId);
			this.activeGenerations.delete(conversationId);
		}
	}
	processEvents(events, conversationId, callbacks) {
		for (const evt of events) {
			if (!evt.data) continue;
			let payload;
			try {
				payload = JSON.parse(evt.data);
			} catch {
				continue;
			}
			switch (evt.event) {
				case "accepted": {
					const gen = payload.generation;
					if (gen?.id) this.activeGenerations.set(conversationId, gen.id);
					break;
				}
				case "status": {
					const st = payload.status;
					if (st) callbacks.onStatus(st);
					break;
				}
				case "conversation_updated": {
					const conv = payload.conversation;
					if (conv && callbacks.onConversationUpdated) callbacks.onConversationUpdated(conv);
					break;
				}
				case "sources": {
					const srcs = payload.sources || [];
					callbacks.onSources(srcs.map(mapSource));
					break;
				}
				case "delta": {
					const text = payload.text;
					if (typeof text === "string") callbacks.onToken(text);
					break;
				}
				case "done": {
					const msg = payload.message;
					if (msg?.sources && msg.sources.length > 0) callbacks.onSources(msg.sources.map(mapSource));
					callbacks.onStatus("completed");
					break;
				}
				case "cancelled":
					callbacks.onStatus("cancelled");
					break;
				case "generation_error": {
					const errMsg = payload.message || "Asisten sedang belum dapat merespons. Coba sebentar lagi.";
					throw new Error(errMsg);
				}
			}
		}
	}
	async stopGeneration(conversationId) {
		const genId = this.activeGenerations.get(conversationId);
		const controller = this.activeControllers.get(conversationId);
		if (genId) try {
			await apiRequest(`/generations/${encodeURIComponent(genId)}/cancel`, { method: "POST" });
		} catch {}
		if (controller) {
			controller.abort();
			this.activeControllers.delete(conversationId);
		}
		this.activeGenerations.delete(conversationId);
	}
};
var apiChatGateway = new ApiChatGateway();
//#endregion
//#region src/lib/features/chat/infrastructure/mockChatGateway.ts
var MockChatGateway = class {
	activeTimeouts = /* @__PURE__ */ new Map();
	messagesByRoom = /* @__PURE__ */ new Map();
	constructor() {
		this.messagesByRoom.set("demo-room-1", [{
			id: "msg-1",
			role: "user",
			content: "Apa perbedaan antara data latih dan data uji dalam machine learning?",
			timestamp: (/* @__PURE__ */ new Date(Date.now() - 18e5)).toISOString()
		}, {
			id: "msg-2",
			role: "assistant",
			content: "Dalam pembelajaran mesin (*machine learning*), pemisahan data sangat penting:\n\n1. **Data Latih (*Training Data*)**: Data yang digunakan model untuk belajar mengenali pola dan memperbarui bobot parameter.\n2. **Data Uji (*Testing Data*)**: Data baru yang belum pernah dilihat model saat pelatihan, digunakan untuk menguji kemampuan generalisasi.\n\nCoba bayangkan seperti ujian sekolah: soal latihan di kelas adalah *data latih*, sedangkan soal saat ujian sesungguhnya adalah *data uji*. Sekarang, coba ceritakan mengapa kita tidak boleh menguji model dengan data latih?",
			timestamp: (/* @__PURE__ */ new Date(Date.now() - 174e4)).toISOString(),
			sources: [{
				id: "src-1",
				title: "Buku Siswa KKA Kelas X - Konsep Dasar AI",
				section: "Bab 3: Pembelajaran Mesin",
				page: 42,
				snippet: "Data latih bertindak sebagai materi pengenalan pola, sementara data uji memastikan model tidak menghafal (overfitting)."
			}]
		}]);
	}
	async loadMessages(conversationId) {
		return this.messagesByRoom.get(conversationId) || [];
	}
	async sendMessage(options) {
		const { conversationId, content, attachments, onToken, onStatus, onSources } = options;
		let roomMsgs = this.messagesByRoom.get(conversationId) || [];
		const userMsg = {
			id: `usr-${Date.now()}`,
			role: "user",
			content,
			attachments: attachments && attachments.length > 0 ? [...attachments] : void 0,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		};
		roomMsgs = [...roomMsgs, userMsg];
		this.messagesByRoom.set(conversationId, roomMsgs);
		onStatus("retrieving");
		await new Promise((r) => setTimeout(r, 600));
		onSources([{
			id: `src-${Date.now()}`,
			title: "Modul Ajar Koding dan Kecerdasan Artifisial SMA",
			section: "Unit 2: Pemecahan Masalah dan Penalaran Komputasional",
			page: 18,
			snippet: "Pendekatan bertahap membantu siswa memahami konsep abstrak melalui contoh konkret sebelum formalisasi kode."
		}]);
		onStatus("generating");
		let sampleResponse = "";
		if (attachments && attachments.length > 0) sampleResponse = `Saya telah menerima dan menganalisis berkas ${attachments.map((a) => `**${a.name}**`).join(", ")} yang kamu lampirkan!\n\nBerikut intisari materi terkait **Koding & Kecerdasan Artifisial (KKA)**:\n\n1. **Pemahaman Dokumen**: Materi dalam dokumen ini menguraikan konsep komputasional dan implementasi logika dasar.\n2. **Poin Pembahasan**: ${content.trim() ? `Menjawab pertanyaanmu: *" ${content.trim()} "*` : "Kita bisa membedah ringkasan isi, menelaah kode/flowchart di dalamnya, atau mendiskusikan istilah yang sulit dipahami."}\n3. **Tips Belajar**: Coba kaitkan isi dokumen ini dengan materi percabangan, perulangan, atau etika kecerdasan artifisial yang sudah dipelajari di kelas X.\n\nAda bagian atau nomor halaman tertentu dari dokumen ini yang ingin kita bahas lebih dalam?`;
		else sampleResponse = `Terima kasih atas pertanyaanmu! Mari kita pelajari bersama langkah demi langkah.\n\nTerkait *" ${content.slice(0, 30)}... "*:\n\n- **Poin Utama:** Pada mata pelajaran KKA kelas X, setiap masalah komputasi dipecah menjadi bagian-bagian lebih kecil (*dekomposisi*).\n- **Langkah Selanjutnya:** Perhatikan pola yang berulang atau aturan logika yang mendasari proses tersebut.\n\nCoba kamu jelaskan kembali: bagian mana dari penjelasan ini yang paling menarik atau masih membingungkan bagimu?`;
		const tokens = sampleResponse.split(/(?<=\s+)/);
		const timers = [];
		this.activeTimeouts.set(conversationId, timers);
		let accumulated = "";
		return new Promise((resolve) => {
			let index = 0;
			const interval = setInterval(() => {
				if (index >= tokens.length) {
					clearInterval(interval);
					onStatus("completed");
					const assistantMsg = {
						id: `ast-${Date.now()}`,
						role: "assistant",
						content: accumulated,
						timestamp: (/* @__PURE__ */ new Date()).toISOString()
					};
					this.messagesByRoom.set(conversationId, [...roomMsgs, assistantMsg]);
					this.activeTimeouts.delete(conversationId);
					resolve();
					return;
				}
				const token = tokens[index];
				accumulated += token;
				onToken(token);
				index++;
			}, 40);
			timers.push(interval);
		});
	}
	async stopGeneration(conversationId) {
		const timers = this.activeTimeouts.get(conversationId);
		if (timers) {
			timers.forEach((t) => clearInterval(t));
			this.activeTimeouts.delete(conversationId);
		}
	}
};
new MockChatGateway();
//#endregion
//#region src/lib/features/chat/presentation/state/composer.svelte.ts
var DEEP_THINK_STORAGE_KEY = "kka_deep_think_mode";
var ComposerController = class {
	text = "";
	isComposing = false;
	deepThink = false;
	attachments = [];
	errorMessage = null;
	#mode = derived(() => this.deepThink ? "terstruktur" : "umum");
	get mode() {
		return this.#mode();
	}
	set mode($$value) {
		return this.#mode($$value);
	}
	#length = derived(() => this.text.length);
	get length() {
		return this.#length();
	}
	set length($$value) {
		return this.#length($$value);
	}
	#isOverLimit = derived(() => this.length > MAX_MESSAGE_CHARACTERS);
	get isOverLimit() {
		return this.#isOverLimit();
	}
	set isOverLimit($$value) {
		return this.#isOverLimit($$value);
	}
	#canSubmit = derived(() => (this.text.trim().length > 0 || this.attachments.length > 0) && !this.isOverLimit && !this.isComposing);
	get canSubmit() {
		return this.#canSubmit();
	}
	set canSubmit($$value) {
		return this.#canSubmit($$value);
	}
	init() {
		if (typeof window === "undefined") return;
		try {
			this.deepThink = localStorage.getItem(DEEP_THINK_STORAGE_KEY) === "true";
		} catch {
			this.deepThink = false;
		}
	}
	toggleDeepThink() {
		this.deepThink = !this.deepThink;
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(DEEP_THINK_STORAGE_KEY, String(this.deepThink));
		} catch {}
	}
	setText(val) {
		this.text = val;
	}
	addFiles(fileList) {
		this.errorMessage = null;
		const files = Array.from(fileList);
		if (this.attachments.length + files.length > 3) {
			this.errorMessage = `Maksimal hanya dapat melampirkan 3 berkas dalam satu pesan.`;
			setTimeout(() => this.errorMessage = null, 4e3);
			return;
		}
		const newAttachments = [];
		for (const file of files) {
			const validation = validateAttachmentFile(file);
			if (!validation.valid) {
				this.errorMessage = validation.error || "Berkas tidak valid.";
				setTimeout(() => this.errorMessage = null, 4e3);
				return;
			}
			newAttachments.push({
				id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
				name: file.name,
				size: file.size,
				type: getAttachmentType(file.name, file.type),
				rawFile: file
			});
		}
		this.attachments = [...this.attachments, ...newAttachments];
	}
	removeAttachment(id) {
		this.attachments = this.attachments.filter((a) => a.id !== id);
	}
	clearErrorMessage() {
		this.errorMessage = null;
	}
	clear() {
		this.text = "";
		this.attachments = [];
		this.errorMessage = null;
	}
	onCompositionStart() {
		this.isComposing = true;
	}
	onCompositionEnd() {
		this.isComposing = false;
	}
	handleKeydown(event, onSend) {
		if (event.key === "Enter" && !event.shiftKey) {
			if (this.isComposing) return;
			if (window.innerWidth >= 768) {
				event.preventDefault();
				if (this.canSubmit) onSend();
			}
		}
	}
};
//#endregion
//#region src/lib/features/chat/presentation/state/roomState.svelte.ts
var RoomStateController = class {
	gateway;
	loadSeq = 0;
	conversationId = null;
	messages = [];
	status = "idle";
	streamingMessage = null;
	userScrolledUp = false;
	errorMessage = null;
	#isBusy = derived(() => this.status === "submitting" || this.status === "retrieving" || this.status === "generating" || this.status === "queued");
	get isBusy() {
		return this.#isBusy();
	}
	set isBusy($$value) {
		return this.#isBusy($$value);
	}
	constructor(gateway = apiChatGateway) {
		this.gateway = gateway;
	}
	clearError() {
		this.errorMessage = null;
	}
	async setRoom(id, forceReload = false) {
		if (!forceReload && id && this.conversationId === id && (this.isBusy || this.status === "loading" || this.messages.length > 0)) return;
		const seq = ++this.loadSeq;
		const isDifferentRoom = this.conversationId !== id;
		this.conversationId = id;
		this.streamingMessage = null;
		this.userScrolledUp = false;
		this.errorMessage = null;
		if (!id) {
			this.messages = [];
			this.status = "empty";
			return;
		}
		if (isDifferentRoom) this.messages = [];
		this.status = "loading";
		try {
			const loaded = await this.gateway.loadMessages(id);
			if (seq !== this.loadSeq || this.conversationId !== id) return;
			this.messages = loaded;
			this.status = loaded.length === 0 ? "empty" : "idle";
		} catch (err) {
			if (seq !== this.loadSeq || this.conversationId !== id) return;
			this.status = "failed";
			this.errorMessage = err instanceof Error ? err.message : "Gagal memuat riwayat percakapan.";
		}
	}
	async reload() {
		if (!this.conversationId || this.isBusy) return;
		await this.setRoom(this.conversationId, true);
	}
	async send(content, attachments, onRoomCreated, onConversationUpdated, mode = "umum") {
		const trimmed = content.trim();
		const hasAttachments = attachments && attachments.length > 0;
		if (!trimmed && !hasAttachments || this.isBusy) return;
		this.errorMessage = null;
		let targetId = this.conversationId;
		if (!targetId && onRoomCreated) try {
			targetId = await onRoomCreated();
			this.conversationId = targetId;
		} catch (err) {
			this.status = "failed";
			this.errorMessage = err instanceof Error ? err.message : "Gagal membuat ruang percakapan baru.";
			return;
		}
		if (!targetId) return;
		const userMessage = {
			id: `usr-${Date.now()}`,
			role: "user",
			content: trimmed,
			attachments: attachments && attachments.length > 0 ? [...attachments] : void 0,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			clientRequestId: crypto.randomUUID()
		};
		this.messages = [...this.messages, userMessage];
		const thinkingStartedAt = Date.now();
		let thinkingCaptured = false;
		const assistantPlaceholder = {
			id: `ast-${Date.now()}`,
			role: "assistant",
			content: "",
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			isStreaming: true,
			sources: []
		};
		this.streamingMessage = assistantPlaceholder;
		this.status = "submitting";
		try {
			await this.gateway.sendMessage({
				conversationId: targetId,
				content: trimmed,
				mode,
				attachments: userMessage.attachments,
				clientRequestId: userMessage.clientRequestId,
				onStatus: (st) => {
					this.status = st;
				},
				onSources: (srcs) => {
					if (this.streamingMessage) this.streamingMessage.sources = srcs;
				},
				onToken: (tok) => {
					if (this.streamingMessage) {
						if (!thinkingCaptured && tok.trim().length > 0) {
							thinkingCaptured = true;
							this.streamingMessage.thinkingSeconds = Math.max(1, Math.round((Date.now() - thinkingStartedAt) / 1e3));
						}
						this.streamingMessage.content += tok;
					}
				},
				onConversationUpdated
			});
			if (this.streamingMessage) {
				if (!thinkingCaptured && this.streamingMessage.content.trim()) this.streamingMessage.thinkingSeconds = Math.max(1, Math.round((Date.now() - thinkingStartedAt) / 1e3));
				this.streamingMessage.isStreaming = false;
				this.messages = [...this.messages, this.streamingMessage];
				this.streamingMessage = null;
			}
			if (this.status !== "cancelled") this.status = "completed";
		} catch (err) {
			if (err instanceof Error && err.name === "AbortError") {
				this.status = "cancelled";
				return;
			}
			this.status = "failed";
			this.errorMessage = err instanceof Error ? err.message : "Gagal terhubung ke layanan AI.";
			if (this.streamingMessage) {
				this.streamingMessage.isStreaming = false;
				if (this.streamingMessage.content.trim()) this.messages = [...this.messages, this.streamingMessage];
				this.streamingMessage = null;
			}
		}
	}
	async stop() {
		if (!this.conversationId || !this.isBusy) return;
		await this.gateway.stopGeneration(this.conversationId);
		this.status = "cancelled";
		if (this.streamingMessage) {
			this.streamingMessage.isStreaming = false;
			this.streamingMessage.isCancelled = true;
			this.messages = [...this.messages, this.streamingMessage];
			this.streamingMessage = null;
		}
	}
	onScroll(container) {
		const threshold = 120;
		const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
		this.userScrolledUp = distanceFromBottom > threshold;
	}
};
var roomStateController = new RoomStateController();
//#endregion
//#region src/lib/features/chat/domain/greeting.ts
var COMMON_NAME_PREFIXES = /* @__PURE__ */ new Set([
	"muhammad",
	"muhamad",
	"mohammad",
	"mohamad",
	"mochammad",
	"mochamad",
	"moch",
	"moch.",
	"moh",
	"moh.",
	"m",
	"m."
]);
var STARTER_PROMPTS = [
	{
		topic: "Machine Learning",
		question: "Apa perbedaan data latih dan data uji?"
	},
	{
		topic: "Berpikir Komputasional",
		question: "Bagaimana menyusun langkah penyelesaian masalah?"
	},
	{
		topic: "Literasi AI",
		question: "Bagaimana menilai informasi dari AI?"
	},
	{
		topic: "Perancangan Sistem",
		question: "Bantu saya memahami perancangan sistem AI."
	}
];
function toTitleWord(word) {
	const cleaned = word.trim();
	if (!cleaned) return "";
	return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}
function extractDisplayName(fullName) {
	const trimmed = fullName?.trim();
	if (!trimmed) return "Sobat KKA";
	const parts = trimmed.split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "Sobat KKA";
	const firstLower = parts[0].toLowerCase();
	return toTitleWord(parts.length > 1 && COMMON_NAME_PREFIXES.has(firstLower) ? parts[1] : parts[0]) || "Sobat KKA";
}
function getTimeGreeting(date = /* @__PURE__ */ new Date()) {
	const hour = date.getHours();
	if (hour >= 4 && hour < 11) return {
		period: "morning",
		salutation: "Selamat pagi",
		subtitle: "Awali hari dengan ide segar. Konsep KKA mana yang mau kita bedah bareng TAKO AI?"
	};
	if (hour >= 11 && hour < 15) return {
		period: "afternoon",
		salutation: "Selamat siang",
		subtitle: "Tetap fokus di tengah hari. Tanyakan materi koding atau AI yang masih bikin penasaran."
	};
	if (hour >= 15 && hour < 18) return {
		period: "evening",
		salutation: "Selamat sore",
		subtitle: "Waktu yang pas buat review pelajaran atau latihan logika algoritma langkah demi langkah."
	};
	return {
		period: "night",
		salutation: "Selamat malam",
		subtitle: "Belajar santai malam ini? Ceritakan pertanyaanmu, TAKO AI siap bantu pelan-pelan."
	};
}
//#endregion
//#region src/lib/features/chat/presentation/components/ChatEmptyState.svelte
function ChatEmptyState($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { userName = null, onselectexample } = $$props;
		let now = /* @__PURE__ */ new Date();
		const displayName = derived(() => extractDisplayName(userName));
		const greeting = derived(() => getTimeGreeting(now));
		$$renderer.push(`<div class="flex flex-1 flex-col items-center justify-center p-4 text-center md:p-8"><h2 class="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl md:text-4xl"><span>${escape_html(greeting().salutation)},</span> <span class="inline-block -rotate-1 rounded-xl border-2 border-line bg-mustard px-3 py-0.5 text-on-mustard shadow-[3px_3px_0px_var(--neo-shadow-color)] transition-transform duration-200 hover:rotate-0">${escape_html(displayName())}!</span></h2> <p class="mt-3 max-w-lg text-sm leading-relaxed font-medium text-muted sm:text-[15px]">${escape_html(greeting().subtitle)}</p> <div class="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-2"><!--[-->`);
		const each_array = ensure_array_like(STARTER_PROMPTS);
		for (let idx = 0, $$length = each_array.length; idx < $$length; idx++) {
			let item = each_array[idx];
			$$renderer.push(`<button type="button" class="neo-control group flex min-h-[68px] items-center justify-between gap-3 rounded-xl border-2 border-line bg-surface px-4 py-3 text-left transition hover:bg-mustard-soft"><span class="flex min-w-0 flex-col gap-1"><span class="text-[10px] font-extrabold tracking-wider text-primary uppercase">${escape_html(item.topic)}</span> <span class="line-clamp-2 text-xs leading-snug font-bold text-ink sm:text-[13px]">${escape_html(item.question)}</span></span> `);
			Arrow_right($$renderer, {
				class: "h-4 w-4 shrink-0 text-muted transition-transform duration-150 group-hover:translate-x-1 group-hover:text-ink",
				"aria-hidden": "true"
			});
			$$renderer.push(`<!----></button>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
//#region src/lib/features/sources/domain/source.ts
function isSafeUrl(url) {
	if (!url) return false;
	try {
		const parsed = new URL(url);
		return parsed.protocol === "http:" || parsed.protocol === "https:";
	} catch {
		return false;
	}
}
//#endregion
//#region src/lib/features/sources/presentation/components/SourceChip.svelte
function SourceChip($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { count, label, open = false, onclick } = $$props;
		const chipText = derived(() => label ? count > 1 ? `${label} (+${count - 1} lainnya)` : label : `Lihat sumber (${count})`);
		if (count > 0) {
			$$renderer.push(`<!--[0--><button type="button" class="inline-flex w-fit max-w-full items-center gap-1.5 rounded-lg border border-line/35 bg-mustard-soft px-2.5 py-1.5 text-left text-xs font-bold text-ink transition hover:border-line hover:bg-mustard hover:text-on-mustard active:scale-[0.99]"${attr("aria-expanded", open)}>`);
			Book_open($$renderer, {
				class: "h-3.5 w-3.5 shrink-0",
				"aria-hidden": "true"
			});
			$$renderer.push(`<!----> <span class="truncate">${escape_html(chipText())}</span> `);
			Chevron_down($$renderer, {
				class: `h-3.5 w-3.5 shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`,
				"aria-hidden": "true"
			});
			$$renderer.push(`<!----></button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/features/sources/presentation/components/SourcePanel.svelte
function SourcePanel($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { sources = [], open = false, onclose } = $$props;
		if (open) {
			$$renderer.push(`<!--[0--><div class="mt-3 flex flex-col gap-3 rounded-2xl border-2 border-line bg-surface-soft p-4 shadow-[3px_3px_0px_var(--neo-shadow-color)]" aria-label="Panel rincian sumber materi"><div class="flex items-center justify-between"><span class="text-xs font-bold uppercase tracking-wider text-muted">Sumber Materi Referensi (${escape_html(sources.length)})</span> <button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-ink" aria-label="Tutup panel sumber">`);
			X($$renderer, {
				class: "h-4 w-4",
				"aria-hidden": "true"
			});
			$$renderer.push(`<!----></button></div> `);
			if (sources.length === 0) $$renderer.push(`<!--[0--><p class="text-xs text-muted">Sumber materi tidak tersedia untuk respons ini.</p>`);
			else {
				$$renderer.push(`<!--[-1--><div class="flex flex-col gap-3"><!--[-->`);
				const each_array = ensure_array_like(sources);
				for (let idx = 0, $$length = each_array.length; idx < $$length; idx++) {
					let src = each_array[idx];
					$$renderer.push(`<div class="flex flex-col gap-1.5 rounded-xl border-2 border-line bg-surface p-3 shadow-[2px_2px_0px_var(--neo-shadow-color)]"><div class="flex items-start justify-between gap-2"><span class="text-xs font-bold text-ink">[${escape_html(idx + 1)}] ${escape_html(src.title)}</span> `);
					if (isSafeUrl(src.url)) {
						$$renderer.push(`<!--[0--><a${attr("href", src.url)} target="_blank" rel="noopener noreferrer" class="inline-flex min-h-[32px] items-center gap-1 text-xs font-medium text-primary hover:underline"><span>Buka Dokumen</span> `);
						External_link($$renderer, {
							class: "h-3 w-3",
							"aria-hidden": "true"
						});
						$$renderer.push(`<!----></a>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div> <div class="flex flex-wrap gap-2 text-[11px] text-muted">`);
					if (src.section) $$renderer.push(`<!--[0--><span>Topik: ${escape_html(src.section)}</span>`);
					else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (src.page) $$renderer.push(`<!--[0--><span>• Halaman: ${escape_html(src.page)}</span>`);
					else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div> `);
					if (src.snippet) $$renderer.push(`<!--[0--><blockquote class="mt-1 border-l-2 border-sage/60 pl-2 text-xs italic text-ink/80">"${escape_html(src.snippet)}"</blockquote>`);
					else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
				}
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/features/chat/domain/responseFormat.ts
var MAX_QUESTION_LEN = 300;
var MIN_QUESTION_LEN = 12;
var MIN_BODY_LEN = 36;
function looksLikeQuestion(text) {
	return text.trim().replace(/[*_`"')\]\s]+$/g, "").endsWith("?");
}
function isNonProseBlock(block) {
	const trimmed = block.trim();
	if (!trimmed) return true;
	return trimmed.startsWith("```") || trimmed.endsWith("```") || trimmed.startsWith("#") || trimmed.startsWith("|") || /^([-*+]|\d+\.)\s+/.test(trimmed);
}
/**
* Finds the last sentence boundary (`.`, `!`, or `?` followed by whitespace)
* outside inline code spans so trailing Socratic guiding questions can be
* highlighted cleanly in a dedicated callout box.
*/
function splitLastSentence(paragraph) {
	let inCode = false;
	let lastBoundary = -1;
	for (let i = 0; i < paragraph.length - 1; i++) {
		const ch = paragraph[i];
		if (ch === "`") {
			inCode = !inCode;
			continue;
		}
		if (inCode) continue;
		if ((ch === "." || ch === "!" || ch === "?") && /\s/.test(paragraph[i + 1])) {
			const prefix = paragraph.slice(Math.max(0, i - 4), i + 1).toLowerCase();
			if (/(?:^|\s)(mis|dll|dst|dsb|dkk|no|dr|hlm)\.$/.test(prefix)) continue;
			lastBoundary = i + 1;
		}
	}
	if (lastBoundary === -1) return null;
	const head = paragraph.slice(0, lastBoundary).trim();
	const tail = paragraph.slice(lastBoundary).trim();
	if (!head || !tail) return null;
	return {
		head,
		tail
	};
}
function splitGuidingQuestion(markdown) {
	const normalized = markdown.replace(/\r\n/g, "\n").trim();
	if (!normalized || !looksLikeQuestion(normalized)) return {
		body: markdown,
		guidingQuestion: null
	};
	const blocks = normalized.split(/\n{2,}/);
	const lastBlock = blocks[blocks.length - 1]?.trim() ?? "";
	if (isNonProseBlock(lastBlock) || !looksLikeQuestion(lastBlock)) return {
		body: markdown,
		guidingQuestion: null
	};
	if (blocks.length >= 2) {
		const body = blocks.slice(0, -1).join("\n\n").trim();
		if (body.length >= MIN_BODY_LEN && lastBlock.length >= MIN_QUESTION_LEN && lastBlock.length <= MAX_QUESTION_LEN) return {
			body,
			guidingQuestion: lastBlock
		};
	}
	const split = splitLastSentence(lastBlock);
	if (!split) return {
		body: markdown,
		guidingQuestion: null
	};
	const body = [...blocks.slice(0, -1), split.head].join("\n\n").trim();
	if (body.length >= MIN_BODY_LEN && looksLikeQuestion(split.tail) && split.tail.length >= MIN_QUESTION_LEN && split.tail.length <= MAX_QUESTION_LEN) return {
		body,
		guidingQuestion: split.tail
	};
	return {
		body: markdown,
		guidingQuestion: null
	};
}
//#endregion
//#region src/lib/features/chat/presentation/components/AttachmentChip.svelte
function AttachmentChip($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { attachment, removable = false, onremove } = $$props;
		const typeConfig = derived(() => {
			switch (attachment.type) {
				case "pdf": return {
					label: "PDF",
					bg: "bg-danger/15 text-danger border-danger/40"
				};
				case "ppt": return {
					label: "PPT",
					bg: "bg-mustard/20 text-on-mustard border-mustard/50"
				};
				case "docx": return {
					label: "DOC",
					bg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-400/40"
				};
				case "md": return {
					label: "MD",
					bg: "bg-sage/25 text-sage-deep dark:text-sage border-sage/40"
				};
				case "txt": return {
					label: "TXT",
					bg: "bg-surface-soft text-ink border-line/30"
				};
				default: return {
					label: "FILE",
					bg: "bg-surface-soft text-ink border-line/30"
				};
			}
		});
		$$renderer.push(`<div class="neo-box-sm group inline-flex max-w-[260px] items-center gap-2 rounded-xl border-2 border-line bg-surface p-1.5 pr-2.5 shadow-[2px_2px_0px_var(--neo-shadow-color)] transition md:max-w-[320px]"${attr("title", `${stringify(attachment.name)} (${stringify(formatFileSize(attachment.size))})`)}><div${attr_class(`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 ${stringify(typeConfig().bg)}`)}>`);
		if (attachment.type === "pdf") {
			$$renderer.push("<!--[0-->");
			File_text($$renderer, {
				class: "h-4 w-4",
				"aria-hidden": "true"
			});
		} else if (attachment.type === "ppt") {
			$$renderer.push("<!--[1-->");
			Presentation($$renderer, {
				class: "h-4 w-4",
				"aria-hidden": "true"
			});
		} else if (attachment.type === "md") {
			$$renderer.push("<!--[2-->");
			File_code($$renderer, {
				class: "h-4 w-4",
				"aria-hidden": "true"
			});
		} else {
			$$renderer.push("<!--[-1-->");
			File_text($$renderer, {
				class: "h-4 w-4",
				"aria-hidden": "true"
			});
		}
		$$renderer.push(`<!--]--></div> <div class="flex min-w-0 flex-1 flex-col"><span class="truncate text-xs font-bold text-ink leading-tight">${escape_html(attachment.name)}</span> <span class="text-[10px] font-medium text-muted leading-none mt-0.5">${escape_html(formatFileSize(attachment.size))} • ${escape_html(typeConfig().label)}</span></div> `);
		if (removable && onremove) {
			$$renderer.push(`<!--[0--><button type="button" class="neo-control ml-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-line/40 bg-surface text-muted hover:border-danger hover:bg-danger hover:text-white transition active:translate-y-px"${attr("aria-label", `Hapus lampiran ${stringify(attachment.name)}`)}>`);
			X($$renderer, {
				class: "h-3 w-3",
				"aria-hidden": "true"
			});
			$$renderer.push(`<!----></button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/features/chat/presentation/components/MessageMarkdown.svelte
function MessageMarkdown($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { content, compact = false } = $$props;
		function renderSanitized(markdown) {
			if (typeof window === "undefined") return markdown.replace(/</g, "&lt;").replace(/>/g, "&gt;");
			try {
				const rawHtml = marked.parse(markdown, {
					async: false,
					breaks: true,
					gfm: true
				});
				return DOMPurify.sanitize(rawHtml, { USE_PROFILES: { html: true } });
			} catch {
				return markdown;
			}
		}
		const html$1 = derived(() => renderSanitized(content));
		$$renderer.push(`<div${attr_class(`prose prose-sm prose-tako tako-markdown max-w-none ${compact ? "tako-markdown--compact font-bold" : "font-medium"}`)}>${html(html$1())}</div>`);
	});
}
//#endregion
//#region src/lib/features/chat/presentation/components/TakoThinkingStatus.svelte
function TakoThinkingStatus($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { status = "retrieving", hasSources = false } = $$props;
		let elapsedMs = 0;
		const elapsedSeconds = derived(() => Math.floor(elapsedMs / 1e3));
		const stageLabel = derived(() => {
			if (hasSources || status === "generating") return "Tako lagi menyusun jawaban…";
			return "Tako lagi berfikir…";
		});
		$$renderer.push(`<div class="flex items-center justify-between gap-3 py-0.5" role="status" aria-live="polite"><div class="flex min-w-0 items-center gap-2">`);
		Loader_circle($$renderer, {
			class: "h-4 w-4 shrink-0 animate-spin text-mustard motion-reduce:animate-none",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----> <!---->`);
		$$renderer.push(`<span class="tako-shimmer truncate text-sm font-semibold tracking-tight">${escape_html(stageLabel())}</span>`);
		$$renderer.push(`<!----></div> `);
		if (elapsedSeconds() >= 1) $$renderer.push(`<!--[0--><span class="shrink-0 font-mono text-[11px] font-semibold text-muted/80 tabular-nums">${escape_html(elapsedSeconds())} dtk</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/features/chat/presentation/components/MessageBubble.svelte
function MessageBubble($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { message, status = "idle" } = $$props;
		let showSources = false;
		const parsedResponse = derived(() => message.role === "assistant" && !message.isStreaming && message.content ? splitGuidingQuestion(message.content) : {
			body: message.content,
			guidingQuestion: null
		});
		const primarySourceTitle = derived(() => message.sources?.[0]?.title);
		$$renderer.push(`<div${attr_class(`flex w-full ${message.role === "user" ? "justify-end" : "justify-start"}`)}>`);
		if (message.role === "user") {
			$$renderer.push(`<!--[0--><div class="flex max-w-[88%] flex-col gap-2 rounded-2xl rounded-br-sm border-2 border-line bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)] md:max-w-[75%]">`);
			if (message.attachments && message.attachments.length > 0) {
				$$renderer.push(`<!--[0--><div class="flex flex-wrap gap-1.5 pb-1"><!--[-->`);
				const each_array = ensure_array_like(message.attachments);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let att = each_array[$$index];
					AttachmentChip($$renderer, { attachment: att });
				}
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (message.content) $$renderer.push(`<!--[0--><p class="whitespace-pre-wrap leading-relaxed">${escape_html(message.content)}</p>`);
			else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else {
			$$renderer.push(`<!--[-1--><div class="flex w-full max-w-[96%] flex-col md:max-w-[86%]"><div class="flex flex-col gap-3 rounded-2xl rounded-bl-sm border-2 border-line bg-surface-soft p-4 shadow-[3px_3px_0px_var(--neo-shadow-color)] sm:p-5"><div class="flex items-center justify-between gap-2"><div class="flex flex-wrap items-center gap-2"><span class="inline-flex h-6 w-6 items-center justify-center rounded-md border border-line bg-mustard text-[11px] font-extrabold text-on-mustard" aria-hidden="true">T</span> <span class="text-[11px] font-extrabold tracking-wide text-muted uppercase">TAKO AI</span> `);
			if (message.thinkingSeconds && (!message.isStreaming || message.content)) {
				$$renderer.push(`<!--[0--><span class="inline-flex items-center gap-1 text-[11px] font-semibold text-muted/80"><span aria-hidden="true">•</span> `);
				Clock($$renderer, {
					class: "h-3 w-3",
					"aria-hidden": "true"
				});
				$$renderer.push(`<!----> <span>Dipikirkan ${escape_html(message.thinkingSeconds)} dtk</span></span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			if (!message.isStreaming && message.content) {
				$$renderer.push(`<!--[0--><button type="button" class="inline-flex min-h-[28px] items-center gap-1 rounded-lg border border-transparent px-2 py-1 text-xs font-bold text-muted transition hover:border-line/20 hover:bg-surface hover:text-ink" aria-label="Salin jawaban">`);
				$$renderer.push("<!--[-1-->");
				Copy($$renderer, {
					class: "h-3.5 w-3.5",
					"aria-hidden": "true"
				});
				$$renderer.push(`<!----> <span>Salin</span>`);
				$$renderer.push(`<!--]--></button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			if (parsedResponse().body) {
				$$renderer.push("<!--[0-->");
				MessageMarkdown($$renderer, { content: parsedResponse().body });
			} else if (message.isStreaming) {
				$$renderer.push("<!--[1-->");
				TakoThinkingStatus($$renderer, {
					status,
					hasSources: Boolean(message.sources && message.sources.length > 0)
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (parsedResponse().guidingQuestion) {
				$$renderer.push(`<!--[0--><div class="rounded-r-lg border border-line/20 border-l-[3px] border-l-mustard bg-surface px-3.5 py-2.5 text-ink">`);
				MessageMarkdown($$renderer, {
					content: parsedResponse().guidingQuestion,
					compact: true
				});
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (message.isCancelled) $$renderer.push(`<!--[0--><div class="text-xs font-semibold text-danger">Respons belum selesai (dihentikan)</div>`);
			else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (message.sources && message.sources.length > 0) {
				$$renderer.push(`<!--[0--><div class="flex flex-col pt-0.5">`);
				SourceChip($$renderer, {
					count: message.sources.length,
					label: primarySourceTitle(),
					open: showSources,
					onclick: () => showSources = !showSources
				});
				$$renderer.push(`<!----> `);
				SourcePanel($$renderer, {
					sources: message.sources,
					open: showSources,
					onclose: () => showSources = false
				});
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/features/chat/presentation/components/MessageList.svelte
function MessageList($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { messages = [], streamingMessage = null, status = "idle", userScrolledUp = false, userName = null, onselectexample, onretry, onscroll, onscrolltobottom } = $$props;
		$$renderer.push(`<div class="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6">`);
		if (messages.length === 0 && !streamingMessage) {
			$$renderer.push("<!--[0-->");
			if (status === "loading") {
				$$renderer.push(`<!--[0--><div class="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">`);
				Loader_circle($$renderer, {
					class: "h-6 w-6 animate-spin text-mustard",
					"aria-hidden": "true"
				});
				$$renderer.push(`<!----> <p class="text-xs font-bold text-muted">Memuat riwayat percakapan…</p></div>`);
			} else if (status === "failed" && onretry) {
				$$renderer.push(`<!--[1--><div class="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center"><p class="text-sm font-bold text-ink">Riwayat percakapan gagal dimuat</p> <p class="max-w-sm text-xs font-medium text-muted">Pastikan server backend aktif lalu coba muat ulang riwayat room ini.</p> <button type="button" class="neo-control inline-flex min-h-[40px] items-center gap-2 rounded-xl border-2 border-line bg-mustard px-4 py-2 text-xs font-extrabold text-on-mustard shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)]">`);
				Refresh_cw($$renderer, {
					class: "h-3.5 w-3.5",
					"aria-hidden": "true"
				});
				$$renderer.push(`<!----> <span>Muat Ulang Riwayat</span></button></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				ChatEmptyState($$renderer, {
					userName,
					onselectexample
				});
			}
			$$renderer.push(`<!--]-->`);
		} else {
			$$renderer.push(`<!--[-1--><div class="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-6"><!--[-->`);
			const each_array = ensure_array_like(messages);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let msg = each_array[$$index];
				MessageBubble($$renderer, { message: msg });
			}
			$$renderer.push(`<!--]--> `);
			if (streamingMessage) {
				$$renderer.push("<!--[0-->");
				MessageBubble($$renderer, {
					message: streamingMessage,
					status
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--> `);
		if (userScrolledUp) {
			$$renderer.push(`<!--[0--><div class="sticky bottom-4 flex justify-center"><button type="button" class="neo-control inline-flex min-h-[40px] items-center gap-1.5 rounded-full border-2 border-line bg-surface px-4 py-2 text-xs font-bold text-ink shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)] hover:bg-mustard hover:text-on-mustard"><span>Ke pesan terbaru</span> `);
			Arrow_down($$renderer, {
				class: "h-3.5 w-3.5",
				"aria-hidden": "true"
			});
			$$renderer.push(`<!----></button></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/features/chat/presentation/components/DeepThinkToggle.svelte
function DeepThinkToggle($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { active = false, disabled = false, ontoggle } = $$props;
		$$renderer.push(`<button type="button" data-slot="deep-think-toggle"${attr("data-state", active ? "on" : "off")}${attr("aria-pressed", active)}${attr("aria-label", active ? "Deep Think aktif (Mode Terstruktur). Klik untuk matikan." : "Aktifkan Deep Think (Mode Terstruktur)")}${attr("title", active ? "Deep Think aktif: TAKO membimbing bertahap langkah demi langkah" : "Aktifkan Deep Think (Mode Terstruktur)")}${attr("disabled", disabled, true)}${attr_class(`group relative inline-flex h-10 shrink-0 touch-manipulation select-none items-center justify-center overflow-hidden rounded-full border-2 text-xs font-extrabold transition-[background-color,border-color,box-shadow,color,padding,transform] duration-200 ease-out active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 motion-reduce:transition-none ${active ? "border-line bg-mustard-soft px-3 text-ink shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[3.5px_3.5px_0px_var(--neo-shadow-color)] dark:border-mustard/80 dark:bg-mustard-soft dark:text-mustard" : "w-10 border-line/35 bg-surface px-0 text-muted shadow-none hover:border-line hover:bg-surface-soft hover:text-ink hover:shadow-[1.5px_1.5px_0px_var(--neo-shadow-color)] sm:w-9"}`, "svelte-7jb634")}><span${attr_class(`relative inline-flex shrink-0 items-center justify-center `, "svelte-7jb634")}>`);
		Brain($$renderer, {
			class: `h-4 w-4 transition-colors duration-200 motion-reduce:transition-none sm:h-3.5 sm:w-3.5 ${active ? "text-amber-700 dark:text-mustard" : "group-hover:scale-105"}`,
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----></span> <span${attr("aria-hidden", !active)}${attr_class(`grid overflow-hidden transition-[grid-template-columns,opacity,margin] duration-250 ease-out motion-reduce:transition-none ${active ? "ml-1.5 grid-cols-[1fr] opacity-100" : "ml-0 grid-cols-[0fr] opacity-0"}`, "svelte-7jb634")}><span class="min-w-0 overflow-hidden whitespace-nowrap svelte-7jb634"><span${attr_class(`inline-block tracking-tight ${active ? "deep-think-shimmer" : ""}`, "svelte-7jb634")}>Deep Think</span></span></span></button>`);
	});
}
//#endregion
//#region src/lib/features/chat/presentation/components/MessageComposer.svelte
function MessageComposer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { text, attachments = [], deepThink = false, isBusy = false, canSubmit = false, errorMessage = null, oninput, ontoggledeepthink, onfileselected, onremoveattachment, onclearerror, onsend, onstop, onkeydown, oncompositionstart, oncompositionend } = $$props;
		let isMultilineText = false;
		const hasAttachments = derived(() => attachments.length > 0);
		const hasNewline = derived(() => text.includes("\n"));
		const isExpanded = derived(() => hasAttachments() || hasNewline() || isMultilineText);
		$$renderer.push(`<div class="w-full bg-transparent px-3 pb-3 pt-1 md:px-4 md:pb-4"><div class="mx-auto flex w-full max-w-3xl flex-col gap-2">`);
		if (errorMessage) {
			$$renderer.push(`<!--[0--><div class="neo-box-sm flex items-center justify-between rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2 text-xs font-semibold text-danger shadow-[2px_2px_0px_var(--neo-shadow-color)] animate-in fade-in duration-150"><div class="flex items-center gap-2">`);
			Circle_exclamation_point($$renderer, {
				class: "h-4 w-4 shrink-0",
				"aria-hidden": "true"
			});
			$$renderer.push(`<!----> <span>${escape_html(errorMessage)}</span></div> `);
			if (onclearerror) {
				$$renderer.push(`<!--[0--><button type="button" class="p-0.5 text-danger hover:opacity-75 transition" aria-label="Tutup pesan peringatan">`);
				X($$renderer, {
					class: "h-3.5 w-3.5",
					"aria-hidden": "true"
				});
				$$renderer.push(`<!----></button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div data-slot="input-group"${attr("data-layout", isExpanded() ? "expanded" : "inline")}${attr("data-deep-think", deepThink ? "on" : "off")}${attr_class(`composer-grid relative cursor-text rounded-2xl border-2 bg-surface transition-[border-color,box-shadow,background-color] duration-200 focus-within:border-neo-border focus-within:shadow-[5px_5px_0px_var(--neo-shadow-color)] has-[[data-slot=input-group-control]:focus-visible]:border-neo-border ${deepThink ? "border-line shadow-[4px_4px_0px_var(--neo-shadow-color)] ring-2 ring-mustard/25 dark:border-mustard/70 dark:ring-mustard/20" : "border-line shadow-[4px_4px_0px_var(--neo-shadow-color)]"} ${isExpanded() ? "p-0" : "px-2 py-1.5 sm:px-2.5 sm:py-2"}`, "svelte-5axz5d")} role="presentation">`);
		if (attachments.length > 0) {
			$$renderer.push(`<!--[0--><div data-slot="input-group-addon" data-align="block-start" class="composer-attachments flex flex-wrap items-center gap-2 border-b-2 border-line/15 px-3 pb-2 pt-3 animate-in fade-in duration-150 svelte-5axz5d"><!--[-->`);
			const each_array = ensure_array_like(attachments);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let att = each_array[$$index];
				AttachmentChip($$renderer, {
					attachment: att,
					removable: true,
					onremove: () => onremoveattachment?.(att.id)
				});
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div${attr_class(`composer-input min-w-0 ${isExpanded() ? "border-b border-line/10 px-3.5 pb-1.5 pt-2.5" : "px-1"}`, "svelte-5axz5d")}><textarea data-slot="input-group-control"${attr("rows", 1)}${attr("placeholder", attachments.length > 0 ? "Tulis pertanyaan atau hal yang ingin kamu diskusikan dari berkas ini…" : deepThink ? "Deep Think aktif — TAKO akan membimbingmu bertahap langkah demi langkah…" : "Tanyakan materi KKA atau ceritakan bagian yang belum kamu pahami…")} class="composer-textarea block max-h-[200px] min-h-[36px] w-full resize-none border-0 bg-transparent px-0 py-1.5 text-sm leading-6 text-ink placeholder:text-muted/60 outline-none ring-0 focus:border-0 focus:outline-hidden focus:ring-0 focus-visible:border-0 focus-visible:outline-hidden focus-visible:ring-0 svelte-5axz5d" style="outline: none !important; box-shadow: none !important;">`);
		const $$body = escape_html(text);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea></div> <div data-slot="input-group-addon"${attr("data-align", isExpanded() ? "block-end" : "inline-start")}${attr_class(`composer-left flex items-center gap-2 ${isExpanded() ? "pb-2.5 pl-3 pt-2" : ""}`, "svelte-5axz5d")}><button type="button"${attr_class(`inline-flex h-10 touch-manipulation items-center justify-center gap-1.5 rounded-xl border-2 border-line/35 bg-surface text-xs font-bold text-muted shadow-none transition active:translate-y-px hover:border-line hover:bg-mustard hover:text-on-mustard hover:shadow-[1.5px_1.5px_0px_var(--neo-shadow-color)] sm:h-9 ${isExpanded() ? "w-10 sm:w-auto sm:px-2.5" : "w-10 sm:w-9"}`)} title="Lampirkan berkas (PDF, PPT, DOCX, TXT, MD - Maks. 10 MB)" aria-label="Lampirkan berkas">`);
		Paperclip($$renderer, {
			class: "h-4 w-4 shrink-0",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----> `);
		if (isExpanded()) $$renderer.push(`<!--[0--><span class="hidden sm:inline">Lampirkan</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></button> <input type="file" multiple="" accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.md,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown" class="hidden"/></div> <div data-slot="input-group-addon"${attr("data-align", isExpanded() ? "block-end" : "inline-end")}${attr_class(`composer-right flex items-center gap-1.5 sm:gap-2 ${isExpanded() ? "pb-2.5 pr-3 pt-2" : ""}`, "svelte-5axz5d")}>`);
		if (isExpanded() || text.length > 4e3) $$renderer.push(`<!--[0--><span${attr_class(`hidden text-[11px] font-semibold text-muted sm:inline ${text.length > 4e3 ? "font-bold text-danger" : ""}`)}>${escape_html(text.length)}/${escape_html(MAX_MESSAGE_CHARACTERS)}</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		DeepThinkToggle($$renderer, {
			active: deepThink,
			disabled: isBusy,
			ontoggle: () => ontoggledeepthink?.()
		});
		$$renderer.push(`<!----> `);
		if (isBusy) {
			$$renderer.push(`<!--[0--><button type="button" class="neo-control inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-xl border-2 border-line bg-danger text-white shadow-[2px_2px_0px_var(--neo-shadow-color)] transition hover:bg-danger/90 active:translate-y-px sm:h-9 sm:w-9" aria-label="Hentikan respons asisten">`);
			Square($$renderer, {
				class: "h-4 w-4 fill-current",
				"aria-hidden": "true"
			});
			$$renderer.push(`<!----></button>`);
		} else {
			$$renderer.push(`<!--[-1--><button type="button"${attr("disabled", !canSubmit, true)}${attr_class(`inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-xl border-2 transition active:translate-y-px sm:h-9 sm:w-9 ${canSubmit ? "border-line bg-mustard text-on-mustard shadow-[2px_2px_0px_var(--neo-shadow-color)] hover:bg-mustard/90" : "cursor-not-allowed border-line/25 bg-surface-soft text-muted/40 shadow-none"}`)} aria-label="Kirim pesan">`);
			Send($$renderer, {
				class: "h-4 w-4",
				"aria-hidden": "true"
			});
			$$renderer.push(`<!----></button>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="flex items-center justify-center px-1 text-center text-[11px] text-muted"><span>TAKO AI • Konfirmasi jawaban kepada guru jika masih ragu</span></div></div></div>`);
	});
}
//#endregion
//#region src/lib/features/chat/presentation/components/GenerationStatusIndicator.svelte
function GenerationStatusIndicator($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { status } = $$props;
		if (derived(() => status === "queued" || status === "reconnecting")()) {
			$$renderer.push(`<!--[0--><div class="flex items-center justify-center px-2 pt-2"><div class="inline-flex items-center gap-2 rounded-xl border-2 border-line bg-surface px-3.5 py-1.5 text-xs font-bold text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)] animate-in fade-in duration-150" role="status">`);
			Loader_circle($$renderer, {
				class: "h-3.5 w-3.5 animate-spin text-mustard",
				"aria-hidden": "true"
			});
			$$renderer.push(`<!----> <span>${escape_html(GENERATION_STATUS_LABELS[status])}</span></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/features/chat/presentation/pages/NewChatPage.svelte
function NewChatPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const composer = new ComposerController();
		const combinedError = derived(() => composer.errorMessage ?? roomStateController.errorMessage);
		async function handleSend() {
			if (!composer.canSubmit) return;
			const content = composer.text;
			const attachments = [...composer.attachments];
			const mode = composer.mode;
			composer.clear();
			const titleCandidate = content.trim() || (attachments[0] ? `Diskusi: ${attachments[0].name}` : "Percakapan Baru");
			await roomStateController.send(content, attachments, async () => {
				const created = await conversationListController.createNew(titleCandidate.slice(0, 60));
				conversationListController.activeId = created.id;
				return created.id;
			}, (updated) => {
				conversationListController.upsert(updated);
			}, mode);
			if (roomStateController.conversationId) await goto(`/chat/${roomStateController.conversationId}`, { replaceState: true });
		}
		head("1gtmz4j", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Percakapan Baru - TAKO AI</title>`);
			});
		});
		$$renderer.push(`<div class="flex h-full min-h-0 flex-col overflow-hidden">`);
		ChatHeader($$renderer, {
			title: "Percakapan Baru",
			onopenmenu: () => drawerController.openDrawer()
		});
		$$renderer.push(`<!----> `);
		GenerationStatusIndicator($$renderer, { status: roomStateController.status });
		$$renderer.push(`<!----> `);
		MessageList($$renderer, {
			messages: roomStateController.messages,
			streamingMessage: roomStateController.streamingMessage,
			status: roomStateController.status,
			userScrolledUp: roomStateController.userScrolledUp,
			userName: authSessionController.user?.name,
			onselectexample: (example) => composer.setText(example),
			onscroll: (e) => roomStateController.onScroll(e.currentTarget),
			onscrolltobottom: () => {
				roomStateController.userScrolledUp = false;
			}
		});
		$$renderer.push(`<!----> `);
		MessageComposer($$renderer, {
			text: composer.text,
			attachments: composer.attachments,
			deepThink: composer.deepThink,
			errorMessage: combinedError(),
			isBusy: roomStateController.isBusy,
			canSubmit: composer.canSubmit,
			oninput: (v) => composer.setText(v),
			ontoggledeepthink: () => composer.toggleDeepThink(),
			onfileselected: (files) => composer.addFiles(files),
			onremoveattachment: (id) => composer.removeAttachment(id),
			onclearerror: () => {
				composer.clearErrorMessage();
				roomStateController.clearError();
			},
			onsend: handleSend,
			onstop: () => roomStateController.stop(),
			onkeydown: (e) => composer.handleKeydown(e, handleSend),
			oncompositionstart: () => composer.onCompositionStart(),
			oncompositionend: () => composer.onCompositionEnd()
		});
		$$renderer.push(`<!----></div>`);
	});
}
//#endregion
//#region src/lib/features/chat/presentation/pages/ChatRoomPage.svelte
function ChatRoomPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { conversationId } = $$props;
		const composer = new ComposerController();
		const currentTitle = derived(() => conversationListController.conversations.find((c) => c.id === conversationId)?.title || "Ruang Percakapan");
		const combinedError = derived(() => composer.errorMessage ?? roomStateController.errorMessage);
		async function handleSend() {
			if (!composer.canSubmit) return;
			const content = composer.text;
			const attachments = [...composer.attachments];
			const mode = composer.mode;
			composer.clear();
			await roomStateController.send(content, attachments, void 0, (updated) => {
				conversationListController.upsert(updated);
			}, mode);
		}
		head("1ol4seu", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(currentTitle())} - TAKO AI</title>`);
			});
		});
		$$renderer.push(`<div class="flex h-full min-h-0 flex-col overflow-hidden">`);
		ChatHeader($$renderer, {
			title: currentTitle(),
			onopenmenu: () => drawerController.openDrawer()
		});
		$$renderer.push(`<!----> `);
		GenerationStatusIndicator($$renderer, { status: roomStateController.status });
		$$renderer.push(`<!----> `);
		MessageList($$renderer, {
			messages: roomStateController.messages,
			streamingMessage: roomStateController.streamingMessage,
			status: roomStateController.status,
			userScrolledUp: roomStateController.userScrolledUp,
			userName: authSessionController.user?.name,
			onselectexample: (example) => composer.setText(example),
			onretry: () => roomStateController.reload(),
			onscroll: (e) => roomStateController.onScroll(e.currentTarget),
			onscrolltobottom: () => {
				roomStateController.userScrolledUp = false;
			}
		});
		$$renderer.push(`<!----> `);
		MessageComposer($$renderer, {
			text: composer.text,
			attachments: composer.attachments,
			deepThink: composer.deepThink,
			errorMessage: combinedError(),
			isBusy: roomStateController.isBusy,
			canSubmit: composer.canSubmit,
			oninput: (v) => composer.setText(v),
			ontoggledeepthink: () => composer.toggleDeepThink(),
			onfileselected: (files) => composer.addFiles(files),
			onremoveattachment: (id) => composer.removeAttachment(id),
			onclearerror: () => {
				composer.clearErrorMessage();
				roomStateController.clearError();
			},
			onsend: handleSend,
			onstop: () => roomStateController.stop(),
			onkeydown: (e) => composer.handleKeydown(e, handleSend),
			oncompositionstart: () => composer.onCompositionStart(),
			oncompositionend: () => composer.onCompositionEnd()
		});
		$$renderer.push(`<!----></div>`);
	});
}
//#endregion
export { NewChatPage as n, ChatRoomPage as t };

//# sourceMappingURL=chat.js.map