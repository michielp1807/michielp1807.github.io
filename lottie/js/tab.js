const TAB_CODE_EDITOR = "codeArea"
const TAB_TIMELINE_EDITOR = "timelineArea";

let activeTab = TAB_CODE_EDITOR;

// Switch to a different tab (activated by tab switcher buttons)
function switchToTab(tab_name) {
    setCodeValue();
    updateTimelines();

    // switch tab buttons
    document.getElementsByClassName("tabSwitcher").forEach(e => {
        e.classList.remove("active");
    });
    document.getElementById(tab_name + "Button").classList.add("active");

    // switch tabs
    document.getElementsByClassName("tab").forEach(t => {
        t.classList.remove("active");
    });
    document.getElementById(tab_name).classList.add("active");

    activeTab = tab_name;
}