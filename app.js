
let actionSelector = document.querySelector("#action-selector-div select");
const addArgBtn = document.querySelector("#add-arg")
const actionBtn = document.querySelector("#action-btn")
const input = document.querySelectorAll("#args-container input")[0]
const select = document.querySelectorAll("#args-container select")[0]
const result = document.querySelector("#result")
let selectorDivID = 1;
let trackArgIdx = 1;

// function to initailize Action-selector
const initActionSelector = (selector) => {
    const parentNode = selector.parentNode;
    selector.addEventListener("change", (e) => {
        if (selector.value === "constant") {
            removeMainActionSelectorHtml(selector)
            appendHtmlToActionSelector(parentNode, createConstantSelectHtml())
            result.innerText = generateResult(document.querySelector("#action-selector-div"), 1);
        } else if (selector.value === "argument") {
            removeMainActionSelectorHtml(selector)
            appendHtmlToActionSelector(parentNode, createArgumentSelectHtml())
            result.innerText = generateResult(document.querySelector("#action-selector-div"), 1);
        } else if (selector.value === "and") {
            removeMainActionSelectorHtml(selector)
            appendHtmlToActionSelector(parentNode, createAndOrSelectHtml("and"))
            generateHtmlForAndOrFlag(parentNode)
        } else if (selector.value === "or") {
            // const parentNode = selector.parentNode;
            removeMainActionSelectorHtml(selector)
            appendHtmlToActionSelector(parentNode, createAndOrSelectHtml("or"))
            generateHtmlForAndOrFlag(parentNode)
        }
    })
}

initActionSelector(actionSelector);

input.addEventListener("change", () => {
    dynamicalyAddArg();
})

select.addEventListener("change", (e) => {
    const options = document.querySelectorAll("#action-selector-div select option")
    options.forEach((item) => {
        if (item.hasAttribute("idx") && Number(item.getAttribute("idx")) === 1) {
            item.value = e.target.value;
        }
    })
    result.innerText = generateResult(document.querySelector("#action-selector-div"), 1);
}
)

// function to add event to the every created action button
const addEventToActionBtn = (btn) => {
    btn.addEventListener("click", () => {
        let parentNode = btn.parentNode;
        actionSelector = parentNode.querySelector("select");
        actionSelector.remove();
        const actionSelectorDiv = parentNode;
        const select = createActionSelectHtml()
        actionSelectorDiv.prepend(select)
        initActionSelector(parentNode.querySelector("select"))
        result.innerText = generateResult(parentNode, parentNode.getAttribute("parent-id"));
    })
}

addEventToActionBtn(actionBtn)

// function for genearting new arguments
addArgBtn.addEventListener("click", () => {
    let argsContainer = document.querySelector("#args-container")
    argsContainer.appendChild(createArg())
    dynamicalyAddArg();
})

// function to add args dyanmically
const dynamicalyAddArg = () => {
    const allActionSelectorSelectTag = document.querySelectorAll("#action-selector-div select")
    allActionSelectorSelectTag.forEach((item, index) => {
        if (item.hasAttribute("select-type-arg")) {
            const parentNode = item.parentNode;
            removeMainActionSelectorHtml(item)
            appendHtmlToActionSelector(parentNode, createArgumentSelectHtml())
        }
    })
}

// generates HTML when we select "##and##" from action selector ref LineNo:HTML:38
const generateHtmlForAndOrFlag = (parentNode) => {
    const parentID = parentNode.getAttribute("parent-id")
    for (let i = 1; i < 3; i++) {
        selectorDivID += 1;
        const div = document.createElement("div")
        div.id = "action-selector-div";
        div.setAttribute("child", parentID)
        div.setAttribute("parent-id", selectorDivID)
        const select = createActionSelectHtml();
        div.appendChild(select)
        const btn = document.createElement("button")
        addEventToActionBtn(btn);
        btn.id = "action-btn";
        btn.innerText = "x";

        div.appendChild(btn);
        parentNode.appendChild(div)
        initActionSelector(select);
    }
    const addOptionBtn = document.createElement("button")
    addOptionBtn.id = "option-btn";
    addOptionBtn.style.display = "block"
    addOptionBtn.innerText = "+add op";
    addOptionBtn.addEventListener("click", () => {
        // generateHtmlForAndOrFlag(parentNode)
        selectorDivID += 1;
        const div = document.createElement("div")
        div.id = "action-selector-div";
        div.setAttribute("child", parentID)
        div.setAttribute("parent-id", selectorDivID)
        const select = createActionSelectHtml();
        div.appendChild(select)
        const btn = document.createElement("button")
        addEventToActionBtn(btn);
        btn.id = "action-btn";
        btn.innerText = "x";

        div.appendChild(btn);
        initActionSelector(select);
        parentNode.insertBefore(div, parentNode.lastChild)
    })

    parentNode.appendChild(addOptionBtn);
    result.innerText = generateResult(document.querySelector("#action-selector-div"), 1);

}

// remove the default action-selector ref LineNo:HTML:38 
const removeMainActionSelectorHtml = (selector) => {
    selector.remove();
}


const appendHtmlToActionSelector = (parentNode, html) => {
    parentNode.prepend(html)
}

// generates HTML when we select "##constant##" from action selector ref LineNo:HTML:38

const createConstantSelectHtml = () => {
    let select = document.createElement("select")
    let optionValue = [true, false];
    optionValue.forEach((item) => {
        let option = document.createElement("option")
        option.value = item;
        option.innerText = item
        select.appendChild(option)
    })

    select.addEventListener("change", (e) => {
        result.innerText = generateResult(document.querySelector("#action-selector-div"), 1);
    })
    return select;
}

const createAndOrSelectHtml = (type) => {
    const options = type === "and" ? ["and", "or"] : ["or", "and"];
    const select = document.createElement("select")
    options.forEach((item) => {
        const option = document.createElement("option")
        option.value = item;
        option.innerText = item;
        select.appendChild(option)
    })
    select.value = options[0];
    select.addEventListener("change", () => {
        result.innerText = generateResult(document.querySelector("#action-selector-div"), 1);
    })
    return select;
}

// re-construct the action-selector ref HTML:38
const createActionSelectHtml = () => {
    let select = document.createElement("select")
    let optionValue = [
        "select a value",
        "argument",
        "constant",
        "and",
        "or",
    ];
    optionValue.forEach((item) => {
        let option = document.createElement("option")
        option.value = item;
        option.innerText = item
        select.appendChild(option)
    })

    return select;
}

const createArgumentSelectHtml = () => {
    const inputBoxes = document.querySelectorAll("#args-container input")
    const allSelect = document.querySelectorAll("#args-container select")

    const selectTag = document.createElement("select")
    selectTag.setAttribute("select-type-arg", true)
    let totalLengthOfOption = allSelect.length;

    for (let i = 0; i < totalLengthOfOption; i++) {
        let option = document.createElement("option")
        option.value = allSelect[i].value;
        option.setAttribute("idx", i + 1)
        option.innerText = inputBoxes[i].value;
        selectTag.appendChild(option)
    }

    selectTag.addEventListener("change", () => {
        result.innerText = generateResult(document.querySelector("#action-selector-div"), 1);
    })

    return selectTag;
}

// to create new arguments
const createArg = () => {
    const argContainer = document.createElement("div")
    trackArgIdx += 1;
    argContainer.setAttribute("idx", trackArgIdx)
    argContainer.classList.add("arg")
    const input = document.createElement("input")
    input.type = "text"
    input.value = "newarg"

    let select = document.createElement("select")

    let optionValue = [false, true];
    optionValue.forEach((item) => {
        let option = document.createElement("option")
        option.value = item;
        option.innerText = item
        select.appendChild(option)
    })

    select.value = optionValue[0];
    argContainer.appendChild(input)
    argContainer.appendChild(select)
    input.addEventListener("change", () => {
        dynamicalyAddArg()
    })

    select.addEventListener("change", (e) => {
        const options = document.querySelectorAll("#action-selector-div select option")

        options.forEach((item) => {
            if (item.hasAttribute("idx") && item.getAttribute("idx") === argContainer.getAttribute("idx")) {
                item.value = e.target.value;
            }
        })
        result.innerText = generateResult(document.querySelector("#action-selector-div"), 1);
    })

    return argContainer
}

// to generate result
const generateResult = (selector, parent) => {
    const selectTag = selector.querySelector("select")
    if (!selectTag) {
        return undefined;
    }
    if (selectTag.value === "select a value") {
        return undefined;
    }

    if (selectTag.value === "and" || selectTag.value === "or") {

        const tempAnsArr = [];
        const allChildren = selector.querySelectorAll(`[child="${parent}"]`).length;

        for (let i = 0; i < allChildren; i++) {
            const child = selector.querySelectorAll(`[child="${parent}"]`)[i]
            let tempAns = generateResult(child, child.getAttribute("parent-id"))
            tempAnsArr.push(tempAns)
            
        }

        return selectTag.value === "and" ? doAndOrOperation(tempAnsArr, "and") : doAndOrOperation(tempAnsArr, "or")
    }
    return selectTag.value === "false" ? false : true;
}

// performs AND | OR operations
const doAndOrOperation = (ansArr, type) => {
    if (type === "and") {
        let result = true;
        for (let i = 0; i < ansArr.length - 1; i++) {
            result = result && ansArr[i] && ansArr[i + 1];
        }
        return result;
    } else {
        let result = false;
        for (let i = 0; i < ansArr.length - 1; i++) {
            result = result || ansArr[i] || ansArr[i + 1];
        }
        return result;
    }
}

result.innerText = generateResult(document.querySelector("#action-selector-div"), 1);
