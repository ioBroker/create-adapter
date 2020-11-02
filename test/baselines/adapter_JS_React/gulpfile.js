/*!
 * ioBroker gulpfile
 * Date: 2019-01-28
 */
"use strict";

const gulp = require("gulp");
const fs = require("fs");
const pkg = require("./package.json");
const iopackage = require("./io-package.json");
const version = (pkg && pkg.version) ? pkg.version : iopackage.common.version;
const fileName = "words.js";
const EMPTY = "";
const translate = require("./lib/tools").translateText;
const languages = {
	en: {},
	de: {},
	ru: {},
	pt: {},
	nl: {},
	fr: {},
	it: {},
	es: {},
	pl: {},
	"zh-cn": {}
};

async function translateNotExisting(obj, baseText, yandex) {
	let t = obj["en"];
	if (!t) {
		t = baseText;
	}

	if (t) {
		for (let l in languages) {
			if (!obj[l]) {
				const time = new Date().getTime();
				obj[l] = await translate(t, l, yandex);
				console.log("en -> " + l + " " + (new Date().getTime() - time) + " ms");
			}
		}
	}
}

//TASKS

gulp.task("updatePackages", function (done) {
	iopackage.common.version = pkg.version;
	iopackage.common.news = iopackage.common.news || {};
	if (!iopackage.common.news[pkg.version]) {
		const news = iopackage.common.news;
		const newNews = {};

		newNews[pkg.version] = {
			en: "news",
			de: "neues",
			ru: "новое",
			pt: "novidades",
			nl: "nieuws",
			fr: "nouvelles",
			it: "notizie",
			es: "noticias",
			pl: "nowości",
			"zh-cn": "新"
		};
		iopackage.common.news = Object.assign(newNews, news);
	}
	fs.writeFileSync("io-package.json", JSON.stringify(iopackage, null, 4));
	done();
});

gulp.task("updateReadme", function (done) {
	const readme = fs.readFileSync("README.md").toString();
	const pos = readme.indexOf("## Changelog\n");
	if (pos !== -1) {
		const readmeStart = readme.substring(0, pos + "## Changelog\n".length);
		const readmeEnd = readme.substring(pos + "## Changelog\n".length);

		if (readme.indexOf(version) === -1) {
			const timestamp = new Date();
			const date = timestamp.getFullYear() + "-" +
					("0" + (timestamp.getMonth() + 1).toString(10)).slice(-2) + "-" +
					("0" + (timestamp.getDate()).toString(10)).slice(-2);

			let news = "";
			if (iopackage.common.news && iopackage.common.news[pkg.version]) {
				news += "* " + iopackage.common.news[pkg.version].en;
			}

			fs.writeFileSync("README.md", readmeStart + "### " + version + " (" + date + ")\n" + (news ? news + "\n\n" : "\n") + readmeEnd);
		}
	}
	done();
});

gulp.task("translate", async function (done) {

	let yandex;
	const i = process.argv.indexOf("--yandex");
	if (i > -1) {
		yandex = process.argv[i + 1];
	}

	if (iopackage && iopackage.common) {
		if (iopackage.common.news) {
			console.log("Translate News");
			for (let k in iopackage.common.news) {
				console.log("News: " + k);
				let nw = iopackage.common.news[k];
				await translateNotExisting(nw, null, yandex);
			}
		}
		if (iopackage.common.titleLang) {
			console.log("Translate Title");
			await translateNotExisting(iopackage.common.titleLang, iopackage.common.title, yandex);
		}
		if (iopackage.common.desc) {
			console.log("Translate Description");
			await translateNotExisting(iopackage.common.desc, null, yandex);
		}

		if (fs.existsSync("./admin/i18n/en/translations.json")) {
			let enTranslations = require("./admin/i18n/en/translations.json");
			for (let l in languages) {
				console.log("Translate Text: " + l);
				let existing = {};
				if (fs.existsSync("./admin/i18n/" + l + "/translations.json")) {
					existing = require("./admin/i18n/" + l + "/translations.json");
				}
				for (let t in enTranslations) {
					if (!existing[t]) {
						existing[t] = await translate(enTranslations[t], l, yandex);
					}
				}
				if (!fs.existsSync("./admin/i18n/" + l + "/")) {
					fs.mkdirSync("./admin/i18n/" + l + "/");
				}
				fs.writeFileSync("./admin/i18n/" + l + "/translations.json", JSON.stringify(existing, null, 4));
			}
		}

	}
	fs.writeFileSync("io-package.json", JSON.stringify(iopackage, null, 4));
});

gulp.task("default", gulp.series("updatePackages", "updateReadme"));