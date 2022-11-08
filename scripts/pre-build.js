const fs = require('fs');

function isExists(path) {
    try {
        fs.accessSync(path);
        return true;
    } catch {
        return false;
    }
}

function tryParseJSONObject(jsonString) {
    try {
        var o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
            return o;
        }
    } catch (e) {
    }

    return false;
}

function isValidJsonFile(jsonFileName) {
    const exist = isExists(jsonFileName);
    if (exist) {
        try {
            let json = fs.readFileSync(jsonFileName, {encoding: 'utf8'});
            json = tryParseJSONObject(json);
            if (json && typeof json === "object") {
                return true;
            }
        } catch (e) {
        }
    }
    return false;
}

function checkOrCreateLangFiels() {
    const pathToLangFiels = `../lang/translations/nuxt`;
    const langs = ['en', 'ua'];

    const emptyTemplate = {};

    for (const lang of langs) {
        const dir = `${pathToLangFiels}`;
        const jsonFileName = `${pathToLangFiels}/${lang}.json`;
        if (!isValidJsonFile(jsonFileName)) {
            fs.mkdir(dir, { recursive: true }, () => {
                fs.writeFile(jsonFileName, JSON.stringify(emptyTemplate), () => {
                    console.log(`Create lang file ${jsonFileName}`);
                });
            });
        }
    }
}

function preBuild() {
    checkOrCreateLangFiels();
}

preBuild();
