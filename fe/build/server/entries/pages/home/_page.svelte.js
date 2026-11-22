import { a as derived, c as head, d as spread_props, f as stringify, h as attr, n as attr_style, s as ensure_array_like, t as attr_class, y as escape_html } from "../../../chunks/server2.js";
import { a as Log_in, i as Moon, n as themeController, o as Icon, r as Sun, s as page } from "../../../chunks/theme.js";
import { t as Arrow_down } from "../../../chunks/arrow-down.js";
import { n as Arrow_right, t as Book_open } from "../../../chunks/book-open.js";
import { r as buildSiteUrl, t as buildAuthLoginUrl } from "../../../chunks/subdomains.js";
//#region node_modules/@lucide/svelte/dist/icons/messages-square.svelte
var __iconData$1 = {
	"name": "messages-square",
	"size": 24,
	"node": [["path", { "d": "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" }], ["path", { "d": "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1" }]]
};
__iconData$1.node;
function Messages_square($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData$1 }]));
}
//#endregion
//#region node_modules/@lucide/svelte/dist/icons/sliders-horizontal.svelte
var __iconData = {
	"name": "sliders-horizontal",
	"size": 24,
	"node": [
		["path", { "d": "M10 5H3" }],
		["path", { "d": "M12 19H3" }],
		["path", { "d": "M14 3v4" }],
		["path", { "d": "M16 17v4" }],
		["path", { "d": "M21 12h-9" }],
		["path", { "d": "M21 19h-5" }],
		["path", { "d": "M21 5h-7" }],
		["path", { "d": "M8 10v4" }],
		["path", { "d": "M8 12H3" }]
	]
};
__iconData.node;
function Sliders_horizontal($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([props, { icon: __iconData }]));
}
//#endregion
//#region src/lib/features/home/domain/homeContent.ts
var FOOTER_COPYRIGHT = "Copyright 2026 - By Utaaa";
var ABOUT_DIALOGUES = [
	{
		id: "data-latih-uji",
		tabLabel: "Data Latih & Uji",
		question: "Apa perbedaan data latih dan data uji dalam machine learning?",
		reply: "Bayangkan kamu lagi siapin diri buat ulangan. Data latih itu seperti kumpulan soal latihan yang kamu kerjakan untuk belajar pola, sedangkan data uji itu soal ujian beneran yang belum pernah kamu lihat sebelumnya.",
		promptBack: "Menurutmu, apa akibatnya kalau soal ujiannya sama persis dengan soal latihan?",
		sourceLabel: "Modul KKA Kelas X: Pemodelan & Evaluasi Data"
	},
	{
		id: "susun-algoritma",
		tabLabel: "Logika Algoritma",
		question: "Gimana cara mulai menyusun langkah penyelesaian masalah buat coding?",
		reply: "Mulai dengan memecah masalah besar jadi bagian kecil (dekomposisi), lalu cari pola yang berulang sebelum menulis baris kode. Dengan begitu, alur logikanya kebayang dulu sebelum pilih bahasa pemrograman.",
		promptBack: "Coba sebutkan 3 langkah awal kalau kamu mau bikin program pengecek nilai ujian!",
		sourceLabel: "Modul KKA Kelas X: Berpikir Komputasional"
	},
	{
		id: "cek-info-ai",
		tabLabel: "Cek Info AI",
		question: "Kenapa jawaban AI tidak boleh langsung dipercaya 100%?",
		reply: "Model bahasa generatif menyusun kata berdasarkan pola statistik, sehingga tetap bisa keliru menyebut fakta atau mengarang referensi. Biasakan verifikasi ke sumber utama atau modul belajar.",
		promptBack: "Bagian mana dari jawaban AI yang paling penting kamu cek ulang sebelum dipakai di tugas?",
		sourceLabel: "Modul KKA Kelas X: Literasi & Etika AI"
	}
];
var ABOUT_CAPABILITIES = [
	{
		id: "sources",
		title: "Rujukan Materi Kurikulum Jelas",
		description: "Penjelasan TAKO mengacu pada bahan ajar KKA yang dikelola guru, lengkap dengan panel sumber untuk meninjau topik dan kutipannya."
	},
	{
		id: "personalization",
		title: "Gaya Belajar Bisa Disesuaikan",
		description: "Atur gaya jawaban sesuai seleramu: terstruktur, pakai analogi sehari-hari, atau ringkas, dengan atau tanpa contoh kode."
	},
	{
		id: "history",
		title: "Riwayat Diskusi Rapi per Topik",
		description: "Simpan percakapan berdasarkan bab pelajaran, ubah judul room, dan cari ulang catatan belajarmu kapan saja."
	}
];
//#endregion
//#region src/lib/features/home/domain/techText.ts
var DEFAULT_TECH_TEXT_SETTINGS = {
	text: "TAKO AI",
	fontFamily: "",
	fontWeight: 800,
	fontSize: 150,
	letterSpacing: -.05,
	color: "currentColor",
	accentColor: "currentColor",
	shadowColor: "",
	shadowOffset: 0,
	align: "center",
	reach: 200,
	softness: .7,
	dashLength: 4,
	dashGap: 2,
	strokeWidth: 1.5,
	lineStyle: "dashed",
	reveal: "letter",
	specks: 15,
	selection: true,
	labels: true,
	draggable: true,
	bounce: .4,
	sweep: true,
	speed: 1,
	clickKick: true,
	intro: "none",
	introDuration: 2,
	guides: false
};
//#endregion
//#region src/lib/features/home/presentation/components/TechText.svelte
function TechText($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { text = DEFAULT_TECH_TEXT_SETTINGS.text, fontFamily = DEFAULT_TECH_TEXT_SETTINGS.fontFamily, fontWeight = DEFAULT_TECH_TEXT_SETTINGS.fontWeight, fontSize = DEFAULT_TECH_TEXT_SETTINGS.fontSize, letterSpacing = DEFAULT_TECH_TEXT_SETTINGS.letterSpacing, color = DEFAULT_TECH_TEXT_SETTINGS.color, accentColor = DEFAULT_TECH_TEXT_SETTINGS.accentColor, shadowColor = DEFAULT_TECH_TEXT_SETTINGS.shadowColor, shadowOffset = DEFAULT_TECH_TEXT_SETTINGS.shadowOffset, align = DEFAULT_TECH_TEXT_SETTINGS.align, reach = DEFAULT_TECH_TEXT_SETTINGS.reach, softness = DEFAULT_TECH_TEXT_SETTINGS.softness, dashLength = DEFAULT_TECH_TEXT_SETTINGS.dashLength, dashGap = DEFAULT_TECH_TEXT_SETTINGS.dashGap, strokeWidth = DEFAULT_TECH_TEXT_SETTINGS.strokeWidth, lineStyle = DEFAULT_TECH_TEXT_SETTINGS.lineStyle, reveal = DEFAULT_TECH_TEXT_SETTINGS.reveal, specks = DEFAULT_TECH_TEXT_SETTINGS.specks, selection = DEFAULT_TECH_TEXT_SETTINGS.selection, labels = DEFAULT_TECH_TEXT_SETTINGS.labels, draggable = DEFAULT_TECH_TEXT_SETTINGS.draggable, bounce = DEFAULT_TECH_TEXT_SETTINGS.bounce, sweep = DEFAULT_TECH_TEXT_SETTINGS.sweep, speed = DEFAULT_TECH_TEXT_SETTINGS.speed, clickKick = DEFAULT_TECH_TEXT_SETTINGS.clickKick, intro = DEFAULT_TECH_TEXT_SETTINGS.intro, introDuration = DEFAULT_TECH_TEXT_SETTINGS.introDuration, guides = DEFAULT_TECH_TEXT_SETTINGS.guides, class: className = "", style = "" } = $$props;
		derived(() => ({
			text,
			fontFamily,
			fontWeight,
			fontSize,
			letterSpacing,
			color,
			accentColor,
			shadowColor,
			shadowOffset,
			align,
			reach,
			softness,
			dashLength,
			dashGap,
			strokeWidth,
			lineStyle,
			reveal,
			specks,
			selection,
			labels,
			draggable,
			bounce,
			sweep,
			speed,
			clickKick,
			intro,
			introDuration,
			guides
		}));
		$$renderer.push(`<div${attr_class(`relative h-full w-full touch-pan-y select-none ${stringify(className)}`)}${attr_style(style)} role="img"${attr("aria-label", text)}><canvas class="block h-full w-full"></canvas></div>`);
	});
}
//#endregion
//#region src/lib/features/home/presentation/components/HomeAbout.svelte
function HomeAbout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { chatHref, dialogues, capabilities } = $$props;
		let activeIndex = 0;
		const activeDialogue = derived(() => dialogues[activeIndex] ?? dialogues[0]);
		$$renderer.push(`<section id="tentang" aria-labelledby="tentang-heading" class="scroll-mt-20 bg-background"><div class="mx-auto flex max-w-6xl flex-col gap-9 px-4 pt-6 pb-14 sm:gap-12 sm:pt-8 sm:pb-16 md:gap-16 md:px-6 md:pt-12 md:pb-24"><div class="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:items-center lg:gap-12"><div class="flex flex-col gap-3 sm:gap-4 lg:col-span-5"><h2 id="tentang-heading" class="text-[1.6rem] leading-[1.2] font-extrabold tracking-tight text-ink sm:text-3xl md:text-4xl md:leading-tight">Teman Belajar Koding &amp; Kecerdasan Artifisial untuk Kelas X</h2> <p class="text-[13.5px] leading-relaxed font-medium text-muted sm:text-base">TAKO AI dibuat khusus buat siswa SMA/SMK yang sedang belajar Koding dan Kecerdasan Artifisial (KKA). Alih-alih langsung menyuapi jawaban jadi, TAKO mengajak kamu berdiskusi langkah demi langkah supaya konsepnya benar-benar masuk akal.</p> <p class="text-[13.5px] leading-relaxed font-medium text-muted sm:text-base">Setiap penjelasan terhubung dengan materi kurikulum yang dikelola guru, jadi kamu bisa belajar mandiri, latihan berpikir komputasional, dan cek langsung rujukan babnya.</p></div> <div class="lg:col-span-7"><div class="motion-card flex flex-col gap-3.5 rounded-2xl border-2 border-line bg-surface p-4 shadow-[3px_3px_0px_var(--neo-shadow-color)] sm:gap-4 sm:p-6 sm:shadow-[4px_4px_0px_var(--neo-shadow-color)]"><div class="flex flex-col gap-2.5 sm:gap-3"><div class="flex items-center justify-between gap-2"><span class="text-xs font-extrabold tracking-tight text-ink sm:text-sm">Simulasi Cara TAKO Membimbing</span> <span class="text-[11px] font-semibold text-muted sm:hidden">${escape_html(1)}/${escape_html(dialogues.length)}</span></div> <div role="tablist" aria-label="Contoh topik diskusi KKA" class="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:rounded-xl sm:border sm:border-line/20 sm:bg-surface-soft sm:p-1"><!--[-->`);
		const each_array = ensure_array_like(dialogues);
		for (let idx = 0, $$length = each_array.length; idx < $$length; idx++) {
			let item = each_array[idx];
			$$renderer.push(`<button type="button" role="tab"${attr("id", `tab-${stringify(item.id)}`)}${attr("aria-selected", activeIndex === idx)}${attr("aria-controls", `panel-${stringify(item.id)}`)}${attr("tabindex", activeIndex === idx ? 0 : -1)}${attr_class(`min-h-[36px] shrink-0 whitespace-nowrap rounded-lg border-2 px-3 py-1.5 text-center text-xs font-bold transition-all duration-150 active:scale-[0.98] sm:min-h-[38px] sm:shrink sm:whitespace-normal ${activeIndex === idx ? "border-line bg-mustard text-on-mustard shadow-[2px_2px_0px_var(--neo-shadow-color)]" : "border-line/20 bg-surface-soft text-muted hover:text-ink sm:border-transparent sm:bg-transparent"}`)}>${escape_html(item.tabLabel)}</button>`);
		}
		$$renderer.push(`<!--]--></div></div> `);
		if (activeDialogue()) {
			$$renderer.push(`<!--[0--><!---->`);
			$$renderer.push(`<div${attr("id", `panel-${stringify(activeDialogue().id)}`)} role="tabpanel"${attr("aria-labelledby", `tab-${stringify(activeDialogue().id)}`)} class="flex flex-col gap-2.5 pt-0.5 sm:gap-3 sm:pt-1"><div class="ml-auto max-w-[90%] rounded-2xl rounded-br-sm border-2 border-line bg-primary px-3.5 py-2.5 text-[13px] leading-snug font-semibold text-on-primary sm:max-w-[85%] sm:rounded-xl sm:px-4 sm:text-sm">${escape_html(activeDialogue().question)}</div> <div class="flex w-full flex-col gap-2.5 rounded-2xl rounded-bl-sm border-2 border-line bg-surface-soft p-3.5 text-[13px] leading-relaxed text-ink sm:mr-auto sm:max-w-[94%] sm:gap-3 sm:rounded-xl sm:p-4 sm:text-sm"><div class="flex items-center gap-2"><span class="inline-flex h-5 w-5 items-center justify-center rounded-md border border-line bg-mustard text-[10px] font-extrabold text-on-mustard" aria-hidden="true">T</span> <span class="text-[11px] font-extrabold tracking-wide text-muted uppercase">TAKO AI</span></div> <p class="font-medium">${escape_html(activeDialogue().reply)}</p> <p class="rounded-r-lg border border-line/20 border-l-[3px] border-l-mustard bg-surface px-3 py-2 text-[13px] leading-snug font-bold text-ink sm:px-3.5 sm:py-2.5 sm:text-sm">${escape_html(activeDialogue().promptBack)}</p> <div class="inline-flex w-fit max-w-full items-center gap-1.5 rounded-lg border border-line/35 bg-mustard-soft px-2.5 py-1 text-[11px] leading-snug font-bold text-ink sm:text-xs">`);
			Book_open($$renderer, {
				class: "h-3.5 w-3.5 shrink-0",
				"aria-hidden": "true"
			});
			$$renderer.push(`<!----> <span>${escape_html(activeDialogue().sourceLabel)}</span></div></div></div>`);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div></div> <div class="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12"><div class="motion-card flex flex-col justify-between gap-5 rounded-2xl border-2 border-line bg-mustard p-5 text-on-mustard shadow-[3px_3px_0px_var(--neo-shadow-color)] sm:gap-6 sm:p-6 sm:shadow-[4px_4px_0px_var(--neo-shadow-color)] md:p-7 lg:col-span-5"><div class="flex flex-col gap-2.5 sm:gap-3"><h3 class="text-lg leading-snug font-extrabold tracking-tight sm:text-xl md:text-2xl">Bikin Paham Konsep, Bukan Sekadar Copy-Paste</h3> <p class="text-[13.5px] leading-relaxed font-semibold sm:text-sm md:text-base">TAKO memandu proses berpikir kamu dari pertanyaan pemantik, petunjuk bertahap, sampai latihan menjelaskan kembali dengan bahasa sendiri.</p></div> <div><a${attr("href", chatHref)} class="neo-control group inline-flex min-h-[44px] w-full items-center justify-center gap-2 bg-surface px-5 py-2.5 text-sm font-extrabold text-ink hover:bg-surface-soft sm:w-auto"><span>Coba Tanya TAKO Sekarang</span> `);
		Arrow_right($$renderer, {
			class: "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1",
			"aria-hidden": "true"
		});
		$$renderer.push(`<!----></a></div></div> <ul class="divide-y divide-line/20 overflow-hidden rounded-2xl border-2 border-line bg-surface shadow-[3px_3px_0px_var(--neo-shadow-color)] sm:shadow-[4px_4px_0px_var(--neo-shadow-color)] lg:col-span-7"><!--[-->`);
		const each_array_1 = ensure_array_like(capabilities);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let item = each_array_1[$$index_1];
			$$renderer.push(`<li class="group flex items-start gap-3.5 p-4 transition-colors duration-150 hover:bg-surface-soft/60 sm:gap-4 sm:p-5 md:p-6"><div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-line bg-surface-soft text-ink transition-all duration-200 group-hover:-translate-y-0.5 group-hover:bg-mustard group-hover:text-on-mustard group-hover:shadow-[2px_2px_0px_var(--neo-shadow-color)] sm:h-11 sm:w-11">`);
			if (item.id === "sources") {
				$$renderer.push("<!--[0-->");
				Book_open($$renderer, {
					class: "h-[18px] w-[18px] sm:h-5 sm:w-5",
					"aria-hidden": "true"
				});
			} else if (item.id === "personalization") {
				$$renderer.push("<!--[1-->");
				Sliders_horizontal($$renderer, {
					class: "h-[18px] w-[18px] sm:h-5 sm:w-5",
					"aria-hidden": "true"
				});
			} else {
				$$renderer.push("<!--[-1-->");
				Messages_square($$renderer, {
					class: "h-[18px] w-[18px] sm:h-5 sm:w-5",
					"aria-hidden": "true"
				});
			}
			$$renderer.push(`<!--]--></div> <div class="flex flex-col gap-1"><h3 class="text-[15px] leading-snug font-extrabold text-ink sm:text-base">${escape_html(item.title)}</h3> <p class="text-[13px] leading-relaxed font-medium text-muted sm:text-sm">${escape_html(item.description)}</p></div></li>`);
		}
		$$renderer.push(`<!--]--></ul></div></div></section>`);
	});
}
//#endregion
//#region src/lib/features/home/presentation/components/HomeHero.svelte
function HomeHero($$renderer, $$props) {
	let { aboutHref = "#tentang" } = $$props;
	$$renderer.push(`<section id="hero" aria-labelledby="hero-title" class="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl flex-col items-center justify-center gap-8 px-4 py-12 md:min-h-[calc(100dvh-4.5rem)] md:gap-10 md:px-6"><h1 id="hero-title" class="sr-only">TAKO AI</h1> <div class="h-[200px] w-full sm:h-[270px] md:h-[340px] lg:h-[380px]">`);
	TechText($$renderer, {
		text: "TAKO AI",
		fontWeight: 800,
		fontSize: 210,
		letterSpacing: -.04,
		color: "var(--text)",
		accentColor: "var(--primary)",
		shadowColor: "var(--mustard)",
		shadowOffset: 6,
		reveal: "letter",
		dashLength: 6,
		dashGap: 3,
		strokeWidth: 2,
		specks: 15,
		intro: "none",
		clickKick: true,
		guides: false,
		reach: 200,
		softness: .7,
		lineStyle: "dashed",
		speed: 1,
		bounce: .42,
		selection: true,
		labels: true,
		align: "center",
		draggable: true,
		sweep: true
	});
	$$renderer.push(`<!----></div> <div><a${attr("href", aboutHref)} class="neo-control group inline-flex min-h-[54px] items-center justify-center gap-2.5 bg-mustard px-8 py-3.5 text-base font-extrabold tracking-tight text-on-mustard shadow-[4px_4px_0px_var(--neo-shadow-color)] md:text-lg">`);
	Book_open($$renderer, {
		class: "h-5 w-5 shrink-0",
		"aria-hidden": "true"
	});
	$$renderer.push(`<!----> <span>Pelajari TAKO AI</span> `);
	Arrow_down($$renderer, {
		class: "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-y-1",
		"aria-hidden": "true"
	});
	$$renderer.push(`<!----></a></div></section>`);
}
//#endregion
//#region src/lib/features/home/presentation/components/HomeThemeSwitch.svelte
function HomeThemeSwitch($$renderer, $$props) {
	let { resolved, ontoggle, class: className = "" } = $$props;
	const isDark = derived(() => resolved === "dark");
	const label = derived(() => isDark() ? "Mode gelap aktif. Beralih ke mode terang." : "Mode terang aktif. Beralih ke mode gelap.");
	$$renderer.push(`<button type="button" role="switch"${attr("aria-checked", isDark())}${attr("aria-label", label())}${attr("title", isDark() ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap")}${attr_class(`relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-line bg-surface text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)] transition-all duration-150 hover:bg-surface-soft active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${stringify(className)}`)}>`);
	Sun($$renderer, {
		class: `h-[18px] w-[18px] transition-all duration-200 ${isDark() ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`,
		"aria-hidden": "true"
	});
	$$renderer.push(`<!----> `);
	Moon($$renderer, {
		class: `absolute h-[18px] w-[18px] transition-all duration-200 ${isDark() ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"}`,
		"aria-hidden": "true"
	});
	$$renderer.push(`<!----> <span class="sr-only">${escape_html(label())}</span></button>`);
}
//#endregion
//#region src/lib/features/home/presentation/components/HomeNavbar.svelte
function HomeNavbar($$renderer, $$props) {
	let { homeHref, loginHref, scrolled, themeResolved, ontoggletheme } = $$props;
	$$renderer.push(`<header${attr_class(`sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-200 motion-reduce:transition-none ${scrolled ? "border-b border-line/20 bg-surface/95 backdrop-blur-xs shadow-[0_2px_12px_rgba(0,0,0,0.08)]" : "border-b border-transparent bg-transparent shadow-none"}`)}><div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:h-[72px] md:px-6"><a${attr("href", homeHref)} class="inline-flex min-h-[40px] items-center gap-2.5 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"><span class="inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-line bg-mustard text-sm font-extrabold text-on-mustard shadow-[2px_2px_0px_var(--neo-shadow-color)]" aria-hidden="true">T</span> <span class="text-base font-extrabold tracking-tight md:text-lg">TAKO <span class="text-primary">AI</span></span></a> <nav aria-label="Navigasi utama" class="flex items-center gap-2 sm:gap-2.5"><a${attr("href", loginHref)} class="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border-2 border-line bg-surface px-3.5 text-sm font-bold text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)] transition-all duration-150 hover:bg-surface-soft active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none sm:px-4">`);
	Log_in($$renderer, {
		class: "h-4 w-4 shrink-0 text-muted",
		"aria-hidden": "true"
	});
	$$renderer.push(`<!----> <span>Masuk</span></a> <span class="mx-0.5 hidden h-5 w-[1.5px] bg-line/25 sm:inline-block" aria-hidden="true"></span> `);
	HomeThemeSwitch($$renderer, {
		resolved: themeResolved,
		ontoggle: ontoggletheme
	});
	$$renderer.push(`<!----></nav></div></header>`);
}
//#endregion
//#region src/lib/features/home/presentation/pages/HomePage.svelte
function HomePage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const isScrolled = derived(() => false);
		const homeHref = derived(() => buildSiteUrl("home", page.url, "/"));
		const chatHref = derived(() => buildSiteUrl("chat", page.url, "/"));
		const loginHref = derived(() => buildAuthLoginUrl(page.url));
		head("1nd5x5b", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>TAKO AI - Teman Belajar Koding dan AI Kelas X</title>`);
			});
		});
		$$renderer.push(`<div class="flex min-h-dvh flex-col bg-background text-ink">`);
		HomeNavbar($$renderer, {
			homeHref: homeHref(),
			loginHref: loginHref(),
			scrolled: isScrolled(),
			themeResolved: themeController.resolved,
			ontoggletheme: () => themeController.toggleDayDark()
		});
		$$renderer.push(`<!----> <main class="flex-1">`);
		HomeHero($$renderer, { aboutHref: "#tentang" });
		$$renderer.push(`<!----> `);
		HomeAbout($$renderer, {
			chatHref: chatHref(),
			dialogues: ABOUT_DIALOGUES,
			capabilities: ABOUT_CAPABILITIES
		});
		$$renderer.push(`<!----></main> <footer class="px-4 py-8 md:px-6"><div class="mx-auto max-w-6xl text-center"><p class="text-xs font-semibold text-muted">${escape_html(FOOTER_COPYRIGHT)}</p></div></footer></div>`);
	});
}
//#endregion
//#region src/routes/home/+page.svelte
function _page($$renderer) {
	HomePage($$renderer, {});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map