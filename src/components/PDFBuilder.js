import jsPDF from 'jspdf';

const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    console.log('converting to blob')
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        // @ts-ignore
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    console.log('returning blob')
    return blob;
}

/**
 *  Takes all of the inverted images and returns them back into a pdf
 * @param imageArray: array of inverted images
 * @param orientation: 'p' for portrait, 'l' for landscape
 */
export default async function PDFBuilder(imageArray, data) {
    // console.log("entered pdf builder", data.name)
    const orientation = data.dimensions[0] < data.dimensions[1] ? 'p' : 'l';
    return new Promise(resolve => {
        let doc = new jsPDF(orientation, 'px', [data.dimensions[0], data.dimensions[1]], true);
        for (let i = 0; i < imageArray.length - 1; i++) {
            doc.addPage();
        }
        for (let i = 0; i < imageArray.length; i++) {
            doc.setPage(i + 1);
            const imgData = imageArray[i];
            if (imgData)
                doc.addImage(imgData, 0, 0, data.dimensions[0], data.dimensions[1], `page ${i+1}`);
        }
        let documentName = data.pdf.name;

        // if (window.webkit) {
        //     window.webkit.messageHandlers.getDocumentName.postMessage(documentName.concat(".pdf"))
        // }
        console.log('initializing file reader')
        let fileReader = new FileReader()
        let base64;
        let blobPDF = new Blob([doc.output('blob')], { type: 'application/pdf' });
        console.log('converted to blob')
        fileReader.readAsDataURL(blobPDF);
        console.log('about to onload')
        fileReader.onload = function (fileLoadedEvent) {
            base64 = fileLoadedEvent.target.result;
            console.log('resolving')
            resolve(base64);
            console.log('made it past the resolve')
            if (!window.webkit)
                doc.save(documentName.concat(".pdf"));
            else {
                console.log('is in webkit')
                const blob = b64toBlob(base64, "application/pdf");
                const blobUrl = URL.createObjectURL(blob);
                console.log('blob url', blobUrl);
                window.webkit.messageHandlers.sendPDFBlob.postMessage({ data: blobUrl.substr(0, blobUrl.length - 10), name: "Bob" })

            }
        }

    });
}