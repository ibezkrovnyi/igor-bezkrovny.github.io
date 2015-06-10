declare module IQ.Color {
    interface IDistanceCalculator {
        setMaximalColorDeltas(maxRedDelta: number, maxGreenDelta: number, maxBlueDelta: number, maxAlphaDelta: number): void;
        calculateRaw(r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number): number;
        calculateNormalized(colorA: Utils.Point, colorB: Utils.Point): number;
    }
}
declare module IQ.Color.Constants.sRGB {
    enum Y {
        RED = 0.2126,
        GREEN = 0.7152,
        BLUE = 0.0722,
        WHITE = 1,
    }
    enum x {
        RED = 0.64,
        GREEN = 0.3,
        BLUE = 0.15,
        WHITE = 0.3127,
    }
    enum y {
        RED = 0.33,
        GREEN = 0.6,
        BLUE = 0.06,
        WHITE = 0.329,
    }
}
declare module IQ.Color {
    class Conversion {
        static rgb2lab(r: number, g: number, b: number): {
            L: number;
            a: number;
            b: number;
        };
        static lab2rgb(L: number, a: number, b: number): {
            r: number;
            g: number;
            b: number;
        };
        static rgb2xyz(r: number, g: number, b: number): {
            x: number;
            y: number;
            z: number;
        };
        static xyz2rgb(x: number, y: number, z: number): {
            r: number;
            g: number;
            b: number;
        };
        private static _refX;
        private static _refY;
        private static _refZ;
        static xyz2lab(x: number, y: number, z: number): {
            L: number;
            a: number;
            b: number;
        };
        static lab2xyz(L: number, a: number, b: number): {
            x: number;
            y: number;
            z: number;
        };
        static rgb2lum(r: number, g: number, b: number): number;
        static rgb2hsl(r: number, g: number, b: number): {
            h: any;
            s: any;
            l: number;
        };
    }
}
declare module IQ.Color {
    class DistanceEuclidean implements IDistanceCalculator {
        protected _Pr: number;
        protected _Pg: number;
        protected _Pb: number;
        protected _Pa: number;
        protected _maxEuclideanDistance: number;
        constructor();
        protected _setDefaults(): void;
        calculateRaw(r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number): number;
        calculateNormalized(colorA: Utils.Point, colorB: Utils.Point): number;
        /**
         * To simulate original RgbQuant distance you need to set `maxAlphaDelta = 0`
         */
        setMaximalColorDeltas(maxRedDelta: number, maxGreenDelta: number, maxBlueDelta: number, maxAlphaDelta: number): void;
    }
    class DistanceEuclideanWuQuant extends DistanceEuclidean implements IDistanceCalculator {
        protected _setDefaults(): void;
    }
    class DistanceEuclideanRgbQuantWOAlpha extends DistanceEuclidean implements IDistanceCalculator {
        protected _setDefaults(): void;
    }
    class DistanceManhattan implements IDistanceCalculator {
        protected _Pr: number;
        protected _Pg: number;
        protected _Pb: number;
        protected _Pa: number;
        protected _maxManhattanDistance: number;
        constructor();
        protected _setDefaults(): void;
        setMaximalColorDeltas(maxRedDelta: number, maxGreenDelta: number, maxBlueDelta: number, maxAlphaDelta: number): void;
        calculateRaw(r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number): number;
        calculateNormalized(colorA: Utils.Point, colorB: Utils.Point): number;
    }
    class DistanceManhattanNeuQuant extends DistanceManhattan implements IDistanceCalculator {
        protected _setDefaults(): void;
    }
    class DistanceCIEDE2000 implements IDistanceCalculator {
        setMaximalColorDeltas(maxRedDelta: number, maxGreenDelta: number, maxBlueDelta: number, maxAlphaDelta: number): void;
        calculateRaw(r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number): number;
        calculateRawInLab(Lab1: {
            L: number;
            a: number;
            b: number;
        }, alpha1: number, Lab2: {
            L: number;
            a: number;
            b: number;
        }, alpha2: number): number;
        calculateNormalized(colorA: Utils.Point, colorB: Utils.Point): number;
        private _degrees(n);
        private _radians(n);
        private _hp_f(x, y);
        private _a_hp_f(C1, C2, h1p, h2p);
        private _dhp_f(C1, C2, h1p, h2p);
    }
}
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
        Lab: {
            L: number;
            a: number;
            b: number;
        };
        static createByQuadruplet(quadruplet: number[]): Point;
        static createByRGBA(red: number, green: number, blue: number, alpha: number): Point;
        static createByUint32(uint32: number): Point;
        constructor();
        from(point: Point): void;
        getLuminosity(useAlphaChannel: any): number;
        private _loadUINT32();
        private _loadRGBA();
        private _loadQuadruplet();
    }
}
declare module IQ.Utils {
    function typeOf(val: any): any;
    function rgb2lum(r: any, g: any, b: any): number;
    function max3(a: any, b: any, c: any): any;
    function min3(a: any, b: any, c: any): any;
    function intInRange(value: any, low: any, high: any): number;
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
        private _iterateBox(bbox, wid, fn);
    }
}
declare module IQ.Utils {
    class Palette {
        private _pointContainer;
        private _pointArray;
        private _i32idx;
        constructor();
        add(color: Point): void;
        getNearestColor(colorDistanceCalculator: Color.IDistanceCalculator, color: Point): Point;
        getPointContainer(): PointContainer;
        private _nearestPointFromCache(key);
        private getNearestIndex(colorDistanceCalculator, point);
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
        toUint32Array(): Uint32Array;
        toUint8Array(): Uint8Array;
        static fromHTMLImageElement(img: HTMLImageElement): PointContainer;
        static fromHTMLCanvasElement(canvas: HTMLCanvasElement): PointContainer;
        static fromNodeCanvas(canvas: any): PointContainer;
        static fromImageData(imageData: ImageData): PointContainer;
        static fromArray(data: number[], width: number, height: number): PointContainer;
        static fromCanvasPixelArray(data: any, width: number, height: number): PointContainer;
        static fromUint32Array(uint32array: Uint32Array, width: number, height: number): PointContainer;
    }
}
declare module IQ.Image {
    interface IImageDitherer {
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
    class ErrorDiffusionDithering implements IImageDitherer {
        private _minColorDistance;
        private _serpentine;
        private _kernel;
        private _calculateErrorLikeGIMP;
        private _distance;
        constructor(colorDistanceCalculator: Color.IDistanceCalculator, kernel: ErrorDiffusionDitheringKernel, serpentine?: boolean, minimumColorDistanceToDither?: number, calculateErrorLikeGIMP?: boolean);
        quantize(pointBuffer: Utils.PointContainer, palette: Utils.Palette): Utils.PointContainer;
        private _fillErrorLine(errorLine, width);
        private _setKernel(kernel);
    }
}
declare module IQ.Image {
    class NearestNeighbour implements IImageDitherer {
        private _distance;
        constructor(colorDistanceCalculator: Color.IDistanceCalculator);
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
        private _networkSize;
        private _network;
        /** sampling factor 1..30 */
        private _sampleFactor;
        private _radPower;
        private _freq;
        private _bias;
        private _distance;
        constructor(colorDistanceCalculator: Color.IDistanceCalculator, colors?: number);
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
         *    finds closest neuron (min dist) and updates freq
         *    finds best neuron (min dist-bias) and returns position
         *    for frequently chosen neurons, freq[i] is high and bias[i] is negative
         *    bias[i] = gamma*((1/this._networkSize)-freq[i])
         *
         * Original distance formula:
         * 		dist = n.b - b;
         * 		if (dist < 0) dist = -dist;
         * 		a = n.g - g;
         * 		if (a < 0) a = -a;
         * 		dist += a;
         * 		a = n.r - r;
         * 		if (a < 0) a = -a;
         * 		dist += a;
         * 		a = (n.a - al);
         * 		if (a < 0) a = -a;
         * 		dist += a;
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
        private _distance;
        constructor(colorDistanceCalculator: Color.IDistanceCalculator, colors?: number, method?: number);
        sample(image: Utils.PointContainer): void;
        quantize(): Utils.Palette;
        private _buildPalette(idxi32);
    }
}
declare module IQ.Palette {
    class WuColorCube {
        redMinimum: any;
        redMaximum: any;
        greenMinimum: any;
        greenMaximum: any;
        blueMinimum: any;
        blueMaximum: any;
        volume: any;
        alphaMinimum: any;
        alphaMaximum: any;
    }
    class WuQuant {
        private static alpha;
        private static red;
        private static green;
        private static blue;
        private _reds;
        private _greens;
        private _blues;
        private _alphas;
        private _sums;
        private _weights;
        private _momentsRed;
        private _momentsGreen;
        private _momentsBlue;
        private _momentsAlpha;
        private _moments;
        private _table;
        private _pixels;
        private _cubes;
        private _colors;
        private _significantBitsPerChannel;
        private _maxSideIndex;
        private _alphaMaxSideIndex;
        private _sideSize;
        private _alphaSideSize;
        private _distance;
        constructor(colorDistanceCalculator: Color.IDistanceCalculator, colors?: number, significantBitsPerChannel?: number);
        sample(image: Utils.PointContainer): void;
        quantize(): Utils.Palette;
        private _preparePalette();
        private _addColor(color);
        /**
         * Converts the histogram to a series of _moments.
         */
        private _calculateMoments();
        /**
         * Computes the volume of the cube in a specific moment.
         */
        private static _volumeFloat(cube, moment);
        /**
         * Computes the volume of the cube in a specific moment.
         */
        private static _volume(cube, moment);
        /**
         * Splits the cube in given position][and color direction.
         */
        private static _top(cube, direction, position, moment);
        /**
         * Splits the cube in a given color direction at its minimum.
         */
        private static _bottom(cube, direction, moment);
        /**
         * Calculates statistical variance for a given cube.
         */
        private _calculateVariance(cube);
        /**
         * Finds the optimal (maximal) position for the cut.
         */
        private _maximize(cube, direction, first, last, wholeRed, wholeGreen, wholeBlue, wholeAlpha, wholeWeight);
        private _cut(first, second);
        private _initialize(colors);
        private _setQuality(significantBitsPerChannel?);
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
