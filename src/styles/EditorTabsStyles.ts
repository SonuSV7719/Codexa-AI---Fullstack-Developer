import { TabPanelPassThroughOptions, TabViewPassThroughOptions } from "primereact/tabview"

const tabViewStyles: TabViewPassThroughOptions = {
    nav: {
        className: " flex bg-bg-primary text-font-primary w-fit justify-between rounded-3xl"
    },
    inkbar: {
        className: "hidden"
    },

}

const tabPanelStyles: TabPanelPassThroughOptions = {
    header: {
        className: " px-2 py-1 rounded-xl"
    },

}

export { tabViewStyles, tabPanelStyles }