/// <reference path="../lib/webix/webix.d.ts" />
/**
 * @preserve
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * common.ts - part of Image Quantization Library
 */
declare module IQ.Color {
    interface IDistanceCalculator {
        setWhitePoint(maxRedDelta: number, maxGreenDelta: number, maxBlueDelta: number, maxAlphaDelta: number): void;
        calculateRaw(r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number): number;
        calculateNormalized(colorA: Utils.Point, colorB: Utils.Point): number;
    }
}
/**
 * @preserve
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * constants.ts - part of Image Quantization Library
 */
declare module IQ.Constants.sRGB {
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
/**
 * @preserve
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * conversion.ts - part of Image Quantization Library
 */
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
        private static _xyz2lab_helper(value);
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
declare module IQ {
    class Arithmetic {
        static degrees2radians(n: number): number;
    }
}
/**
 * @preserve
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * distance.ts - part of Image Quantization Library
 */
declare module IQ.Color {
    class Euclidean implements IDistanceCalculator {
        protected _Pr: number;
        protected _Pg: number;
        protected _Pb: number;
        protected _Pa: number;
        protected _maxEuclideanDistance: number;
        constructor();
        /**
         * To simulate original RgbQuant distance use `r=255,g=255,b=255,a=0`
         */
        setWhitePoint(r: number, g: number, b: number, a: number): void;
        calculateRaw(r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number): number;
        calculateNormalized(colorA: Utils.Point, colorB: Utils.Point): number;
        protected _setDefaults(): void;
    }
    class EuclideanWuQuant extends Euclidean implements IDistanceCalculator {
        protected _setDefaults(): void;
    }
    class EuclideanRgbQuantWOAlpha extends Euclidean implements IDistanceCalculator {
        protected _setDefaults(): void;
    }
    class Manhattan implements IDistanceCalculator {
        protected _Pr: number;
        protected _Pg: number;
        protected _Pb: number;
        protected _Pa: number;
        protected _maxManhattanDistance: number;
        constructor();
        setWhitePoint(r: number, g: number, b: number, a: number): void;
        calculateNormalized(colorA: Utils.Point, colorB: Utils.Point): number;
        calculateRaw(r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number): number;
        protected _setDefaults(): void;
    }
    class ManhattanNeuQuant extends Manhattan implements IDistanceCalculator {
        protected _setDefaults(): void;
    }
    /**
     * CIEDE2000 algorithm (Original)
     */
    class CIEDE2000_Original implements IDistanceCalculator {
        private static _kL;
        private static _kC;
        private static _kH;
        private static _pow25to7;
        private static _deg360InRad;
        private static _deg180InRad;
        private static _deg30InRad;
        private static _deg6InRad;
        private static _deg63InRad;
        private static _deg275InRad;
        private static _deg25InRad;
        private _whitePoint;
        constructor();
        setWhitePoint(r: number, g: number, b: number, a: number): void;
        calculateRaw(r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number): number;
        calculateRawInLab(Lab1: {
            L: number;
            a: number;
            b: number;
        }, Lab2: {
            L: number;
            a: number;
            b: number;
        }): number;
        calculateNormalized(colorA: Utils.Point, colorB: Utils.Point): number;
        private _hp_f(b, aPrime);
        private _a_hp_f(C1, C2, h1p, h2p);
        private _dhp_f(C1, C2, h1p, h2p);
    }
    /**
     * CIEDE2000 algorithm (optimized)
     *
     */
    class CIEDE2000 implements IDistanceCalculator {
        private static _kL;
        private static _kC;
        private static _kH;
        private static _pow25to7;
        private static _deg360InRad;
        private static _deg180InRad;
        private static _deg30InRad;
        private static _deg6InRad;
        private static _deg63InRad;
        private _whitePoint;
        constructor();
        setWhitePoint(r: number, g: number, b: number, a: number): void;
        calculateRaw(r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number): number;
        /**
         * @description
         *   minDistance between any color (CIEDE2000 low limit) = 0.00021155740497634713 (Chrome 46, JavaScript)
         *   !!!!!! max (RT * (dCp / (SC * CIEDE2000._kC)) * (dHp / (SH * CIEDE2000._kH))) 0.0000019135101965161994
         *   max (abs(dE (correct RT) - dE (RT = 0) ) ) is always less than minDistance (0.0000019135101965161994)
         *
         *   So, we can remove RT from equation.
         */
        calculateRawInLab(Lab1: {
            L: number;
            a: number;
            b: number;
        }, Lab2: {
            L: number;
            a: number;
            b: number;
        }): number;
        calculateNormalized(colorA: Utils.Point, colorB: Utils.Point): number;
        private _hp_f(b, aPrime);
        private _a_hp_f(C1, C2, h1p, h2p);
        private _dhp_f(C1, C2, h1p, h2p);
    }
    class CIE94 implements IDistanceCalculator {
        private static _Kl;
        private static _K1;
        private static _K2;
        private _whitePoint;
        private _maxCIE94Distance;
        constructor();
        setWhitePoint(r: number, g: number, b: number, a: number): void;
        calculateRaw(r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number): number;
        calculateNormalized(colorA: Utils.Point, colorB: Utils.Point): number;
    }
    class CMETRIC implements IDistanceCalculator {
        private _rCoefficient;
        private _gCoefficient;
        private _bCoefficient;
        private _aCoefficient;
        private _maxDistance;
        constructor();
        setWhitePoint(r: number, g: number, b: number, a: number): void;
        calculateRaw(r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number): number;
        calculateNormalized(colorA: Utils.Point, colorB: Utils.Point): number;
    }
    /**
     * TODO: check quality of this distance equation
     * TODO: ask author for usage rights
     * taken from:
     * {@link http://stackoverflow.com/questions/4754506/color-similarity-distance-in-rgba-color-space/8796867#8796867}
     * {@link https://github.com/pornel/pngquant/blob/cc39b47799a7ff2ef17b529f9415ff6e6b213b8f/lib/pam.h#L148}
     */
    class PNGQUANT implements IDistanceCalculator {
        private _whitePoint;
        private _maxDistance;
        constructor();
        setWhitePoint(r: number, g: number, b: number, a: number): void;
        calculateNormalized(colorA: Utils.Point, colorB: Utils.Point): number;
        private _colordifference_ch(x, y, alphas);
        calculateRaw(r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number): number;
    }
}
/**
 * @preserve
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * point.ts - part of Image Quantization Library
 */
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
/**
 * @preserve
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * utils.ts - part of Image Quantization Library
 */
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
    var sort: typeof stableSort;
    function stableSort(fn: any): any;
    /**
     * 	partitions a rectangle of width x height into
     *	array of boxes stepX x stepY (or less)
     */
    function makeBoxes(width: any, height: any, stepX: any, stepY: any): any[];
    function sortedHashKeys(obj: any, desc: any): any;
}
/**
 * @preserve
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * hueStatistics.ts - part of Image Quantization Library
 */
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
/**
 * @preserve TypeScript port:
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * colorHistogram.ts - part of Image Quantization Library
 */
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
/**
 * @preserve
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * palette.ts - part of Image Quantization Library
 */
declare module IQ.Utils {
    class Palette {
        private _pointContainer;
        private _pointArray;
        private _i32idx;
        constructor();
        add(color: Point): void;
        has(color: Point): boolean;
        getNearestColor(colorDistanceCalculator: Color.IDistanceCalculator, color: Point): Point;
        getPointContainer(): PointContainer;
        private _nearestPointFromCache(key);
        private getNearestIndex(colorDistanceCalculator, point);
        sort(): void;
    }
}
/**
 * @preserve
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * pointContainer.ts - part of Image Quantization Library
 */
declare module IQ.Utils {
    /**
     * v8 optimizations done.
     * fromXXX methods are static to move out polymorphic code from class instance itself.
     */
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
/**
 * @preserve
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * common.ts - part of Image Quantization Library
 */
declare module IQ.Image {
    interface IImageDitherer {
        quantize(pointBuffer: Utils.PointContainer, palette: Utils.Palette): Utils.PointContainer;
    }
}
/**
 * @preserve
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * array.ts - part of Image Quantization Library
 */
declare module IQ.Image {
    enum ErrorDiffusionArrayKernel {
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
    class ErrorDiffusionArray implements IImageDitherer {
        private _minColorDistance;
        private _serpentine;
        private _kernel;
        private _calculateErrorLikeGIMP;
        private _distance;
        constructor(colorDistanceCalculator: Color.IDistanceCalculator, kernel: ErrorDiffusionArrayKernel, serpentine?: boolean, minimumColorDistanceToDither?: number, calculateErrorLikeGIMP?: boolean);
        quantize(pointBuffer: Utils.PointContainer, palette: Utils.Palette): Utils.PointContainer;
        private _fillErrorLine(errorLine, width);
        private _setKernel(kernel);
    }
}
/**
 * @preserve
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * nearestColor.ts - part of Image Quantization Library
 */
declare module IQ.Image {
    class NearestColor implements IImageDitherer {
        private _distance;
        constructor(colorDistanceCalculator: Color.IDistanceCalculator);
        quantize(pointBuffer: Utils.PointContainer, palette: Utils.Palette): Utils.PointContainer;
    }
}
/**
 * @preserve
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * common.ts - part of Image Quantization Library
 */
declare module IQ {
    interface IPaletteQuantizer {
        sample(pointBuffer: Utils.PointContainer): void;
        quantize(): Utils.Palette;
    }
}
/**
 * @preserve TypeScript port:
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * neuquant.ts - part of Image Quantization Library
 */
declare module IQ.Palette {
    class NeuQuant implements IPaletteQuantizer {
        private static _prime1;
        private static _prime2;
        private static _prime3;
        private static _prime4;
        private static _minpicturebytes;
        private static _nCycles;
        private static _initialBiasShift;
        private static _initialBias;
        private static _gammaShift;
        private static _gamma;
        private static _betaShift;
        private static _beta;
        private static _betaGamma;
        private static _radiusBiasShift;
        private static _radiusBias;
        private static _radiusDecrease;
        private static _alphaBiasShift;
        private static _initAlpha;
        private static _radBiasShift;
        private static _radBias;
        private static _alphaRadBiasShift;
        private static _alphaRadBias;
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
         * Move adjacent neurons by precomputed alpha*(1-((i-j)^2/[r]^2)) in radpower[|i-j|]
         */
        private _alterNeighbour(rad, i, b, g, r, al);
        /**
         * Move neuron i towards biased (b,g,r) by factor alpha
         */
        private _alterSingle(alpha, i, b, g, r, a);
        /**
         * Search for biased BGR values
         * description:
         *    finds closest neuron (min dist) and updates freq
         *    finds best neuron (min dist-bias) and returns position
         *    for frequently chosen neurons, freq[i] is high and bias[i] is negative
         *    bias[i] = _gamma*((1/this._networkSize)-freq[i])
         *
         * Original distance equation:
         *        dist = n.b - b;
         *        if (dist < 0) dist = -dist;
         *        a = n.g - g;
         *        if (a < 0) a = -a;
         *        dist += a;
         *        a = n.r - r;
         *        if (a < 0) a = -a;
         *        dist += a;
         *        a = (n.a - al);
         *        if (a < 0) a = -a;
         *        dist += a;
         */
        private _contest(b, g, r, al);
    }
}
/**
 * @preserve TypeScript port:
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * rgbquant.ts - part of Image Quantization Library
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
/**
 * @preserve
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * wuQuant.ts - part of Image Quantization Library
 */
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
/**
 * @preserve
 * Copyright 2015 Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * ssim.ts - part of Image Quantization Library
 */
declare module IQ.Quality {
    class SSIM {
        compare(image1: Utils.PointContainer, image2: Utils.PointContainer): number;
        private _iterate(image1, image2, callback);
        private _calculateLumaValuesForWindow(image, x, y, width, height);
        private _calculateAverageLuma(lumaValues);
    }
}
declare module Usage {
    class QuantizationUsage {
        static drawPixels(pointContainer: any, width0: any, width1?: number): HTMLCanvasElement;
        private static _typeOf(val);
        private _timeMark(title, callback);
        private _baseName(src);
        quantize(img: HTMLImageElement, optionColors: any, optionPaletteQuantizer: any, optionImageDithering: any, optionColorDistance: any): {
            palette: IQ.Utils.Palette;
            image: IQ.Utils.PointContainer;
            time: number;
            ssim: number;
            original: IQ.Utils.PointContainer;
        };
        private _getColorDistanceCalculator(option);
        private _checkImageAndPalette(image, palette, colors);
    }
}
declare module Data {
    var imageData: any[];
}
declare module UI {
    var configForm: {
        view: string;
        id: string;
        width: number;
        elements: ({
            view: string;
            id: string;
            label: string;
            labelWidth: number;
            value: string;
            options: string[];
        } | {
            view: string;
            id: string;
            label: string;
            labelWidth: number;
            value: string;
            options: {
                id: number;
                value: string;
            }[];
        } | {
            type: string;
            view: string;
            elements: {}[];
        })[];
    };
}
declare module UI {
    var imageFoldersPanel: {
        id: string;
        view: string;
        type: {
            height: number;
        };
        template: (obj: any) => string;
        select: boolean;
        data: any[];
        on: {
            "onafterselect": (id: any) => void;
        };
        ready: () => void;
    };
}
declare module UI {
    var leftPanel: {
        type: string;
        rows: ({
            view: string;
            id: string;
            width: number;
            elements: ({
                view: string;
                id: string;
                label: string;
                labelWidth: number;
                value: string;
                options: string[];
            } | {
                view: string;
                id: string;
                label: string;
                labelWidth: number;
                value: string;
                options: {
                    id: number;
                    value: string;
                }[];
            } | {
                type: string;
                view: string;
                elements: {}[];
            })[];
        } | {
            id: string;
            view: string;
            type: {
                height: number;
            };
            template: (obj: any) => string;
            select: boolean;
            data: any[];
            on: {
                "onafterselect": (id: any) => void;
            };
            ready: () => void;
        } | {
            type: string;
            template: string;
        })[];
    };
}
declare module UI {
    var quantizedImageClickToCompare: {
        id: string;
        rows: ({
            id: string;
            view: string;
            height: number;
        } | {
            cols: {
                rows: ({
                    type: string;
                    template: string;
                } | {
                    id: string;
                    view: string;
                })[];
            }[];
        })[];
    };
}
declare module UI {
    var quantizedImageOriginalVsQuantized: {
        id: string;
        rows: ({
            id: string;
            view: string;
            height: number;
        } | {
            cols: {
                rows: ({
                    type: string;
                    template: string;
                } | {
                    id: string;
                    view: string;
                })[];
            }[];
        })[];
    };
}
declare module Controller {
    function initialize(): void;
    function update(quantize: boolean): void;
}
declare module UI {
    var rightPanel: {
        view: string;
        gravity: number;
        tabbar: {
            optionWidth: number;
            value: string;
            options: {
                value: string;
                id: string;
            }[];
            on: {
                onAfterTabClick: (id: any) => void;
            };
        };
        cells: {
            id: string;
            rows: ({
                id: string;
                view: string;
                height: number;
            } | {
                cols: {
                    rows: ({
                        type: string;
                        template: string;
                    } | {
                        id: string;
                        view: string;
                    })[];
                }[];
            })[];
        }[];
    };
}
