module UI {
	export var configForm = {
		view : "form", id : "myform", width : 300, elements : [
			{
				view : "richselect",
				id : "option-colors",
				label : "Colors",
				labelWidth : 175,
				value : "256",
				options : [
					"2",
					"4",
					"16",
					"64",
					"128",
					"256",
					"512",
					"1024",
					"2048",
					"8192"
				]
			},
			{
				view : "richselect",
				id : "option-distance",
				label : "Color Distance Equation",
				labelWidth : 175,
				value : "6",
				options : [
					{id : 1, value : "Euclidean"},
					{id : 2, value : "Manhattan"},
					{id : 3, value : "CIEDE2000"},
					{id : 4, value : "CIE94"},
					{id : 5, value : "RgbQuant Euclidean (w/o ALPHA)"},
					{id : 6, value : "NeuQuant Manhattan (w/o sRGB coef)"},
					{id : 7, value : "WuQuant Euclidean (w/o sRGB coef)"},
					{id : 8, value : "CMETRIC"},
					{id : 9, value : "PNGQUANT"}
				]
			},
			{
				view : "richselect",
				id : "option-palette",
				label : "Quantization Method",
				labelWidth : 175,
				value : "1",
				options : [
					{id : 1, value : "neuquant (Original, Integer)"},
					{id : 2, value : "rgbquant"},
					{id : 3, value : "wuquant"},
                    {id : 4, value : "neuquant (Floating Point)"}
				]
			},
			{
				view : "richselect",
				id : "option-image",
				label : "Palette-to-Image Method",
				labelWidth : 175,
				value : "1",
				options : [
					{id : 1, value : "Nearest (Simple)"},
					{id : 2, value : "ErrorDiffusion: Array (Floyd-Steinberg)"},
					{id : 4, value : "ErrorDiffusion: Array (Stucki)"},
					{id : 5, value : "ErrorDiffusion: Array (Atkinson)"},
					{id : 6, value : "ErrorDiffusion: Array (Jarvis)"},
					{id : 7, value : "ErrorDiffusion: Array (Burkes)"},
					{id : 8, value : "ErrorDiffusion: Array (Sierra)"},
					{id : 9, value : "ErrorDiffusion: Array (TwoSierra)"},
					{id : 10, value: "ErrorDiffusion: Array (SierraLite)"},
					{id : 3, value : "ErrorDiffusion: Array (False Floyd-Steinberg)"},
					{id : 11, value : "ErrorDiffusion: Riemersma (Hilbert Curve)"}
				]
			},
			{
				type : "line",
				view : "toolbar",
				elements : [{}, {view : "button", value : "Update", width : 90, on : {onItemClick : () => {
					Controller.update(true)
				}}}]
			}

		]
	};
}
