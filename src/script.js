import { ArrayNode, ObjectNode } from "./components.js";

const home = document.querySelector(".home");
const viewer = document.querySelector(".viewer");
const root = document.querySelector("#data");

const fileTitle = viewer.querySelector("h2");
const fileSelector = document.querySelector("input#file");
const loadButton = home.querySelector("button#load");
const errorText = home.querySelector("p#error");

loadButton.addEventListener("click", () => fileSelector.click());
fileSelector.addEventListener("input", () => {
    window.history.pushState("json", null, "/");

    const file = fileSelector.files.item(0);
    fileTitle.innerText = file.name;

    errorText.hidden = true;

    file
        .text()
        .then((result) => {
            try {
                const json = JSON.parse(result);

                home.hidden = true;
                viewer.hidden = false;

                root.append(
                    Array.isArray(json) ?
                    ArrayNode({
                        values: json
                    })
                    :
                    ObjectNode({
                        value: json,
                        line: false
                    })
                );
            } catch {
                errorText.hidden = false;
            }
        });
});

window.addEventListener("popstate", () => {
    root.innerHTML = "";

    home.hidden = false;
    viewer.hidden = true;
    errorText.hidden = true;
});