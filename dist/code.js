/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/nanoid/non-secure/index.js":
/*!*************************************************!*\
  !*** ./node_modules/nanoid/non-secure/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   customAlphabet: () => (/* binding */ customAlphabet),
/* harmony export */   nanoid: () => (/* binding */ nanoid)
/* harmony export */ });
let urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
let customAlphabet = (alphabet, defaultSize = 21) => {
  return (size = defaultSize) => {
    let id = ''
    let i = size
    while (i--) {
      id += alphabet[(Math.random() * alphabet.length) | 0]
    }
    return id
  }
}
let nanoid = (size = 21) => {
  let id = ''
  let i = size
  while (i--) {
    id += urlAlphabet[(Math.random() * 64) | 0]
  }
  return id
}



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/code.tsx ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var nanoid_non_secure__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! nanoid/non-secure */ "./node_modules/nanoid/non-secure/index.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { widget } = figma;
const { useSyncedState, useWidgetNodeId, usePropertyMenu, useEffect, AutoLayout, Input, Text: TextBlock, SVG, Rectangle, } = widget;

const MAX_FREE_TASKS = 2;
function TodoWidget() {
    const widgetId = useWidgetNodeId();
    const [todos, setTodos] = useSyncedState("todos", []);
    const [showUpgradeMessage, setShowUpgradeMessage] = useSyncedState("showUpgradeMessage", false);
    const [title, setTitle] = useSyncedState("title", "");
    const [hasTitle, setHasTitle] = useSyncedState("hasTitle", false);
    const [width, setWidth] = useSyncedState("width", 380);
    const [size, setSize] = useSyncedState("size", 1);
    useEffect(() => {
        figma.ui.onmessage = ({ type, id, title }) => {
            switch (type) {
                case "update-title":
                    updateTodo({ id, field: "title", value: title });
                    break;
                case "flip-todo-scope":
                    updateTodo({ id, field: "outOfScope" });
                    break;
                case "delete-todo":
                    deleteTodo(id);
                    figma.closePlugin();
                    break;
                default:
                    figma.closePlugin();
                    break;
            }
        };
    });
    const deleteTodo = (id) => setTodos(todos.filter((todo) => todo.id !== id));
    const createTodo = (id) => __awaiter(this, void 0, void 0, function* () {
        const activeTasks = todos.filter(todo => !todo.done && !todo.outOfScope).length;
        if (activeTasks >= MAX_FREE_TASKS) {
            if (!figma.payments) {
                figma.notify("Payments are not available in this context");
                return;
            }
            try {
                // ✨ Changed: Using status property directly instead of trying to call get()
                if (figma.payments.status.type === "PAID") {
                    // ✨ Added: Allow task creation for paid users
                    setShowUpgradeMessage(false);
                }
                else {
                    setShowUpgradeMessage(true);
                    return;
                }
            }
            catch (error) {
                console.error("Failed to check payment status:", error);
                figma.notify("Failed to verify payment status");
                return;
            }
        }
        setTodos([
            ...todos,
            {
                id,
                title: "",
                done: false,
                outOfScope: false,
            },
        ]);
    });
    function updateTodo(editedTodo) {
        if (editedTodo.field === "title" && "value" in editedTodo) {
            return setTodos(todos.map((todo) => todo.id === editedTodo.id
                ? Object.assign(Object.assign({}, todo), { title: editedTodo.value }) : todo));
        }
        const todo = todos.find((todo) => todo.id === editedTodo.id);
        const rest = todos.filter((todo) => todo.id !== editedTodo.id);
        if (!todo)
            return;
        if (editedTodo.field === "outOfScope") {
            setTodos([...rest, Object.assign(Object.assign({}, todo), { outOfScope: !todo.outOfScope })]);
        }
        else if (editedTodo.field === "done") {
            setTodos([...rest, Object.assign(Object.assign({}, todo), { done: !todo.done })]);
        }
    }
    const titleActionItem = hasTitle
        ? {
            tooltip: "Remove Title",
            propertyName: "remove-title",
            itemType: "action",
            icon: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3536 2.35355C13.5488 2.15829 13.5488 1.84171 13.3536 1.64645C13.1583 1.45118 12.8417 1.45118 12.6464 1.64645L11.9291 2.36383C11.9159 2.32246 11.897 2.28368 11.8732 2.24845C11.7923 2.12875 11.6554 2.05005 11.5001 2.05005H3.50005C3.29909 2.05005 3.1289 2.18178 3.07111 2.3636C3.05743 2.40665 3.05005 2.45249 3.05005 2.50007V4.50001C3.05005 4.74854 3.25152 4.95001 3.50005 4.95001C3.74858 4.95001 3.95005 4.74854 3.95005 4.50001V2.95005H6.95006V7.34284L1.64645 12.6464C1.45118 12.8417 1.45118 13.1583 1.64645 13.3536C1.84171 13.5488 2.15829 13.5488 2.35355 13.3536L6.95006 8.75705V12.0501H5.7544C5.50587 12.0501 5.3044 12.2515 5.3044 12.5001C5.3044 12.7486 5.50587 12.9501 5.7544 12.9501H9.2544C9.50293 12.9501 9.7044 12.7486 9.7044 12.5001C9.7044 12.2515 9.50293 12.0501 9.2544 12.0501H8.05006V7.65705L13.3536 2.35355ZM8.05006 6.24284L11.0501 3.24283V2.95005H8.05006V6.24284Z" fill="#ddd" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
        }
        : {
            tooltip: "Add a Title",
            propertyName: "add-title",
            itemType: "action",
            icon: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.94993 2.95002L3.94993 4.49998C3.94993 4.74851 3.74845 4.94998 3.49993 4.94998C3.2514 4.94998 3.04993 4.74851 3.04993 4.49998V2.50004C3.04993 2.45246 3.05731 2.40661 3.07099 2.36357C3.12878 2.18175 3.29897 2.05002 3.49993 2.05002H11.4999C11.6553 2.05002 11.7922 2.12872 11.8731 2.24842C11.9216 2.32024 11.9499 2.40682 11.9499 2.50002L11.9499 2.50004V4.49998C11.9499 4.74851 11.7485 4.94998 11.4999 4.94998C11.2514 4.94998 11.0499 4.74851 11.0499 4.49998V2.95002H8.04993V12.05H9.25428C9.50281 12.05 9.70428 12.2515 9.70428 12.5C9.70428 12.7486 9.50281 12.95 9.25428 12.95H5.75428C5.50575 12.95 5.30428 12.7486 5.30428 12.5C5.30428 12.2515 5.50575 12.05 5.75428 12.05H6.94993V2.95002H3.94993Z" fill="#ddd" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
        };
    const propertyMenuItems = [
        titleActionItem,
        {
            itemType: "separator",
        },
        {
            tooltip: "Make it smaller",
            propertyName: "shrink",
            itemType: "action",
            icon: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z" fill="#ddd" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
        },
        {
            tooltip: "Make it bigger",
            propertyName: "grow",
            itemType: "action",
            icon: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="#ddd" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
        },
        {
            itemType: "separator",
        },
        {
            tooltip: "Clear it",
            propertyName: "clear-all",
            itemType: "action",
            icon: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.60913 0.0634287C4.39082 0.0088505 4.16575 0.12393 4.08218 0.332867L3.1538 2.6538L0.832866 3.58218C0.702884 3.63417 0.604404 3.7437 0.566705 3.87849C0.528906 4.01329 0.555994 4.158 0.639992 4.26999L2.01148 6.09864L1.06343 9.89085C1.00944 10.1068 1.12145 10.3298 1.32691 10.4154L4.20115 11.613L5.62557 13.7496C5.73412 13.9124 5.93545 13.9864 6.12362 13.9327L9.62362 12.9327C9.62988 12.9309 9.63611 12.929 9.64229 12.9269L12.6423 11.9269C12.7923 11.8769 12.905 11.7519 12.9393 11.5976L13.9393 7.09761C13.9776 6.92506 13.9114 6.74605 13.77 6.63999L11.95 5.27499V2.99999C11.95 2.82955 11.8537 2.67373 11.7012 2.5975L8.70124 1.0975C8.67187 1.08282 8.64098 1.07139 8.60913 1.06343L4.60913 0.0634287ZM11.4323 6.01173L12.7748 7.01858L10.2119 9.15429C10.1476 9.20786 10.0995 9.2783 10.0731 9.35769L9.25382 11.8155L7.73849 10.8684C7.52774 10.7367 7.25011 10.8007 7.11839 11.0115C6.98667 11.2222 7.05074 11.4999 7.26149 11.6316L8.40341 12.3453L6.19221 12.9771L4.87441 11.0004C4.82513 10.9265 4.75508 10.8688 4.67307 10.8346L2.03046 9.73352L2.85134 6.44999H4.99999C5.24852 6.44999 5.44999 6.24852 5.44999 5.99999C5.44999 5.75146 5.24852 5.54999 4.99999 5.54999H2.72499L1.7123 4.19974L3.51407 3.47903L6.35769 4.4269C6.53655 4.48652 6.73361 4.42832 6.85138 4.28111L8.62413 2.06518L11.05 3.27811V5.19533L8.83287 6.08218C8.70996 6.13134 8.61494 6.23212 8.57308 6.35769L8.07308 7.85769C7.99449 8.09346 8.12191 8.34831 8.35769 8.4269C8.59346 8.50549 8.84831 8.37807 8.9269 8.14229L9.3609 6.84029L11.4323 6.01173ZM7.71052 1.76648L6.34462 3.47386L4.09505 2.724L4.77192 1.03183L7.71052 1.76648ZM10.2115 11.7885L12.116 11.1537L12.7745 8.19034L10.8864 9.76374L10.2115 11.7885Z" fill="#ddd" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`,
        },
    ];
    usePropertyMenu(propertyMenuItems, ({ propertyName }) => {
        if (propertyName === 'grow' || propertyName === 'shrink') {
            const newSize = propertyName === "grow" ? size * 1.3 : size / 1.3;
            return setSize(newSize);
        }
        switch (propertyName) {
            case "clear-all":
                setTodos([]);
                setHasTitle(false);
                setTitle("");
                break;
            case "add-title":
                setHasTitle(true);
                break;
            case "remove-title":
                setHasTitle(false);
                break;
            case "toggle-width":
                setWidth(width === 440 ? 380 : 440);
                break;
        }
    });
    const Todo = (todo) => {
        const { id, done, title, outOfScope } = todo;
        return (figma.widget.h(AutoLayout, { key: id, direction: "horizontal", verticalAlignItems: "start", spacing: 40 * size, width: "fill-parent" },
            figma.widget.h(AutoLayout, { direction: "horizontal", verticalAlignItems: "start", spacing: 8 * size, width: 'fill-parent' },
                figma.widget.h(AutoLayout, { hidden: done || outOfScope, height: 20 * size, width: 20 * size, verticalAlignItems: "center", horizontalAlignItems: "center", padding: 4 * size, onClick: () => updateTodo({ id, field: "done" }) },
                    figma.widget.h(Rectangle, { fill: "#fff", stroke: "#aeaeae", strokeWidth: 1 * size, strokeAlign: "inside", height: 16 * size, width: 16 * size, cornerRadius: 4 * size })),
                figma.widget.h(SVG, { hidden: !done || outOfScope, onClick: () => updateTodo({ id, field: "done" }), height: 20 * size, width: 20 * size, src: `
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C3.79086 2 2 3.79086 2 6V14C2 16.2091 3.79086 18 6 18H14C16.2091 18 18 16.2091 18 14V6C18 3.79086 16.2091 2 14 2H6ZM14.3408 8.74741C14.7536 8.28303 14.7118 7.57195 14.2474 7.15916C13.783 6.74638 13.0719 6.78821 12.6592 7.25259L10.6592 9.50259L9.45183 10.8608L7.7955 9.2045C7.35616 8.76516 6.64384 8.76516 6.2045 9.2045C5.76517 9.64384 5.76517 10.3562 6.2045 10.7955L8.7045 13.2955C8.92359 13.5146 9.22334 13.6336 9.53305 13.6245C9.84275 13.6154 10.135 13.479 10.3408 13.2474L12.3408 10.9974L14.3408 8.74741Z" fill="#4AB393"/>
              </svg>
            ` }),
                figma.widget.h(Rectangle, { hidden: !outOfScope, fill: "#f2f2f2", width: 20 * size, height: 20 * size }),
                figma.widget.h(Input, { fill: outOfScope ? "#6E6E6E" : done ? "#767676" : "#101010", fontSize: (done || outOfScope ? 13 : 14) * size, lineHeight: 20 * size, width: 'fill-parent', value: title, placeholder: "I need to...", placeholderProps: {
                        fill: "#b7b7b7",
                        opacity: 1,
                        letterSpacing: -0.15,
                    }, onTextEditEnd: (e) => {
                        e.characters === ""
                            ? deleteTodo(id)
                            : updateTodo({ id, field: "title", value: e.characters });
                    } })),
            figma.widget.h(AutoLayout, { fill: outOfScope ? "#f2f2f2" : "#fff", onClick: () => new Promise(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const widget = yield figma.getNodeByIdAsync(widgetId);
                        const absoluteX = widget.absoluteTransform[0][2];
                        const absoluteY = widget.absoluteTransform[1][2];
                        figma.showUI(__html__, {
                            height: 76,
                            width: 220,
                            title,
                            position: {
                                y: absoluteY - 58,
                                x: absoluteX + widget.width + 7,
                            },
                        });
                        figma.ui.postMessage({ type: "ui", id, title, outOfScope });
                    }
                    catch (e) {
                        console.error(e);
                    }
                })) },
                figma.widget.h(SVG, { height: 20 * size, width: 20 * size, src: `
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1.6" y="8" width="4" height="4" rx="2" fill="#AAAAAA"/>
                <rect x="8" y="8" width="4" height="4" rx="2" fill="#AAAAAA"/>
                <rect x="14.4" y="8" width="4" height="4" rx="2" fill="#AAAAAA"/>
              </svg>
            ` }))));
    };
    const handleUpgradeClick = () => __awaiter(this, void 0, void 0, function* () {
        if (!figma.payments) {
            figma.notify("Payments not available");
            return;
        }
        try {
            yield figma.payments.initiateCheckoutAsync({
                interstitial: "PAID_FEATURE"
            });
            if (figma.payments.status.type === "PAID") {
                figma.notify("Thank you for upgrading!");
                setShowUpgradeMessage(false);
            }
            else if (figma.payments.status.type === "UNPAID") {
                figma.notify("Upgrade required to add more tasks");
            }
            else {
                figma.notify("Payment status could not be determined");
            }
        }
        catch (error) {
            console.error(error);
            figma.notify("Failed to initiate payment");
        }
    });
    return (figma.widget.h(AutoLayout, { direction: "vertical", cornerRadius: 8 * size, fill: "#fff", width: width * size, stroke: "#e7e7e7", strokeWidth: 1 * size },
        hasTitle && (figma.widget.h(AutoLayout, { width: "fill-parent", direction: "vertical", verticalAlignItems: "center", horizontalAlignItems: "center" },
            figma.widget.h(Input, { value: title, placeholder: "Title", fill: "#2A2A2A", fontWeight: 700, fontSize: 19.8 * size, lineHeight: 24 * size, horizontalAlignText: "center", width: 290 * size, letterSpacing: -0.15 * size, inputFrameProps: {
                    fill: "#FFFFFF",
                    horizontalAlignItems: "center",
                    padding: { top: 24 * size },
                    verticalAlignItems: "center",
                }, onTextEditEnd: (e) => setTitle(e.characters) }))),
        figma.widget.h(AutoLayout, { direction: "vertical", spacing: 24 * size, padding: 24 * size, width: "fill-parent" },
            figma.widget.h(AutoLayout, { direction: "vertical", spacing: 8 * size, width: "fill-parent" },
                todos
                    .filter(({ done, outOfScope }) => !done && !outOfScope)
                    .map(({ id, title, done, outOfScope }) => (figma.widget.h(Todo, { key: id, id: id, title: title, done: done, outOfScope: outOfScope }))),
                figma.widget.h(AutoLayout, { width: "fill-parent" },
                    figma.widget.h(AutoLayout, { direction: "horizontal", verticalAlignItems: "center", spacing: 8 * size, fill: "#fff", onClick: () => createTodo((0,nanoid_non_secure__WEBPACK_IMPORTED_MODULE_0__.nanoid)()) },
                        figma.widget.h(SVG, { height: 20 * size, width: 20 * size, src: `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.125 5C10.7463 5 11.25 5.44772 11.25 6V14C11.25 14.5523 10.7463 15 10.125 15C9.50368 15 9 14.5523 9 14V6C9 5.44772 9.50368 5 10.125 5Z" fill="#979797"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5 9.875C5 9.25368 5.44772 8.75 6 8.75L14 8.75C14.5523 8.75 15 9.25368 15 9.875C15 10.4963 14.5523 11 14 11L6 11C5.44772 11 5 10.4963 5 9.875Z" fill="#979797"/>
                </svg>
                ` }),
                        figma.widget.h(TextBlock, { fill: "#949494", fontSize: 14 * size, lineHeight: 20 * size, fontWeight: 700, letterSpacing: "-0.75%" }, "Add a todo task")))),
            figma.widget.h(AutoLayout, { hidden: !todos.filter(({ done, outOfScope }) => done && !outOfScope).length, direction: "vertical", spacing: 8 * size, width: "fill-parent" }, todos
                .filter(({ done, outOfScope }) => done && !outOfScope)
                .map(({ id, title, done, outOfScope }) => (figma.widget.h(Todo, { key: id, id: id, title: title, done: done, outOfScope: outOfScope })))),
            showUpgradeMessage && (figma.widget.h(AutoLayout, { direction: "vertical", width: "fill-parent", spacing: 16 * size },
                figma.widget.h(AutoLayout, { direction: "horizontal", width: "fill-parent", padding: 16 * size, fill: "#FFF3E6", cornerRadius: 8 * size, stroke: "#FFB459", strokeWidth: 1 * size, spacing: 8 * size },
                    figma.widget.h(SVG, { height: 20 * size, width: 20 * size, src: `
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM9.25 6C9.25 5.58579 9.58579 5.25 10 5.25C10.4142 5.25 10.75 5.58579 10.75 6V11C10.75 11.4142 10.4142 11.75 10 11.75C9.58579 11.75 9.25 11.4142 9.25 11V6ZM10 15C10.5523 15 11 14.5523 11 14C11 13.4477 10.5523 13 10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15Z" fill="#FFB459"/>
                  </svg>
                ` }),
                    figma.widget.h(TextBlock, { fill: "#B55B08", fontSize: 14 * size, width: "fill-parent" }, "You've reached the free plan limit. Please upgrade to add more tasks."),
                    figma.widget.h(SVG, { height: 20 * size, width: 20 * size, src: `
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 5L5 15M5 5L15 15" stroke="#FFB459" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                `, onClick: () => setShowUpgradeMessage(false) })),
                figma.widget.h(AutoLayout, { direction: "horizontal", width: "fill-parent", spacing: 8 * size, horizontalAlignItems: "center", verticalAlignItems: "center" },
                    figma.widget.h(AutoLayout, { onClick: handleUpgradeClick, fill: "#FFB459", padding: {
                            vertical: 8 * size,
                            horizontal: 16 * size
                        }, cornerRadius: 6 * size, hoverStyle: {
                            fill: "#E69D3F"
                        } },
                        figma.widget.h(TextBlock, { fill: "#FFFFFF", fontSize: 14 * size, fontWeight: 600 }, "Upgrade Plan")),
                    figma.widget.h(AutoLayout, { onClick: () => setShowUpgradeMessage(false), padding: {
                            vertical: 8 * size,
                            horizontal: 16 * size
                        }, cornerRadius: 6 * size, stroke: "#E0E0E0", strokeWidth: 1 * size, hoverStyle: {
                            fill: "#F5F5F5"
                        } },
                        figma.widget.h(TextBlock, { fill: "#666666", fontSize: 14 * size, fontWeight: 500 }, "Maybe Later")))))),
        figma.widget.h(AutoLayout, { hidden: todos.filter(({ outOfScope }) => outOfScope).length === 0, width: "fill-parent", height: !todos.filter(({ outOfScope }) => outOfScope).length
                ? 40 * size
                : "hug-contents", direction: "vertical", horizontalAlignItems: "center", spacing: 8 * size, padding: 24 * size, fill: "#f2f2f2" }, todos
            .filter(({ outOfScope }) => outOfScope)
            .map(({ id, title, done, outOfScope }) => (figma.widget.h(Todo, { key: id, id: id, title: title, done: done, outOfScope: outOfScope })))),
        figma.widget.h(AutoLayout, { width: 8, positioning: "absolute", cornerRadius: 1000, tooltip: width === 380 ? "Make it wider" : "Make it narrower", x: {
                type: "right",
                offset: 0,
            }, y: {
                type: "top-bottom",
                topOffset: 0,
                bottomOffset: 0,
            }, onClick: () => setWidth(width === 380 ? 440 : 380) })));
}
widget.register(TodoWidget);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2lDOzs7Ozs7O1VDcEJqQztVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTkEsaUJBQWlCLFNBQUksSUFBSSxTQUFJO0FBQzdCLDRCQUE0QiwrREFBK0QsaUJBQWlCO0FBQzVHO0FBQ0Esb0NBQW9DLE1BQU0sK0JBQStCLFlBQVk7QUFDckYsbUNBQW1DLE1BQU0sbUNBQW1DLFlBQVk7QUFDeEYsZ0NBQWdDO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0EsUUFBUSxTQUFTO0FBQ2pCLFFBQVEsbUhBQW1IO0FBQ3BFO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLGlCQUFpQjtBQUNqRDtBQUNBO0FBQ0EsaUNBQWlDLGtDQUFrQztBQUNuRTtBQUNBO0FBQ0EsaUNBQWlDLHlCQUF5QjtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxXQUFXLHlCQUF5QjtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQsV0FBVyw4QkFBOEI7QUFDdEc7QUFDQTtBQUNBLDZEQUE2RCxXQUFXLGtCQUFrQjtBQUMxRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsMENBQTBDLGNBQWM7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGdCQUFnQiw4QkFBOEI7QUFDOUMsNkNBQTZDLHlHQUF5RztBQUN0Six5Q0FBeUMsK0ZBQStGO0FBQ3hJLDZDQUE2Qyw4S0FBOEssbUJBQW1CLEdBQUc7QUFDalAsZ0RBQWdELDRJQUE0STtBQUM1TCxzQ0FBc0MseURBQXlELG1CQUFtQjtBQUNsSDtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsNENBQTRDLDJFQUEyRTtBQUN2SCx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSwyQ0FBMkMseUNBQXlDO0FBQ3BGLHVCQUF1QjtBQUN2Qix5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3Qix5QkFBeUI7QUFDekIsK0NBQStDLG1DQUFtQztBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixJQUFJO0FBQ3JCLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wseUNBQXlDLDRIQUE0SDtBQUNySyxrREFBa0QsMkdBQTJHO0FBQzdKLG9DQUFvQztBQUNwQztBQUNBO0FBQ0EsK0JBQStCLGdCQUFnQjtBQUMvQztBQUNBLGlCQUFpQixnREFBZ0Q7QUFDakUscUNBQXFDLHFGQUFxRjtBQUMxSCx5Q0FBeUMsZ0VBQWdFO0FBQ3pHO0FBQ0EsK0JBQStCLGtCQUFrQjtBQUNqRCw0QkFBNEIsNkJBQTZCLDZCQUE2QixtRUFBbUU7QUFDekosNkNBQTZDLHNCQUFzQjtBQUNuRSxpREFBaUQsa0hBQWtILHlEQUFRLEtBQUs7QUFDaEwsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CLG9EQUFvRCx1R0FBdUc7QUFDM0oseUNBQXlDLHlCQUF5QixrQkFBa0Isa0dBQWtHO0FBQ3RMLDJCQUEyQixrQkFBa0I7QUFDN0Msd0JBQXdCLDZCQUE2Qiw2QkFBNkIsbUVBQW1FO0FBQ3JKLGdFQUFnRSxpRUFBaUU7QUFDakksNkNBQTZDLHlLQUF5SztBQUN0TiwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CLGdEQUFnRCw0REFBNEQ7QUFDNUcsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLGdFQUFnRTtBQUNoRSw2Q0FBNkMsZ0lBQWdJO0FBQzdLLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0EsMkJBQTJCO0FBQzNCLG9EQUFvRCx1REFBdUQ7QUFDM0csaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQSwyQkFBMkI7QUFDM0Isb0RBQW9ELHVEQUF1RDtBQUMzRyxxQ0FBcUMsd0JBQXdCLFlBQVksOEVBQThFLFlBQVk7QUFDbks7QUFDQSxpSkFBaUo7QUFDakosdUJBQXVCLFlBQVk7QUFDbkMsb0JBQW9CLDZCQUE2Qiw2QkFBNkIsbUVBQW1FO0FBQ2pKLHFDQUFxQztBQUNyQztBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWEsc0RBQXNEO0FBQ25FO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zY29wZS10by1kby8uL25vZGVfbW9kdWxlcy9uYW5vaWQvbm9uLXNlY3VyZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9zY29wZS10by1kby93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zY29wZS10by1kby93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc2NvcGUtdG8tZG8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9zY29wZS10by1kby93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3Njb3BlLXRvLWRvLy4vc3JjL2NvZGUudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImxldCB1cmxBbHBoYWJldCA9XG4gICd1c2VhbmRvbS0yNlQxOTgzNDBQWDc1cHhKQUNLVkVSWU1JTkRCVVNIV09MRl9HUVpiZmdoamtscXZ3eXpyaWN0J1xubGV0IGN1c3RvbUFscGhhYmV0ID0gKGFscGhhYmV0LCBkZWZhdWx0U2l6ZSA9IDIxKSA9PiB7XG4gIHJldHVybiAoc2l6ZSA9IGRlZmF1bHRTaXplKSA9PiB7XG4gICAgbGV0IGlkID0gJydcbiAgICBsZXQgaSA9IHNpemVcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBpZCArPSBhbHBoYWJldFsoTWF0aC5yYW5kb20oKSAqIGFscGhhYmV0Lmxlbmd0aCkgfCAwXVxuICAgIH1cbiAgICByZXR1cm4gaWRcbiAgfVxufVxubGV0IG5hbm9pZCA9IChzaXplID0gMjEpID0+IHtcbiAgbGV0IGlkID0gJydcbiAgbGV0IGkgPSBzaXplXG4gIHdoaWxlIChpLS0pIHtcbiAgICBpZCArPSB1cmxBbHBoYWJldFsoTWF0aC5yYW5kb20oKSAqIDY0KSB8IDBdXG4gIH1cbiAgcmV0dXJuIGlkXG59XG5leHBvcnQgeyBuYW5vaWQsIGN1c3RvbUFscGhhYmV0IH1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5jb25zdCB7IHdpZGdldCB9ID0gZmlnbWE7XHJcbmNvbnN0IHsgdXNlU3luY2VkU3RhdGUsIHVzZVdpZGdldE5vZGVJZCwgdXNlUHJvcGVydHlNZW51LCB1c2VFZmZlY3QsIEF1dG9MYXlvdXQsIElucHV0LCBUZXh0OiBUZXh0QmxvY2ssIFNWRywgUmVjdGFuZ2xlLCB9ID0gd2lkZ2V0O1xyXG5pbXBvcnQgeyBuYW5vaWQgYXMgY3JlYXRlSWQgfSBmcm9tIFwibmFub2lkL25vbi1zZWN1cmVcIjtcclxuY29uc3QgTUFYX0ZSRUVfVEFTS1MgPSAyO1xyXG5mdW5jdGlvbiBUb2RvV2lkZ2V0KCkge1xyXG4gICAgY29uc3Qgd2lkZ2V0SWQgPSB1c2VXaWRnZXROb2RlSWQoKTtcclxuICAgIGNvbnN0IFt0b2Rvcywgc2V0VG9kb3NdID0gdXNlU3luY2VkU3RhdGUoXCJ0b2Rvc1wiLCBbXSk7XHJcbiAgICBjb25zdCBbc2hvd1VwZ3JhZGVNZXNzYWdlLCBzZXRTaG93VXBncmFkZU1lc3NhZ2VdID0gdXNlU3luY2VkU3RhdGUoXCJzaG93VXBncmFkZU1lc3NhZ2VcIiwgZmFsc2UpO1xyXG4gICAgY29uc3QgW3RpdGxlLCBzZXRUaXRsZV0gPSB1c2VTeW5jZWRTdGF0ZShcInRpdGxlXCIsIFwiXCIpO1xyXG4gICAgY29uc3QgW2hhc1RpdGxlLCBzZXRIYXNUaXRsZV0gPSB1c2VTeW5jZWRTdGF0ZShcImhhc1RpdGxlXCIsIGZhbHNlKTtcclxuICAgIGNvbnN0IFt3aWR0aCwgc2V0V2lkdGhdID0gdXNlU3luY2VkU3RhdGUoXCJ3aWR0aFwiLCAzODApO1xyXG4gICAgY29uc3QgW3NpemUsIHNldFNpemVdID0gdXNlU3luY2VkU3RhdGUoXCJzaXplXCIsIDEpO1xyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBmaWdtYS51aS5vbm1lc3NhZ2UgPSAoeyB0eXBlLCBpZCwgdGl0bGUgfSkgPT4ge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJ1cGRhdGUtdGl0bGVcIjpcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVUb2RvKHsgaWQsIGZpZWxkOiBcInRpdGxlXCIsIHZhbHVlOiB0aXRsZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJmbGlwLXRvZG8tc2NvcGVcIjpcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVUb2RvKHsgaWQsIGZpZWxkOiBcIm91dE9mU2NvcGVcIiB9KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJkZWxldGUtdG9kb1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZVRvZG8oaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbiAgICBjb25zdCBkZWxldGVUb2RvID0gKGlkKSA9PiBzZXRUb2Rvcyh0b2Rvcy5maWx0ZXIoKHRvZG8pID0+IHRvZG8uaWQgIT09IGlkKSk7XHJcbiAgICBjb25zdCBjcmVhdGVUb2RvID0gKGlkKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aXZlVGFza3MgPSB0b2Rvcy5maWx0ZXIodG9kbyA9PiAhdG9kby5kb25lICYmICF0b2RvLm91dE9mU2NvcGUpLmxlbmd0aDtcclxuICAgICAgICBpZiAoYWN0aXZlVGFza3MgPj0gTUFYX0ZSRUVfVEFTS1MpIHtcclxuICAgICAgICAgICAgaWYgKCFmaWdtYS5wYXltZW50cykge1xyXG4gICAgICAgICAgICAgICAgZmlnbWEubm90aWZ5KFwiUGF5bWVudHMgYXJlIG5vdCBhdmFpbGFibGUgaW4gdGhpcyBjb250ZXh0XCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAvLyDinKggQ2hhbmdlZDogVXNpbmcgc3RhdHVzIHByb3BlcnR5IGRpcmVjdGx5IGluc3RlYWQgb2YgdHJ5aW5nIHRvIGNhbGwgZ2V0KClcclxuICAgICAgICAgICAgICAgIGlmIChmaWdtYS5wYXltZW50cy5zdGF0dXMudHlwZSA9PT0gXCJQQUlEXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDinKggQWRkZWQ6IEFsbG93IHRhc2sgY3JlYXRpb24gZm9yIHBhaWQgdXNlcnNcclxuICAgICAgICAgICAgICAgICAgICBzZXRTaG93VXBncmFkZU1lc3NhZ2UoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0U2hvd1VwZ3JhZGVNZXNzYWdlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gY2hlY2sgcGF5bWVudCBzdGF0dXM6XCIsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIGZpZ21hLm5vdGlmeShcIkZhaWxlZCB0byB2ZXJpZnkgcGF5bWVudCBzdGF0dXNcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0VG9kb3MoW1xyXG4gICAgICAgICAgICAuLi50b2RvcyxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWQsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJcIixcclxuICAgICAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgb3V0T2ZTY29wZTogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgXSk7XHJcbiAgICB9KTtcclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRvZG8oZWRpdGVkVG9kbykge1xyXG4gICAgICAgIGlmIChlZGl0ZWRUb2RvLmZpZWxkID09PSBcInRpdGxlXCIgJiYgXCJ2YWx1ZVwiIGluIGVkaXRlZFRvZG8pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNldFRvZG9zKHRvZG9zLm1hcCgodG9kbykgPT4gdG9kby5pZCA9PT0gZWRpdGVkVG9kby5pZFxyXG4gICAgICAgICAgICAgICAgPyBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHRvZG8pLCB7IHRpdGxlOiBlZGl0ZWRUb2RvLnZhbHVlIH0pIDogdG9kbykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB0b2RvID0gdG9kb3MuZmluZCgodG9kbykgPT4gdG9kby5pZCA9PT0gZWRpdGVkVG9kby5pZCk7XHJcbiAgICAgICAgY29uc3QgcmVzdCA9IHRvZG9zLmZpbHRlcigodG9kbykgPT4gdG9kby5pZCAhPT0gZWRpdGVkVG9kby5pZCk7XHJcbiAgICAgICAgaWYgKCF0b2RvKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKGVkaXRlZFRvZG8uZmllbGQgPT09IFwib3V0T2ZTY29wZVwiKSB7XHJcbiAgICAgICAgICAgIHNldFRvZG9zKFsuLi5yZXN0LCBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHRvZG8pLCB7IG91dE9mU2NvcGU6ICF0b2RvLm91dE9mU2NvcGUgfSldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZWRpdGVkVG9kby5maWVsZCA9PT0gXCJkb25lXCIpIHtcclxuICAgICAgICAgICAgc2V0VG9kb3MoWy4uLnJlc3QsIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgdG9kbyksIHsgZG9uZTogIXRvZG8uZG9uZSB9KV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHRpdGxlQWN0aW9uSXRlbSA9IGhhc1RpdGxlXHJcbiAgICAgICAgPyB7XHJcbiAgICAgICAgICAgIHRvb2x0aXA6IFwiUmVtb3ZlIFRpdGxlXCIsXHJcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZTogXCJyZW1vdmUtdGl0bGVcIixcclxuICAgICAgICAgICAgaXRlbVR5cGU6IFwiYWN0aW9uXCIsXHJcbiAgICAgICAgICAgIGljb246IGA8c3ZnIHdpZHRoPVwiMTVcIiBoZWlnaHQ9XCIxNVwiIHZpZXdCb3g9XCIwIDAgMTUgMTVcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwiTTEzLjM1MzYgMi4zNTM1NUMxMy41NDg4IDIuMTU4MjkgMTMuNTQ4OCAxLjg0MTcxIDEzLjM1MzYgMS42NDY0NUMxMy4xNTgzIDEuNDUxMTggMTIuODQxNyAxLjQ1MTE4IDEyLjY0NjQgMS42NDY0NUwxMS45MjkxIDIuMzYzODNDMTEuOTE1OSAyLjMyMjQ2IDExLjg5NyAyLjI4MzY4IDExLjg3MzIgMi4yNDg0NUMxMS43OTIzIDIuMTI4NzUgMTEuNjU1NCAyLjA1MDA1IDExLjUwMDEgMi4wNTAwNUgzLjUwMDA1QzMuMjk5MDkgMi4wNTAwNSAzLjEyODkgMi4xODE3OCAzLjA3MTExIDIuMzYzNkMzLjA1NzQzIDIuNDA2NjUgMy4wNTAwNSAyLjQ1MjQ5IDMuMDUwMDUgMi41MDAwN1Y0LjUwMDAxQzMuMDUwMDUgNC43NDg1NCAzLjI1MTUyIDQuOTUwMDEgMy41MDAwNSA0Ljk1MDAxQzMuNzQ4NTggNC45NTAwMSAzLjk1MDA1IDQuNzQ4NTQgMy45NTAwNSA0LjUwMDAxVjIuOTUwMDVINi45NTAwNlY3LjM0Mjg0TDEuNjQ2NDUgMTIuNjQ2NEMxLjQ1MTE4IDEyLjg0MTcgMS40NTExOCAxMy4xNTgzIDEuNjQ2NDUgMTMuMzUzNkMxLjg0MTcxIDEzLjU0ODggMi4xNTgyOSAxMy41NDg4IDIuMzUzNTUgMTMuMzUzNkw2Ljk1MDA2IDguNzU3MDVWMTIuMDUwMUg1Ljc1NDRDNS41MDU4NyAxMi4wNTAxIDUuMzA0NCAxMi4yNTE1IDUuMzA0NCAxMi41MDAxQzUuMzA0NCAxMi43NDg2IDUuNTA1ODcgMTIuOTUwMSA1Ljc1NDQgMTIuOTUwMUg5LjI1NDRDOS41MDI5MyAxMi45NTAxIDkuNzA0NCAxMi43NDg2IDkuNzA0NCAxMi41MDAxQzkuNzA0NCAxMi4yNTE1IDkuNTAyOTMgMTIuMDUwMSA5LjI1NDQgMTIuMDUwMUg4LjA1MDA2VjcuNjU3MDVMMTMuMzUzNiAyLjM1MzU1Wk04LjA1MDA2IDYuMjQyODRMMTEuMDUwMSAzLjI0MjgzVjIuOTUwMDVIOC4wNTAwNlY2LjI0Mjg0WlwiIGZpbGw9XCIjZGRkXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIj48L3BhdGg+PC9zdmc+YCxcclxuICAgICAgICB9XHJcbiAgICAgICAgOiB7XHJcbiAgICAgICAgICAgIHRvb2x0aXA6IFwiQWRkIGEgVGl0bGVcIixcclxuICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBcImFkZC10aXRsZVwiLFxyXG4gICAgICAgICAgICBpdGVtVHlwZTogXCJhY3Rpb25cIixcclxuICAgICAgICAgICAgaWNvbjogYDxzdmcgd2lkdGg9XCIxNVwiIGhlaWdodD1cIjE1XCIgdmlld0JveD1cIjAgMCAxNSAxNVwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIGQ9XCJNMy45NDk5MyAyLjk1MDAyTDMuOTQ5OTMgNC40OTk5OEMzLjk0OTkzIDQuNzQ4NTEgMy43NDg0NSA0Ljk0OTk4IDMuNDk5OTMgNC45NDk5OEMzLjI1MTQgNC45NDk5OCAzLjA0OTkzIDQuNzQ4NTEgMy4wNDk5MyA0LjQ5OTk4VjIuNTAwMDRDMy4wNDk5MyAyLjQ1MjQ2IDMuMDU3MzEgMi40MDY2MSAzLjA3MDk5IDIuMzYzNTdDMy4xMjg3OCAyLjE4MTc1IDMuMjk4OTcgMi4wNTAwMiAzLjQ5OTkzIDIuMDUwMDJIMTEuNDk5OUMxMS42NTUzIDIuMDUwMDIgMTEuNzkyMiAyLjEyODcyIDExLjg3MzEgMi4yNDg0MkMxMS45MjE2IDIuMzIwMjQgMTEuOTQ5OSAyLjQwNjgyIDExLjk0OTkgMi41MDAwMkwxMS45NDk5IDIuNTAwMDRWNC40OTk5OEMxMS45NDk5IDQuNzQ4NTEgMTEuNzQ4NSA0Ljk0OTk4IDExLjQ5OTkgNC45NDk5OEMxMS4yNTE0IDQuOTQ5OTggMTEuMDQ5OSA0Ljc0ODUxIDExLjA0OTkgNC40OTk5OFYyLjk1MDAySDguMDQ5OTNWMTIuMDVIOS4yNTQyOEM5LjUwMjgxIDEyLjA1IDkuNzA0MjggMTIuMjUxNSA5LjcwNDI4IDEyLjVDOS43MDQyOCAxMi43NDg2IDkuNTAyODEgMTIuOTUgOS4yNTQyOCAxMi45NUg1Ljc1NDI4QzUuNTA1NzUgMTIuOTUgNS4zMDQyOCAxMi43NDg2IDUuMzA0MjggMTIuNUM1LjMwNDI4IDEyLjI1MTUgNS41MDU3NSAxMi4wNSA1Ljc1NDI4IDEyLjA1SDYuOTQ5OTNWMi45NTAwMkgzLjk0OTkzWlwiIGZpbGw9XCIjZGRkXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIj48L3BhdGg+PC9zdmc+YCxcclxuICAgICAgICB9O1xyXG4gICAgY29uc3QgcHJvcGVydHlNZW51SXRlbXMgPSBbXHJcbiAgICAgICAgdGl0bGVBY3Rpb25JdGVtLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaXRlbVR5cGU6IFwic2VwYXJhdG9yXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRvb2x0aXA6IFwiTWFrZSBpdCBzbWFsbGVyXCIsXHJcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZTogXCJzaHJpbmtcIixcclxuICAgICAgICAgICAgaXRlbVR5cGU6IFwiYWN0aW9uXCIsXHJcbiAgICAgICAgICAgIGljb246IGA8c3ZnIHdpZHRoPVwiMTVcIiBoZWlnaHQ9XCIxNVwiIHZpZXdCb3g9XCIwIDAgMTUgMTVcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwiTTIuMjUgNy41QzIuMjUgNy4yMjM4NiAyLjQ3Mzg2IDcgMi43NSA3SDEyLjI1QzEyLjUyNjEgNyAxMi43NSA3LjIyMzg2IDEyLjc1IDcuNUMxMi43NSA3Ljc3NjE0IDEyLjUyNjEgOCAxMi4yNSA4SDIuNzVDMi40NzM4NiA4IDIuMjUgNy43NzYxNCAyLjI1IDcuNVpcIiBmaWxsPVwiI2RkZFwiIGZpbGwtcnVsZT1cImV2ZW5vZGRcIiBjbGlwLXJ1bGU9XCJldmVub2RkXCI+PC9wYXRoPjwvc3ZnPmAsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRvb2x0aXA6IFwiTWFrZSBpdCBiaWdnZXJcIixcclxuICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBcImdyb3dcIixcclxuICAgICAgICAgICAgaXRlbVR5cGU6IFwiYWN0aW9uXCIsXHJcbiAgICAgICAgICAgIGljb246IGA8c3ZnIHdpZHRoPVwiMTVcIiBoZWlnaHQ9XCIxNVwiIHZpZXdCb3g9XCIwIDAgMTUgMTVcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwiTTggMi43NUM4IDIuNDczODYgNy43NzYxNCAyLjI1IDcuNSAyLjI1QzcuMjIzODYgMi4yNSA3IDIuNDczODYgNyAyLjc1VjdIMi43NUMyLjQ3Mzg2IDcgMi4yNSA3LjIyMzg2IDIuMjUgNy41QzIuMjUgNy43NzYxNCAyLjQ3Mzg2IDggMi43NSA4SDdWMTIuMjVDNyAxMi41MjYxIDcuMjIzODYgMTIuNzUgNy41IDEyLjc1QzcuNzc2MTQgMTIuNzUgOCAxMi41MjYxIDggMTIuMjVWOEgxMi4yNUMxMi41MjYxIDggMTIuNzUgNy43NzYxNCAxMi43NSA3LjVDMTIuNzUgNy4yMjM4NiAxMi41MjYxIDcgMTIuMjUgN0g4VjIuNzVaXCIgZmlsbD1cIiNkZGRcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCIgY2xpcC1ydWxlPVwiZXZlbm9kZFwiPjwvcGF0aD48L3N2Zz5gLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpdGVtVHlwZTogXCJzZXBhcmF0b3JcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdG9vbHRpcDogXCJDbGVhciBpdFwiLFxyXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IFwiY2xlYXItYWxsXCIsXHJcbiAgICAgICAgICAgIGl0ZW1UeXBlOiBcImFjdGlvblwiLFxyXG4gICAgICAgICAgICBpY29uOiBgPHN2ZyB3aWR0aD1cIjE1XCIgaGVpZ2h0PVwiMTVcIiB2aWV3Qm94PVwiMCAwIDE1IDE1XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PHBhdGggZD1cIk00LjYwOTEzIDAuMDYzNDI4N0M0LjM5MDgyIDAuMDA4ODUwNSA0LjE2NTc1IDAuMTIzOTMgNC4wODIxOCAwLjMzMjg2N0wzLjE1MzggMi42NTM4TDAuODMyODY2IDMuNTgyMThDMC43MDI4ODQgMy42MzQxNyAwLjYwNDQwNCAzLjc0MzcgMC41NjY3MDUgMy44Nzg0OUMwLjUyODkwNiA0LjAxMzI5IDAuNTU1OTk0IDQuMTU4IDAuNjM5OTkyIDQuMjY5OTlMMi4wMTE0OCA2LjA5ODY0TDEuMDYzNDMgOS44OTA4NUMxLjAwOTQ0IDEwLjEwNjggMS4xMjE0NSAxMC4zMjk4IDEuMzI2OTEgMTAuNDE1NEw0LjIwMTE1IDExLjYxM0w1LjYyNTU3IDEzLjc0OTZDNS43MzQxMiAxMy45MTI0IDUuOTM1NDUgMTMuOTg2NCA2LjEyMzYyIDEzLjkzMjdMOS42MjM2MiAxMi45MzI3QzkuNjI5ODggMTIuOTMwOSA5LjYzNjExIDEyLjkyOSA5LjY0MjI5IDEyLjkyNjlMMTIuNjQyMyAxMS45MjY5QzEyLjc5MjMgMTEuODc2OSAxMi45MDUgMTEuNzUxOSAxMi45MzkzIDExLjU5NzZMMTMuOTM5MyA3LjA5NzYxQzEzLjk3NzYgNi45MjUwNiAxMy45MTE0IDYuNzQ2MDUgMTMuNzcgNi42Mzk5OUwxMS45NSA1LjI3NDk5VjIuOTk5OTlDMTEuOTUgMi44Mjk1NSAxMS44NTM3IDIuNjczNzMgMTEuNzAxMiAyLjU5NzVMOC43MDEyNCAxLjA5NzVDOC42NzE4NyAxLjA4MjgyIDguNjQwOTggMS4wNzEzOSA4LjYwOTEzIDEuMDYzNDNMNC42MDkxMyAwLjA2MzQyODdaTTExLjQzMjMgNi4wMTE3M0wxMi43NzQ4IDcuMDE4NThMMTAuMjExOSA5LjE1NDI5QzEwLjE0NzYgOS4yMDc4NiAxMC4wOTk1IDkuMjc4MyAxMC4wNzMxIDkuMzU3NjlMOS4yNTM4MiAxMS44MTU1TDcuNzM4NDkgMTAuODY4NEM3LjUyNzc0IDEwLjczNjcgNy4yNTAxMSAxMC44MDA3IDcuMTE4MzkgMTEuMDExNUM2Ljk4NjY3IDExLjIyMjIgNy4wNTA3NCAxMS40OTk5IDcuMjYxNDkgMTEuNjMxNkw4LjQwMzQxIDEyLjM0NTNMNi4xOTIyMSAxMi45NzcxTDQuODc0NDEgMTEuMDAwNEM0LjgyNTEzIDEwLjkyNjUgNC43NTUwOCAxMC44Njg4IDQuNjczMDcgMTAuODM0NkwyLjAzMDQ2IDkuNzMzNTJMMi44NTEzNCA2LjQ0OTk5SDQuOTk5OTlDNS4yNDg1MiA2LjQ0OTk5IDUuNDQ5OTkgNi4yNDg1MiA1LjQ0OTk5IDUuOTk5OTlDNS40NDk5OSA1Ljc1MTQ2IDUuMjQ4NTIgNS41NDk5OSA0Ljk5OTk5IDUuNTQ5OTlIMi43MjQ5OUwxLjcxMjMgNC4xOTk3NEwzLjUxNDA3IDMuNDc5MDNMNi4zNTc2OSA0LjQyNjlDNi41MzY1NSA0LjQ4NjUyIDYuNzMzNjEgNC40MjgzMiA2Ljg1MTM4IDQuMjgxMTFMOC42MjQxMyAyLjA2NTE4TDExLjA1IDMuMjc4MTFWNS4xOTUzM0w4LjgzMjg3IDYuMDgyMThDOC43MDk5NiA2LjEzMTM0IDguNjE0OTQgNi4yMzIxMiA4LjU3MzA4IDYuMzU3NjlMOC4wNzMwOCA3Ljg1NzY5QzcuOTk0NDkgOC4wOTM0NiA4LjEyMTkxIDguMzQ4MzEgOC4zNTc2OSA4LjQyNjlDOC41OTM0NiA4LjUwNTQ5IDguODQ4MzEgOC4zNzgwNyA4LjkyNjkgOC4xNDIyOUw5LjM2MDkgNi44NDAyOUwxMS40MzIzIDYuMDExNzNaTTcuNzEwNTIgMS43NjY0OEw2LjM0NDYyIDMuNDczODZMNC4wOTUwNSAyLjcyNEw0Ljc3MTkyIDEuMDMxODNMNy43MTA1MiAxLjc2NjQ4Wk0xMC4yMTE1IDExLjc4ODVMMTIuMTE2IDExLjE1MzdMMTIuNzc0NSA4LjE5MDM0TDEwLjg4NjQgOS43NjM3NEwxMC4yMTE1IDExLjc4ODVaXCIgZmlsbD1cIiNkZGRcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCIgY2xpcC1ydWxlPVwiZXZlbm9kZFwiPjwvcGF0aD48L3N2Zz5gLFxyXG4gICAgICAgIH0sXHJcbiAgICBdO1xyXG4gICAgdXNlUHJvcGVydHlNZW51KHByb3BlcnR5TWVudUl0ZW1zLCAoeyBwcm9wZXJ0eU5hbWUgfSkgPT4ge1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09ICdncm93JyB8fCBwcm9wZXJ0eU5hbWUgPT09ICdzaHJpbmsnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1NpemUgPSBwcm9wZXJ0eU5hbWUgPT09IFwiZ3Jvd1wiID8gc2l6ZSAqIDEuMyA6IHNpemUgLyAxLjM7XHJcbiAgICAgICAgICAgIHJldHVybiBzZXRTaXplKG5ld1NpemUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKHByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiY2xlYXItYWxsXCI6XHJcbiAgICAgICAgICAgICAgICBzZXRUb2RvcyhbXSk7XHJcbiAgICAgICAgICAgICAgICBzZXRIYXNUaXRsZShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBzZXRUaXRsZShcIlwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYWRkLXRpdGxlXCI6XHJcbiAgICAgICAgICAgICAgICBzZXRIYXNUaXRsZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicmVtb3ZlLXRpdGxlXCI6XHJcbiAgICAgICAgICAgICAgICBzZXRIYXNUaXRsZShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInRvZ2dsZS13aWR0aFwiOlxyXG4gICAgICAgICAgICAgICAgc2V0V2lkdGgod2lkdGggPT09IDQ0MCA/IDM4MCA6IDQ0MCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IFRvZG8gPSAodG9kbykgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgaWQsIGRvbmUsIHRpdGxlLCBvdXRPZlNjb3BlIH0gPSB0b2RvO1xyXG4gICAgICAgIHJldHVybiAoZmlnbWEud2lkZ2V0LmgoQXV0b0xheW91dCwgeyBrZXk6IGlkLCBkaXJlY3Rpb246IFwiaG9yaXpvbnRhbFwiLCB2ZXJ0aWNhbEFsaWduSXRlbXM6IFwic3RhcnRcIiwgc3BhY2luZzogNDAgKiBzaXplLCB3aWR0aDogXCJmaWxsLXBhcmVudFwiIH0sXHJcbiAgICAgICAgICAgIGZpZ21hLndpZGdldC5oKEF1dG9MYXlvdXQsIHsgZGlyZWN0aW9uOiBcImhvcml6b250YWxcIiwgdmVydGljYWxBbGlnbkl0ZW1zOiBcInN0YXJ0XCIsIHNwYWNpbmc6IDggKiBzaXplLCB3aWR0aDogJ2ZpbGwtcGFyZW50JyB9LFxyXG4gICAgICAgICAgICAgICAgZmlnbWEud2lkZ2V0LmgoQXV0b0xheW91dCwgeyBoaWRkZW46IGRvbmUgfHwgb3V0T2ZTY29wZSwgaGVpZ2h0OiAyMCAqIHNpemUsIHdpZHRoOiAyMCAqIHNpemUsIHZlcnRpY2FsQWxpZ25JdGVtczogXCJjZW50ZXJcIiwgaG9yaXpvbnRhbEFsaWduSXRlbXM6IFwiY2VudGVyXCIsIHBhZGRpbmc6IDQgKiBzaXplLCBvbkNsaWNrOiAoKSA9PiB1cGRhdGVUb2RvKHsgaWQsIGZpZWxkOiBcImRvbmVcIiB9KSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLndpZGdldC5oKFJlY3RhbmdsZSwgeyBmaWxsOiBcIiNmZmZcIiwgc3Ryb2tlOiBcIiNhZWFlYWVcIiwgc3Ryb2tlV2lkdGg6IDEgKiBzaXplLCBzdHJva2VBbGlnbjogXCJpbnNpZGVcIiwgaGVpZ2h0OiAxNiAqIHNpemUsIHdpZHRoOiAxNiAqIHNpemUsIGNvcm5lclJhZGl1czogNCAqIHNpemUgfSkpLFxyXG4gICAgICAgICAgICAgICAgZmlnbWEud2lkZ2V0LmgoU1ZHLCB7IGhpZGRlbjogIWRvbmUgfHwgb3V0T2ZTY29wZSwgb25DbGljazogKCkgPT4gdXBkYXRlVG9kbyh7IGlkLCBmaWVsZDogXCJkb25lXCIgfSksIGhlaWdodDogMjAgKiBzaXplLCB3aWR0aDogMjAgKiBzaXplLCBzcmM6IGBcbiAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDIwIDIwXCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgICAgICAgICAgPHBhdGggZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIiBkPVwiTTYgMkMzLjc5MDg2IDIgMiAzLjc5MDg2IDIgNlYxNEMyIDE2LjIwOTEgMy43OTA4NiAxOCA2IDE4SDE0QzE2LjIwOTEgMTggMTggMTYuMjA5MSAxOCAxNFY2QzE4IDMuNzkwODYgMTYuMjA5MSAyIDE0IDJINlpNMTQuMzQwOCA4Ljc0NzQxQzE0Ljc1MzYgOC4yODMwMyAxNC43MTE4IDcuNTcxOTUgMTQuMjQ3NCA3LjE1OTE2QzEzLjc4MyA2Ljc0NjM4IDEzLjA3MTkgNi43ODgyMSAxMi42NTkyIDcuMjUyNTlMMTAuNjU5MiA5LjUwMjU5TDkuNDUxODMgMTAuODYwOEw3Ljc5NTUgOS4yMDQ1QzcuMzU2MTYgOC43NjUxNiA2LjY0Mzg0IDguNzY1MTYgNi4yMDQ1IDkuMjA0NUM1Ljc2NTE3IDkuNjQzODQgNS43NjUxNyAxMC4zNTYyIDYuMjA0NSAxMC43OTU1TDguNzA0NSAxMy4yOTU1QzguOTIzNTkgMTMuNTE0NiA5LjIyMzM0IDEzLjYzMzYgOS41MzMwNSAxMy42MjQ1QzkuODQyNzUgMTMuNjE1NCAxMC4xMzUgMTMuNDc5IDEwLjM0MDggMTMuMjQ3NEwxMi4zNDA4IDEwLjk5NzRMMTQuMzQwOCA4Ljc0NzQxWlwiIGZpbGw9XCIjNEFCMzkzXCIvPlxuICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIGAgfSksXHJcbiAgICAgICAgICAgICAgICBmaWdtYS53aWRnZXQuaChSZWN0YW5nbGUsIHsgaGlkZGVuOiAhb3V0T2ZTY29wZSwgZmlsbDogXCIjZjJmMmYyXCIsIHdpZHRoOiAyMCAqIHNpemUsIGhlaWdodDogMjAgKiBzaXplIH0pLFxyXG4gICAgICAgICAgICAgICAgZmlnbWEud2lkZ2V0LmgoSW5wdXQsIHsgZmlsbDogb3V0T2ZTY29wZSA/IFwiIzZFNkU2RVwiIDogZG9uZSA/IFwiIzc2NzY3NlwiIDogXCIjMTAxMDEwXCIsIGZvbnRTaXplOiAoZG9uZSB8fCBvdXRPZlNjb3BlID8gMTMgOiAxNCkgKiBzaXplLCBsaW5lSGVpZ2h0OiAyMCAqIHNpemUsIHdpZHRoOiAnZmlsbC1wYXJlbnQnLCB2YWx1ZTogdGl0bGUsIHBsYWNlaG9sZGVyOiBcIkkgbmVlZCB0by4uLlwiLCBwbGFjZWhvbGRlclByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwiI2I3YjdiN1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiAtMC4xNSxcclxuICAgICAgICAgICAgICAgICAgICB9LCBvblRleHRFZGl0RW5kOiAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLmNoYXJhY3RlcnMgPT09IFwiXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZGVsZXRlVG9kbyhpZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdXBkYXRlVG9kbyh7IGlkLCBmaWVsZDogXCJ0aXRsZVwiLCB2YWx1ZTogZS5jaGFyYWN0ZXJzIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gfSkpLFxyXG4gICAgICAgICAgICBmaWdtYS53aWRnZXQuaChBdXRvTGF5b3V0LCB7IGZpbGw6IG91dE9mU2NvcGUgPyBcIiNmMmYyZjJcIiA6IFwiI2ZmZlwiLCBvbkNsaWNrOiAoKSA9PiBuZXcgUHJvbWlzZSgoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd2lkZ2V0ID0geWllbGQgZmlnbWEuZ2V0Tm9kZUJ5SWRBc3luYyh3aWRnZXRJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFic29sdXRlWCA9IHdpZGdldC5hYnNvbHV0ZVRyYW5zZm9ybVswXVsyXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWJzb2x1dGVZID0gd2lkZ2V0LmFic29sdXRlVHJhbnNmb3JtWzFdWzJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWdtYS5zaG93VUkoX19odG1sX18sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogNzYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogMjIwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGFic29sdXRlWSAtIDU4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGFic29sdXRlWCArIHdpZGdldC53aWR0aCArIDcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiBcInVpXCIsIGlkLCB0aXRsZSwgb3V0T2ZTY29wZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSkgfSxcclxuICAgICAgICAgICAgICAgIGZpZ21hLndpZGdldC5oKFNWRywgeyBoZWlnaHQ6IDIwICogc2l6ZSwgd2lkdGg6IDIwICogc2l6ZSwgc3JjOiBgXG4gICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgdmlld0JveD1cIjAgMCAyMCAyMFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICAgICAgICAgIDxyZWN0IHg9XCIxLjZcIiB5PVwiOFwiIHdpZHRoPVwiNFwiIGhlaWdodD1cIjRcIiByeD1cIjJcIiBmaWxsPVwiI0FBQUFBQVwiLz5cbiAgICAgICAgICAgICAgICA8cmVjdCB4PVwiOFwiIHk9XCI4XCIgd2lkdGg9XCI0XCIgaGVpZ2h0PVwiNFwiIHJ4PVwiMlwiIGZpbGw9XCIjQUFBQUFBXCIvPlxuICAgICAgICAgICAgICAgIDxyZWN0IHg9XCIxNC40XCIgeT1cIjhcIiB3aWR0aD1cIjRcIiBoZWlnaHQ9XCI0XCIgcng9XCIyXCIgZmlsbD1cIiNBQUFBQUFcIi8+XG4gICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgYCB9KSkpKTtcclxuICAgIH07XHJcbiAgICBjb25zdCBoYW5kbGVVcGdyYWRlQ2xpY2sgPSAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgaWYgKCFmaWdtYS5wYXltZW50cykge1xyXG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkoXCJQYXltZW50cyBub3QgYXZhaWxhYmxlXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHlpZWxkIGZpZ21hLnBheW1lbnRzLmluaXRpYXRlQ2hlY2tvdXRBc3luYyh7XHJcbiAgICAgICAgICAgICAgICBpbnRlcnN0aXRpYWw6IFwiUEFJRF9GRUFUVVJFXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChmaWdtYS5wYXltZW50cy5zdGF0dXMudHlwZSA9PT0gXCJQQUlEXCIpIHtcclxuICAgICAgICAgICAgICAgIGZpZ21hLm5vdGlmeShcIlRoYW5rIHlvdSBmb3IgdXBncmFkaW5nIVwiKTtcclxuICAgICAgICAgICAgICAgIHNldFNob3dVcGdyYWRlTWVzc2FnZShmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZmlnbWEucGF5bWVudHMuc3RhdHVzLnR5cGUgPT09IFwiVU5QQUlEXCIpIHtcclxuICAgICAgICAgICAgICAgIGZpZ21hLm5vdGlmeShcIlVwZ3JhZGUgcmVxdWlyZWQgdG8gYWRkIG1vcmUgdGFza3NcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmaWdtYS5ub3RpZnkoXCJQYXltZW50IHN0YXR1cyBjb3VsZCBub3QgYmUgZGV0ZXJtaW5lZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeShcIkZhaWxlZCB0byBpbml0aWF0ZSBwYXltZW50XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIChmaWdtYS53aWRnZXQuaChBdXRvTGF5b3V0LCB7IGRpcmVjdGlvbjogXCJ2ZXJ0aWNhbFwiLCBjb3JuZXJSYWRpdXM6IDggKiBzaXplLCBmaWxsOiBcIiNmZmZcIiwgd2lkdGg6IHdpZHRoICogc2l6ZSwgc3Ryb2tlOiBcIiNlN2U3ZTdcIiwgc3Ryb2tlV2lkdGg6IDEgKiBzaXplIH0sXHJcbiAgICAgICAgaGFzVGl0bGUgJiYgKGZpZ21hLndpZGdldC5oKEF1dG9MYXlvdXQsIHsgd2lkdGg6IFwiZmlsbC1wYXJlbnRcIiwgZGlyZWN0aW9uOiBcInZlcnRpY2FsXCIsIHZlcnRpY2FsQWxpZ25JdGVtczogXCJjZW50ZXJcIiwgaG9yaXpvbnRhbEFsaWduSXRlbXM6IFwiY2VudGVyXCIgfSxcclxuICAgICAgICAgICAgZmlnbWEud2lkZ2V0LmgoSW5wdXQsIHsgdmFsdWU6IHRpdGxlLCBwbGFjZWhvbGRlcjogXCJUaXRsZVwiLCBmaWxsOiBcIiMyQTJBMkFcIiwgZm9udFdlaWdodDogNzAwLCBmb250U2l6ZTogMTkuOCAqIHNpemUsIGxpbmVIZWlnaHQ6IDI0ICogc2l6ZSwgaG9yaXpvbnRhbEFsaWduVGV4dDogXCJjZW50ZXJcIiwgd2lkdGg6IDI5MCAqIHNpemUsIGxldHRlclNwYWNpbmc6IC0wLjE1ICogc2l6ZSwgaW5wdXRGcmFtZVByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogXCIjRkZGRkZGXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbEFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogeyB0b3A6IDI0ICogc2l6ZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgIH0sIG9uVGV4dEVkaXRFbmQ6IChlKSA9PiBzZXRUaXRsZShlLmNoYXJhY3RlcnMpIH0pKSksXHJcbiAgICAgICAgZmlnbWEud2lkZ2V0LmgoQXV0b0xheW91dCwgeyBkaXJlY3Rpb246IFwidmVydGljYWxcIiwgc3BhY2luZzogMjQgKiBzaXplLCBwYWRkaW5nOiAyNCAqIHNpemUsIHdpZHRoOiBcImZpbGwtcGFyZW50XCIgfSxcclxuICAgICAgICAgICAgZmlnbWEud2lkZ2V0LmgoQXV0b0xheW91dCwgeyBkaXJlY3Rpb246IFwidmVydGljYWxcIiwgc3BhY2luZzogOCAqIHNpemUsIHdpZHRoOiBcImZpbGwtcGFyZW50XCIgfSxcclxuICAgICAgICAgICAgICAgIHRvZG9zXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcigoeyBkb25lLCBvdXRPZlNjb3BlIH0pID0+ICFkb25lICYmICFvdXRPZlNjb3BlKVxyXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoKHsgaWQsIHRpdGxlLCBkb25lLCBvdXRPZlNjb3BlIH0pID0+IChmaWdtYS53aWRnZXQuaChUb2RvLCB7IGtleTogaWQsIGlkOiBpZCwgdGl0bGU6IHRpdGxlLCBkb25lOiBkb25lLCBvdXRPZlNjb3BlOiBvdXRPZlNjb3BlIH0pKSksXHJcbiAgICAgICAgICAgICAgICBmaWdtYS53aWRnZXQuaChBdXRvTGF5b3V0LCB7IHdpZHRoOiBcImZpbGwtcGFyZW50XCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBmaWdtYS53aWRnZXQuaChBdXRvTGF5b3V0LCB7IGRpcmVjdGlvbjogXCJob3Jpem9udGFsXCIsIHZlcnRpY2FsQWxpZ25JdGVtczogXCJjZW50ZXJcIiwgc3BhY2luZzogOCAqIHNpemUsIGZpbGw6IFwiI2ZmZlwiLCBvbkNsaWNrOiAoKSA9PiBjcmVhdGVUb2RvKGNyZWF0ZUlkKCkpIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZ21hLndpZGdldC5oKFNWRywgeyBoZWlnaHQ6IDIwICogc2l6ZSwgd2lkdGg6IDIwICogc2l6ZSwgc3JjOiBgXG4gICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDIwIDIwXCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgICAgICAgICAgPHBhdGggZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIiBkPVwiTTEwLjEyNSA1QzEwLjc0NjMgNSAxMS4yNSA1LjQ0NzcyIDExLjI1IDZWMTRDMTEuMjUgMTQuNTUyMyAxMC43NDYzIDE1IDEwLjEyNSAxNUM5LjUwMzY4IDE1IDkgMTQuNTUyMyA5IDE0VjZDOSA1LjQ0NzcyIDkuNTAzNjggNSAxMC4xMjUgNVpcIiBmaWxsPVwiIzk3OTc5N1wiLz5cbiAgICAgICAgICAgICAgICA8cGF0aCBmaWxsLXJ1bGU9XCJldmVub2RkXCIgY2xpcC1ydWxlPVwiZXZlbm9kZFwiIGQ9XCJNNSA5Ljg3NUM1IDkuMjUzNjggNS40NDc3MiA4Ljc1IDYgOC43NUwxNCA4Ljc1QzE0LjU1MjMgOC43NSAxNSA5LjI1MzY4IDE1IDkuODc1QzE1IDEwLjQ5NjMgMTQuNTUyMyAxMSAxNCAxMUw2IDExQzUuNDQ3NzIgMTEgNSAxMC40OTYzIDUgOS44NzVaXCIgZmlsbD1cIiM5Nzk3OTdcIi8+XG4gICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgYCB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlnbWEud2lkZ2V0LmgoVGV4dEJsb2NrLCB7IGZpbGw6IFwiIzk0OTQ5NFwiLCBmb250U2l6ZTogMTQgKiBzaXplLCBsaW5lSGVpZ2h0OiAyMCAqIHNpemUsIGZvbnRXZWlnaHQ6IDcwMCwgbGV0dGVyU3BhY2luZzogXCItMC43NSVcIiB9LCBcIkFkZCBhIHRvZG8gdGFza1wiKSkpKSxcclxuICAgICAgICAgICAgZmlnbWEud2lkZ2V0LmgoQXV0b0xheW91dCwgeyBoaWRkZW46ICF0b2Rvcy5maWx0ZXIoKHsgZG9uZSwgb3V0T2ZTY29wZSB9KSA9PiBkb25lICYmICFvdXRPZlNjb3BlKS5sZW5ndGgsIGRpcmVjdGlvbjogXCJ2ZXJ0aWNhbFwiLCBzcGFjaW5nOiA4ICogc2l6ZSwgd2lkdGg6IFwiZmlsbC1wYXJlbnRcIiB9LCB0b2Rvc1xyXG4gICAgICAgICAgICAgICAgLmZpbHRlcigoeyBkb25lLCBvdXRPZlNjb3BlIH0pID0+IGRvbmUgJiYgIW91dE9mU2NvcGUpXHJcbiAgICAgICAgICAgICAgICAubWFwKCh7IGlkLCB0aXRsZSwgZG9uZSwgb3V0T2ZTY29wZSB9KSA9PiAoZmlnbWEud2lkZ2V0LmgoVG9kbywgeyBrZXk6IGlkLCBpZDogaWQsIHRpdGxlOiB0aXRsZSwgZG9uZTogZG9uZSwgb3V0T2ZTY29wZTogb3V0T2ZTY29wZSB9KSkpKSxcclxuICAgICAgICAgICAgc2hvd1VwZ3JhZGVNZXNzYWdlICYmIChmaWdtYS53aWRnZXQuaChBdXRvTGF5b3V0LCB7IGRpcmVjdGlvbjogXCJ2ZXJ0aWNhbFwiLCB3aWR0aDogXCJmaWxsLXBhcmVudFwiLCBzcGFjaW5nOiAxNiAqIHNpemUgfSxcclxuICAgICAgICAgICAgICAgIGZpZ21hLndpZGdldC5oKEF1dG9MYXlvdXQsIHsgZGlyZWN0aW9uOiBcImhvcml6b250YWxcIiwgd2lkdGg6IFwiZmlsbC1wYXJlbnRcIiwgcGFkZGluZzogMTYgKiBzaXplLCBmaWxsOiBcIiNGRkYzRTZcIiwgY29ybmVyUmFkaXVzOiA4ICogc2l6ZSwgc3Ryb2tlOiBcIiNGRkI0NTlcIiwgc3Ryb2tlV2lkdGg6IDEgKiBzaXplLCBzcGFjaW5nOiA4ICogc2l6ZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLndpZGdldC5oKFNWRywgeyBoZWlnaHQ6IDIwICogc2l6ZSwgd2lkdGg6IDIwICogc2l6ZSwgc3JjOiBgXG4gICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgMjAgMjBcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIiBkPVwiTTEwIDJDNS41ODE3MiAyIDIgNS41ODE3MiAyIDEwQzIgMTQuNDE4MyA1LjU4MTcyIDE4IDEwIDE4QzE0LjQxODMgMTggMTggMTQuNDE4MyAxOCAxMEMxOCA1LjU4MTcyIDE0LjQxODMgMiAxMCAyWk05LjI1IDZDOS4yNSA1LjU4NTc5IDkuNTg1NzkgNS4yNSAxMCA1LjI1QzEwLjQxNDIgNS4yNSAxMC43NSA1LjU4NTc5IDEwLjc1IDZWMTFDMTAuNzUgMTEuNDE0MiAxMC40MTQyIDExLjc1IDEwIDExLjc1QzkuNTg1NzkgMTEuNzUgOS4yNSAxMS40MTQyIDkuMjUgMTFWNlpNMTAgMTVDMTAuNTUyMyAxNSAxMSAxNC41NTIzIDExIDE0QzExIDEzLjQ0NzcgMTAuNTUyMyAxMyAxMCAxM0M5LjQ0NzcyIDEzIDkgMTMuNDQ3NyA5IDE0QzkgMTQuNTUyMyA5LjQ0NzcyIDE1IDEwIDE1WlwiIGZpbGw9XCIjRkZCNDU5XCIvPlxuICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgYCB9KSxcclxuICAgICAgICAgICAgICAgICAgICBmaWdtYS53aWRnZXQuaChUZXh0QmxvY2ssIHsgZmlsbDogXCIjQjU1QjA4XCIsIGZvbnRTaXplOiAxNCAqIHNpemUsIHdpZHRoOiBcImZpbGwtcGFyZW50XCIgfSwgXCJZb3UndmUgcmVhY2hlZCB0aGUgZnJlZSBwbGFuIGxpbWl0LiBQbGVhc2UgdXBncmFkZSB0byBhZGQgbW9yZSB0YXNrcy5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgZmlnbWEud2lkZ2V0LmgoU1ZHLCB7IGhlaWdodDogMjAgKiBzaXplLCB3aWR0aDogMjAgKiBzaXplLCBzcmM6IGBcbiAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgdmlld0JveD1cIjAgMCAyMCAyMFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTE1IDVMNSAxNU01IDVMMTUgMTVcIiBzdHJva2U9XCIjRkZCNDU5XCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIi8+XG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICBgLCBvbkNsaWNrOiAoKSA9PiBzZXRTaG93VXBncmFkZU1lc3NhZ2UoZmFsc2UpIH0pKSxcclxuICAgICAgICAgICAgICAgIGZpZ21hLndpZGdldC5oKEF1dG9MYXlvdXQsIHsgZGlyZWN0aW9uOiBcImhvcml6b250YWxcIiwgd2lkdGg6IFwiZmlsbC1wYXJlbnRcIiwgc3BhY2luZzogOCAqIHNpemUsIGhvcml6b250YWxBbGlnbkl0ZW1zOiBcImNlbnRlclwiLCB2ZXJ0aWNhbEFsaWduSXRlbXM6IFwiY2VudGVyXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBmaWdtYS53aWRnZXQuaChBdXRvTGF5b3V0LCB7IG9uQ2xpY2s6IGhhbmRsZVVwZ3JhZGVDbGljaywgZmlsbDogXCIjRkZCNDU5XCIsIHBhZGRpbmc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsOiA4ICogc2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvcml6b250YWw6IDE2ICogc2l6ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBjb3JuZXJSYWRpdXM6IDYgKiBzaXplLCBob3ZlclN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcIiNFNjlEM0ZcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZ21hLndpZGdldC5oKFRleHRCbG9jaywgeyBmaWxsOiBcIiNGRkZGRkZcIiwgZm9udFNpemU6IDE0ICogc2l6ZSwgZm9udFdlaWdodDogNjAwIH0sIFwiVXBncmFkZSBQbGFuXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICBmaWdtYS53aWRnZXQuaChBdXRvTGF5b3V0LCB7IG9uQ2xpY2s6ICgpID0+IHNldFNob3dVcGdyYWRlTWVzc2FnZShmYWxzZSksIHBhZGRpbmc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsOiA4ICogc2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvcml6b250YWw6IDE2ICogc2l6ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBjb3JuZXJSYWRpdXM6IDYgKiBzaXplLCBzdHJva2U6IFwiI0UwRTBFMFwiLCBzdHJva2VXaWR0aDogMSAqIHNpemUsIGhvdmVyU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwiI0Y1RjVGNVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlnbWEud2lkZ2V0LmgoVGV4dEJsb2NrLCB7IGZpbGw6IFwiIzY2NjY2NlwiLCBmb250U2l6ZTogMTQgKiBzaXplLCBmb250V2VpZ2h0OiA1MDAgfSwgXCJNYXliZSBMYXRlclwiKSkpKSkpLFxyXG4gICAgICAgIGZpZ21hLndpZGdldC5oKEF1dG9MYXlvdXQsIHsgaGlkZGVuOiB0b2Rvcy5maWx0ZXIoKHsgb3V0T2ZTY29wZSB9KSA9PiBvdXRPZlNjb3BlKS5sZW5ndGggPT09IDAsIHdpZHRoOiBcImZpbGwtcGFyZW50XCIsIGhlaWdodDogIXRvZG9zLmZpbHRlcigoeyBvdXRPZlNjb3BlIH0pID0+IG91dE9mU2NvcGUpLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgPyA0MCAqIHNpemVcclxuICAgICAgICAgICAgICAgIDogXCJodWctY29udGVudHNcIiwgZGlyZWN0aW9uOiBcInZlcnRpY2FsXCIsIGhvcml6b250YWxBbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBzcGFjaW5nOiA4ICogc2l6ZSwgcGFkZGluZzogMjQgKiBzaXplLCBmaWxsOiBcIiNmMmYyZjJcIiB9LCB0b2Rvc1xyXG4gICAgICAgICAgICAuZmlsdGVyKCh7IG91dE9mU2NvcGUgfSkgPT4gb3V0T2ZTY29wZSlcclxuICAgICAgICAgICAgLm1hcCgoeyBpZCwgdGl0bGUsIGRvbmUsIG91dE9mU2NvcGUgfSkgPT4gKGZpZ21hLndpZGdldC5oKFRvZG8sIHsga2V5OiBpZCwgaWQ6IGlkLCB0aXRsZTogdGl0bGUsIGRvbmU6IGRvbmUsIG91dE9mU2NvcGU6IG91dE9mU2NvcGUgfSkpKSksXHJcbiAgICAgICAgZmlnbWEud2lkZ2V0LmgoQXV0b0xheW91dCwgeyB3aWR0aDogOCwgcG9zaXRpb25pbmc6IFwiYWJzb2x1dGVcIiwgY29ybmVyUmFkaXVzOiAxMDAwLCB0b29sdGlwOiB3aWR0aCA9PT0gMzgwID8gXCJNYWtlIGl0IHdpZGVyXCIgOiBcIk1ha2UgaXQgbmFycm93ZXJcIiwgeDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJyaWdodFwiLFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiAwLFxyXG4gICAgICAgICAgICB9LCB5OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInRvcC1ib3R0b21cIixcclxuICAgICAgICAgICAgICAgIHRvcE9mZnNldDogMCxcclxuICAgICAgICAgICAgICAgIGJvdHRvbU9mZnNldDogMCxcclxuICAgICAgICAgICAgfSwgb25DbGljazogKCkgPT4gc2V0V2lkdGgod2lkdGggPT09IDM4MCA/IDQ0MCA6IDM4MCkgfSkpKTtcclxufVxyXG53aWRnZXQucmVnaXN0ZXIoVG9kb1dpZGdldCk7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==