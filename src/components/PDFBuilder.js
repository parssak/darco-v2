import jsPDF from 'jspdf';
/**
 *  Takes all of the inverted images and returns them back into a pdf
 * @param imageArray: array of inverted images
 * @param orientation: 'p' for portrait, 'l' for landscape
 */
export default async function PDFBuilder(imageArray, data) {
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

        if (window.webkit) {
            window.webkit.messageHandlers.getDocumentName.postMessage(documentName.concat(".pdf"))
        }

        let fileReader = new FileReader()
        let base64;
        let blobPDF = new Blob([doc.output('blob')], { type: 'application/pdf' });
        fileReader.readAsDataURL(blobPDF);
        fileReader.onload = function (fileLoadedEvent) {
            base64 = fileLoadedEvent.target.result;
            resolve(base64);
            if (!window.webkit)
                doc.save(documentName.concat(".pdf"));
        }

    });
}