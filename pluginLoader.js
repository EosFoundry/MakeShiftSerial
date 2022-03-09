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
import { fork } from 'child_process';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var __plugin_dir = path.join(__dirname, 'plugins');
var pluginList = [
    // "dummyPlugin",
    "makeshiftctrl-obs",
];
var plugins = {};
function loadPlugins() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, pluginList_1, pluginName, data, manifest, _loop_1, _a, pluginList_2, id;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, pluginList_1 = pluginList;
                    _b.label = 1;
                case 1:
                    if (!(_i < pluginList_1.length)) return [3 /*break*/, 4];
                    pluginName = pluginList_1[_i];
                    plugins[pluginName] = {};
                    console.log('reading manifest from - ' + pluginName);
                    return [4 /*yield*/, readFile(path.join(__plugin_dir, pluginName, 'manifest.json'), { encoding: 'UTF8' })];
                case 2:
                    data = _b.sent();
                    manifest = JSON.parse(data);
                    plugins[pluginName].manifest = manifest;
                    console.log(manifest);
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    ;
                    console.log('done!');
                    _loop_1 = function (id) {
                        var vm = fork('./pluginVM');
                        vm.on('message', function (m) {
                            console.log("message received from: ".concat(id));
                            console.log(m.message);
                            if (m.message === 'load successful') {
                                console.log('sending command to VM');
                                vm.send({
                                    command: 'run',
                                    functionName: plugins[id].manifest.functionsAvailable[1]
                                });
                            }
                            else if (m.message === 'error loading') {
                                console.log(m.message);
                            }
                        });
                        vm.send({
                            name: plugins[id].manifest.name,
                            root: './plugins/' + plugins[id].manifest.name,
                            manifest: plugins[id].manifest,
                            command: 'init'
                        });
                    };
                    for (_a = 0, pluginList_2 = pluginList; _a < pluginList_2.length; _a++) {
                        id = pluginList_2[_a];
                        _loop_1(id);
                    }
                    ;
                    return [2 /*return*/];
            }
        });
    });
}
;
export { loadPlugins, plugins, };
