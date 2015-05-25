var IQ;
(function (IQ) {
    var Utils;
    (function (Utils) {
        /**
         * v8 optimized class
         * 1) "constructor" should have initialization with worst types
         * 2) "set" should have |0 / >>> 0
         */
        var Point = (function () {
            function Point() {
                this.r = this.g = this.b = this.a = 0;
                this.rgba = [this.r, this.g, this.b, this.a];
                this.uint32 = -1 >>> 0;
                this.lab = {
                    l: 0,
                    a: 0,
                    b: 0
                };
                //this.set(...args);
            }
            Point.createByQuadruplet = function (quadruplet) {
                var point = new Point();
                point.r = quadruplet[0] | 0;
                point.g = quadruplet[1] | 0;
                point.b = quadruplet[2] | 0;
                point.a = quadruplet[3] | 0;
                point._loadUINT32();
                point._loadQuadruplet();
                return point;
            };
            Point.createByRGBA = function (red, green, blue, alpha) {
                var point = new Point();
                point.r = red | 0;
                point.g = green | 0;
                point.b = blue | 0;
                point.a = alpha | 0;
                point._loadUINT32();
                point._loadQuadruplet();
                return point;
            };
            Point.createByUint32 = function (uint32) {
                var point = new Point();
                point.uint32 = uint32 >>> 0;
                point._loadRGBA();
                point._loadQuadruplet();
                return point;
            };
            Point.prototype.from = function (point) {
                this.r = point.r;
                this.g = point.g;
                this.b = point.b;
                this.a = point.a;
                this.uint32 = point.uint32;
                this.rgba = point.rgba.slice(0);
                this.lab.l = point.lab.l;
                this.lab.a = point.lab.a;
                this.lab.b = point.lab.b;
            };
            Point.prototype.set = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                switch (args.length) {
                    case 1:
                        if (typeof args[0] === "number") {
                            this.uint32 = args[0] >>> 0;
                            this._loadRGBA();
                        }
                        else if (Utils.typeOf(args[0]) === "Array") {
                            this.r = args[0][0] | 0;
                            this.g = args[0][1] | 0;
                            this.b = args[0][2] | 0;
                            this.a = args[0][3] | 0;
                            this._loadUINT32();
                        }
                        else {
                            throw new Error("Point.constructor/set: unsupported single parameter");
                        }
                        break;
                    case 4:
                        this.r = args[0] | 0;
                        this.g = args[1] | 0;
                        this.b = args[2] | 0;
                        this.a = args[3] | 0;
                        this._loadUINT32();
                        break;
                    default:
                        throw new Error("Point.constructor/set should have parameter/s");
                }
                this._loadQuadruplet();
            };
            /*
             * TODO:
             Luminance from RGB:
    
             Luminance (standard for certain colour spaces): (0.2126*R + 0.7152*G + 0.0722*B) [1]
             Luminance (perceived option 1): (0.299*R + 0.587*G + 0.114*B) [2]
             Luminance (perceived option 2, slower to calculate):  sqrt( 0.241*R^2 + 0.691*G^2 + 0.068*B^2 ) ? sqrt( 0.299*R^2 + 0.587*G^2 + 0.114*B^2 ) (thanks to @MatthewHerbst) [http://alienryderflex.com/hsp.html]
            */
            Point.prototype.getLuminosity = function (useAlphaChannel) {
                var r = this.r, g = this.g, b = this.b;
                if (useAlphaChannel) {
                    r = Math.min(255, 255 - this.a + this.a * r / 255);
                    g = Math.min(255, 255 - this.a + this.a * g / 255);
                    b = Math.min(255, 255 - this.a + this.a * b / 255);
                }
                //var luma = this.r * Point._RED_COEFFICIENT + this.g * Point._GREEN_COEFFICIENT + this.b * Point._BLUE_COEFFICIENT;
                /*
                            if(useAlphaChannel) {
                                luma = (luma * (255 - this.a)) / 255;
                            }
                */
                var luma = r * Point._RED_COEFFICIENT + g * Point._GREEN_COEFFICIENT + b * Point._BLUE_COEFFICIENT;
                return luma;
            };
            Point.prototype._loadUINT32 = function () {
                this.uint32 = ((this.a << 24) |
                    (this.b << 16) |
                    (this.g << 8) |
                    this.r // red
                ) >>> 0;
            };
            Point.prototype._loadRGBA = function () {
                this.r = this.uint32 & 0xff;
                this.g = (this.uint32 >>> 8) & 0xff;
                this.b = (this.uint32 >>> 16) & 0xff;
                this.a = (this.uint32 >>> 24) & 0xff;
            };
            Point.prototype._loadQuadruplet = function () {
                this.rgba = [
                    this.r,
                    this.g,
                    this.b,
                    this.a
                ];
                var xyz = Utils.rgb2xyz(this.r, this.g, this.b);
                var lab = Utils.xyz2lab(xyz.x, xyz.y, xyz.z);
                this.lab.l = lab.l;
                this.lab.a = lab.a;
                this.lab.b = lab.b;
            };
            Point._RED_COEFFICIENT = 0.212655;
            Point._GREEN_COEFFICIENT = 0.715158;
            Point._BLUE_COEFFICIENT = 0.072187;
            return Point;
        })();
        Utils.Point = Point;
    })(Utils = IQ.Utils || (IQ.Utils = {}));
})(IQ || (IQ = {}));
var IQ;
(function (IQ) {
    var Utils;
    (function (Utils) {
        // Rec. 709 (sRGB) luma coef
        var Pr = .2126, Pg = .7152, Pb = .0722, Pa = 1; // TODO: (igor-bezkrovny) what should be here?
        // test if js engine's Array#sort implementation is stable
        function isArrSortStable() {
            var str = "abcdefghijklmnopqrstuvwxyz";
            return "xyzvwtursopqmnklhijfgdeabc" == str.split("").sort(function (a, b) {
                return ~~(str.indexOf(b) / 2.3) - ~~(str.indexOf(a) / 2.3);
            }).join("");
        }
        // TODO: move to separate file like "utils.ts" - it is used by colorQuant too!
        function typeOf(val) {
            return Object.prototype.toString.call(val).slice(8, -1);
        }
        Utils.typeOf = typeOf;
        // http://alienryderflex.com/hsp.html
        function rgb2lum(r, g, b) {
            // TODO: luma = point.r * RED_COEFFICIENT + point.g * GREEN_COEFFICIENT + point.b * BLUE_COEFFICIENT
            // TODO: why here another formula??
            return Math.sqrt(Pr * r * r +
                Pg * g * g +
                Pb * b * b);
        }
        Utils.rgb2lum = rgb2lum;
        // http://rgb2hsl.nichabi.com/javascript-function.php
        function rgb2hsl(r, g, b) {
            var max, min, h, s, l, d;
            r /= 255;
            g /= 255;
            b /= 255;
            max = Math.max(r, g, b);
            min = Math.min(r, g, b);
            l = (max + min) / 2;
            if (max == min) {
                h = s = 0;
            }
            else {
                d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }
                h /= 6;
            }
            //		h = Math.floor(h * 360)
            //		s = Math.floor(s * 100)
            //		l = Math.floor(l * 100)
            return {
                h: h,
                s: s,
                l: rgb2lum(r, g, b)
            };
        }
        Utils.rgb2hsl = rgb2hsl;
        function hueGroup(hue, segs) {
            var seg = 1 / segs, haf = seg / 2;
            if (hue >= 1 - haf || hue <= haf)
                return 0;
            for (var i = 1; i < segs; i++) {
                var mid = i * seg;
                if (hue >= mid - haf && hue <= mid + haf)
                    return i;
            }
        }
        Utils.hueGroup = hueGroup;
        function satGroup(sat) {
            return sat;
        }
        Utils.satGroup = satGroup;
        function lumGroup(lum) {
            return lum;
        }
        Utils.lumGroup = lumGroup;
        Utils.sort = isArrSortStable() ? Array.prototype.sort : stableSort;
        // must be used via stableSort.call(arr, fn)
        function stableSort(fn) {
            var type = typeOf(this[0]);
            if (type == "Number" || type == "String") {
                var ord = {}, len = this.length, val;
                for (var i = 0; i < len; i++) {
                    val = this[i];
                    if (ord[val] || ord[val] === 0)
                        continue;
                    ord[val] = i;
                }
                return this.sort(function (a, b) {
                    return fn(a, b) || ord[a] - ord[b];
                });
            }
            else {
                var ord2 = this.map(function (v) {
                    return v;
                });
                return this.sort(function (a, b) {
                    return fn(a, b) || ord2.indexOf(a) - ord2.indexOf(b);
                });
            }
        }
        Utils.stableSort = stableSort;
        // partitions a rect of wid x hgt into
        // array of bboxes of w0 x h0 (or less)
        function makeBoxes(wid, hgt, w0, h0) {
            var wnum = ~~(wid / w0), wrem = wid % w0, hnum = ~~(hgt / h0), hrem = hgt % h0, xend = wid - wrem, yend = hgt - hrem;
            var bxs = [];
            for (var y = 0; y < hgt; y += h0)
                for (var x = 0; x < wid; x += w0)
                    bxs.push({ x: x, y: y, w: (x == xend ? wrem : w0), h: (y == yend ? hrem : h0) });
            return bxs;
        }
        Utils.makeBoxes = makeBoxes;
        // returns array of hash keys sorted by their values
        function sortedHashKeys(obj, desc) {
            var keys = Object.keys(obj);
            if (desc) {
                return Utils.sort.call(keys, function (a, b) {
                    return obj[b] - obj[a];
                });
            }
            else {
                return Utils.sort.call(keys, function (a, b) {
                    return obj[a] - obj[b];
                });
            }
        }
        Utils.sortedHashKeys = sortedHashKeys;
        var rd = 255, gd = 255, bd = 255, ad = 255;
        var euclMax = Math.sqrt(Pr * rd * rd + Pg * gd * gd + Pb * bd * bd + Pa * ad * ad);
        // perceptual Euclidean color distance
        function distEuclidean(colorA, colorB) {
            var rd = colorB.r - colorA.r, gd = colorB.g - colorA.g, bd = colorB.b - colorA.b, ad = colorB.a - colorA.a;
            return Math.sqrt(Pr * rd * rd + Pg * gd * gd + Pb * bd * bd + Pa * ad * ad) / euclMax;
        }
        Utils.distEuclidean = distEuclidean;
        function rgb2xyz(r, g, b) {
            r = r / 255; //R from 0 to 255
            g = g / 255; //G from 0 to 255
            b = b / 255; //B from 0 to 255
            r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
            g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
            b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
            r = r * 100;
            g = g * 100;
            b = b * 100;
            //Observer. = 2�, Illuminant = D65
            return {
                x: r * 0.4124 + g * 0.3576 + b * 0.1805,
                y: r * 0.2126 + g * 0.7152 + b * 0.0722,
                z: r * 0.0193 + g * 0.1192 + b * 0.9505
            };
        }
        Utils.rgb2xyz = rgb2xyz;
        function xyz2rgb(x, y, z) {
            x = x / 100; //X from 0 to  95.047      (Observer = 2�, Illuminant = D65)
            y = y / 100; //Y from 0 to 100.000
            z = z / 100; //Z from 0 to 108.883
            var r = x * 3.2406 + y * -1.5372 + z * -0.4986, g = x * -0.9689 + y * 1.8758 + z * 0.0415, b = x * 0.0557 + y * -0.2040 + z * 1.0570;
            r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
            g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
            b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;
            return {
                r: r * 255,
                g: g * 255,
                b: b * 255
            };
        }
        var refX = 95.047, refY = 100.0, refZ = 108.883;
        function xyz2lab(x, y, z) {
            x = x / refX; //ref_X =  95.047   Observer= 2�, Illuminant= D65
            y = y / refY; //ref_Y = 100.000
            z = z / refZ; //ref_Z = 108.883
            x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
            y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
            z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);
            return {
                l: (116 * y) - 16,
                a: 500 * (x - y),
                b: 200 * (y - z)
            };
        }
        Utils.xyz2lab = xyz2lab;
        function lab2xyz(l, a, b) {
            var y = (l + 16) / 116, x = a / 500 + y, z = y - b / 200;
            var y3 = Math.pow(y, 3), x3 = Math.pow(x, 3), z3 = Math.pow(z, 3);
            y = y3 > 0.008856 ? y3 : (y - 16 / 116) / 7.787;
            x = x3 > 0.008856 ? x3 : (x - 16 / 116) / 7.787;
            z = z3 > 0.008856 ? z3 : (z - 16 / 116) / 7.787;
            return {
                x: refX * x,
                y: refY * y,
                z: refZ * z //ref_Z = 108.883
            };
        }
        /*
         * Computes CIE94 distance between 2 colors in LAB space.
         *
         * p1 = [l1, a1, b1]
         * p2 = [l2, a2, b2]
         * Returns distance:float
         *
         * Usage example:
         *     var d = CIE94_dist([94.0, -0.1, -0.55], [77.0, 0.5, 0.45])
         *
         * Iulius Curt, april 2013
         */
        function CIE94Distance(colorA, colorB) {
            /*
             var xyzA = rgb2xyz(colorA.r, colorA.g, colorA.b);
             var labA = xyz2lab(xyzA.x, xyzA.y, xyzA.z);
    
             var xyzB = rgb2xyz(colorB.r, colorB.g, colorB.b);
             var labB = xyz2lab(xyzB.x, xyzB.y, xyzB.z);
             */
            var labA = colorA.lab, labB = colorB.lab;
            var Kl = 2.0, K1 = 0.048, K2 = 0.014;
            var dL = labA.l - labB.l, dA = labA.a - labB.a, dB = labA.b - labB.b, c1 = Math.sqrt(labA.a * labA.a + labA.b * labA.b), c2 = Math.sqrt(labB.a * labB.a + labB.b * labB.b), dC = c1 - c2, deltaH = dA * dA + dB * dB - dC * dC;
            deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
            var i = Math.pow(dL / Kl, 2) + Math.pow(dC / (1.0 + K1 * c1), 2) + Math.pow(deltaH / (1.0 + K2 * c1), 2);
            return i < 0 ? 0 : Math.sqrt(i) / 200;
        }
        Utils.CIE94Distance = CIE94Distance;
    })(Utils = IQ.Utils || (IQ.Utils = {}));
})(IQ || (IQ = {}));
/// <reference path='./utils.ts' />
var IQ;
(function (IQ) {
    var Utils;
    (function (Utils) {
        var HueGroup = (function () {
            function HueGroup() {
                this.num = 0;
                this.cols = [];
            }
            return HueGroup;
        })();
        var HueStatistics = (function () {
            function HueStatistics(numGroups, minCols) {
                this._numGroups = numGroups;
                this._minCols = minCols;
                this._stats = [];
                for (var i = 0; i <= numGroups; i++) {
                    this._stats[i] = new HueGroup();
                }
                this._groupsFull = 0;
            }
            HueStatistics.prototype.check = function (i32) {
                if (this._groupsFull == this._numGroups + 1) {
                    this.check = function () {
                    };
                }
                var r = (i32 & 0xff), g = (i32 >>> 8) & 0xff, b = (i32 >>> 16) & 0xff, a = (i32 >>> 24) & 0xff, hg = (r == g && g == b) ? 0 : 1 + Utils.hueGroup(Utils.rgb2hsl(r, g, b).h, this._numGroups), gr = this._stats[hg], min = this._minCols;
                gr.num++;
                if (gr.num > min)
                    return;
                if (gr.num == min)
                    this._groupsFull++;
                if (gr.num <= min)
                    this._stats[hg].cols.push(i32);
            };
            HueStatistics.prototype.inject = function (histG) {
                for (var i = 0; i <= this._numGroups; i++) {
                    if (this._stats[i].num <= this._minCols) {
                        switch (Utils.typeOf(histG)) {
                            case "Array":
                                this._stats[i].cols.forEach(function (col) {
                                    if (histG.indexOf(col) == -1)
                                        histG.push(col);
                                });
                                break;
                            case "Object":
                                this._stats[i].cols.forEach(function (col) {
                                    if (!histG[col])
                                        histG[col] = 1;
                                    else
                                        histG[col]++;
                                });
                                break;
                        }
                    }
                }
            };
            return HueStatistics;
        })();
        Utils.HueStatistics = HueStatistics;
    })(Utils = IQ.Utils || (IQ.Utils = {}));
})(IQ || (IQ = {}));
/// <reference path='../../utils/hueStatistics.ts' />
var IQ;
(function (IQ) {
    var Utils;
    (function (Utils) {
        var ColorHistogram = (function () {
            function ColorHistogram(method, colors) {
                // 1 = by global population, 2 = subregion population threshold
                this._method = method;
                // if > 0, enables hues stats and min-color retention per group
                this._minHueCols = colors << 2; //opts.minHueCols || 0;
                // # of highest-frequency colors to start with for palette reduction
                this._initColors = colors << 2;
                // HueStatistics instance
                this._hueStats = new Utils.HueStatistics(ColorHistogram._hueGroups, this._minHueCols);
                this._histogram = {};
            }
            ColorHistogram.prototype.sample = function (pointBuffer) {
                switch (this._method) {
                    case 1:
                        this._colorStats1D(pointBuffer);
                        break;
                    case 2:
                        this._colorStats2D(pointBuffer);
                        break;
                }
            };
            ColorHistogram.prototype.getImportanceSortedColorsIDXI32 = function () {
                var sorted = Utils.sortedHashKeys(this._histogram, true);
                // TODO: check that other code waits for null
                if (sorted.length == 0) {
                    return null;
                }
                switch (this._method) {
                    case 1:
                        var initialColorsLimit = Math.min(sorted.length, this._initColors), last = sorted[initialColorsLimit - 1], freq = this._histogram[last];
                        var idxi32 = sorted.slice(0, initialColorsLimit);
                        // add any cut off colors with same freq as last
                        var pos = initialColorsLimit, len = sorted.length;
                        while (pos < len && this._histogram[sorted[pos]] == freq)
                            idxi32.push(sorted[pos++]);
                        // inject min huegroup colors
                        this._hueStats.inject(idxi32);
                        break;
                    case 2:
                        var idxi32 = sorted;
                        break;
                }
                // int32-ify values
                idxi32 = idxi32.map(function (v) {
                    return +v;
                });
                return idxi32;
            };
            // global top-population
            ColorHistogram.prototype._colorStats1D = function (pointBuffer) {
                var histG = this._histogram, pointArray = pointBuffer.getPointArray(), len = pointArray.length;
                for (var i = 0; i < len; i++) {
                    var col = pointArray[i].uint32;
                    // collect hue stats
                    this._hueStats.check(col);
                    if (col in histG)
                        histG[col]++;
                    else
                        histG[col] = 1;
                }
            };
            // population threshold within subregions
            // FIXME: this can over-reduce (few/no colors same?), need a way to keep
            // important colors that dont ever reach local thresholds (gradients?)
            ColorHistogram.prototype._colorStats2D = function (pointBuffer) {
                var width = pointBuffer.getWidth(), height = pointBuffer.getHeight(), pointArray = pointBuffer.getPointArray();
                var boxW = ColorHistogram._boxSize[0], boxH = ColorHistogram._boxSize[1], area = boxW * boxH, boxes = Utils.makeBoxes(width, height, boxW, boxH), histG = this._histogram;
                boxes.forEach(function (box) {
                    var effc = Math.max(Math.round((box.w * box.h) / area) * ColorHistogram._boxPixels, 2), histL = {}, col;
                    this._iterBox(box, width, function (i) {
                        col = pointArray[i].uint32;
                        // collect hue stats
                        this._hueStats.check(col);
                        if (col in histG)
                            histG[col]++;
                        else if (col in histL) {
                            if (++histL[col] >= effc)
                                histG[col] = histL[col];
                        }
                        else
                            histL[col] = 1;
                    });
                }, this);
                // inject min huegroup colors
                this._hueStats.inject(histG);
            };
            // iterates @bbox within a parent rect of width @wid; calls @fn, passing index within parent
            ColorHistogram.prototype._iterBox = function (bbox, wid, fn) {
                var b = bbox, i0 = b.y * wid + b.x, i1 = (b.y + b.h - 1) * wid + (b.x + b.w - 1), cnt = 0, incr = wid - b.w + 1, i = i0;
                do {
                    fn.call(this, i);
                    i += (++cnt % b.w == 0) ? incr : 1;
                } while (i <= i1);
            };
            ColorHistogram._boxSize = [64, 64];
            ColorHistogram._boxPixels = 2;
            ColorHistogram._hueGroups = 10;
            return ColorHistogram;
        })();
        Utils.ColorHistogram = ColorHistogram;
    })(Utils = IQ.Utils || (IQ.Utils = {}));
})(IQ || (IQ = {}));
/// <reference path='point.ts' />
///<reference path="../palette/rgbquant/colorHistogram.ts"/>
// TODO: make paletteArray via pointBuffer, so, export will be available via pointBuffer.exportXXX
var IQ;
(function (IQ) {
    var Utils;
    (function (Utils) {
        var hueGroups = 10;
        var Palette = (function () {
            function Palette() {
                this._pointArray = [];
                this._i32idx = {};
                this._pointContainer = new Utils.PointContainer();
                this._pointContainer.setHeight(1);
                this._pointArray = this._pointContainer.getPointArray();
            }
            Palette.prototype.add = function (color) {
                this._pointArray.push(color);
                this._pointContainer.setWidth(this._pointArray.length);
            };
            // TOTRY: use HUSL - http://boronine.com/husl/ http://www.husl-colors.org/ https://github.com/husl-colors/husl
            Palette.prototype.getNearestColor = function (color) {
                return this._pointArray[this.getNearestIndex(color) | 0];
            };
            Palette.prototype.getPointContainer = function () {
                return this._pointContainer;
            };
            // TOTRY: use HUSL - http://boronine.com/husl/
            /*
                    public nearestIndexByUint32(i32) {
                        var idx : number = this._nearestPointFromCache("" + i32);
                        if (idx >= 0) return idx;
            
                        var min = 1000,
                            rgb = [
                                (i32 & 0xff),
                                (i32 >>> 8) & 0xff,
                                (i32 >>> 16) & 0xff,
                                (i32 >>> 24) & 0xff
                            ],
                            len = this._pointArray.length;
            
                        idx = 0;
                        for (var i = 0; i < len; i++) {
                            var dist = Utils.distEuclidean(rgb, this._pointArray[i].rgba);
            
                            if (dist < min) {
                                min = dist;
                                idx = i;
                            }
                        }
            
                        this._i32idx[i32] = idx;
                        return idx;
                    }
            */
            Palette.prototype._nearestPointFromCache = function (key) {
                return typeof this._i32idx[key] === "number" ? this._i32idx[key] : -1;
            };
            Palette.prototype.getNearestIndex = function (point) {
                var idx = this._nearestPointFromCache("" + point.uint32);
                if (idx >= 0)
                    return idx;
                var minimalDistance = 1000.0;
                for (var idx = 0, i = 0, l = this._pointArray.length; i < l; i++) {
                    var distance = Utils.distEuclidean(point, this._pointArray[i]);
                    if (distance < minimalDistance) {
                        minimalDistance = distance;
                        idx = i;
                    }
                }
                this._i32idx[point.uint32] = idx;
                return idx;
            };
            /*
                    public reduce(histogram : ColorHistogram, colors : number) {
                        if (this._pointArray.length > colors) {
                            var idxi32 = histogram.getImportanceSortedColorsIDXI32();
            
                            // quantize histogram to existing palette
                            var keep = [], uniqueColors = 0, idx, pruned = false;
            
                            for (var i = 0, len = idxi32.length; i < len; i++) {
                                // palette length reached, unset all remaining colors (sparse palette)
                                if (uniqueColors >= colors) {
                                    this.prunePal(keep);
                                    pruned = true;
                                    break;
                                } else {
                                    idx = this.nearestIndexByUint32(idxi32[i]);
                                    if (keep.indexOf(idx) < 0) {
                                        keep.push(idx);
                                        uniqueColors++;
                                    }
                                }
                            }
            
                            if (!pruned) {
                                this.prunePal(keep);
                            }
                        }
                    }
            
                    // TODO: check usage, not tested!
                    public prunePal(keep : number[]) {
                        var colors = this._pointArray.length;
                        for (var colorIndex = colors - 1; colorIndex >= 0; colorIndex--) {
                            if (keep.indexOf(colorIndex) < 0) {
            
                                if(colorIndex + 1 < colors) {
                                    this._pointArray[ colorIndex ] = this._pointArray [ colors - 1 ];
                                }
                                --colors;
                                //this._pointArray[colorIndex] = null;
                            }
                        }
                        console.log("colors pruned: " + (this._pointArray.length - colors));
                        this._pointArray.length = colors;
                        this._i32idx = {};
                    }
            */
            // TODO: group very low lum and very high lum colors
            // TODO: pass custom sort order
            // TODO: sort criteria function should be placed to HueStats class
            Palette.prototype.sort = function () {
                this._i32idx = {};
                this._pointArray.sort(function (a, b) {
                    var alphaA = a.a, alphaB = b.a; // < 255 ? 0 : 1;
                    //if(alphaB !== alphaA) return alphaA - alphaB;
                    var rgbA = a.rgba, rgbB = b.rgba;
                    var hslA = Utils.rgb2hsl(rgbA[0], rgbA[1], rgbA[2]), hslB = Utils.rgb2hsl(rgbB[0], rgbB[1], rgbB[2]);
                    // sort all grays + whites together
                    var hueA = (rgbA[0] == rgbA[1] && rgbA[1] == rgbA[2]) ? 0 : 1 + Utils.hueGroup(hslA.h, hueGroups);
                    var hueB = (rgbB[0] == rgbB[1] && rgbB[1] == rgbB[2]) ? 0 : 1 + Utils.hueGroup(hslB.h, hueGroups);
                    var hueDiff = hueB - hueA;
                    if (hueDiff)
                        return -hueDiff;
                    var lA = a.getLuminosity(true), lB = b.getLuminosity(true);
                    if (lB - lA !== 0)
                        return lB - lA;
                    /*
                                    var lumDiff = Utils.lumGroup(+hslB.l.toFixed(2)) - Utils.lumGroup(+hslA.l.toFixed(2));
                                    if (lumDiff) return -lumDiff;
                    */
                    var satDiff = Utils.satGroup(+hslB.s.toFixed(2)) - Utils.satGroup(+hslA.s.toFixed(2));
                    if (satDiff)
                        return -satDiff;
                });
            };
            return Palette;
        })();
        Utils.Palette = Palette;
    })(Utils = IQ.Utils || (IQ.Utils = {}));
})(IQ || (IQ = {}));
/// <reference path='./point.ts' />
var IQ;
(function (IQ) {
    var Utils;
    (function (Utils) {
        // TODO: http://www.javascripture.com/Uint8ClampedArray
        // TODO: Uint8ClampedArray is better than Uint8Array to avoid checking for out of bounds
        // TODO: check performance (it seems identical) http://jsperf.com/uint8-typed-array-vs-imagedata/4
        /*
    
         TODO: Examples:
    
         var x = new Uint8ClampedArray([17, -45.3]);
         console.log(x[0]); // 17
         console.log(x[1]); // 0
         console.log(x.length); // 2
    
         var x = new Uint8Array([17, -45.3]);
         console.log(x[0]); // 17
         console.log(x[1]); // 211
         console.log(x.length); // 2
    
         */
        var PointContainer = (function () {
            function PointContainer() {
                this._width = 0;
                this._height = 0;
                this._pointArray = [];
            }
            PointContainer.prototype.getWidth = function () {
                return this._width;
            };
            PointContainer.prototype.getHeight = function () {
                return this._height;
            };
            PointContainer.prototype.setWidth = function (width) {
                this._width = width;
            };
            PointContainer.prototype.setHeight = function (height) {
                this._height = height;
            };
            PointContainer.prototype.getPointArray = function () {
                return this._pointArray;
            };
            PointContainer.prototype.clone = function () {
                var clone = new PointContainer();
                clone._width = this._width;
                clone._height = this._height;
                clone._pointArray = [];
                for (var i = 0, l = this._pointArray.length; i < l; i++) {
                    clone._pointArray[i] = Utils.Point.createByUint32(this._pointArray[i].uint32 | 0); // "| 0" is added for v8 optimization
                }
                return clone;
            };
            PointContainer.prototype.importHTMLImageElement = function (img) {
                var width = img.naturalWidth, height = img.naturalHeight;
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height, 0, 0, width, height);
                this.importHTMLCanvasElement(canvas);
            };
            PointContainer.prototype.importHTMLCanvasElement = function (canvas) {
                var width = canvas.width, height = canvas.height;
                var ctx = canvas.getContext("2d"), imgData = ctx.getImageData(0, 0, width, height);
                this.importImageData(imgData);
            };
            PointContainer.prototype.importNodeCanvas = function (canvas) {
                this.importHTMLCanvasElement(canvas);
            };
            PointContainer.prototype.importImageData = function (imageData) {
                var width = imageData.width, height = imageData.height;
                this.importCanvasPixelArray(imageData.data, width, height);
                /*
                            var buf8;
                            if (Utils.typeOf(imageData.data) == "CanvasPixelArray")
                                buf8 = new Uint8Array(imageData.data);
                            else
                                buf8 = imageData.data;
                
                            this.importUint32Array(new Uint32Array(buf8.buffer), width, height);
                */
            };
            PointContainer.prototype.importArray = function (data, width, height) {
                var uint8array = new Uint8Array(data);
                this.importUint32Array(new Uint32Array(uint8array.buffer), width, height);
            };
            PointContainer.prototype.importCanvasPixelArray = function (data, width, height) {
                this.importArray(data, width, height);
            };
            PointContainer.prototype.importUint32Array = function (uint32array, width, height) {
                this._width = width;
                this._height = height;
                this._pointArray = []; //new Array(uint32array.length);
                for (var i = 0, l = uint32array.length; i < l; i++) {
                    this._pointArray[i] = Utils.Point.createByUint32(uint32array[i] | 0); // "| 0" is added for v8 optimization
                }
            };
            PointContainer.prototype.exportUint32Array = function () {
                var l = this._pointArray.length, uint32Array = new Uint32Array(l);
                for (var i = 0; i < l; i++) {
                    uint32Array[i] = this._pointArray[i].uint32;
                }
                return uint32Array;
            };
            PointContainer.prototype.exportUint8Array = function () {
                return new Uint8Array(this.exportUint32Array().buffer);
            };
            return PointContainer;
        })();
        Utils.PointContainer = PointContainer;
    })(Utils = IQ.Utils || (IQ.Utils = {}));
})(IQ || (IQ = {}));
/// <reference path='iquantize.ts' />
var IQ;
(function (IQ) {
    var Image;
    (function (Image) {
        (function (ErrorDiffusionDitheringKernel) {
            ErrorDiffusionDitheringKernel[ErrorDiffusionDitheringKernel["FloydSteinberg"] = 0] = "FloydSteinberg";
            ErrorDiffusionDitheringKernel[ErrorDiffusionDitheringKernel["FalseFloydSteinberg"] = 1] = "FalseFloydSteinberg";
            ErrorDiffusionDitheringKernel[ErrorDiffusionDitheringKernel["Stucki"] = 2] = "Stucki";
            ErrorDiffusionDitheringKernel[ErrorDiffusionDitheringKernel["Atkinson"] = 3] = "Atkinson";
            ErrorDiffusionDitheringKernel[ErrorDiffusionDitheringKernel["Jarvis"] = 4] = "Jarvis";
            ErrorDiffusionDitheringKernel[ErrorDiffusionDitheringKernel["Burkes"] = 5] = "Burkes";
            ErrorDiffusionDitheringKernel[ErrorDiffusionDitheringKernel["Sierra"] = 6] = "Sierra";
            ErrorDiffusionDitheringKernel[ErrorDiffusionDitheringKernel["TwoSierra"] = 7] = "TwoSierra";
            ErrorDiffusionDitheringKernel[ErrorDiffusionDitheringKernel["SierraLite"] = 8] = "SierraLite";
        })(Image.ErrorDiffusionDitheringKernel || (Image.ErrorDiffusionDitheringKernel = {}));
        var ErrorDiffusionDitheringKernel = Image.ErrorDiffusionDitheringKernel;
        // http://www.tannerhelland.com/4660/dithering-eleven-algorithms-source-code/
        var ErrorDiffusionDithering = (function () {
            // TODO: is it the best name for this parameter "kernel"?
            function ErrorDiffusionDithering(kernel, serpentine, minimumColorDistanceToDither, calculateErrorLikeGIMP) {
                if (serpentine === void 0) { serpentine = true; }
                if (minimumColorDistanceToDither === void 0) { minimumColorDistanceToDither = 0; }
                if (calculateErrorLikeGIMP === void 0) { calculateErrorLikeGIMP = true; }
                this._setKernel(kernel);
                this._minColorDistance = minimumColorDistanceToDither;
                this._serpentine = serpentine;
                this._calculateErrorLikeGIMP = calculateErrorLikeGIMP;
            }
            // adapted from http://jsbin.com/iXofIji/2/edit by PAEz
            // fixed version. it doesn't use image pixels as error storage, also it doesn't have 0.3 + 0.3 + 0.3 + 0.3 = 0 error
            ErrorDiffusionDithering.prototype.quantize = function (pointBuffer, palette) {
                var pointArray = pointBuffer.getPointArray(), width = pointBuffer.getWidth(), height = pointBuffer.getHeight(), dir = 1, errorLines = [];
                // initial error lines (number is taken from dithering kernel)
                for (var i = 0, maxErrorLines = 1; i < this._kernel.length; i++) {
                    maxErrorLines = Math.max(maxErrorLines, this._kernel[i][2] + 1);
                }
                for (var i = 0; i < maxErrorLines; i++) {
                    this._fillErrorLine(errorLines[i] = [], width);
                }
                //(<any>console).profile("dither");
                for (var y = 0; y < height; y++) {
                    // always serpentine
                    if (this._serpentine)
                        dir = dir * -1;
                    var lni = y * width, xStart = dir == 1 ? 0 : width - 1, xEnd = dir == 1 ? width : -1;
                    // cyclic shift with erasing
                    this._fillErrorLine(errorLines[0], width);
                    errorLines.push(errorLines.shift());
                    var errorLine = errorLines[0];
                    for (var x = xStart, idx = lni + xStart; x !== xEnd; x += dir, idx += dir) {
                        // Image pixel
                        var point = pointArray[idx], originalPoint = new IQ.Utils.Point(), error = errorLine[x];
                        originalPoint.from(point);
                        var correctedPoint = IQ.Utils.Point.createByRGBA(Math.max(0, Math.min(255, point.r + error[0])), Math.max(0, Math.min(255, point.g + error[1])), Math.max(0, Math.min(255, point.b + error[2])), Math.max(0, Math.min(255, point.a + error[3])));
                        // Reduced pixel
                        var palettePoint = palette.getNearestColor(correctedPoint);
                        point.from(palettePoint);
                        // dithering strength
                        if (this._minColorDistance) {
                            var dist = IQ.Utils.distEuclidean(point, palettePoint);
                            if (dist < this._minColorDistance)
                                continue;
                        }
                        // Component distance
                        if (this._calculateErrorLikeGIMP) {
                            var er = correctedPoint.r - palettePoint.r, eg = correctedPoint.g - palettePoint.g, eb = correctedPoint.b - palettePoint.b, ea = correctedPoint.a - palettePoint.a;
                        }
                        else {
                            var er = originalPoint.r - palettePoint.r, eg = originalPoint.g - palettePoint.g, eb = originalPoint.b - palettePoint.b, ea = originalPoint.a - palettePoint.a;
                        }
                        var dStart = dir == 1 ? 0 : this._kernel.length - 1, dEnd = dir == 1 ? this._kernel.length : -1;
                        for (var i = dStart; i !== dEnd; i += dir) {
                            var x1 = this._kernel[i][1] * dir, y1 = this._kernel[i][2];
                            if (x1 + x >= 0 && x1 + x < width && y1 + y >= 0 && y1 + y < height) {
                                var d = this._kernel[i][0], e = errorLines[y1][x1 + x];
                                e[0] = e[0] + er * d;
                                e[1] = e[1] + eg * d;
                                e[2] = e[2] + eb * d;
                                e[3] = e[3] + ea * d;
                            }
                        }
                    }
                }
                //(<any>console).profileEnd("dither");
                return pointBuffer;
            };
            ErrorDiffusionDithering.prototype._fillErrorLine = function (errorLine, width) {
                // shrink
                if (errorLine.length > width) {
                    errorLine.length = width;
                }
                // reuse existing arrays
                var l = errorLine.length;
                for (var i = 0; i < l; i++) {
                    var error = errorLine[i];
                    error[0] = error[1] = error[2] = error[3] = 0;
                }
                // create missing arrays
                for (var i = l; i < width; i++) {
                    errorLine[i] = [0.0, 0.0, 0.0, 0.0];
                }
            };
            ErrorDiffusionDithering.prototype._setKernel = function (kernel) {
                switch (kernel) {
                    case ErrorDiffusionDitheringKernel.FloydSteinberg:
                        this._kernel = [
                            [7 / 16, 1, 0],
                            [3 / 16, -1, 1],
                            [5 / 16, 0, 1],
                            [1 / 16, 1, 1]
                        ];
                        break;
                    case ErrorDiffusionDitheringKernel.FalseFloydSteinberg:
                        this._kernel = [
                            [3 / 8, 1, 0],
                            [3 / 8, 0, 1],
                            [2 / 8, 1, 1]
                        ];
                        break;
                    case ErrorDiffusionDitheringKernel.Stucki:
                        this._kernel = [
                            [8 / 42, 1, 0],
                            [4 / 42, 2, 0],
                            [2 / 42, -2, 1],
                            [4 / 42, -1, 1],
                            [8 / 42, 0, 1],
                            [4 / 42, 1, 1],
                            [2 / 42, 2, 1],
                            [1 / 42, -2, 2],
                            [2 / 42, -1, 2],
                            [4 / 42, 0, 2],
                            [2 / 42, 1, 2],
                            [1 / 42, 2, 2]
                        ];
                        break;
                    case ErrorDiffusionDitheringKernel.Atkinson:
                        this._kernel = [
                            [1 / 8, 1, 0],
                            [1 / 8, 2, 0],
                            [1 / 8, -1, 1],
                            [1 / 8, 0, 1],
                            [1 / 8, 1, 1],
                            [1 / 8, 0, 2]
                        ];
                        break;
                    case ErrorDiffusionDitheringKernel.Jarvis:
                        this._kernel = [
                            [7 / 48, 1, 0],
                            [5 / 48, 2, 0],
                            [3 / 48, -2, 1],
                            [5 / 48, -1, 1],
                            [7 / 48, 0, 1],
                            [5 / 48, 1, 1],
                            [3 / 48, 2, 1],
                            [1 / 48, -2, 2],
                            [3 / 48, -1, 2],
                            [5 / 48, 0, 2],
                            [3 / 48, 1, 2],
                            [1 / 48, 2, 2]
                        ];
                        break;
                    case ErrorDiffusionDitheringKernel.Burkes:
                        this._kernel = [
                            [8 / 32, 1, 0],
                            [4 / 32, 2, 0],
                            [2 / 32, -2, 1],
                            [4 / 32, -1, 1],
                            [8 / 32, 0, 1],
                            [4 / 32, 1, 1],
                            [2 / 32, 2, 1],
                        ];
                        break;
                    case ErrorDiffusionDitheringKernel.Sierra:
                        this._kernel = [
                            [5 / 32, 1, 0],
                            [3 / 32, 2, 0],
                            [2 / 32, -2, 1],
                            [4 / 32, -1, 1],
                            [5 / 32, 0, 1],
                            [4 / 32, 1, 1],
                            [2 / 32, 2, 1],
                            [2 / 32, -1, 2],
                            [3 / 32, 0, 2],
                            [2 / 32, 1, 2]
                        ];
                        break;
                    case ErrorDiffusionDitheringKernel.TwoSierra:
                        this._kernel = [
                            [4 / 16, 1, 0],
                            [3 / 16, 2, 0],
                            [1 / 16, -2, 1],
                            [2 / 16, -1, 1],
                            [3 / 16, 0, 1],
                            [2 / 16, 1, 1],
                            [1 / 16, 2, 1]
                        ];
                        break;
                    case ErrorDiffusionDitheringKernel.SierraLite:
                        this._kernel = [
                            [2 / 4, 1, 0],
                            [1 / 4, -1, 1],
                            [1 / 4, 0, 1]
                        ];
                        break;
                    default:
                        throw new Error("ErrorDiffusionDithering: unknown kernel = " + kernel);
                }
            };
            return ErrorDiffusionDithering;
        })();
        Image.ErrorDiffusionDithering = ErrorDiffusionDithering;
    })(Image = IQ.Image || (IQ.Image = {}));
})(IQ || (IQ = {}));
/// <reference path='iquantize.ts' />
var IQ;
(function (IQ) {
    var Image;
    (function (Image) {
        var NearestNeighbour = (function () {
            function NearestNeighbour() {
            }
            NearestNeighbour.prototype.quantize = function (pointBuffer, palette) {
                var pointArray = pointBuffer.getPointArray(), width = pointBuffer.getWidth(), height = pointBuffer.getHeight();
                for (var y = 0; y < height; y++) {
                    for (var x = 0, idx = y * width; x < width; x++, idx++) {
                        // Image pixel
                        var point = pointArray[idx];
                        // Reduced pixel
                        point.from(palette.getNearestColor(point));
                    }
                }
                return pointBuffer;
            };
            return NearestNeighbour;
        })();
        Image.NearestNeighbour = NearestNeighbour;
    })(Image = IQ.Image || (IQ.Image = {}));
})(IQ || (IQ = {}));
/*
 * NeuQuant Neural-Net Quantization Algorithm
 * ------------------------------------------
 *
 * Copyright (c) 1994 Anthony Dekker
 *
 * NEUQUANT Neural-Net quantization algorithm by Anthony Dekker, 1994. See
 * "Kohonen neural networks for optimal colour quantization" in "Network:
 * Computation in Neural Systems" Vol. 5 (1994) pp 351-367. for a discussion of
 * the algorithm.
 *
 * Any party obtaining a copy of these files from the author, directly or
 * indirectly, is granted, free of charge, a full and unrestricted irrevocable,
 * world-wide, paid up, royalty-free, nonexclusive right and license to deal in
 * this software and documentation files (the "Software"), including without
 * limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons who
 * receive copies from any such party to do so, with the only requirement being
 * that this copyright notice remain intact.
 */
/**
 * @preserve TypeScript port:
 * Copyright (c) 2015, Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * neuquant.ts - part of color quantization collection
 */
///<reference path="../ipaletteQuantizer.ts"/>
var IQ;
(function (IQ) {
    var Palette;
    (function (Palette) {
        /* number of colours used */
        /*
         four primes near 500 - assume no image has a length so large
         that it is divisible by all four primes
         */
        var bytesPerPoint = 3, prime1 = 499, prime2 = 491, prime3 = 487, prime4 = 503, minpicturebytes = (bytesPerPoint * prime4);
        // bias for colour values
        var netbiasshift = 4;
        // no. of learning cycles
        var ncycles = 100;
        // defs for freq and bias
        var intbiasshift = 16;
        // bias for fractions
        var intbias = (1 << intbiasshift), gammashift = 10;
        // gamma = 1024
        var gamma = (1 << gammashift), betashift = 10, beta = (intbias >> betashift);
        // beta = 1/1024
        var betagamma = (intbias << (gammashift - betashift));
        /*
         * for 256 cols, radius starts
         */
        var radiusbiasshift = 6;
        // at 32.0 biased by 6 bits
        var radiusbias = 1 << radiusbiasshift;
        /*
         * and
         * decreases
         * by a
         */
        // factor of 1/30 each cycle
        var radiusdec = 30;
        /* defs for decreasing alpha factor */
        // alpha starts at 1.0
        var alphabiasshift = 10;
        // biased by 10 bits
        var initalpha = (1 << alphabiasshift);
        /* radbias and alpharadbias used for radpower calculation */
        var radbiasshift = 8, radbias = 1 << radbiasshift, alpharadbshift = alphabiasshift + radbiasshift, alpharadbias = 1 << alpharadbshift;
        var Neuron = (function () {
            function Neuron(defaultValue) {
                this.r = this.g = this.b = this.a = defaultValue;
            }
            Neuron.prototype.toPoint = function () {
                return IQ.Utils.Point.createByRGBA(this.r, this.g, this.b, this.a);
            };
            return Neuron;
        })();
        var NeuQuant = (function () {
            /**
             *
             * @param colors
             * @param sampleFactor sampling factor 1..30
             */
            function NeuQuant(colors, sampleFactor) {
                if (colors === void 0) { colors = 256; }
                if (sampleFactor === void 0) { sampleFactor = 1; }
                this._pointArray = [];
                this._samplefac = sampleFactor;
                this._netsize = colors;
            }
            NeuQuant.prototype.sample = function (pointBuffer) {
                this._pointArray = this._pointArray.concat(pointBuffer.getPointArray());
            };
            NeuQuant.prototype.quantize = function () {
                this._init();
                this._learn();
                this._unbiasnet();
                this._inxbuild();
                return this._buildPalette();
            };
            NeuQuant.prototype._init = function () {
                this._freq = [];
                this._bias = [];
                this._radpower = [];
                this._network = [];
                for (var i = 0; i < this._netsize; i++) {
                    this._network[i] = new Neuron((i << (netbiasshift + 8)) / this._netsize);
                    // 1/this._netsize
                    this._freq[i] = intbias / this._netsize;
                    this._bias[i] = 0;
                }
            };
            /**
             * Main Learning Loop
             */
            NeuQuant.prototype._learn = function () {
                var i, radius, rad, alpha, step, delta, samplepixels, pix, lim;
                var lengthcount = this._pointArray.length * 3;
                if (lengthcount < minpicturebytes)
                    this._samplefac = 1;
                var alphadec = 30 + ((this._samplefac - 1) / 3);
                pix = 0;
                lim = lengthcount;
                samplepixels = lengthcount / (bytesPerPoint * this._samplefac);
                delta = (samplepixels / ncycles) | 0;
                alpha = initalpha;
                radius = (this._netsize >> 3) * radiusbias;
                rad = radius >> radiusbiasshift;
                if (rad <= 1)
                    rad = 0;
                for (i = 0; i < rad; i++)
                    this._radpower[i] = alpha * (((rad * rad - i * i) * radbias) / (rad * rad));
                if (lengthcount < minpicturebytes) {
                    step = bytesPerPoint;
                }
                else if (lengthcount % prime1 != 0) {
                    step = bytesPerPoint * prime1;
                }
                else if ((lengthcount % prime2) != 0) {
                    step = bytesPerPoint * prime2;
                }
                else if ((lengthcount % prime3) != 0) {
                    step = bytesPerPoint * prime3;
                }
                else {
                    step = bytesPerPoint * prime4;
                }
                i = 0;
                while (i < samplepixels) {
                    var point = this._pointArray[pix / bytesPerPoint], b = point.b << netbiasshift, g = point.g << netbiasshift, r = point.r << netbiasshift, a = point.a << netbiasshift, j = this._contest(b, g, r, a);
                    this._altersingle(alpha, j, b, g, r, a);
                    if (rad != 0)
                        this._alterneigh(rad, j, b, g, r, a);
                    /* alter neighbours */
                    pix += step;
                    if (pix >= lim)
                        pix -= lengthcount;
                    i++;
                    if (delta == 0)
                        delta = 1;
                    if (i % delta == 0) {
                        alpha -= alpha / alphadec;
                        radius -= radius / radiusdec;
                        rad = radius >> radiusbiasshift;
                        if (rad <= 1)
                            rad = 0;
                        for (j = 0; j < rad; j++)
                            this._radpower[j] = alpha * (((rad * rad - j * j) * radbias) / (rad * rad));
                    }
                }
            };
            /**
             * Insertion sort of network and building of netindex[0..255] (to do after unbias)
             */
            NeuQuant.prototype._inxbuild = function () {
                var i, j, smallpos, smallval, p, q;
                for (i = 0; i < this._netsize; i++) {
                    p = this._network[i];
                    smallpos = i;
                    smallval = p.g;
                    /* find smallest in i..this._netsize-1 */
                    for (j = i + 1; j < this._netsize; j++) {
                        q = this._network[j];
                        if (q.g < smallval) {
                            smallpos = j;
                            smallval = q.g;
                        }
                    }
                    q = this._network[smallpos];
                    if (i != smallpos) {
                        this._network[i] = q;
                        this._network[smallpos] = p;
                    }
                }
            };
            NeuQuant.prototype._buildPalette = function () {
                var palette = new IQ.Utils.Palette();
                for (var j = 0; j < this._netsize; j++) {
                    palette.add(this._network[j].toPoint());
                }
                palette.sort();
                return palette;
            };
            /**
             * Unbias network to give byte values 0..255 and record position i to prepare for sort
             */
            NeuQuant.prototype._unbiasnet = function () {
                for (var i = 0; i < this._netsize; i++) {
                    var neuron = this._network[i];
                    neuron.b >>= netbiasshift;
                    neuron.g >>= netbiasshift;
                    neuron.r >>= netbiasshift;
                    neuron.a >>= netbiasshift;
                }
            };
            /**
             * Move adjacent neurons by precomputed alpha*(1-((i-j)^2/[r]^2)) in radpower[|i-j|]
             */
            NeuQuant.prototype._alterneigh = function (rad, i, b, g, r, al) {
                var j, k, lo, hi, a, m, p;
                lo = i - rad;
                if (lo < -1)
                    lo = -1;
                hi = i + rad;
                if (hi > this._netsize)
                    hi = this._netsize;
                j = i + 1;
                k = i - 1;
                m = 1;
                while ((j < hi) || (k > lo)) {
                    a = this._radpower[m++];
                    if (j < hi) {
                        p = this._network[j++];
                        p.b -= (a * (p.b - b)) / alpharadbias;
                        p.g -= (a * (p.g - g)) / alpharadbias;
                        p.r -= (a * (p.r - r)) / alpharadbias;
                        p.a -= (a * (p.a - al)) / alpharadbias;
                    }
                    if (k > lo) {
                        p = this._network[k--];
                        p.b -= (a * (p.b - b)) / alpharadbias;
                        p.g -= (a * (p.g - g)) / alpharadbias;
                        p.r -= (a * (p.r - r)) / alpharadbias;
                        p.al -= (a * (p.a - al)) / alpharadbias;
                    }
                }
            };
            /**
             * Move neuron i towards biased (b,g,r) by factor alpha
             */
            NeuQuant.prototype._altersingle = function (alpha, i, b, g, r, a) {
                /* alter hit neuron */
                var n = this._network[i];
                n.b -= (alpha * (n.b - b)) / initalpha;
                n.g -= (alpha * (n.g - g)) / initalpha;
                n.r -= (alpha * (n.r - r)) / initalpha;
                n.a -= (alpha * (n.a - a)) / initalpha;
            };
            /**
             * Search for biased BGR values
             * description:
             *	finds closest neuron (min dist) and updates freq
             *	finds best neuron (min dist-bias) and returns position
             *	for frequently chosen neurons, freq[i] is high and bias[i] is negative
             *	bias[i] = gamma*((1/this._netsize)-freq[i])
             */
            NeuQuant.prototype._contest = function (b, g, r, al) {
                var i, dist, a, biasdist, betafreq, bestpos, bestbiaspos, bestd, bestbiasd, n;
                bestd = ~(1 << 31);
                bestbiasd = bestd;
                bestpos = -1;
                bestbiaspos = bestpos;
                for (i = 0; i < this._netsize; i++) {
                    n = this._network[i];
                    //dist = Utils.distEuclidean([ n.r, n.g, n.b, n.a], [r, g, b, al]);
                    dist = n.b - b;
                    if (dist < 0)
                        dist = -dist;
                    a = n.g - g;
                    if (a < 0)
                        a = -a;
                    dist += a;
                    a = n.r - r;
                    if (a < 0)
                        a = -a;
                    dist += a;
                    a = (n.a - al);
                    if (a < 0)
                        a = -a;
                    dist += a;
                    if (dist < bestd) {
                        bestd = dist;
                        bestpos = i;
                    }
                    biasdist = dist - ((this._bias[i]) >> (intbiasshift - netbiasshift));
                    if (biasdist < bestbiasd) {
                        bestbiasd = biasdist;
                        bestbiaspos = i;
                    }
                    betafreq = (this._freq[i] >> betashift);
                    this._freq[i] -= betafreq;
                    this._bias[i] += (betafreq << gammashift);
                }
                this._freq[bestpos] += beta;
                this._bias[bestpos] -= betagamma;
                return (bestbiaspos);
            };
            return NeuQuant;
        })();
        Palette.NeuQuant = NeuQuant;
    })(Palette = IQ.Palette || (IQ.Palette = {}));
})(IQ || (IQ = {}));
/*
 * Copyright (c) 2015, Leon Sorokin
 * All rights reserved. (MIT Licensed)
 *
 * RgbQuant.js - an image quantization lib
 */
/**
 * @preserve TypeScript port:
 * Copyright (c) 2015, Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * rgbquant.ts - part of color quantization collection
 */
/// <reference path='../../utils/point.ts' />
/// <reference path='../../utils/palette.ts' />
/// <reference path='../../utils/pointContainer.ts' />
///<reference path="colorHistogram.ts"/>
/// <reference path='../../utils/utils.ts' />
var IQ;
(function (IQ) {
    var Palette;
    (function (Palette) {
        // TODO: make input/output image and input/output palettes with instances of class Point only!
        var RgbQuant = (function () {
            function RgbQuant(colors, method) {
                if (colors === void 0) { colors = 256; }
                if (method === void 0) { method = 2; }
                // desired final palette size
                this._colors = colors;
                // accumulated histogram
                this._histogram = new IQ.Utils.ColorHistogram(method, colors);
                this._initialDistance = 0.01;
                this._distanceIncrement = 0.005;
            }
            // gathers histogram info
            RgbQuant.prototype.sample = function (image) {
                this._histogram.sample(image);
            };
            // reduces histogram to palette, remaps & memoizes reduced colors
            RgbQuant.prototype.quantize = function () {
                var idxi32 = this._histogram.getImportanceSortedColorsIDXI32(), palette = this._buildPalette(idxi32);
                palette.sort();
                return palette;
            };
            // reduces similar colors from an importance-sorted Uint32 rgba array
            RgbQuant.prototype._buildPalette = function (idxi32) {
                // reduce histogram to create initial palette
                // build full rgb palette
                var palette = new IQ.Utils.Palette(), colorArray = palette.getPointContainer().getPointArray();
                for (var i = 0; i < idxi32.length; i++) {
                    colorArray.push(IQ.Utils.Point.createByUint32(idxi32[i]));
                }
                var len = colorArray.length, palLen = len, thold = this._initialDistance;
                // palette already at or below desired length
                if (palLen > this._colors) {
                    while (palLen > this._colors) {
                        var memDist = [];
                        // iterate palette
                        for (var i = 0; i < len; i++) {
                            var pxi = colorArray[i];
                            if (!pxi)
                                continue;
                            for (var j = i + 1; j < len; j++) {
                                var pxj = colorArray[j];
                                if (!pxj)
                                    continue;
                                var dist = IQ.Utils.distEuclidean(pxi, pxj);
                                if (dist < thold) {
                                    // store index,rgb,dist
                                    memDist.push([j, pxj, dist]);
                                    colorArray[j] = null;
                                    palLen--;
                                }
                            }
                        }
                        // palette reduction pass
                        // console.log("palette length: " + palLen);
                        // if palette is still much larger than target, increment by larger initDist
                        thold += (palLen > this._colors * 3) ? this._initialDistance : this._distanceIncrement;
                    }
                    // if palette is over-reduced, re-add removed colors with largest distances from last round
                    if (palLen < this._colors) {
                        // sort descending
                        IQ.Utils.sort.call(memDist, function (a, b) {
                            return b[2] - a[2];
                        });
                        var k = 0;
                        while (palLen < this._colors && k < memDist.length) {
                            // re-inject rgb into final palette
                            colorArray[memDist[k][0]] = memDist[k][1];
                            palLen++;
                            k++;
                        }
                    }
                }
                var colors = colorArray.length;
                for (var colorIndex = colors - 1; colorIndex >= 0; colorIndex--) {
                    if (!colorArray[colorIndex]) {
                        if (colorIndex !== colors - 1) {
                            colorArray[colorIndex] = colorArray[colors - 1];
                        }
                        --colors;
                    }
                }
                colorArray.length = colors;
                return palette;
            };
            return RgbQuant;
        })();
        Palette.RgbQuant = RgbQuant;
    })(Palette = IQ.Palette || (IQ.Palette = {}));
})(IQ || (IQ = {}));
var IQ;
(function (IQ) {
    var Palette;
    (function (Palette) {
        function createArray1D(dimension1) {
            var a = [];
            for (var k = 0; k < dimension1; k++) {
                a[k] = 0;
            }
            return a;
        }
        function createArray4D(dimension1, dimension2, dimension3, dimension4) {
            var a = [];
            for (var i = 0; i < dimension1; i++) {
                a[i] = [];
                for (var j = 0; j < dimension2; j++) {
                    a[i][j] = [];
                    for (var k = 0; k < dimension3; k++) {
                        a[i][j][k] = [];
                        for (var l = 0; l < dimension4; l++) {
                            a[i][j][k][l] = 0;
                        }
                    }
                }
            }
            return a;
        }
        function createArray3D(dimension1, dimension2, dimension3) {
            var a = [];
            for (var i = 0; i < dimension1; i++) {
                a[i] = [];
                for (var j = 0; j < dimension2; j++) {
                    a[i][j] = [];
                    for (var k = 0; k < dimension3; k++) {
                        a[i][j][k] = 0;
                    }
                }
            }
            return a;
        }
        var WuColorCube = (function () {
            function WuColorCube() {
            }
            return WuColorCube;
        })();
        Palette.WuColorCube = WuColorCube;
        var WuQuant = (function () {
            function WuQuant(colors) {
                if (colors === void 0) { colors = 256; }
                this._colors = colors;
                // TODO: 'C' version use maxColors=256 for 256 colors palette, 'C#' version uses maxColors=512 for 256 colors palette. I think it is for colors count variation in 'C#' version.
                WuQuant.maxColors = colors;
                // creates all the _cubes
                this._cubes = [];
                // initializes all the _cubes
                for (var cubeIndex = 0; cubeIndex < WuQuant.maxColors; cubeIndex++) {
                    this._cubes[cubeIndex] = new WuColorCube();
                }
                // resets the reference minimums
                this._cubes[0].redMinimum = 0;
                this._cubes[0].greenMinimum = 0;
                this._cubes[0].blueMinimum = 0;
                this._cubes[0].alphaMinimum = 0;
                // resets the reference maximums
                this._cubes[0].redMaximum = WuQuant.maxSideIndex;
                this._cubes[0].greenMaximum = WuQuant.maxSideIndex;
                this._cubes[0].blueMaximum = WuQuant.maxSideIndex;
                this._cubes[0].alphaMaximum = WuQuant.alphaMaxSideIndex;
                this._weights = createArray4D(WuQuant.sideSize, WuQuant.sideSize, WuQuant.sideSize, WuQuant.alphaSideSize);
                this._momentsRed = createArray4D(WuQuant.sideSize, WuQuant.sideSize, WuQuant.sideSize, WuQuant.alphaSideSize);
                this._momentsGreen = createArray4D(WuQuant.sideSize, WuQuant.sideSize, WuQuant.sideSize, WuQuant.alphaSideSize);
                this._momentsBlue = createArray4D(WuQuant.sideSize, WuQuant.sideSize, WuQuant.sideSize, WuQuant.alphaSideSize);
                this._momentsAlpha = createArray4D(WuQuant.sideSize, WuQuant.sideSize, WuQuant.sideSize, WuQuant.alphaSideSize);
                this._moments = createArray4D(WuQuant.sideSize, WuQuant.sideSize, WuQuant.sideSize, WuQuant.alphaSideSize);
                this._table = [];
                for (var tableIndex = 0; tableIndex < 256; ++tableIndex) {
                    this._table[tableIndex] = tableIndex * tableIndex;
                }
                this._pixels = [];
            }
            WuQuant.prototype.sample = function (image) {
                var pointArray = image.getPointArray();
                for (var i = 0, l = pointArray.length; i < l; i++) {
                    this._addColor(pointArray[i]);
                }
                this._pixels = this._pixels.concat(pointArray);
            };
            WuQuant.prototype.quantize = function () {
                var l;
                // preprocess the colors
                this._calculateMoments();
                var next = 0, volumeVariance = createArray1D(WuQuant.maxColors);
                // processes the cubes
                for (var cubeIndex = 1; cubeIndex < this._colors; ++cubeIndex) {
                    // if cut is possible; make it
                    if (this._cut(this._cubes[next], this._cubes[cubeIndex])) {
                        volumeVariance[next] = this._cubes[next].volume > 1 ? this._calculateVariance(this._cubes[next]) : 0.0;
                        volumeVariance[cubeIndex] = this._cubes[cubeIndex].volume > 1 ? this._calculateVariance(this._cubes[cubeIndex]) : 0.0;
                    }
                    else {
                        // the cut was not possible, revert the index
                        volumeVariance[next] = 0.0;
                        cubeIndex--;
                    }
                    next = 0;
                    var temp = volumeVariance[0];
                    for (var index = 1; index <= cubeIndex; ++index) {
                        if (volumeVariance[index] > temp) {
                            temp = volumeVariance[index];
                            next = index;
                        }
                    }
                    if (temp <= 0.0) {
                        this._colors = cubeIndex + 1;
                        break;
                    }
                }
                var lookupRed = [], lookupGreen = [], lookupBlue = [], lookupAlpha = [];
                // precalculates lookup tables
                for (var k = 0; k < this._colors; ++k) {
                    var weight = WuQuant._volume(this._cubes[k], this._weights) | 0;
                    if (weight > 0) {
                        lookupRed[k] = (WuQuant._volume(this._cubes[k], this._momentsRed) / weight) | 0;
                        lookupGreen[k] = (WuQuant._volume(this._cubes[k], this._momentsGreen) / weight) | 0;
                        lookupBlue[k] = (WuQuant._volume(this._cubes[k], this._momentsBlue) / weight) | 0;
                        lookupAlpha[k] = (WuQuant._volume(this._cubes[k], this._momentsAlpha) / weight) | 0;
                    }
                    else {
                        lookupRed[k] = 0;
                        lookupGreen[k] = 0;
                        lookupBlue[k] = 0;
                        lookupAlpha[k] = 0;
                    }
                }
                this._reds = createArray1D(this._colors + 1);
                this._greens = createArray1D(this._colors + 1);
                this._blues = createArray1D(this._colors + 1);
                this._alphas = createArray1D(this._colors + 1);
                this._sums = createArray1D(this._colors + 1);
                // scans and adds colors
                l = this._pixels.length;
                for (var index = 0; index < l; index++) {
                    var color = this._pixels[index];
                    var match = -1, bestMatch = match, bestDistance = 100000000;
                    for (var lookup = 0; lookup < this._colors; lookup++) {
                        var foundRed = lookupRed[lookup], foundGreen = lookupGreen[lookup], foundBlue = lookupBlue[lookup], foundAlpha = lookupAlpha[lookup], deltaRed = color.r - foundRed, deltaGreen = color.g - foundGreen, deltaBlue = color.b - foundBlue, deltaAlpha = color.a - foundAlpha, distance = deltaRed * deltaRed + deltaGreen * deltaGreen + deltaBlue * deltaBlue + deltaAlpha * deltaAlpha;
                        //console.log(deltaAlpha, color.a, foundAlpha);
                        if (distance < bestDistance) {
                            bestDistance = distance;
                            bestMatch = lookup;
                        }
                    }
                    this._reds[bestMatch] += color.r;
                    this._greens[bestMatch] += color.g;
                    this._blues[bestMatch] += color.b;
                    this._alphas[bestMatch] += color.a;
                    this._sums[bestMatch]++;
                }
                var palette = new IQ.Utils.Palette();
                // generates palette
                for (var paletteIndex = 0; paletteIndex < this._colors; paletteIndex++) {
                    if (this._sums[paletteIndex] > 0) {
                        this._reds[paletteIndex] = (this._reds[paletteIndex] / this._sums[paletteIndex]) | 0;
                        this._greens[paletteIndex] = (this._greens[paletteIndex] / this._sums[paletteIndex]) | 0;
                        this._blues[paletteIndex] = (this._blues[paletteIndex] / this._sums[paletteIndex]) | 0;
                        this._alphas[paletteIndex] = (this._alphas[paletteIndex] / this._sums[paletteIndex]) | 0;
                    }
                    //console.log(this._reds[paletteIndex], this._greens[paletteIndex], this._blues[paletteIndex], this._alphas[paletteIndex]);
                    var color = IQ.Utils.Point.createByRGBA(this._reds[paletteIndex], this._greens[paletteIndex], this._blues[paletteIndex], this._alphas[paletteIndex]);
                    palette.add(color);
                }
                palette.sort();
                return palette;
            };
            WuQuant.prototype._addColor = function (color) {
                var indexRed = (color.r >> 3) + 1, indexGreen = (color.g >> 3) + 1, indexBlue = (color.b >> 3) + 1, indexAlpha = (color.a >> 3) + 1;
                //if(color.a > 10) {
                this._weights[indexRed][indexGreen][indexBlue][indexAlpha]++;
                this._momentsRed[indexRed][indexGreen][indexBlue][indexAlpha] += color.r;
                this._momentsGreen[indexRed][indexGreen][indexBlue][indexAlpha] += color.g;
                this._momentsBlue[indexRed][indexGreen][indexBlue][indexAlpha] += color.b;
                this._momentsAlpha[indexRed][indexGreen][indexBlue][indexAlpha] += color.a;
                this._moments[indexRed][indexGreen][indexBlue][indexAlpha] += this._table[color.r] + this._table[color.g] + this._table[color.b] + this._table[color.a];
                //			}
            };
            /**
             * Converts the histogram to a series of _moments.
             */
            WuQuant.prototype._calculateMoments = function () {
                var area = [], areaRed = [], areaGreen = [], areaBlue = [], areaAlpha = [], area2 = [];
                /*
                            var xarea:number[][][] = createArray3D(WuQuant.sideSize, WuQuant.sideSize, WuQuant.sideSize),
                                xareaRed:number[][][] = createArray3D(WuQuant.sideSize, WuQuant.sideSize, WuQuant.sideSize),
                                xareaGreen:number[][][] = createArray3D(WuQuant.sideSize, WuQuant.sideSize, WuQuant.sideSize),
                                xareaBlue:number[][][] = createArray3D(WuQuant.sideSize, WuQuant.sideSize, WuQuant.sideSize),
                                xareaAlpha:number[][][] = createArray3D(WuQuant.sideSize, WuQuant.sideSize, WuQuant.sideSize),
                                xarea2:number[][][] = createArray3D(WuQuant.sideSize, WuQuant.sideSize, WuQuant.sideSize);
                */
                for (var alphaIndex = 1; alphaIndex <= WuQuant.alphaMaxSideIndex; ++alphaIndex) {
                    var xarea = createArray3D(WuQuant.sideSize, WuQuant.sideSize, WuQuant.sideSize), xareaRed = createArray3D(WuQuant.sideSize, WuQuant.sideSize, WuQuant.sideSize), xareaGreen = createArray3D(WuQuant.sideSize, WuQuant.sideSize, WuQuant.sideSize), xareaBlue = createArray3D(WuQuant.sideSize, WuQuant.sideSize, WuQuant.sideSize), xareaAlpha = createArray3D(WuQuant.sideSize, WuQuant.sideSize, WuQuant.sideSize), xarea2 = createArray3D(WuQuant.sideSize, WuQuant.sideSize, WuQuant.sideSize);
                    for (var redIndex = 1; redIndex <= WuQuant.maxSideIndex; ++redIndex) {
                        for (var index = 0; index <= WuQuant.maxSideIndex; ++index) {
                            area[index] = 0;
                            areaRed[index] = 0;
                            areaGreen[index] = 0;
                            areaBlue[index] = 0;
                            areaAlpha[index] = 0;
                            area2[index] = 0;
                        }
                        for (var greenIndex = 1; greenIndex <= WuQuant.maxSideIndex; ++greenIndex) {
                            var line = 0, lineRed = 0, lineGreen = 0, lineBlue = 0, lineAlpha = 0, line2 = 0.0;
                            for (var blueIndex = 1; blueIndex <= WuQuant.maxSideIndex; ++blueIndex) {
                                line += this._weights[redIndex][greenIndex][blueIndex][alphaIndex];
                                lineRed += this._momentsRed[redIndex][greenIndex][blueIndex][alphaIndex];
                                lineGreen += this._momentsGreen[redIndex][greenIndex][blueIndex][alphaIndex];
                                lineBlue += this._momentsBlue[redIndex][greenIndex][blueIndex][alphaIndex];
                                lineAlpha += this._momentsAlpha[redIndex][greenIndex][blueIndex][alphaIndex];
                                line2 += this._moments[redIndex][greenIndex][blueIndex][alphaIndex];
                                area[blueIndex] += line;
                                areaRed[blueIndex] += lineRed;
                                areaGreen[blueIndex] += lineGreen;
                                areaBlue[blueIndex] += lineBlue;
                                areaAlpha[blueIndex] += lineAlpha;
                                area2[blueIndex] += line2;
                                xarea[redIndex][greenIndex][blueIndex] = xarea[redIndex - 1][greenIndex][blueIndex] + area[blueIndex];
                                xareaRed[redIndex][greenIndex][blueIndex] = xareaRed[redIndex - 1][greenIndex][blueIndex] + areaRed[blueIndex];
                                xareaGreen[redIndex][greenIndex][blueIndex] = xareaGreen[redIndex - 1][greenIndex][blueIndex] + areaGreen[blueIndex];
                                xareaBlue[redIndex][greenIndex][blueIndex] = xareaBlue[redIndex - 1][greenIndex][blueIndex] + areaBlue[blueIndex];
                                xareaAlpha[redIndex][greenIndex][blueIndex] = xareaAlpha[redIndex - 1][greenIndex][blueIndex] + areaAlpha[blueIndex];
                                xarea2[redIndex][greenIndex][blueIndex] = xarea2[redIndex - 1][greenIndex][blueIndex] + area2[blueIndex];
                                this._weights[redIndex][greenIndex][blueIndex][alphaIndex] = this._weights[redIndex][greenIndex][blueIndex][alphaIndex - 1] + xarea[redIndex][greenIndex][blueIndex];
                                this._momentsRed[redIndex][greenIndex][blueIndex][alphaIndex] = this._momentsRed[redIndex][greenIndex][blueIndex][alphaIndex - 1] + xareaRed[redIndex][greenIndex][blueIndex];
                                this._momentsGreen[redIndex][greenIndex][blueIndex][alphaIndex] = this._momentsGreen[redIndex][greenIndex][blueIndex][alphaIndex - 1] + xareaGreen[redIndex][greenIndex][blueIndex];
                                this._momentsBlue[redIndex][greenIndex][blueIndex][alphaIndex] = this._momentsBlue[redIndex][greenIndex][blueIndex][alphaIndex - 1] + xareaBlue[redIndex][greenIndex][blueIndex];
                                this._momentsAlpha[redIndex][greenIndex][blueIndex][alphaIndex] = this._momentsAlpha[redIndex][greenIndex][blueIndex][alphaIndex - 1] + xareaAlpha[redIndex][greenIndex][blueIndex];
                                this._moments[redIndex][greenIndex][blueIndex][alphaIndex] = this._moments[redIndex][greenIndex][blueIndex][alphaIndex - 1] + xarea2[redIndex][greenIndex][blueIndex];
                            }
                        }
                    }
                }
            };
            /**
             * Computes the volume of the cube in a specific moment.
             */
            WuQuant._volume = function (cube, moment) {
                return (moment[cube.alphaMaximum][cube.redMaximum][cube.greenMaximum][cube.blueMaximum] -
                    moment[cube.alphaMaximum][cube.redMaximum][cube.greenMinimum][cube.blueMaximum] -
                    moment[cube.alphaMaximum][cube.redMinimum][cube.greenMaximum][cube.blueMaximum] +
                    moment[cube.alphaMaximum][cube.redMinimum][cube.greenMinimum][cube.blueMaximum] -
                    moment[cube.alphaMinimum][cube.redMaximum][cube.greenMaximum][cube.blueMaximum] +
                    moment[cube.alphaMinimum][cube.redMaximum][cube.greenMinimum][cube.blueMaximum] +
                    moment[cube.alphaMinimum][cube.redMinimum][cube.greenMaximum][cube.blueMaximum] -
                    moment[cube.alphaMinimum][cube.redMinimum][cube.greenMinimum][cube.blueMaximum]) -
                    (moment[cube.alphaMaximum][cube.redMaximum][cube.greenMaximum][cube.blueMinimum] -
                        moment[cube.alphaMinimum][cube.redMaximum][cube.greenMaximum][cube.blueMinimum] -
                        moment[cube.alphaMaximum][cube.redMaximum][cube.greenMinimum][cube.blueMinimum] +
                        moment[cube.alphaMinimum][cube.redMaximum][cube.greenMinimum][cube.blueMinimum] -
                        moment[cube.alphaMaximum][cube.redMinimum][cube.greenMaximum][cube.blueMinimum] +
                        moment[cube.alphaMinimum][cube.redMinimum][cube.greenMaximum][cube.blueMinimum] +
                        moment[cube.alphaMaximum][cube.redMinimum][cube.greenMinimum][cube.blueMinimum] -
                        moment[cube.alphaMinimum][cube.redMinimum][cube.greenMinimum][cube.blueMinimum]);
            };
            /**
             * Splits the cube in given position][and color direction.
             */
            WuQuant._top = function (cube, direction, position, moment) {
                switch (direction) {
                    case WuQuant.alpha:
                        return (moment[position][cube.redMaximum][cube.greenMaximum][cube.blueMaximum] -
                            moment[position][cube.redMaximum][cube.greenMinimum][cube.blueMaximum] -
                            moment[position][cube.redMinimum][cube.greenMaximum][cube.blueMaximum] +
                            moment[position][cube.redMinimum][cube.greenMinimum][cube.blueMaximum]) -
                            (moment[position][cube.redMaximum][cube.greenMaximum][cube.blueMinimum] -
                                moment[position][cube.redMaximum][cube.greenMinimum][cube.blueMinimum] -
                                moment[position][cube.redMinimum][cube.greenMaximum][cube.blueMinimum] +
                                moment[position][cube.redMinimum][cube.greenMinimum][cube.blueMinimum]);
                    case WuQuant.red:
                        return (moment[cube.alphaMaximum][position][cube.greenMaximum][cube.blueMaximum] -
                            moment[cube.alphaMaximum][position][cube.greenMinimum][cube.blueMaximum] -
                            moment[cube.alphaMinimum][position][cube.greenMaximum][cube.blueMaximum] +
                            moment[cube.alphaMinimum][position][cube.greenMinimum][cube.blueMaximum]) -
                            (moment[cube.alphaMaximum][position][cube.greenMaximum][cube.blueMinimum] -
                                moment[cube.alphaMaximum][position][cube.greenMinimum][cube.blueMinimum] -
                                moment[cube.alphaMinimum][position][cube.greenMaximum][cube.blueMinimum] +
                                moment[cube.alphaMinimum][position][cube.greenMinimum][cube.blueMinimum]);
                    case WuQuant.green:
                        return (moment[cube.alphaMaximum][cube.redMaximum][position][cube.blueMaximum] -
                            moment[cube.alphaMaximum][cube.redMinimum][position][cube.blueMaximum] -
                            moment[cube.alphaMinimum][cube.redMaximum][position][cube.blueMaximum] +
                            moment[cube.alphaMinimum][cube.redMinimum][position][cube.blueMaximum]) -
                            (moment[cube.alphaMaximum][cube.redMaximum][position][cube.blueMinimum] -
                                moment[cube.alphaMaximum][cube.redMinimum][position][cube.blueMinimum] -
                                moment[cube.alphaMinimum][cube.redMaximum][position][cube.blueMinimum] +
                                moment[cube.alphaMinimum][cube.redMinimum][position][cube.blueMinimum]);
                    case WuQuant.blue:
                        return (moment[cube.alphaMaximum][cube.redMaximum][cube.greenMaximum][position] -
                            moment[cube.alphaMaximum][cube.redMaximum][cube.greenMinimum][position] -
                            moment[cube.alphaMaximum][cube.redMinimum][cube.greenMaximum][position] +
                            moment[cube.alphaMaximum][cube.redMinimum][cube.greenMinimum][position]) -
                            (moment[cube.alphaMinimum][cube.redMaximum][cube.greenMaximum][position] -
                                moment[cube.alphaMinimum][cube.redMaximum][cube.greenMinimum][position] -
                                moment[cube.alphaMinimum][cube.redMinimum][cube.greenMaximum][position] +
                                moment[cube.alphaMinimum][cube.redMinimum][cube.greenMinimum][position]);
                    default:
                        return 0;
                }
            };
            /**
             * Splits the cube in a given color direction at its minimum.
             */
            WuQuant._bottom = function (cube, direction, moment) {
                switch (direction) {
                    case WuQuant.alpha:
                        return (-moment[cube.alphaMinimum][cube.redMaximum][cube.greenMaximum][cube.blueMaximum] +
                            moment[cube.alphaMinimum][cube.redMaximum][cube.greenMinimum][cube.blueMaximum] +
                            moment[cube.alphaMinimum][cube.redMinimum][cube.greenMaximum][cube.blueMaximum] -
                            moment[cube.alphaMinimum][cube.redMinimum][cube.greenMinimum][cube.blueMaximum]) -
                            (-moment[cube.alphaMinimum][cube.redMaximum][cube.greenMaximum][cube.blueMinimum] +
                                moment[cube.alphaMinimum][cube.redMaximum][cube.greenMinimum][cube.blueMinimum] +
                                moment[cube.alphaMinimum][cube.redMinimum][cube.greenMaximum][cube.blueMinimum] -
                                moment[cube.alphaMinimum][cube.redMinimum][cube.greenMinimum][cube.blueMinimum]);
                    case WuQuant.red:
                        return (-moment[cube.alphaMaximum][cube.redMinimum][cube.greenMaximum][cube.blueMaximum] +
                            moment[cube.alphaMaximum][cube.redMinimum][cube.greenMinimum][cube.blueMaximum] +
                            moment[cube.alphaMinimum][cube.redMinimum][cube.greenMaximum][cube.blueMaximum] -
                            moment[cube.alphaMinimum][cube.redMinimum][cube.greenMinimum][cube.blueMaximum]) -
                            (-moment[cube.alphaMaximum][cube.redMinimum][cube.greenMaximum][cube.blueMinimum] +
                                moment[cube.alphaMaximum][cube.redMinimum][cube.greenMinimum][cube.blueMinimum] +
                                moment[cube.alphaMinimum][cube.redMinimum][cube.greenMaximum][cube.blueMinimum] -
                                moment[cube.alphaMinimum][cube.redMinimum][cube.greenMinimum][cube.blueMinimum]);
                    case WuQuant.green:
                        return (-moment[cube.alphaMaximum][cube.redMaximum][cube.greenMinimum][cube.blueMaximum] +
                            moment[cube.alphaMaximum][cube.redMinimum][cube.greenMinimum][cube.blueMaximum] +
                            moment[cube.alphaMinimum][cube.redMaximum][cube.greenMinimum][cube.blueMaximum] -
                            moment[cube.alphaMinimum][cube.redMinimum][cube.greenMinimum][cube.blueMaximum]) -
                            (-moment[cube.alphaMaximum][cube.redMaximum][cube.greenMinimum][cube.blueMinimum] +
                                moment[cube.alphaMaximum][cube.redMinimum][cube.greenMinimum][cube.blueMinimum] +
                                moment[cube.alphaMinimum][cube.redMaximum][cube.greenMinimum][cube.blueMinimum] -
                                moment[cube.alphaMinimum][cube.redMinimum][cube.greenMinimum][cube.blueMinimum]);
                    case WuQuant.blue:
                        return (-moment[cube.alphaMaximum][cube.redMaximum][cube.greenMaximum][cube.blueMinimum] +
                            moment[cube.alphaMaximum][cube.redMaximum][cube.greenMinimum][cube.blueMinimum] +
                            moment[cube.alphaMaximum][cube.redMinimum][cube.greenMaximum][cube.blueMinimum] -
                            moment[cube.alphaMaximum][cube.redMinimum][cube.greenMinimum][cube.blueMinimum]) -
                            (-moment[cube.alphaMinimum][cube.redMaximum][cube.greenMaximum][cube.blueMinimum] +
                                moment[cube.alphaMinimum][cube.redMaximum][cube.greenMinimum][cube.blueMinimum] +
                                moment[cube.alphaMinimum][cube.redMinimum][cube.greenMaximum][cube.blueMinimum] -
                                moment[cube.alphaMinimum][cube.redMinimum][cube.greenMinimum][cube.blueMinimum]);
                    default:
                        return 0;
                }
            };
            /**
             * Calculates statistical variance for a given cube.
             */
            WuQuant.prototype._calculateVariance = function (cube) {
                var volumeRed = WuQuant._volume(cube, this._momentsRed) | 0, volumeGreen = WuQuant._volume(cube, this._momentsGreen) | 0, volumeBlue = WuQuant._volume(cube, this._momentsBlue) | 0, volumeAlpha = WuQuant._volume(cube, this._momentsAlpha) | 0, volumeMoment = WuQuant._volume(cube, this._moments), volumeWeight = WuQuant._volume(cube, this._weights) | 0, distance = volumeRed * volumeRed + volumeGreen * volumeGreen + volumeBlue * volumeBlue + volumeAlpha * volumeAlpha;
                var result = volumeMoment - (distance / volumeWeight);
                if (isNaN(result))
                    throw new Error("x");
                return result;
            };
            /**
             * Finds the optimal (maximal) position for the cut.
             */
            WuQuant.prototype._maximize = function (cube, direction, first, last, cut, wholeRed, wholeGreen, wholeBlue, wholeAlpha, wholeWeight) {
                var bottomRed = WuQuant._bottom(cube, direction, this._momentsRed) | 0, bottomGreen = WuQuant._bottom(cube, direction, this._momentsGreen) | 0, bottomBlue = WuQuant._bottom(cube, direction, this._momentsBlue) | 0, bottomAlpha = WuQuant._bottom(cube, direction, this._momentsAlpha) | 0, bottomWeight = WuQuant._bottom(cube, direction, this._weights) | 0, result = 0.0;
                cut[0] = -1;
                for (var position = first; position < last; ++position) {
                    // determines the cube cut at a certain position
                    var halfRed = bottomRed + WuQuant._top(cube, direction, position, this._momentsRed) | 0, halfGreen = bottomGreen + WuQuant._top(cube, direction, position, this._momentsGreen) | 0, halfBlue = bottomBlue + WuQuant._top(cube, direction, position, this._momentsBlue) | 0, halfAlpha = bottomAlpha + WuQuant._top(cube, direction, position, this._momentsAlpha) | 0, halfWeight = bottomWeight + WuQuant._top(cube, direction, position, this._weights) | 0;
                    // the cube cannot be cut at bottom (this would lead to empty cube)
                    if (halfWeight != 0) {
                        var halfDistance = halfRed * halfRed + halfGreen * halfGreen + halfBlue * halfBlue + halfAlpha * halfAlpha, temp = halfDistance / halfWeight;
                        halfRed = wholeRed - halfRed;
                        halfGreen = wholeGreen - halfGreen;
                        halfBlue = wholeBlue - halfBlue;
                        halfAlpha = wholeAlpha - halfAlpha;
                        halfWeight = wholeWeight - halfWeight;
                        if (halfWeight != 0) {
                            halfDistance = halfRed * halfRed + halfGreen * halfGreen + halfBlue * halfBlue + halfAlpha * halfAlpha;
                            temp += halfDistance / halfWeight;
                            if (temp > result) {
                                result = temp;
                                cut[0] = position;
                            }
                        }
                    }
                }
                return result;
            };
            // Cuts a cube with another one.
            WuQuant.prototype._cut = function (first, second) {
                var direction, cutRed = [0], cutGreen = [0], cutBlue = [0], cutAlpha = [0], wholeRed = WuQuant._volume(first, this._momentsRed) | 0, wholeGreen = WuQuant._volume(first, this._momentsGreen) | 0, wholeBlue = WuQuant._volume(first, this._momentsBlue) | 0, wholeAlpha = WuQuant._volume(first, this._momentsAlpha) | 0, wholeWeight = WuQuant._volume(first, this._weights) | 0, maxRed = this._maximize(first, WuQuant.red, first.redMinimum + 1, first.redMaximum, cutRed, wholeRed, wholeGreen, wholeBlue, wholeAlpha, wholeWeight), maxGreen = this._maximize(first, WuQuant.green, first.greenMinimum + 1, first.greenMaximum, cutGreen, wholeRed, wholeGreen, wholeBlue, wholeAlpha, wholeWeight), maxBlue = this._maximize(first, WuQuant.blue, first.blueMinimum + 1, first.blueMaximum, cutBlue, wholeRed, wholeGreen, wholeBlue, wholeAlpha, wholeWeight), maxAlpha = this._maximize(first, WuQuant.alpha, first.alphaMinimum + 1, first.alphaMaximum, cutAlpha, wholeRed, wholeGreen, wholeBlue, wholeAlpha, wholeWeight);
                if ((maxAlpha >= maxRed) && (maxAlpha >= maxGreen) && (maxAlpha >= maxBlue)) {
                    direction = WuQuant.alpha;
                    // cannot split empty cube
                    if (cutAlpha[0] < 0)
                        return false;
                }
                else {
                    if (maxRed >= maxAlpha && maxRed >= maxGreen && maxRed >= maxBlue) {
                        direction = WuQuant.red;
                    }
                    else if (maxGreen >= maxAlpha && maxGreen >= maxRed && maxGreen >= maxBlue) {
                        direction = WuQuant.green;
                    }
                    else {
                        direction = WuQuant.blue;
                    }
                }
                second.redMaximum = first.redMaximum;
                second.greenMaximum = first.greenMaximum;
                second.blueMaximum = first.blueMaximum;
                second.alphaMaximum = first.alphaMaximum;
                // cuts in a certain direction
                switch (direction) {
                    case WuQuant.red:
                        second.redMinimum = first.redMaximum = cutRed[0];
                        second.greenMinimum = first.greenMinimum;
                        second.blueMinimum = first.blueMinimum;
                        second.alphaMinimum = first.alphaMinimum;
                        break;
                    case WuQuant.green:
                        second.greenMinimum = first.greenMaximum = cutGreen[0];
                        second.redMinimum = first.redMinimum;
                        second.blueMinimum = first.blueMinimum;
                        second.alphaMinimum = first.alphaMinimum;
                        break;
                    case WuQuant.blue:
                        second.blueMinimum = first.blueMaximum = cutBlue[0];
                        second.redMinimum = first.redMinimum;
                        second.greenMinimum = first.greenMinimum;
                        second.alphaMinimum = first.alphaMinimum;
                        break;
                    case WuQuant.alpha:
                        second.alphaMinimum = first.alphaMaximum = cutAlpha[0];
                        second.blueMinimum = first.blueMinimum;
                        second.redMinimum = first.redMinimum;
                        second.greenMinimum = first.greenMinimum;
                        break;
                }
                // determines the volumes after cut
                first.volume = (first.redMaximum - first.redMinimum) * (first.greenMaximum - first.greenMinimum) * (first.blueMaximum - first.blueMinimum) * (first.alphaMaximum - first.alphaMinimum);
                second.volume = (second.redMaximum - second.redMinimum) * (second.greenMaximum - second.greenMinimum) * (second.blueMaximum - second.blueMinimum) * (second.alphaMaximum - second.alphaMinimum);
                // the cut was successfull
                return true;
            };
            WuQuant.maxColors = 512;
            WuQuant.red = 2;
            WuQuant.green = 1;
            WuQuant.blue = 0;
            WuQuant.alpha = 3;
            WuQuant.maxSideIndex = 32;
            WuQuant.alphaMaxSideIndex = 32;
            WuQuant.sideSize = WuQuant.maxSideIndex + 1;
            WuQuant.alphaSideSize = WuQuant.alphaMaxSideIndex + 1;
            return WuQuant;
        })();
        Palette.WuQuant = WuQuant;
    })(Palette = IQ.Palette || (IQ.Palette = {}));
})(IQ || (IQ = {}));
// based on https://github.com/rhys-e/structural-similarity
// http://en.wikipedia.org/wiki/Structural_similarity
var IQ;
(function (IQ) {
    var Quality;
    (function (Quality) {
        var K1 = 0.01, K2 = 0.03;
        var RED_COEFFICIENT = 0.212655, GREEN_COEFFICIENT = 0.715158, BLUE_COEFFICIENT = 0.072187;
        var SSIM = (function () {
            function SSIM() {
            }
            SSIM.prototype.compare = function (image1, image2) {
                if (image1.getHeight() !== image2.getHeight() || image1.getWidth() !== image2.getWidth()) {
                    throw new Error("Images have different sizes!");
                }
                var bitsPerComponent = 8, L = (1 << bitsPerComponent) - 1, c1 = Math.pow((K1 * L), 2), c2 = Math.pow((K2 * L), 2), numWindows = 0, mssim = 0.0;
                //calculate ssim for each window
                this._iterate(image1, image2, function (lumaValues1, lumaValues2, averageLumaValue1, averageLumaValue2) {
                    //calculate variance and covariance
                    var sigxy, sigsqx, sigsqy;
                    sigxy = sigsqx = sigsqy = 0.0;
                    for (var i = 0; i < lumaValues1.length; i++) {
                        sigsqx += Math.pow((lumaValues1[i] - averageLumaValue1), 2);
                        sigsqy += Math.pow((lumaValues2[i] - averageLumaValue2), 2);
                        sigxy += (lumaValues1[i] - averageLumaValue1) * (lumaValues2[i] - averageLumaValue2);
                    }
                    var numPixelsInWin = lumaValues1.length - 1;
                    sigsqx /= numPixelsInWin;
                    sigsqy /= numPixelsInWin;
                    sigxy /= numPixelsInWin;
                    //perform ssim calculation on window
                    var numerator = (2 * averageLumaValue1 * averageLumaValue2 + c1) * (2 * sigxy + c2), denominator = (Math.pow(averageLumaValue1, 2) + Math.pow(averageLumaValue2, 2) + c1) * (sigsqx + sigsqy + c2), ssim = numerator / denominator;
                    mssim += ssim;
                    numWindows++;
                });
                return mssim / numWindows;
            };
            SSIM.prototype._iterate = function (image1, image2, callback) {
                var windowSize = 8, width = image1.getWidth(), height = image1.getHeight();
                for (var y = 0; y < height; y += windowSize) {
                    for (var x = 0; x < width; x += windowSize) {
                        // avoid out-of-width/height
                        var windowWidth = Math.min(windowSize, width - x), windowHeight = Math.min(windowSize, height - y);
                        var lumaValues1 = this._calculateLumaValuesForWindow(image1, x, y, windowWidth, windowHeight), lumaValues2 = this._calculateLumaValuesForWindow(image2, x, y, windowWidth, windowHeight), averageLuma1 = this._calculateAverageLuma(lumaValues1), averageLuma2 = this._calculateAverageLuma(lumaValues2);
                        callback(lumaValues1, lumaValues2, averageLuma1, averageLuma2);
                    }
                }
            };
            SSIM.prototype._calculateLumaValuesForWindow = function (image, x, y, width, height) {
                var pointArray = image.getPointArray(), lumaValues = [], counter = 0;
                for (var j = y; j < y + height; j++) {
                    var offset = j * image.getWidth();
                    for (var i = x; i < x + width; i++) {
                        var point = pointArray[offset + i];
                        lumaValues[counter] = point.r * RED_COEFFICIENT + point.g * GREEN_COEFFICIENT + point.b * BLUE_COEFFICIENT;
                        counter++;
                    }
                }
                return lumaValues;
            };
            SSIM.prototype._calculateAverageLuma = function (lumaValues) {
                var sumLuma = 0.0;
                for (var i = 0; i < lumaValues.length; i++) {
                    sumLuma += lumaValues[i];
                }
                return sumLuma / lumaValues.length;
            };
            return SSIM;
        })();
        Quality.SSIM = SSIM;
    })(Quality = IQ.Quality || (IQ.Quality = {}));
})(IQ || (IQ = {}));
/**
 * @preserve TypeScript port:
 * Copyright (c) 2015, Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * cq.ts - part of Color Quantization Library (ColorQuantCollection
 */
/// <reference path='utils/point.ts' />
/// <reference path='utils/palette.ts' />
/// <reference path='utils/pointContainer.ts' />
/// <reference path='utils/hueStatistics.ts' />
/// <reference path='image/iquantize.ts' />
/// <reference path='image/errorDiffusionDithering.ts' />
/// <reference path='image/nearest.ts' />
/// <reference path="palette/ipaletteQuantizer.ts"/>
/// <reference path="palette/neuquant/neuquant.ts"/>
/// <reference path="palette/rgbquant/rgbquant.ts"/>
/// <reference path="palette/wu/wuQuant.ts"/>
/// <reference path="quality/ssim.ts"/>
/// <reference path='utils/utils.ts' />
//# sourceMappingURL=iq.js.map