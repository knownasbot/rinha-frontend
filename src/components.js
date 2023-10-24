let nodeCount = 0;
let maxNodeCount = 127;

let depth = 0;
let lastDepth;
let lastObjectEndDepth;
let refresh = false;

/**
 * Define a quantidade atual de nós renderizados.
 * @param {number} n Quantidade
 * @param {boolean} newChunk Se é um novo pedaço a ser renderizado
 */
export function setNodeCount(n, newChunk) {
    nodeCount = n;
    lastDepth = depth;
    depth = 0;
    refresh = newChunk;
}

/**
 * Adiciona elementos de tabulação no elemento alvo.
 * @param {HTMLElement} target Elemento alvo
 */
export function applyTab(target) {
    for (let i = 0; i < depth; i++) {
        target.append(document.createElement("tab"));
    }
}

/**
 * Valor de uma array.
 * @param {number} index Índice
 * @param {any} value Valor
 * @param {string} startWithSymbol Se o valor deve iniciar com o simbolo especificado
 */
export function ArrayValue(index, value, startWithSymbol) {
    const li = document.createElement("li");
    const idx = document.createElement("span");
    idx.classList.add("index");
    idx.innerText = index + ": "

    applyTab(li);
    li.append(idx);

    if (startWithSymbol) {
        const arrayStart = document.createElement("span");
        arrayStart.classList.add("brackets");
        arrayStart.append(startWithSymbol);
        li.append(arrayStart);

        value = "";
    } else if (typeof value == "string") {
        value = `"${value}"`;
    }

    li.append(value);

    lastObjectEndDepth = null;

    return li;
}
/**
 * Valor de um objeto.
 * @param {string} key Chave
 * @param {any} value Valor
 * @param {string} startWithSymbol Se o valor deve iniciar com o simbolo especificado
 */
export function ObjectValue(key, value, startWithSymbol) {
    const li = document.createElement("li");
    const k = document.createElement("span");
    k.classList.add("key");
    k.innerText = key + ": "

    applyTab(li);
    li.append(k);

    if (startWithSymbol) {
        const objectStart = document.createElement("span");
        objectStart.classList.add("brackets");
        objectStart.append(startWithSymbol);
        li.append(objectStart);

        value = "";
    } else if (typeof value == "string") {
        value = `"${value}"`;
    }

    li.append(value);

    lastObjectEndDepth = null;

    return li;
}

/**
 * Renderiza o JSON como elementos.
 * @param {HTMLOListElement} target Elemento alvo
 * @param {any} value Valor do JSON 
 */
export function renderJSON(target, value) {
    if (nodeCount >= maxNodeCount ||
        depth == 0 && (
            (Array.isArray(value) && value.length < 1) ||
            typeof value == "object" && Object.keys(value).length < 1))
        return;

    if (depth == lastDepth && refresh) {
        refresh = false;
    }

    if (Array.isArray(value)) {
        if (depth < 1 && !refresh) {
            const arrayStart = document.createElement("li");
            arrayStart.classList.add("brackets");

            applyTab(arrayStart);
            arrayStart.append("[");
            target.append(arrayStart);
        }

        depth++;

        for (let i in value) {
            const v = value[i];

            if (v == null || typeof v != "object") {
                if (!refresh) {
                    target.append(ArrayValue(i, v));
                }
            } else {
                if (!refresh) {
                    target.append(ArrayValue(i, null, Array.isArray(v) ? "[" : "{"));
                }

                renderJSON(target, v);

                if (nodeCount >= maxNodeCount) return;
            }

            delete value[i];
        }

        depth--;

        if (!refresh && "]" + depth != lastObjectEndDepth) {
            const arrayEnd = document.createElement("li");
            arrayEnd.classList.add("brackets");
            applyTab(arrayEnd);
            arrayEnd.append("]");
            target.append(arrayEnd);

            lastObjectEndDepth = "]" + depth;
        }
    } else if (typeof value == "object") {
        if (depth < 1 && !refresh) {
            const objectStart = document.createElement("li");
            objectStart.classList.add("brackets");

            applyTab(objectStart);
            objectStart.append("{");
            target.append(objectStart);
        }

        depth++;

        for (let [ k, v ] of Object.entries(value)) {
            if (v == null || typeof v != "object") {
                if (!refresh) {
                    target.append(ObjectValue(k, v));
                }
            } else {
                if (!refresh) {
                    target.append(ObjectValue(k, null, Array.isArray(v) ? "[" : "{"));
                }

                renderJSON(target, v);

                if (nodeCount >= maxNodeCount) return;
            }

            delete value[k];
        }

        depth--;

        if (!refresh && "}" + depth != lastObjectEndDepth) { 
            const objectEnd = document.createElement("li");
            objectEnd.classList.add("brackets");
            applyTab(objectEnd);
            objectEnd.append("}");
            target.append(objectEnd);

            lastObjectEndDepth = "}" + depth;
        }
    } else {
        const li = document.createElement("li");

        applyTab(li);
        li.append(typeof value == "string" ? `"${value}"` : value);
        target.append(li);
    }
    
    nodeCount++;
}