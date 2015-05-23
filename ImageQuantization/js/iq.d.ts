declare module IQ.Utils {
    /**
     * v8 optimized class
     * 1) "constructor" should have initialization with worst types
     * 2) "set" should have |0 / >>> 0
     */
    class Point {
        private static _RED_COEFFICIENT;
        private static _GREEN_COEFFICIENT;
        private static _BLUE_COEFFICIENT;
        r: number;
        g: number;
        b: number;
        a: number;
        uint32: number;
        rgba: number[];
        lab: {
            l: number;
            a: number;
            b: number;
        };
        static createByQuadruplet(quadruplet: number[]): Point;
        static createByRGBA(red: number, green: number, blue: number, alpha: number): Point;
        static createByUint32(uint32: number): Point;
        constructor();
        from(point: Point): void;
        set(...args: number[]): void;
        getLuminosity(useAlphaChannel: any): number;
        private _loadUINT32();
        private _loadRGBA();
        private _loadQuadruplet();
    }
}
declare module IQ.Utils {
    function typeOf(val: any): any;
    function rgb2lum(r: any, g: any, b: any): number;
    function rgb2hsl(r: any, g: any, b: any): {
        h: any;
        s: any;
        l: number;
    };
    function hueGroup(hue: any, segs: any): number;
    function satGroup(sat: any): any;
    function lumGroup(lum: any): any;
    var sort: typeof stableSort;
    function stableSort(fn: any): any;
    function makeBoxes(wid: any, hgt: any, w0: any, h0: any): any[];
    function sortedHashKeys(obj: any, desc: any): any;
    function distEuclidean(colorA: Point, colorB: Point): number;
    function rgb2xyz(r: number, g: number, b: number): {
        x: number;
        y: number;
        z: number;
    };
    function xyz2lab(x: number, y: number, z: number): {
        l: number;
        a: number;
        b: number;
    };
    function CIE94Distance(colorA: Point, colorB: Point): number;
}
declare module IQ.Utils {
    class HueStatistics {
        private _numGroups;
        private _minCols;
        private _stats;
        private _groupsFull;
        constructor(numGroups: number, minCols: number);
        check(i32: any): void;
        inject(histG: any): void;
    }
}
declare module IQ.Utils {
    class ColorHistogram {
        private static _boxSize;
        private static _boxPixels;
        private static _hueGroups;
        private _method;
        private _hueStats;
        private _histogram;
        private _initColors;
        private _minHueCols;
        constructor(method: number, colors: number);
        sample(pointBuffer: PointContainer): void;
        getImportanceSortedColorsIDXI32(): any;
        private _colorStats1D(pointBuffer);
        private _colorStats2D(pointBuffer);
        private _iterBox(bbox, wid, fn);
    }
}
declare module IQ.Utils {
    class Palette {
        private _pointContainer;
        private _pointArray;
        private _i32idx;
        constructor();
        add(color: Point): void;
        getNearestColor(color: Point): Point;
        getPointContainer(): PointContainer;
        private _nearestPointFromCache(key);
        private getNearestIndex(point);
        sort(): void;
    }
}
declare module IQ.Utils {
    class PointContainer {
        private _pointArray;
        private _width;
        private _height;
        constructor();
        getWidth(): number;
        getHeight(): number;
        setWidth(width: number): void;
        setHeight(height: number): void;
        getPointArray(): Point[];
        clone(): PointContainer;
        importHTMLImageElement(img: HTMLImageElement): void;
        importHTMLCanvasElement(canvas: HTMLCanvasElement): void;
        importNodeCanvas(canvas: any): void;
        importImageData(imageData: ImageData): void;
        importArray(data: number[], width: number, height: number): void;
        importCanvasPixelArray(data: any, width: number, height: number): void;
        importUint32Array(uint32array: Uint32Array, width: number, height: number): void;
        exportUint32Array(): Uint32Array;
        exportUint8Array(): Uint8Array;
    }
}
declare module IQ.Image {
    interface IImageQuantizer {
        quantize(pointBuffer: Utils.PointContainer, palette: Utils.Palette): Utils.PointContainer;
    }
}
declare module IQ.Image {
    enum ErrorDiffusionDitheringKernel {
        FloydSteinberg = 0,
        FalseFloydSteinberg = 1,
        Stucki = 2,
        Atkinson = 3,
        Jarvis = 4,
        Burkes = 5,
        Sierra = 6,
        TwoSierra = 7,
        SierraLite = 8,
    }
    class ErrorDiffusionDithering implements IImageQuantizer {
        private _minColorDistance;
        private _serpentine;
        private _kernel;
        private _calculateErrorLikeGIMP;
        constructor(kernel: ErrorDiffusionDitheringKernel, serpentine?: boolean, minimumColorDistanceToDither?: number, calculateErrorLikeGIMP?: boolean);
        quantize(pointBuffer: Utils.PointContainer, palette: Utils.Palette): Utils.PointContainer;
        private _fillErrorLine(errorLine, width);
        private _setKernel(kernel);
    }
}
declare module IQ.Image {
    class NearestNeighbour implements IImageQuantizer {
        quantize(pointBuffer: Utils.PointContainer, palette: Utils.Palette): Utils.PointContainer;
    }
}
declare module IQ {
    interface IPaletteQuantizer {
        sample(pointBuffer: Utils.PointContainer): void;
        quantize(): Utils.Palette;
    }
}
/**
 * @preserve TypeScript port:
 * Copyright (c) 2015, Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * neuquant.ts - part of color quantization collection
 */
declare module IQ.Palette {
    class NeuQuant implements IPaletteQuantizer {
        private _pointArray;
        private _netsize;
        private _network;
        private _samplefac;
        private _radpower;
        private _freq;
        private _bias;
        /**
         *
         * @param colors
         * @param sampleFactor sampling factor 1..30
         */
        constructor(colors?: number, sampleFactor?: number);
        sample(pointBuffer: Utils.PointContainer): void;
        quantize(): Utils.Palette;
        private _init();
        /**
         * Main Learning Loop
         */
        private _learn();
        /**
         * Insertion sort of network and building of netindex[0..255] (to do after unbias)
         */
        private _inxbuild();
        private _buildPalette();
        /**
         * Unbias network to give byte values 0..255 and record position i to prepare for sort
         */
        private _unbiasnet();
        /**
         * Move adjacent neurons by precomputed alpha*(1-((i-j)^2/[r]^2)) in radpower[|i-j|]
         */
        private _alterneigh(rad, i, b, g, r, al);
        /**
         * Move neuron i towards biased (b,g,r) by factor alpha
         */
        private _altersingle(alpha, i, b, g, r, a);
        /**
         * Search for biased BGR values
         * description:
         *	finds closest neuron (min dist) and updates freq
         *	finds best neuron (min dist-bias) and returns position
         *	for frequently chosen neurons, freq[i] is high and bias[i] is negative
         *	bias[i] = gamma*((1/this._netsize)-freq[i])
         */
        private _contest(b, g, r, al);
    }
}
/**
 * @preserve TypeScript port:
 * Copyright (c) 2015, Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * rgbquant.ts - part of color quantization collection
 */
declare module IQ.Palette {
    class RgbQuant implements IPaletteQuantizer {
        private _colors;
        private _initialDistance;
        private _distanceIncrement;
        private _histogram;
        constructor(colors?: number, method?: number);
        sample(image: Utils.PointContainer): void;
        quantize(): Utils.Palette;
        private _buildPalette(idxi32);
    }
}
declare module IQ.Palette {
    class WuColorCube {
        RedMinimum: any;
        RedMaximum: any;
        GreenMinimum: any;
        GreenMaximum: any;
        BlueMinimum: any;
        BlueMaximum: any;
        Volume: any;
    }
}
declare module IQ.Palette {
    class WuQuant {
        private static MaxColor;
        private static Red;
        private static Green;
        private static Blue;
        private static SideSize;
        private static MaxSideIndex;
        private static MaxVolume;
        private reds;
        private greens;
        private blues;
        private sums;
        private indices;
        private weights;
        private momentsRed;
        private momentsGreen;
        private momentsBlue;
        private moments;
        private tag;
        private quantizedPixels;
        private table;
        private pixels;
        private _cubes;
        private _colors;
        constructor(colors?: number);
        private CalculateMoments();
        private static Volume(cube, moment);
        private static VolumeFloat(cube, moment);
        private static Top(cube, direction, position, moment);
        private static Bottom(cube, direction, moment);
        private CalculateVariance(cube);
        private Maximize(cube, direction, first, last, cut, wholeRed, wholeGreen, wholeBlue, wholeWeight);
        private Cut(first, second);
        private static Mark(cube, label, tag);
        sample(image: Utils.PointContainer): void;
        private addColor(color);
        quantize(): Utils.Palette;
    }
}
declare module IQ.Quality {
    class SSIM {
        compare(image1: Utils.PointContainer, image2: Utils.PointContainer): number;
        private _iterate(image1, image2, callback);
        private _calculateLumaValuesForWindow(image, x, y, width, height);
        private _calculateAverageLuma(lumaValues);
    }
}
