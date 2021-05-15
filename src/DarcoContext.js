import React from 'react';

export const Quality = {
    high: 0.7,
    low: 0.5
}

export const Theme = {
    grey: {
        name: 'slate',
        convert: 'invert(0.8) contrast(1.2) hue-rotate(135rad)',
        contrast: 1.2,
        invert: 0.8,
        hueRotate: 0.4,
    },
    classic: {
        name: 'classic',
        convert: 'invert(1) hue-rotate(125rad)',
        contrast: 1,
        invert: 1,
        hueRotate: 0.5,
    },
}

const defaultState = {
    pdf: null,
    step: 0,
    info: null,
    images: null,
    completion: 0,
    dimensions: [],
    options: {
        quality: Quality.high,
        theme: Theme.classic
    }
}
export const ReducerTypes = {
    Idle: 0,
    Ready: 1,
    Loading: 2,
    Download: 3,
    ImagesConverted: 'images',
    Progress: 'ratio',
    O_Quality: 'quality',
    O_Theme: 'theme',
    DocumentDimensions: 'dimensions'
}
function reducer(state, action) {
    let currOptions = state.options;
    switch (action.type) {
        case ReducerTypes.Idle:
            return { ...state, pdf: action.data, images: null }
        case ReducerTypes.Ready:
            return { ...state, info: action.data, step: ReducerTypes.Ready, completion: 0}
        case ReducerTypes.Loading:
            return { ...state, step: ReducerTypes.Loading}
        case ReducerTypes.ImagesConverted:
            return { ...state, images: action.images, step: ReducerTypes.Download }
        case ReducerTypes.DocumentDimensions:
            return { ...state, dimensions: action.data }
        case ReducerTypes.Progress:
            return { ...state, completion: (state.progress !== 1) ? action.data : 1 }
        case ReducerTypes.O_Quality:
            currOptions.quality = action.data
            return { ...state, options: currOptions }
        case ReducerTypes.O_Theme:
            currOptions.theme = action.data
            return { ...state, options: currOptions }
        default: {
            alert(`Tried doing ${action.type}`)
        }

    }
}

export const DarcoContext = React.createContext();
export const useDarco = () => {
    const context = React.useContext(DarcoContext)
    if (context === undefined)
        throw new Error('context must be used within a DarcoProvider')
    return context
}

const DarcoProvider = props => {
    const [state, dispatch] = React.useReducer(reducer, defaultState)
    const value = { state, dispatch }
    return (
        <DarcoContext.Provider value={value}>
            {props.children}
        </DarcoContext.Provider>
    );
}

export default DarcoProvider;
