import { a as derived, c as head, d as spread_props, f as stringify, h as attr, i as bind_props, l as props_id, r as attributes, s as ensure_array_like, t as attr_class, y as escape_html } from "./server2.js";
import { a as Log_in, o as Icon, s as page } from "./theme.js";
import { n as goto } from "./navigation.js";
import { o as resolveSafePostLoginTarget } from "./subdomains.js";
//#region node_modules/@lucide/svelte/dist/icons/chevron-down.svelte
var __iconData$6 = {
	"name": "chevron-down",
	"size": 24,
	"node": [["path", { "d": "m6 9 6 6 6-6" }]]
};
__iconData$6.node;
function Chevron_down($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$6 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/chevron-left.svelte
var __iconData$5 = {
	"name": "chevron-left",
	"size": 24,
	"node": [["path", { "d": "m15 18-6-6 6-6" }]]
};
__iconData$5.node;
function Chevron_left($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$5 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/chevron-right.svelte
var __iconData$4 = {
	"name": "chevron-right",
	"size": 24,
	"node": [["path", { "d": "m9 18 6-6-6-6" }]]
};
__iconData$4.node;
function Chevron_right($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$4 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/circle-exclamation-point.svelte
var __iconData$3 = {
	"name": "circle-exclamation-point",
	"size": 24,
	"node": [
		["circle", {
			"cx": "12",
			"cy": "12",
			"r": "10"
		}],
		["line", {
			"x1": "12",
			"x2": "12",
			"y1": "8",
			"y2": "12"
		}],
		["line", {
			"x1": "12",
			"x2": "12.01",
			"y1": "16",
			"y2": "16"
		}]
	],
	"aliases": ["alert-circle", "circle-alert"]
};
__iconData$3.node;
function Circle_exclamation_point($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$3 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/eye-off.svelte
var __iconData$2 = {
	"name": "eye-off",
	"size": 24,
	"node": [
		["path", { "d": "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" }],
		["path", { "d": "M14.084 14.158a3 3 0 0 1-4.242-4.242" }],
		["path", { "d": "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" }],
		["path", { "d": "m2 2 20 20" }]
	]
};
__iconData$2.node;
function Eye_off($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$2 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/eye.svelte
var __iconData$1 = {
	"name": "eye",
	"size": 24,
	"node": [["path", { "d": "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" }], ["circle", {
		"cx": "12",
		"cy": "12",
		"r": "3"
	}]]
};
__iconData$1.node;
function Eye($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$1 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/loader-circle.svelte
var __iconData = {
	"name": "loader-circle",
	"size": 24,
	"node": [["path", { "d": "M21 12a9 9 0 1 1-6.219-8.56" }]],
	"aliases": ["loader-2"]
};
__iconData.node;
function Loader_circle($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData }]));
}
//#endregion
//#region src/lib/features/auth/domain/user.ts
function validateUsernameOrEmail(value) {
	const trimmed = value.trim();
	if (!trimmed) return "Email atau nama pengguna wajib diisi.";
	if (trimmed.length < 3) return "Panjang minimal 3 karakter.";
	return null;
}
function validatePassword(value) {
	if (!value) return "Kata sandi wajib diisi.";
	if (value.length < 4) return "Kata sandi minimal 4 karakter.";
	return null;
}
//#endregion
//#region src/lib/shared/api/httpClient.ts
function resolveApiBaseUrl(raw) {
	const trimmed = (raw || "").trim().replace(/\/+$/, "");
	if (!trimmed) return "/api/v1";
	if (trimmed.endsWith("/api/v1")) return trimmed;
	if (trimmed.endsWith("/api")) return `${trimmed}/v1`;
	return `${trimmed}/api/v1`;
}
function getApiBaseUrl() {
	const envVars = {
		"BASE_URL": "./",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"PUBLIC_API_BASE_URL": "http://127.0.0.1:8080/api/v1",
		"SSR": true
	};
	return resolveApiBaseUrl(envVars?.PUBLIC_API_BASE_URL || envVars?.VITE_API_BASE_URL);
}
var TOKEN_STORAGE_KEY = "kka_access_token";
var USER_STORAGE_KEY = "kka_auth_user";
var ApiError = class extends Error {
	status;
	code;
	requestId;
	retryable;
	constructor(status, payload) {
		super(payload.message || "Permintaan ke server gagal diproses.");
		this.name = "ApiError";
		this.status = status;
		this.code = payload.code || "UNKNOWN_ERROR";
		this.requestId = payload.requestId;
		this.retryable = Boolean(payload.retryable);
	}
};
function getStoredToken() {
	if (typeof window === "undefined") return null;
	try {
		return localStorage.getItem(TOKEN_STORAGE_KEY);
	} catch {
		return null;
	}
}
function setStoredToken(token) {
	if (typeof window === "undefined") return;
	try {
		if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
		else localStorage.removeItem(TOKEN_STORAGE_KEY);
	} catch {}
}
function getStoredUserJson() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(USER_STORAGE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function setStoredUserJson(user) {
	if (typeof window === "undefined") return;
	try {
		if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
		else localStorage.removeItem(USER_STORAGE_KEY);
	} catch {}
}
function clearAuthStorage() {
	setStoredToken(null);
	setStoredUserJson(null);
}
async function parseErrorResponse(response) {
	try {
		const data = await response.json();
		if (data && typeof data === "object" && "error" in data && data.error) return new ApiError(response.status, data.error);
		if (data && typeof data.message === "string") return new ApiError(response.status, {
			code: "HTTP_ERROR",
			message: data.message
		});
	} catch {}
	return new ApiError(response.status, {
		code: `HTTP_${response.status}`,
		message: response.status === 401 ? "Sesi tidak valid atau sudah berakhir. Silakan masuk kembali." : response.status === 503 ? "Layanan AI sedang sibuk atau belum dapat dihubungi." : "Gagal menghubungi server backend.",
		retryable: response.status >= 500 || response.status === 429
	});
}
function buildAuthHeaders(extra, isJson = true) {
	const headers = new Headers(extra);
	if (isJson && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
	const token = getStoredToken();
	if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
	return headers;
}
async function apiRequest(path, init = {}) {
	const hasBody = init.body !== void 0 && init.body !== null;
	const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;
	const response = await fetch(`${getApiBaseUrl()}${path}`, {
		...init,
		headers: buildAuthHeaders(init.headers, hasBody && !isFormData)
	});
	if (!response.ok) {
		if (response.status === 401 && path !== "/auth/login") clearAuthStorage();
		throw await parseErrorResponse(response);
	}
	if (response.status === 204) return;
	return await response.json();
}
async function apiStream(path, body, signal) {
	const headers = buildAuthHeaders({
		Accept: "text/event-stream",
		"Content-Type": "application/json"
	}, true);
	const response = await fetch(`${getApiBaseUrl()}${path}`, {
		method: "POST",
		headers,
		body: JSON.stringify(body),
		signal
	});
	if (!response.ok) {
		if (response.status === 401) clearAuthStorage();
		throw await parseErrorResponse(response);
	}
	return response;
}
//#endregion
//#region src/lib/features/auth/infrastructure/apiAuthGateway.ts
function mapBackendUser(dto) {
	const normalizedRole = String(dto.role || "").trim().toLowerCase();
	const isTeacher = normalizedRole === "guru" || normalizedRole === "teacher" || normalizedRole === "admin";
	return {
		id: dto.id,
		name: dto.displayName || dto.username,
		email: dto.username,
		username: dto.username,
		identifier: dto.identifier,
		className: dto.className,
		gradeLevel: dto.gradeLevel,
		role: isTeacher ? "teacher" : "student"
	};
}
var ApiAuthGateway = class {
	async login(usernameOrEmail, password) {
		const res = await apiRequest("/auth/login", {
			method: "POST",
			body: JSON.stringify({
				identifier: usernameOrEmail.trim(),
				password
			})
		});
		const user = mapBackendUser(res.user);
		setStoredToken(res.accessToken);
		setStoredUserJson(user);
		return user;
	}
	async logout() {
		try {
			if (getStoredToken()) await apiRequest("/auth/logout", { method: "POST" });
		} catch {} finally {
			clearAuthStorage();
		}
	}
	async getCurrentUser() {
		if (!getStoredToken()) return null;
		try {
			const user = mapBackendUser((await apiRequest("/auth/me")).user);
			setStoredUserJson(user);
			return user;
		} catch (err) {
			if (err instanceof ApiError && err.status === 401) {
				clearAuthStorage();
				return null;
			}
			return getStoredUserJson();
		}
	}
};
var apiAuthGateway = new ApiAuthGateway();
//#endregion
//#region src/lib/features/auth/infrastructure/mockAuthGateway.ts
var AUTH_STORAGE_KEY = "kka_auth_user";
var MockAuthGateway = class {
	async login(usernameOrEmail, password) {
		await new Promise((r) => setTimeout(r, 450));
		const trimmed = usernameOrEmail.trim().toLowerCase();
		if (password === "salah" || password === "error") throw new Error("Akun atau kata sandi tidak sesuai.");
		if (password === "offline") throw new Error("Belum dapat terhubung. Periksa koneksi lalu coba lagi.");
		const mockUser = {
			id: "student-x-1",
			name: trimmed.includes("@") ? trimmed.split("@")[0] : usernameOrEmail,
			email: trimmed.includes("@") ? trimmed : `${trimmed}@kka.sch.id`,
			role: "student"
		};
		if (typeof window !== "undefined") try {
			localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
		} catch {}
		return mockUser;
	}
	async logout() {
		if (typeof window !== "undefined") try {
			localStorage.removeItem(AUTH_STORAGE_KEY);
		} catch {}
	}
	async getCurrentUser() {
		if (typeof window === "undefined") return null;
		try {
			const stored = localStorage.getItem(AUTH_STORAGE_KEY);
			if (!stored) return null;
			return JSON.parse(stored);
		} catch {
			return null;
		}
	}
};
new MockAuthGateway();
//#endregion
//#region src/lib/features/auth/presentation/state/authSession.svelte.ts
var AuthSessionController = class {
	gateway;
	user = null;
	loading = true;
	#isAuthenticated = derived(() => this.user !== null);
	get isAuthenticated() {
		return this.#isAuthenticated();
	}
	set isAuthenticated($$value) {
		return this.#isAuthenticated($$value);
	}
	constructor(gateway = apiAuthGateway) {
		this.gateway = gateway;
	}
	async init() {
		this.loading = true;
		try {
			this.user = await this.gateway.getCurrentUser();
		} finally {
			this.loading = false;
		}
	}
	setUser(user) {
		this.user = user;
	}
	async logout() {
		await this.gateway.logout();
		this.user = null;
	}
};
var authSessionController = new AuthSessionController();
//#endregion
//#region src/lib/features/auth/presentation/state/loginForm.svelte.ts
var LoginFormController = class {
	gateway;
	usernameOrEmail = "";
	password = "";
	showPassword = false;
	submitting = false;
	fieldErrors = {};
	errorMessage = null;
	constructor(gateway = apiAuthGateway) {
		this.gateway = gateway;
	}
	toggleShowPassword() {
		this.showPassword = !this.showPassword;
	}
	validate() {
		const usernameError = validateUsernameOrEmail(this.usernameOrEmail);
		const passwordError = validatePassword(this.password);
		this.fieldErrors = {
			username: usernameError ?? void 0,
			password: passwordError ?? void 0
		};
		return !usernameError && !passwordError;
	}
	async submit(onSuccess) {
		this.errorMessage = null;
		if (!this.validate() || this.submitting) return;
		this.submitting = true;
		try {
			const user = await this.gateway.login(this.usernameOrEmail, this.password);
			authSessionController.setUser(user);
			onSuccess(user);
		} catch (err) {
			if (err instanceof Error) this.errorMessage = err.message;
			else this.errorMessage = "Terjadi kesalahan saat masuk. Coba lagi.";
		} finally {
			this.submitting = false;
		}
	}
};
//#endregion
//#region src/lib/shared/ui/Button.svelte
function Button($$renderer, $$props) {
	let { variant = "primary", size = "default", children, class: className = "", type = "button", disabled = false, $$slots, $$events, ...restProps } = $$props;
	$$renderer.push(`<button${attributes({
		type,
		disabled,
		class: `neo-control inline-flex items-center justify-center gap-2 select-none disabled:pointer-events-none disabled:opacity-50 ${stringify({
			primary: "bg-primary text-on-primary font-bold hover:brightness-105",
			secondary: "bg-surface-soft text-ink font-semibold hover:bg-surface",
			ghost: "bg-transparent text-ink border-transparent shadow-none hover:bg-surface-soft active:translate-none",
			danger: "bg-danger text-white font-bold hover:brightness-105",
			accent: "bg-mustard text-on-mustard font-bold hover:brightness-105"
		}[variant])} ${stringify({
			default: "min-h-[44px] px-5 py-2.5 text-base",
			sm: "min-h-[44px] px-3.5 py-1.5 text-sm",
			icon: "min-h-[44px] min-w-[44px] p-2.5"
		}[size])} ${stringify(className)}`,
		...restProps
	})}>`);
	if (children) {
		$$renderer.push("<!--[0-->");
		children($$renderer);
		$$renderer.push(`<!---->`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></button>`);
}
//#endregion
//#region src/lib/shared/ui/Input.svelte
function Input($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { value = "", error = false, class: className = "", type = "text", disabled = false, $$slots, $$events, ...restProps } = $$props;
		const hasError = derived(() => Boolean(error));
		$$renderer.push(`<div class="w-full"><input${attributes({
			type,
			disabled,
			value,
			"aria-invalid": hasError() ? "true" : void 0,
			class: `min-h-[44px] w-full rounded-xl border-2 bg-surface px-4 py-2.5 text-base font-medium text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)] placeholder:text-muted/70 transition-all duration-120 outline-none focus:border-neo-border focus:shadow-[3.5px_3.5px_0px_var(--neo-shadow-color)] disabled:cursor-not-allowed disabled:opacity-50 ${hasError() ? "border-danger focus-visible:outline-danger" : "border-line"} ${stringify(className)}`,
			...restProps
		}, void 0, void 0, void 0, 4)}/> `);
		if (typeof error === "string" && error.trim().length > 0) $$renderer.push(`<!--[0--><p class="mt-1.5 text-xs font-semibold text-danger" role="alert">${escape_html(error)}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, { value });
	});
}
//#endregion
//#region src/lib/shared/ui/Card.svelte
function Card($$renderer, $$props) {
	let { children, class: className = "", $$slots, $$events, ...restProps } = $$props;
	$$renderer.push(`<div${attributes({
		class: `neo-box p-5 md:p-6 ${stringify(className)}`,
		...restProps
	})}>`);
	if (children) {
		$$renderer.push("<!--[0-->");
		children($$renderer);
		$$renderer.push(`<!---->`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div>`);
}
//#endregion
//#region src/lib/shared/ui/Dialog.svelte
function Dialog($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, title, onclose, children, footer } = $$props;
		if (open) {
			$$renderer.push(`<!--[0--><div class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs" role="presentation"><div role="dialog" aria-modal="true" aria-labelledby="dialog-title" class="neo-box flex w-full max-w-md flex-col gap-4 border-2 border-line bg-surface p-6 shadow-[6px_6px_0px_var(--neo-shadow-color)] animate-in fade-in-50 zoom-in-95 duration-150"><div class="flex items-center justify-between"><h2 id="dialog-title" class="text-lg font-bold text-ink">${escape_html(title)}</h2> <button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted hover:bg-surface-soft hover:text-ink" aria-label="Tutup dialog">✕</button></div> <div class="text-sm text-ink">`);
			if (children) {
				$$renderer.push("<!--[0-->");
				children($$renderer);
				$$renderer.push(`<!---->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			if (footer) {
				$$renderer.push(`<!--[0--><div class="mt-2 flex items-center justify-end gap-2 pt-2 border-t border-line/60">`);
				footer($$renderer);
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/shared/ui/Select.svelte
function Select($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id, value, options = [], placeholder = "Pilih opsi", ariaLabel, disabled = false, class: className = "", onchange } = $$props;
		let open = false;
		const listboxId = `${uid}-listbox`;
		const selectedOption = derived(() => options.find((opt) => opt.value === value) ?? null);
		$$renderer.push(`<div${attr_class(`relative w-full ${stringify(className)}`)}><button${attr("id", id)} type="button" role="combobox" aria-haspopup="listbox"${attr("aria-controls", listboxId)}${attr("aria-expanded", open)}${attr("aria-label", ariaLabel)}${attr("disabled", disabled, true)}${attr_class(`flex h-11 w-full items-center justify-between gap-2 rounded-xl border-2 border-line bg-surface px-3.5 text-left text-xs font-bold text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)] transition-all duration-150 hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm `)}><span class="flex min-w-0 items-center gap-2"><span${attr_class(`truncate ${selectedOption() ? "text-ink" : "text-muted"}`)}>${escape_html(selectedOption() ? selectedOption().label : placeholder)}</span> `);
		if (selectedOption()?.badge) $$renderer.push(`<!--[0--><span class="shrink-0 rounded-md border border-line/25 bg-mustard-soft px-1.5 py-0.5 text-[10px] font-extrabold text-ink">${escape_html(selectedOption().badge)}</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></span> `);
		Chevron_down($$renderer, {
			class: `h-4 w-4 shrink-0 text-muted transition-transform duration-150 `,
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----></button> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/shared/ui/Pagination.svelte
function Pagination($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { page, pageSize, totalItems, totalPages, disabled = false, itemLabel = "data", onpagechange, onpagesizechange } = $$props;
		const pageSizeOptions = [
			{
				value: "10",
				label: "10 / hal"
			},
			{
				value: "15",
				label: "15 / hal"
			},
			{
				value: "25",
				label: "25 / hal"
			},
			{
				value: "50",
				label: "50 / hal"
			}
		];
		const startItem = derived(() => totalItems === 0 ? 0 : (page - 1) * pageSize + 1);
		const endItem = derived(() => Math.min(page * pageSize, totalItems));
		const visiblePages = derived(() => {
			if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
			const items = [1];
			const left = Math.max(2, page - 1);
			const right = Math.min(totalPages - 1, page + 1);
			if (left > 2) items.push("ellipsis");
			for (let p = left; p <= right; p++) items.push(p);
			if (right < totalPages - 1) items.push("ellipsis");
			items.push(totalPages);
			return items;
		});
		$$renderer.push(`<div class="flex flex-col gap-3 border-t-2 border-line/15 pt-4 sm:flex-row sm:items-center sm:justify-between"><div class="flex flex-wrap items-center justify-between gap-3 sm:justify-start"><p class="text-xs font-semibold text-muted">Menampilkan <span class="font-extrabold text-ink">${escape_html(startItem())}–${escape_html(endItem())}</span> dari <span class="font-extrabold text-ink">${escape_html(totalItems)}</span> ${escape_html(itemLabel)}</p> `);
		if (onpagesizechange) {
			$$renderer.push(`<!--[0--><div class="w-28">`);
			Select($$renderer, {
				ariaLabel: "Jumlah data per halaman",
				value: String(pageSize),
				options: pageSizeOptions,
				disabled,
				onchange: (val) => onpagesizechange(Number(val))
			});
			$$renderer.push(`<!----></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <nav aria-label="Navigasi halaman" class="flex flex-wrap items-center justify-center gap-1.5 sm:justify-end"><button type="button"${attr("disabled", disabled || page <= 1, true)} class="inline-flex h-9 items-center gap-1 rounded-xl border-2 border-line bg-surface px-2.5 text-xs font-bold text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)] transition hover:bg-surface-soft active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none" aria-label="Halaman sebelumnya">`);
		Chevron_left($$renderer, {
			class: "h-4 w-4",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----> <span class="hidden sm:inline">Sebelumnya</span></button> <!--[-->`);
		const each_array = ensure_array_like(visiblePages());
		for (let idx = 0, $$length = each_array.length; idx < $$length; idx++) {
			let token = each_array[idx];
			if (token === "ellipsis") $$renderer.push(`<!--[0--><span class="px-1.5 text-xs font-bold text-muted" aria-hidden="true">…</span>`);
			else $$renderer.push(`<!--[-1--><button type="button"${attr("disabled", disabled, true)}${attr("aria-current", token === page ? "page" : void 0)}${attr_class(`inline-flex h-9 min-w-[36px] items-center justify-center rounded-xl border-2 px-2 text-xs font-extrabold transition ${token === page ? "border-line bg-mustard text-on-mustard shadow-[2px_2px_0px_var(--neo-shadow-color)]" : "border-line/30 bg-surface text-ink hover:border-line hover:bg-surface-soft"}`)}>${escape_html(token)}</button>`);
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--> <button type="button"${attr("disabled", disabled || page >= totalPages, true)} class="inline-flex h-9 items-center gap-1 rounded-xl border-2 border-line bg-surface px-2.5 text-xs font-bold text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)] transition hover:bg-surface-soft active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none" aria-label="Halaman berikutnya"><span class="hidden sm:inline">Berikutnya</span> `);
		Chevron_right($$renderer, {
			class: "h-4 w-4",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----></button></nav></div>`);
	});
}
//#endregion
//#region src/lib/features/auth/presentation/components/LoginForm.svelte
function LoginForm($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { usernameOrEmail, password, showPassword, submitting, errorMessage = null, fieldErrors = {}, sessionExpired = false, onusernamechange, onpasswordchange, ontoggleshowpassword, onsubmit } = $$props;
		$$renderer.push(`<div class="w-full max-w-[400px]">`);
		Card($$renderer, {
			class: "flex w-full flex-col gap-6 rounded-2xl border-2 border-line bg-surface p-6 shadow-[4px_4px_0px_var(--neo-shadow-color)] sm:p-7",
			children: ($$renderer) => {
				$$renderer.push(`<div class="flex flex-col gap-1.5"><h1 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Masuk ke Akun</h1> <p class="text-xs leading-relaxed font-medium text-muted sm:text-[13px]">Masukkan nama pengguna atau NIS untuk mengakses ruang belajar TAKO AI.</p></div> `);
				if (sessionExpired) {
					$$renderer.push(`<!--[0--><div class="flex items-center gap-2.5 rounded-xl border-2 border-line bg-mustard/20 px-3.5 py-2.5 text-xs font-bold text-ink" role="alert">`);
					Circle_exclamation_point($$renderer, {
						class: "h-4 w-4 shrink-0",
						"aria-hidden": "true"
					});
					$$renderer.push(`<!----> <span>Sesi Anda telah berakhir. Silakan masuk kembali.</span></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (errorMessage) {
					$$renderer.push(`<!--[0--><div class="flex items-center gap-2.5 rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2.5 text-xs font-bold text-danger" role="alert">`);
					Circle_exclamation_point($$renderer, {
						class: "h-4 w-4 shrink-0",
						"aria-hidden": "true"
					});
					$$renderer.push(`<!----> <span>${escape_html(errorMessage)}</span></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <form class="flex flex-col gap-4"><div class="flex flex-col gap-1.5"><label for="login-username" class="text-xs font-bold tracking-tight text-ink">Nama pengguna atau NIS</label> `);
				Input($$renderer, {
					id: "login-username",
					name: "username",
					autocomplete: "username",
					placeholder: "siswa.x01 atau NIS-10001",
					value: usernameOrEmail,
					error: fieldErrors.username,
					class: "h-11 text-sm",
					oninput: (e) => onusernamechange(e.currentTarget.value)
				});
				$$renderer.push(`<!----></div> <div class="flex flex-col gap-1.5"><label for="login-password" class="text-xs font-bold tracking-tight text-ink">Kata sandi</label> <div class="relative w-full">`);
				Input($$renderer, {
					id: "login-password",
					name: "password",
					type: showPassword ? "text" : "password",
					autocomplete: "current-password",
					placeholder: "Masukkan kata sandi",
					value: password,
					error: fieldErrors.password,
					class: "h-11 pr-11 text-sm",
					oninput: (e) => onpasswordchange(e.currentTarget.value)
				});
				$$renderer.push(`<!----> <button type="button" class="absolute right-1.5 top-[22px] -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-soft hover:text-ink"${attr("aria-label", showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi")}>`);
				if (showPassword) {
					$$renderer.push("<!--[0-->");
					Eye_off($$renderer, {
						class: "h-4 w-4",
						"aria-hidden": "true"
					});
				} else {
					$$renderer.push("<!--[-1-->");
					Eye($$renderer, {
						class: "h-4 w-4",
						"aria-hidden": "true"
					});
				}
				$$renderer.push(`<!--]--></button></div></div> `);
				Button($$renderer, {
					type: "submit",
					variant: "primary",
					disabled: submitting,
					class: "mt-1 h-11 w-full justify-center text-sm font-bold",
					children: ($$renderer) => {
						if (submitting) {
							$$renderer.push("<!--[0-->");
							Loader_circle($$renderer, {
								class: "h-4 w-4 animate-spin",
								"aria-hidden": "true"
							});
							$$renderer.push(`<!----> <span>Memverifikasi…</span>`);
						} else {
							$$renderer.push("<!--[-1-->");
							Log_in($$renderer, {
								class: "h-4 w-4",
								"aria-hidden": "true"
							});
							$$renderer.push(`<!----> <span>Masuk</span>`);
						}
						$$renderer.push(`<!--]-->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></form> <div class="border-t border-line/20 pt-4 text-center"><p class="text-xs font-medium text-muted">Kesulitan masuk? Hubungi guru pengampu atau pengelola kelas.</p></div>`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div>`);
	});
}
//#endregion
//#region src/lib/features/auth/presentation/pages/LoginPage.svelte
function LoginPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const formController = new LoginFormController();
		async function handleSuccess(user) {
			const target = resolveSafePostLoginTarget(page.url, user.role);
			if (target.startsWith("/")) {
				await goto(target);
				return;
			}
			window.location.href = target;
		}
		head("1j2njiu", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Masuk - TAKO AI</title>`);
			});
		});
		$$renderer.push(`<main class="flex min-h-dvh w-full items-center justify-center bg-background px-4 py-8 text-ink">`);
		LoginForm($$renderer, {
			usernameOrEmail: formController.usernameOrEmail,
			password: formController.password,
			showPassword: formController.showPassword,
			submitting: formController.submitting,
			errorMessage: formController.errorMessage,
			fieldErrors: formController.fieldErrors,
			sessionExpired: page.url.searchParams.get("expired") === "true",
			onusernamechange: (v) => formController.usernameOrEmail = v,
			onpasswordchange: (v) => formController.password = v,
			ontoggleshowpassword: () => formController.toggleShowPassword(),
			onsubmit: () => formController.submit(handleSuccess)
		});
		$$renderer.push(`<!----></main>`);
	});
}
//#endregion
export { Circle_exclamation_point as _, Card as a, authSessionController as c, apiStream as d, clearAuthStorage as f, Eye as g, Loader_circle as h, Dialog as i, ApiError as l, getStoredToken as m, Pagination as n, Input as o, getApiBaseUrl as p, Select as r, Button as s, LoginPage as t, apiRequest as u, Chevron_down as v };

//# sourceMappingURL=auth.js.map