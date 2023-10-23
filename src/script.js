import { renderJSON, setNodeCount } from "./components.js";

const home = document.querySelector(".home");
const viewer = document.querySelector(".viewer");
const root = document.querySelector("#data");

const fileTitle = viewer.querySelector("h2");
const fileSelector = document.querySelector("input#file");
const loadButton = home.querySelector("button#load");
const errorText = home.querySelector("p#error");

let mainNode;
let currentJSON;

loadButton.addEventListener("click", () => fileSelector.click());
fileSelector.addEventListener("input", () => {
    window.history.pushState("json", null, "/");

    const file = fileSelector.files.item(0);
    fileTitle.innerText = file.name;

    errorText.hidden = true;

    file
        .text()
        .then((result) => {
            mainNode = document.createElement("ol");
            root.append(mainNode);

            try {
                currentJSON = JSON.parse(result);

                home.hidden = true;
                viewer.hidden = false;

                setNodeCount(0);
                renderJSON(mainNode, currentJSON);
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

    fileSelector.value = null;
});

window.addEventListener("scroll", () => {
    if (!viewer.hidden && window.scrollY >= document.body.scrollHeight * 0.8) {
        setNodeCount(0, true);
        renderJSON(mainNode, currentJSON);
    }
});