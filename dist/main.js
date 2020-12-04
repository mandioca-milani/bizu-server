"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio = require("cheerio");
var express = require("express");
var puppeteer = require("puppeteer");
var app = express();
var browser = puppeteer.launch();
app.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, password, page, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                email = req.query.email.toString();
                password = req.query.password.toString();
                return [4 /*yield*/, browser];
            case 1: return [4 /*yield*/, (_d.sent()).newPage()];
            case 2:
                page = _d.sent();
                return [4 /*yield*/, page.goto('https://promilitares.com.br/login')];
            case 3:
                _d.sent();
                return [4 /*yield*/, page.type('input[name="_username"]', email)];
            case 4:
                _d.sent();
                return [4 /*yield*/, page.type('input[name="_password"]', password)];
            case 5:
                _d.sent();
                _b = (_a = Promise).all;
                return [4 /*yield*/, page.click('button[type="submit"]')];
            case 6:
                _c = [
                    _d.sent()
                ];
                return [4 /*yield*/, page.waitForNavigation()];
            case 7: return [4 /*yield*/, _b.apply(_a, [_c.concat([
                        _d.sent()
                    ])])];
            case 8:
                _d.sent();
                if (!(page.url() === 'https://promilitares.com.br/cursos')) return [3 /*break*/, 10];
                return [4 /*yield*/, page.close()];
            case 9:
                _d.sent();
                res.send({
                    "email": email
                });
                _d.label = 10;
            case 10: return [4 /*yield*/, page.close()];
            case 11:
                _d.sent();
                res.status(401).send({
                    "error": "Incorrect email or password"
                });
                return [2 /*return*/];
        }
    });
}); });
app.get('/course', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var page, response, $, _a, _b, courses, regex;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, browser];
            case 1: return [4 /*yield*/, (_c.sent()).newPage()];
            case 2:
                page = _c.sent();
                return [4 /*yield*/, page.goto('https://promilitares.com.br/cursos')];
            case 3:
                response = _c.sent();
                _b = (_a = cheerio).load;
                return [4 /*yield*/, response.text()];
            case 4:
                $ = _b.apply(_a, [_c.sent()]);
                courses = $('a').map(function (index, element) {
                    return $(element).attr('href');
                }).get();
                regex = new RegExp('^\/[a-z\-]{0,}\/[0-9]{4}$');
                courses = courses.filter(function (value) {
                    return regex.test(value);
                });
                courses = courses.filter(function (value, index, array) {
                    return array.indexOf(value) === index;
                });
                courses = courses.map(function (value) {
                    return {
                        "title": value.replace(/\//g, ' ').trim(),
                        "href": value
                    };
                });
                return [4 /*yield*/, page.close()];
            case 5:
                _c.sent();
                res.send(courses);
                return [2 /*return*/];
        }
    });
}); });
app.get('/module', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var course, page, response, $, _a, _b, modules, regex;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                course = req.query.course.toString();
                return [4 /*yield*/, browser];
            case 1: return [4 /*yield*/, (_c.sent()).newPage()];
            case 2:
                page = _c.sent();
                return [4 /*yield*/, page.goto('https://promilitares.com.br' + course)];
            case 3:
                response = _c.sent();
                _b = (_a = cheerio).load;
                return [4 /*yield*/, response.text()];
            case 4:
                $ = _b.apply(_a, [_c.sent()]);
                modules = $('a').map(function (index, element) {
                    return $(element).attr('href');
                }).get();
                regex = new RegExp('^\/[a-z\-]{0,}\/[0-9]{4}\/[a-z0-9\-]{0,}$');
                modules = modules.filter(function (value) {
                    return regex.test(value);
                });
                modules = modules.map(function (value) {
                    return {
                        "title": value.split('/')[3],
                        "href": value
                    };
                });
                return [4 /*yield*/, page.close()];
            case 5:
                _c.sent();
                res.send(modules);
                return [2 /*return*/];
        }
    });
}); });
app.get('/season', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var module, page, response, $, _a, _b, seasons, regex;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                module = req.query.module.toString();
                return [4 /*yield*/, browser];
            case 1: return [4 /*yield*/, (_c.sent()).newPage()];
            case 2:
                page = _c.sent();
                return [4 /*yield*/, page.goto('https://promilitares.com.br' + module)];
            case 3:
                response = _c.sent();
                _b = (_a = cheerio).load;
                return [4 /*yield*/, response.text()];
            case 4:
                $ = _b.apply(_a, [_c.sent()]);
                seasons = $('a').map(function (index, element) {
                    return $(element).attr('href');
                }).get();
                regex = new RegExp('^\/[a-z\-]{0,}\/[a-z0-9\-]{0,}\/[0-9]{4}\/[a-z0-9\-\%]{0,}$');
                seasons = seasons.filter(function (value) {
                    return regex.test(value);
                });
                seasons = seasons.map(function (value) {
                    return {
                        "title": value.split('/')[4],
                        "href": value
                    };
                });
                return [4 /*yield*/, page.close()];
            case 5:
                _c.sent();
                res.send(seasons);
                return [2 /*return*/];
        }
    });
}); });
app.get('/lesson', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var season, page, response, $, _a, _b, lessons, regex;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                season = req.query.season.toString();
                return [4 /*yield*/, browser];
            case 1: return [4 /*yield*/, (_c.sent()).newPage()];
            case 2:
                page = _c.sent();
                return [4 /*yield*/, page.goto('https://promilitares.com.br' + season)];
            case 3:
                response = _c.sent();
                _b = (_a = cheerio).load;
                return [4 /*yield*/, response.text()];
            case 4:
                $ = _b.apply(_a, [_c.sent()]);
                lessons = $('a').map(function (index, element) {
                    return $(element).attr('href');
                }).get();
                regex = new RegExp('^\/[a-z\-]{0,}\/[a-z0-9\-]{0,}\/[0-9]{4}\/[a-z0-9\-\%]{0,}\/[a-z0-9\-\%]{0,}$');
                lessons = lessons.filter(function (value) {
                    return regex.test(value);
                });
                lessons = lessons.map(function (value) {
                    return {
                        "title": value.split('/')[5],
                        "href": value
                    };
                });
                return [4 /*yield*/, page.close()];
            case 5:
                _c.sent();
                res.send(lessons);
                return [2 /*return*/];
        }
    });
}); });
app.get('/source', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var lesson, page, regex, _a, _b, source, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                lesson = req.query.lesson.toString();
                return [4 /*yield*/, browser];
            case 1: return [4 /*yield*/, (_f.sent()).newPage()];
            case 2:
                page = _f.sent();
                return [4 /*yield*/, page.goto('https://promilitares.com.br' + lesson)];
            case 3:
                _f.sent();
                regex = new RegExp('\/\/view\.vzaar\.com\/[0-9]{0,}\/player');
                _b = (_a = regex).test;
                return [4 /*yield*/, page.content()];
            case 4:
                if (!_b.apply(_a, [_f.sent()])) return [3 /*break*/, 7];
                _c = 'https:';
                _e = (_d = regex).exec;
                return [4 /*yield*/, page.content()];
            case 5:
                source = _c + _e.apply(_d, [_f.sent()])[0].replace('player', 'download');
                return [4 /*yield*/, page.close()];
            case 6:
                _f.sent();
                res.send({
                    "src": source,
                });
                _f.label = 7;
            case 7: return [4 /*yield*/, page.close()];
            case 8:
                _f.sent();
                res.status(401).send({
                    "error": "Unauthorized"
                });
                return [2 /*return*/];
        }
    });
}); });
app.listen(3000);
//# sourceMappingURL=main.js.map