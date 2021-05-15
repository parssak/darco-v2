import styled from 'styled-components';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { ReducerTypes, useDarco } from '../DarcoContext';
import { useEffect, useRef, useState } from 'react';
import invertImage from '../helpers/invertImage';
import LoadingModal from './LoadingModal'
import PDFBuilder from './PDFBuilder';


const Preview = styled.div`
    grid-area: preview;
    display: flex;
    justify-content: center;
    position: relative;
`
const options = {
    cMapUrl: 'cmaps/',
    cMapPacked: true,
};

let isConverting = false;
let children = []
let images = []
let texts = []

const PreviewPanel = ({ width, height }) => {
    const { state, dispatch } = useDarco();
    const [numPages, setNumPages] = useState(0);
    const [completedImages, setCompletedImages] = useState([]);

    const docRef = useRef(null);

    function onDocumentLoadSuccess(pdf) {
        setNumPages(pdf._pdfInfo.numPages);
        dispatch({ type: ReducerTypes.Ready, data: pdf._pdfInfo })
    }

    useEffect(() => {
        if (state.step <= ReducerTypes.Ready && completedImages.length > 0) {
            setCompletedImages([])
            children = []
            images = []
            isConverting = false;
        }
    }, [completedImages, state]);

    if (state.pdf === null)
        return null

    const storeCanvasRef = (canvasEl, index) => children[index] = canvasEl
    
    const buildPDF = async () => {
        isConverting = true;
        await PDFBuilder(images, state);
        dispatch({ type: ReducerTypes.ImagesConverted, images: images });
    }
    
    const handleConvert = () => {
        let numActualImages = 0;
        images.forEach(e => {
            let stringLength = e.length - 'data:image/jpeg;base64,'.length;
            let sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
            if (sizeInBytes > 1000) numActualImages++;
        })
        if (numActualImages === state.info.numPages && !isConverting) {
            buildPDF()
        }
    }

    const getDataURL = async e => {
        const index = e._pageIndex;
        invertImage(children[index]?.toDataURL(), children[index], state.options.theme, state.options.quality).then(
            e => {
                images[index] = e;
                if (images.length === numPages) 
                    handleConvert();
            }
        )
    }
    return (
        <Preview>
            <Document
                className={'pdf'}
                file={state.pdf}
                onLoadSuccess={onDocumentLoadSuccess}
                options={options}
                inputRef={docRef}
            >
                {
                    width < 1000 ?
                        <Page
                            key={`page_${0}`}
                            pageNumber={0 + 1}
                            width={width / 2}
                            className={[state.options.theme, 'page']}
                            onLoadSuccess={e => dispatch({ type: ReducerTypes.DocumentDimensions, data: [e.originalWidth, e.originalHeight] })}
                            renderAnnotationLayer={false}
                        />
                        :
                        <Page
                            key={`page_${0}`}
                            pageNumber={0 + 1}
                            height={height}
                            className={[state.options.theme, 'page']}
                            onLoadSuccess={e => dispatch({ type: ReducerTypes.DocumentDimensions, data: [e.originalWidth, e.originalHeight] })}
                            renderAnnotationLayer={false}
                        />
                }
                {
                    state.step === ReducerTypes.Loading &&
                    Array.from(
                        new Array(numPages),
                        (_, index) => (
                            <Page
                                key={`page_${index + 1}`}
                                width={state.dimensions[0]}
                                height={state.dimensions[1]}
                                scale={2}
                                pageNumber={index + 1}
                                onGetTextSuccess={e => texts[index] = e}
                                className={['hidden']}
                                canvasRef={e => storeCanvasRef(e, index)}
                                onRenderSuccess={e => getDataURL(e)}

                            />
                        ),
                    )
                }
            </Document>
            {((state.step === ReducerTypes.Loading && width < 1000)) &&
                <LoadingModal />
            }
        </Preview>
    );
}

export default PreviewPanel;
