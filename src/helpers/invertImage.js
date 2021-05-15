// Contrast amount
    //  2   === Classic
    //  1.2 === Space Grey

import { Theme } from "../DarcoContext";

export default async function invertImage(imageURL, canvas, theme, quality = 0.7) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.crossOrigin = "";
        img.onload = draw;
        img.src = imageURL;

        /**
         *  Draws image onto canvas and inverts the image data.
         *  Had to manually input the invert and hue rotate here
         *  because webkit does not support canvas draw filters.
         */
        function draw() {
            const themeSettings = Theme[theme];
            const contrastAmount = themeSettings.contrast;
            const rotateAmount = themeSettings.hueRotate;
            const invertAmount = themeSettings.invert;

            let ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                data[i + 2] = Math.abs(data[i + 2] - 255 * invertAmount);
                data[i + 0] = Math.abs(data[i + 0] - 255 * invertAmount);
                data[i + 1] = Math.abs(data[i + 1] - 255 * invertAmount);
            }
            const { length } = data;
            for (let i = 0; i < length; i += 4) {
                data[i + 0] = ((((data[i + 0] / 255) - .5) * contrastAmount) + .5) * 255;
                data[i + 1] = ((((data[i + 1] / 255) - .5) * contrastAmount) + .5) * 255;
                data[i + 2] = ((((data[i + 2] / 255) - .5) * contrastAmount) + .5) * 255;
            }
            
            const h = (rotateAmount % 1 + 1) % 1; // wraps the angle to unit interval, even when negative
            const th = h * 3;
            const thr = Math.floor(th);
            const d = th - thr;
            const b = 1 - d;
            let ma, mb, mc;
            let md, me, mf;
            let mg, mh, mi;

            switch (thr) {
                case 0:
                    ma = b;
                    mb = 0;
                    mc = d;
                    md = d;
                    me = b;
                    mf = 0;
                    mg = 0;
                    mh = d;
                    mi = b;
                    break;
                case 1:
                    ma = 0;
                    mb = d;
                    mc = b;
                    md = b;
                    me = 0;
                    mf = d;
                    mg = d;
                    mh = b;
                    mi = 0;
                    break;
                case 2:
                    ma = d;
                    mb = b;
                    mc = 0;
                    md = 0;
                    me = d;
                    mf = b;
                    mg = b;
                    mh = 0;
                    mi = d;
                    break;
                default:
                    break;
            }

            let place = 0;
            for (let y = 0; y < canvas.height; ++y) {
                for (let x = 0; x < canvas.width; ++x) {
                    place = 4 * (y * canvas.width + x);
                    const ir = data[place + 0];
                    const ig = data[place + 1];
                    const ib = data[place + 2];
                    data[place + 0] = Math.floor(ma * ir + mb * ig + mc * ib);
                    data[place + 1] = Math.floor(md * ir + me * ig + mf * ib);
                    data[place + 2] = Math.floor(mg * ir + mh * ig + mi * ib);
                }
            }
           
            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', quality));
        }
    })
}