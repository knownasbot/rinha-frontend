/**
 * Array JSON.
 * @param {{
 *  title?: string;
 *  values: any[];
 *  depth?: number;
 * }} props Propriedades do elemento.
 * @returns {HTMLDListElement} Elemento
 */
export function ArrayNode({
    title,
    values,
    depth = 0
}) {
    const element = document.createElement("dl");
    element.classList.add("array");
    
    const arrayTitle = document.createElement("dt");
    let titleContent = title ? title + ":" : "";

    if (depth === 0) {
        const key = document.createElement("span");
        key.classList.add("key");
        key.append(titleContent);

        titleContent = key;
    }

    arrayTitle.append(titleContent);
    element.append(arrayTitle);

    for (let i = 0; i < values.length; i++) {
        let v = values[i];
        const dd = document.createElement("dd");

        if (typeof v === "string") {
            const key = document.createElement("span");
            key.classList.add("index");
            key.append(i + ": ");
            dd.append(key);

            v = `"${v}"`;
        } else if (Array.isArray(v)) {
            v = ArrayNode({
                title: i,
                values: v,
                depth: depth + 1
            });
        } else if (typeof v === "object" && v) {
            const key = document.createElement("span");
            key.classList.add("index");
            key.append(i + ": ");
            dd.append(key);

            v = ObjectNode({ value: v });
        }

        dd.append(v);
        element.append(dd);
    }

    return element;
}

/**
 * Objeto JSON.
 * @param {{
 *  value: {
 *   [s: string]: any;
 *  };
 *  line: boolean;
 * }} value Objeto
 * @returns {HTMLDListElement} Elemento
 */
export function ObjectNode({ value, line = true }) {
    const element = document.createElement("dl");

    for (let [ k, v ] of Object.entries(value)) {
        const dd = document.createElement("dd");

        if (!line) {
            dd.classList.add("noline");
        }

        if (!Array.isArray(v)) {
            const key = document.createElement("span");
            key.classList.add("key");
            key.append(k + ": ");
            dd.append(key);
        }

        if (typeof v === "string") {
            v = `"${v}"`;
        } else if (Array.isArray(v)) {
            v = ArrayNode({
                title: k,
                values: v,
                depth: 0
            });
        } else if (typeof v === "object" && v) {
            v = ObjectNode({
                value: v
            });
        }

        dd.append(v);
        element.append(dd);
    }

    return element;
}