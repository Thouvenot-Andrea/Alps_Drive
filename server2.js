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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = require("path");
let tmpdir = os_1.default.tmpdir();
let app = (0, express_1.default)();
app.use(function autoriser(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.get("/", function afficher(req, res) {
    res.send("hello , bonjour");
});
app.get('/api/drive/:path(*)', function affichage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = req.params.path;
        const filePath = (0, path_1.join)(tmpdir, path);
        try {
            const info = yield fs_1.default.promises.stat(filePath);
            if (info.isDirectory()) {
                const files = yield fs_1.default.promises.readdir(filePath);
                const dataFiles = yield Promise.all(files.map((fileName) => __awaiter(this, void 0, void 0, function* () {
                    const fileInfo = yield fs_1.default.promises.stat((0, path_1.join)(filePath, fileName));
                    return {
                        name: fileName,
                        isFolder: fileInfo.isDirectory(),
                        size: fileInfo.size
                    };
                })));
                res.status(200).json(dataFiles);
            }
            else {
                const fileData = yield fs_1.default.promises.readFile(filePath);
                res.set('Content-Type', 'application/octet-stream');
                res.send(fileData);
            }
        }
        catch (error) {
            res.status(500).send(error);
        }
    });
});
app.post("/api/drive/:path(*)", function affichage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name } = req.query;
        const { path: folderPath } = req.params;
        if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
            return res.status(400).send("Seuls les lettres et les chiffres sont autorisés.");
        }
        try {
            const fullPath = (0, path_1.join)(tmpdir, folderPath || '', name);
            yield fs_1.default.promises.mkdir(fullPath);
            res.sendStatus(200);
        }
        catch (error) {
            res.status(500).send(error);
        }
    });
});
app.delete("/api/drive/:path(*)", function affichage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = req.params.path;
        const filePath = (0, path_1.join)(tmpdir, path);
        try {
            const info = yield fs_1.default.promises.stat(filePath);
            if (info.isDirectory()) {
                yield fs_1.default.promises.rmdir(filePath);
            }
            else {
                yield fs_1.default.promises.unlink(filePath);
            }
            res.sendStatus(200);
        }
        catch (error) {
            res.status(500).send(error);
        }
    });
});
app.listen(3000, function () {
    console.log("Server started on port 3000");
});
app.put('/api/drive/:path(*)', function affichage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = req.params.path;
        try {
            if (!req.files || !req.files.file) {
                return res.status(400).send("Aucun fichier n'a été téléchargé.");
            }
            const { file } = req.files;
            // Copie du fichier vers le dossier temporaire
            yield fs_1.default.promises.copyFile(file.file, (0, path_1.join)(tmpdir, file.filename));
            // Suppression du fichier source
            yield fs_1.default.promises.rm(file.uuid, { recursive: true });
            console.log(req.files);
            return res.sendStatus(200);
        }
        catch (error) {
            console.error("Erreur lors du traitement du fichier:", error);
            return res.status(500).send(error);
        }
    });
});
