var APP;
(function(exports) {
	exports.main = function() {
		var imagesDiv = document.getElementById("images")
		for(var category in exports.images) {
			if(exports.images.hasOwnProperty(category)) {
				var url = "img/" + category + "/",
					categoryDiv = document.createElement("div");

				categoryDiv.className = "imageBox";
				imagesDiv.appendChild(categoryDiv);

				var title = document.createElement("h4");
				title.innerHTML = category;
				categoryDiv.appendChild(title);

				var imagesInCategory = exports.images[category];
				imagesInCategory.forEach(function(image) {
					var img = document.createElement("img");
					img.src = url + image;
					img.className = "th";
					categoryDiv.appendChild(img);
				});
			}
		}
	};

	var config = {}, currentImage;

	exports.onClick = function(e) {
		var target = (e || window.event).target;
		if(target && target.className === "th") {
			if(currentImage !== target) {
				currentImage = target;
				exports.process(currentImage, config.colors, config.paletteQuantizer, config.imageDithering);
			}
		}
	};
	exports.onMouse = function(isDown, e) {
		var e = e || window.event,
			x = e.pageX, y = e.pageY;

		var div = document.getElementById("reduced-image-container");
		if(x >= div.offsetLeft && x < div.offsetLeft + div.offsetWidth && y >= div.offsetTop && y < div.offsetTop + div.offsetHeight || !isDown) {
			var original = document.getElementById("original-image");
			var reduced = document.getElementById("reduced-image");

			if(original) original.style.display = isDown ? "block" : "none";
			if(reduced) reduced.style.display = !isDown ?  "block" : "none";
			document.getElementById("reduced-title").innerHTML = isDown ? "Original Image" : "Reduced Image"
		}
	};

	var lastChangeTime = null;
	exports.onConfigChanged = function() {
		lastChangeTime = Date.now();
	};

	setInterval(function() {
		if(!currentImage) {
			var e = document.getElementsByClassName("th");
			if(e.length > 0 && typeof e[0].naturalWidth === "number" && e[0].naturalWidth > 0) {
				currentImage = e[0];
				lastChangeTime = 0;
			}
		}
		if(JSON.stringify(config) !== JSON.stringify(getConfig()) && lastChangeTime !== null && Date.now() > lastChangeTime + 500) {
			if(currentImage) {
				lastChangeTime = null;
				config = getConfig();
				exports.process(currentImage, config.colors, config.paletteQuantizer, config.imageDithering);
			}
		}
	}, 50);

	exports.onColorSliderChange = function() {
		var slider = document.getElementById("colors-slider"),
			colors = parseInt(slider.value, 10);

		if(config.colors !== colors) {
			document.getElementById("colors").value = colors;

			config = getConfig();
			exports.process(currentImage, config.colors, config.initialColors, config.paletteQuantizer, config.imageDithering);
		}
	};

	function getConfig() {
		var optionColors = document.getElementById("colors");
		var optionPaletteQuantizer = document.getElementById("paletteQuantizer");
		var optionImageDithering = document.getElementById("imageDithering");

		if(!optionColors || !optionImageDithering || !optionPaletteQuantizer) return {};

		return {
			colors : parseInt(optionColors.value, 10),
			paletteQuantizer : optionPaletteQuantizer.value,
			imageDithering : parseInt(optionImageDithering.value, 10)
		}
	}

})(APP = APP || {});
