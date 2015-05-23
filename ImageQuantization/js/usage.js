var APP;
(function (exports) {
	function typeOf (val) {
		return Object.prototype.toString.call(val).slice(8, -1);
	}

	function timeMark (title, callback) {
		var start = Date.now();
		callback();
		console.log(title + ": " + (Date.now() - start));
	}

	function baseName (src) {
		return src.split("/").pop().split(".");
	}

	function drawPixels (idxi8, width0, width1) {
		var idxi32 = new Uint32Array(idxi8.buffer);

		width1 = width1 || width0;

		var can  = document.createElement("canvas"),
			can2 = document.createElement("canvas"),
			ctx  = can.getContext("2d"),
			ctx2 = can2.getContext("2d");

		can.width = width0;
		can.height = Math.ceil(idxi32.length / width0);
		can2.width = width1;
		can2.height = Math.ceil(can.height * width1 / width0);

		ctx.imageSmoothingEnabled = ctx.mozImageSmoothingEnabled = ctx.webkitImageSmoothingEnabled = ctx.msImageSmoothingEnabled = false;
		ctx2.imageSmoothingEnabled = ctx2.mozImageSmoothingEnabled = ctx2.webkitImageSmoothingEnabled = ctx2.msImageSmoothingEnabled = false;

		var imgd = ctx.createImageData(can.width, can.height);

		if (typeOf(imgd.data) == "CanvasPixelArray") {
			var data = imgd.data;
			for (var i = 0, len = data.length; i < len; ++i) {
				data[i] = idxi8[i];
			}
		}
		else {
			var buf32 = new Uint32Array(imgd.data.buffer);
			buf32.set(idxi32);
		}

		ctx.putImageData(imgd, 0, 0);

		ctx2.drawImage(can, 0, 0, can2.width, can2.height);

		return can2;
	}

	exports.process = function (img, optionColors, optionInitialColors, optionPaletteQuantizer, optionImageDithering) {
		var pointBuffer,
			originalPointBuffer,
			paletteQuantizer,
			id = baseName(img.src)[0],
			pal8,
			img8;

		pointBuffer = new IQ.Utils.PointContainer();
		pointBuffer.importHTMLImageElement(img);
		originalPointBuffer = pointBuffer.clone();

		var time = Date.now();
		var colorHistogram = new IQ.Utils.ColorHistogram(2, optionColors << 2);

			timeMark("...sample", function () {
				if (optionPaletteQuantizer === "neuquant") {
					paletteQuantizer = new IQ.Palette.NeuQuant(optionInitialColors);
				} else {
					paletteQuantizer = new IQ.Palette.RgbQuant(optionInitialColors);
				}
				paletteQuantizer.sample(pointBuffer);
				colorHistogram.sample(pointBuffer);
			});

			timeMark("...palette", function () {
				pal8 = paletteQuantizer.quantize();
				pal8.reduce(colorHistogram, optionColors);
			});

			timeMark("...dither", function () {
				var imageQuantizer;
				if (optionImageDithering === -1) {
					imageQuantizer = new IQ.Image.NearestNeighbour();
				} else {
					imageQuantizer = new IQ.Image.ErrorDiffusionDithering(optionImageDithering);
				}

				img8 = imageQuantizer.quantize(pointBuffer, pal8).exportUint8Array();
			});

		time = Date.now() - time;

		// CLEANUP
		document.getElementById("palette-container").innerHTML = "";
		document.getElementById("reduced-image-container").innerHTML = "";

		// DRAW ORIGINAL IMAGE

		var canvas = drawPixels(originalPointBuffer.exportUint8Array(), img.naturalWidth);
		canvas.id = "original-image";
		canvas.style.display = "none";
		document.getElementById("reduced-image-container").appendChild(canvas);

		// DRAW REDUCED/DITHERED IMAGE
		canvas = drawPixels(img8, img.naturalWidth);
		canvas.id = "reduced-image";
		document.getElementById("reduced-image-container").appendChild(canvas);

		var ssim = new IQ.Quality.SSIM().compare(originalPointBuffer, pointBuffer);
		document.getElementById("reduced-title-ssim").innerHTML = " (SSIM: " + ssim.toFixed(2) + ", Time: " + time + " )";

		// DRAW PALETTE

		// TODO: temporary solution. see Palette class todo
		var uint32Array = pal8._paletteArray.map(function (point) {
			return point.uint32
		});
		var uint8array = new Uint8Array((new Uint32Array(uint32Array)).buffer);

		canvas = drawPixels(uint8array, 16, 128);
		document.getElementById("palette-container").appendChild(canvas);

	};
})(APP = APP || {});
