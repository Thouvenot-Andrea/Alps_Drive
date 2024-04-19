import express, {Request, Response} from 'express';
import * as os from "node:os";
import * as fs from "node:fs";

const app = express();

app.get('/', function test(req: Request, res: Response) {
    res.send("hello");
});

app.get('api/drive', async function affichage(req: Request, res: Response) {
    try {
        let tmpdir = os.tmpdir();
        const files = await fs.promises.readdir(tmpdir);
        res.send(files);
    } catch (err) {
        res.send(err);
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

