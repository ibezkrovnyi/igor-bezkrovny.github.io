var IQ;
(function (IQ) {
    var Color;
    (function (Color) {
        var Constants;
        (function (Constants) {
            var sRGB;
            (function (sRGB) {
                // sRGB (based on ITU-R Recommendation BT.709)
                // http://en.wikipedia.org/wiki/SRGB
                // luma coef
                (function (Y) {
                    Y[Y["RED"] = 0.2126] = "RED";
                    Y[Y["GREEN"] = 0.7152] = "GREEN";
                    Y[Y["BLUE"] = 0.0722] = "BLUE";
                    Y[Y["WHITE"] = 1] = "WHITE";
                })(sRGB.Y || (sRGB.Y = {}));
                var Y = sRGB.Y;
                (function (x) {
                    x[x["RED"] = 0.64] = "RED";
                    x[x["GREEN"] = 0.3] = "GREEN";
                    x[x["BLUE"] = 0.15] = "BLUE";
                    x[x["WHITE"] = 0.3127] = "WHITE";
                })(sRGB.x || (sRGB.x = {}));
                var x = sRGB.x;
                (function (y) {
                    y[y["RED"] = 0.33] = "RED";
                    y[y["GREEN"] = 0.6] = "GREEN";
                    y[y["BLUE"] = 0.06] = "BLUE";
                    y[y["WHITE"] = 0.329] = "WHITE";
                })(sRGB.y || (sRGB.y = {}));
                var y = sRGB.y;
            })(sRGB = Constants.sRGB || (Constants.sRGB = {}));
        })(Constants = Color.Constants || (Color.Constants = {}));
    })(Color = IQ.Color || (IQ.Color = {}));
})(IQ || (IQ = {}));
var IQ;
(function (IQ) {
    var Color;
    (function (Color) {
        var Conversion = (function () {
            function Conversion() {
            }
            Conversion.rgb2lab = function (r, g, b) {
                var xyz = Conversion.rgb2xyz(r, g, b);
                return Conversion.xyz2lab(xyz.x, xyz.y, xyz.z);
            };
            Conversion.lab2rgb = function (L, a, b) {
                var xyz = Conversion.lab2xyz(L, a, b);
                return Conversion.xyz2rgb(xyz.x, xyz.y, xyz.z);
            };
            Conversion.rgb2xyz = function (r, g, b) {
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
                    x: r * 0.4124 + g * 0.3576 + b * 0.1805, y: r * 0.2126 + g * 0.7152 + b * 0.0722, z: r * 0.0193 + g * 0.1192 + b * 0.9505
                };
            };
            Conversion.xyz2rgb = function (x, y, z) {
                x = x / 100; //X from 0 to  95.047      (Observer = 2�, Illuminant = D65)
                y = y / 100; //Y from 0 to 100.000
                z = z / 100; //Z from 0 to 108.883
                var r = x * 3.2406 + y * -1.5372 + z * -0.4986, g = x * -0.9689 + y * 1.8758 + z * 0.0415, b = x * 0.0557 + y * -0.2040 + z * 1.0570;
                r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
                g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
                b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;
                return {
                    r: r * 255, g: g * 255, b: b * 255
                };
            };
            Conversion.xyz2lab = function (x, y, z) {
                x = x / Conversion._refX; //ref_X =  95.047   Observer= 2�, Illuminant= D65
                y = y / Conversion._refY; //ref_Y = 100.000
                z = z / Conversion._refZ; //ref_Z = 108.883
                x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
                y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
                z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);
                return {
                    L: (116 * y) - 16, a: 500 * (x - y), b: 200 * (y - z)
                };
            };
            Conversion.lab2xyz = function (L, a, b) {
                var y = (L + 16) / 116, x = a / 500 + y, z = y - b / 200;
                var y3 = Math.pow(y, 3), x3 = Math.pow(x, 3), z3 = Math.pow(z, 3);
                y = y3 > 0.008856 ? y3 : (y - 16 / 116) / 7.787;
                x = x3 > 0.008856 ? x3 : (x - 16 / 116) / 7.787;
                z = z3 > 0.008856 ? z3 : (z - 16 / 116) / 7.787;
                return {
                    x: Conversion._refX * x,
                    y: Conversion._refY * y,
                    z: Conversion._refZ * z //ref_Z = 108.883
                };
            };
            // http://alienryderflex.com/hsp.html
            Conversion.rgb2lum = function (r, g, b) {
                // TODO: luma = point.r * RED_COEFFICIENT + point.g * GREEN_COEFFICIENT + point.b * BLUE_COEFFICIENT
                // TODO: why here another formula??
                return Math.sqrt(Color.Constants.sRGB.Y.RED * r * r + Color.Constants.sRGB.Y.GREEN * g * g + Color.Constants.sRGB.Y.BLUE * b * b);
            };
            // http://rgb2hsl.nichabi.com/javascript-function.php
            Conversion.rgb2hsl = function (r, g, b) {
                var max, min, h, s, l, d;
                r /= 255;
                g /= 255;
                b /= 255;
                max = IQ.Utils.max3(r, g, b);
                min = IQ.Utils.min3(r, g, b);
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
                    h: h, s: s, l: Conversion.rgb2lum(r, g, b)
                };
            };
            Conversion._refX = 95.047;
            Conversion._refY = 100.0;
            Conversion._refZ = 108.883;
            return Conversion;
        })();
        Color.Conversion = Conversion;
    })(Color = IQ.Color || (IQ.Color = {}));
})(IQ || (IQ = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="common.ts"/>
///<reference path="conversion.ts"/>
///<reference path="constants.ts"/>
var IQ;
(function (IQ) {
    var Color;
    (function (Color) {
        // Perceptual Euclidean color distance
        var DistanceEuclidean = (function () {
            function DistanceEuclidean() {
                this._setDefaults();
                // set default maximal color component deltas (255 - 0 = 255)
                this.setMaximalColorDeltas(255, 255, 255, 255);
            }
            DistanceEuclidean.prototype._setDefaults = function () {
                this._Pr = Color.Constants.sRGB.Y.RED;
                this._Pg = Color.Constants.sRGB.Y.GREEN;
                this._Pb = Color.Constants.sRGB.Y.BLUE;
                // TODO: what is the best coef below?
                this._Pa = 1;
            };
            DistanceEuclidean.prototype.calculateRaw = function (r1, g1, b1, a1, r2, g2, b2, a2) {
                var dR = r2 - r1, dG = g2 - g1, dB = b2 - b1, dA = a2 - a1;
                return this._Pr * dR * dR + this._Pg * dG * dG + this._Pb * dB * dB + this._Pa * dA * dA;
            };
            DistanceEuclidean.prototype.calculateNormalized = function (colorA, colorB) {
                return Math.sqrt(this.calculateRaw(colorA.r, colorA.g, colorA.b, colorA.a, colorB.r, colorB.g, colorB.b, colorB.a)) / this._maxEuclideanDistance;
            };
            /**
             * To simulate original RgbQuant distance you need to set `maxAlphaDelta = 0`
             */
            DistanceEuclidean.prototype.setMaximalColorDeltas = function (maxRedDelta, maxGreenDelta, maxBlueDelta, maxAlphaDelta) {
                this._maxEuclideanDistance = Math.sqrt(this.calculateRaw(maxRedDelta, maxGreenDelta, maxBlueDelta, maxAlphaDelta, 0, 0, 0, 0));
            };
            return DistanceEuclidean;
        })();
        Color.DistanceEuclidean = DistanceEuclidean;
        // Perceptual Euclidean color distance
        var DistanceEuclideanWuQuant = (function (_super) {
            __extends(DistanceEuclideanWuQuant, _super);
            function DistanceEuclideanWuQuant() {
                _super.apply(this, arguments);
            }
            DistanceEuclideanWuQuant.prototype._setDefaults = function () {
                this._Pr = this._Pg = this._Pb = this._Pa = 1;
            };
            return DistanceEuclideanWuQuant;
        })(DistanceEuclidean);
        Color.DistanceEuclideanWuQuant = DistanceEuclideanWuQuant;
        // Perceptual Euclidean color distance
        var DistanceEuclideanRgbQuantWOAlpha = (function (_super) {
            __extends(DistanceEuclideanRgbQuantWOAlpha, _super);
            function DistanceEuclideanRgbQuantWOAlpha() {
                _super.apply(this, arguments);
            }
            DistanceEuclideanRgbQuantWOAlpha.prototype._setDefaults = function () {
                this._Pr = Color.Constants.sRGB.Y.RED;
                this._Pg = Color.Constants.sRGB.Y.GREEN;
                this._Pb = Color.Constants.sRGB.Y.BLUE;
                this._Pa = 0;
            };
            return DistanceEuclideanRgbQuantWOAlpha;
        })(DistanceEuclidean);
        Color.DistanceEuclideanRgbQuantWOAlpha = DistanceEuclideanRgbQuantWOAlpha;
        // Manhattan distance
        var DistanceManhattan = (function () {
            function DistanceManhattan() {
                this._setDefaults();
                // set default maximal color component deltas (255 - 0 = 255)
                this.setMaximalColorDeltas(255, 255, 255, 255);
            }
            DistanceManhattan.prototype._setDefaults = function () {
                this._Pr = Color.Constants.sRGB.Y.RED;
                this._Pg = Color.Constants.sRGB.Y.GREEN;
                this._Pb = Color.Constants.sRGB.Y.BLUE;
                // TODO: what is the best coef below?
                this._Pa = 1;
            };
            DistanceManhattan.prototype.setMaximalColorDeltas = function (maxRedDelta, maxGreenDelta, maxBlueDelta, maxAlphaDelta) {
                this._maxManhattanDistance = this.calculateRaw(maxRedDelta, maxGreenDelta, maxBlueDelta, maxAlphaDelta, 0, 0, 0, 0);
            };
            DistanceManhattan.prototype.calculateRaw = function (r1, g1, b1, a1, r2, g2, b2, a2) {
                var dR = r2 - r1, dG = g2 - g1, dB = b2 - b1, dA = a2 - a1;
                if (dR < 0)
                    dR = 0 - dR;
                if (dG < 0)
                    dG = 0 - dG;
                if (dB < 0)
                    dB = 0 - dB;
                if (dA < 0)
                    dA = 0 - dA;
                return this._Pr * dR + this._Pg * dG + this._Pb * dB + this._Pa * dA;
            };
            DistanceManhattan.prototype.calculateNormalized = function (colorA, colorB) {
                return this.calculateRaw(colorA.r, colorA.g, colorA.b, colorA.a, colorB.r, colorB.g, colorB.b, colorB.a) / this._maxManhattanDistance;
            };
            return DistanceManhattan;
        })();
        Color.DistanceManhattan = DistanceManhattan;
        // Manhattan distance (NeuQuant version) - w/o sRGB coefficients
        var DistanceManhattanNeuQuant = (function (_super) {
            __extends(DistanceManhattanNeuQuant, _super);
            function DistanceManhattanNeuQuant() {
                _super.apply(this, arguments);
            }
            DistanceManhattanNeuQuant.prototype._setDefaults = function () {
                this._Pr = this._Pg = this._Pb = this._Pa = 1;
            };
            return DistanceManhattanNeuQuant;
        })(DistanceManhattan);
        Color.DistanceManhattanNeuQuant = DistanceManhattanNeuQuant;
        // CIEDE2000 algorithm
        var DistanceCIEDE2000 = (function () {
            function DistanceCIEDE2000() {
            }
            DistanceCIEDE2000.prototype.setMaximalColorDeltas = function (maxRedDelta, maxGreenDelta, maxBlueDelta, maxAlphaDelta) {
            };
            DistanceCIEDE2000.prototype.calculateRaw = function (r1, g1, b1, a1, r2, g2, b2, a2) {
                var lab1 = Color.Conversion.rgb2lab(r1, g1, b1), lab2 = Color.Conversion.rgb2lab(r2, g2, b2);
                return this.calculateRawInLab(lab1, a1, lab2, a2);
            };
            DistanceCIEDE2000.prototype.calculateRawInLab = function (Lab1, alpha1, Lab2, alpha2) {
                // Get L,a,b values for color 1
                var L1 = Lab1.L;
                var a1 = Lab1.a;
                var b1 = Lab1.b;
                // Get L,a,b values for color 2
                var L2 = Lab2.L;
                var a2 = Lab2.a;
                var b2 = Lab2.b;
                // Weight factors
                var kL = 1;
                var kC = 1;
                var kH = 1;
                /**
                 * Step 1: Calculate C1p, C2p, h1p, h2p
                 */
                var C1 = Math.sqrt(Math.pow(a1, 2) + Math.pow(b1, 2)), C2 = Math.sqrt(Math.pow(a2, 2) + Math.pow(b2, 2)), a_C1_C2 = (C1 + C2) / 2.0, G = 0.5 * (1 - Math.sqrt(Math.pow(a_C1_C2, 7.0) / (Math.pow(a_C1_C2, 7.0) + Math.pow(25.0, 7.0)))), a1p = (1.0 + G) * a1, a2p = (1.0 + G) * a2, C1p = Math.sqrt(Math.pow(a1p, 2) + Math.pow(b1, 2)), C2p = Math.sqrt(Math.pow(a2p, 2) + Math.pow(b2, 2)), h1p = this._hp_f(b1, a1p), h2p = this._hp_f(b2, a2p); //(7)
                /**
                 * Step 2: Calculate dLp, dCp, dHp
                 */
                var dLp = L2 - L1, dCp = C2p - C1p, dhp = this._dhp_f(C1, C2, h1p, h2p), dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(this._radians(dhp) / 2.0); //(11)
                /**
                 * Step 3: Calculate CIEDE2000 Color-Difference
                 */
                var a_L = (L1 + L2) / 2.0, a_Cp = (C1p + C2p) / 2.0, a_hp = this._a_hp_f(C1, C2, h1p, h2p), T = 1 - 0.17 * Math.cos(this._radians(a_hp - 30)) + 0.24 * Math.cos(this._radians(2 * a_hp)) + 0.32 * Math.cos(this._radians(3 * a_hp + 6)) - 0.20 * Math.cos(this._radians(4 * a_hp - 63)), d_ro = 30 * Math.exp(-(Math.pow((a_hp - 275) / 25, 2))), RC = Math.sqrt((Math.pow(a_Cp, 7.0)) / (Math.pow(a_Cp, 7.0) + Math.pow(25.0, 7.0))), SL = 1 + ((0.015 * Math.pow(a_L - 50, 2)) / Math.sqrt(20 + Math.pow(a_L - 50, 2.0))), SC = 1 + 0.045 * a_Cp, SH = 1 + 0.015 * a_Cp * T, RT = -2 * RC * Math.sin(this._radians(2 * d_ro)), dE = Math.sqrt(Math.pow(dLp / (SL * kL), 2) + Math.pow(dCp / (SC * kC), 2) + Math.pow(dHp / (SH * kH), 2) + RT * (dCp / (SC * kC)) * (dHp / (SH * kH))), dA = alpha2 - alpha1;
                return dE * dE + dA * dA;
            };
            DistanceCIEDE2000.prototype.calculateNormalized = function (colorA, colorB) {
                return Math.sqrt(this.calculateRaw(colorA.r, colorA.g, colorA.b, colorA.a, colorB.r, colorB.g, colorB.b, colorB.a));
            };
            DistanceCIEDE2000.prototype._degrees = function (n) {
                return n * (180 / Math.PI);
            };
            DistanceCIEDE2000.prototype._radians = function (n) {
                return n * (Math.PI / 180);
            };
            DistanceCIEDE2000.prototype._hp_f = function (x, y) {
                if (x === 0 && y === 0) {
                    return 0;
                }
                else {
                    var tmphp = this._degrees(Math.atan2(x, y));
                    if (tmphp >= 0) {
                        return tmphp;
                    }
                    else {
                        return tmphp + 360;
                    }
                }
            };
            DistanceCIEDE2000.prototype._a_hp_f = function (C1, C2, h1p, h2p) {
                if (C1 * C2 === 0) {
                    return h1p + h2p;
                }
                else if (Math.abs(h1p - h2p) <= 180) {
                    return (h1p + h2p) / 2.0;
                }
                else if (Math.abs(h1p - h2p) > 180 && h1p + h2p < 360) {
                    return (h1p + h2p + 360) / 2.0;
                }
                else if ((Math.abs(h1p - h2p) > 180) && ((h1p + h2p) >= 360)) {
                    return (h1p + h2p - 360) / 2.0;
                }
                else
                    throw (new Error());
            };
            DistanceCIEDE2000.prototype._dhp_f = function (C1, C2, h1p, h2p) {
                if (C1 * C2 === 0) {
                    return 0;
                }
                else if (Math.abs(h2p - h1p) <= 180) {
                    return h2p - h1p;
                }
                else if (h2p - h1p > 180) {
                    return (h2p - h1p) - 360;
                }
                else if (h2p - h1p < -180) {
                    return (h2p - h1p) + 360;
                }
                else {
                    throw new Error();
                }
            };
            return DistanceCIEDE2000;
        })();
        Color.DistanceCIEDE2000 = DistanceCIEDE2000;
    })(Color = IQ.Color || (IQ.Color = {}));
})(IQ || (IQ = {}));
var IQ;
(function (IQ) {
    var Utils;
    (function (Utils) {
        "use strict";
        /**
         * v8 optimized class
         * 1) "constructor" should have initialization with worst types
         * 2) "set" should have |0 / >>> 0
         */
        var Point = (function () {
            function Point() {
                this.uint32 = -1 >>> 0;
                this.r = this.g = this.b = this.a = 0;
                this.rgba = new Array(4); /*[ this.r , this.g , this.b , this.a ]*/
                this.rgba[0] = 0;
                this.rgba[1] = 0;
                this.rgba[2] = 0;
                this.rgba[3] = 0;
                /*
                            this.Lab = {
                                L : 0.0,
                                a : 0.0,
                                b : 0.0
                            };
                */
            }
            Point.createByQuadruplet = function (quadruplet) {
                var point = new Point();
                point.r = quadruplet[0] | 0;
                point.g = quadruplet[1] | 0;
                point.b = quadruplet[2] | 0;
                point.a = quadruplet[3] | 0;
                point._loadUINT32();
                point._loadQuadruplet();
                //point._loadLab();
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
                //point._loadLab();
                return point;
            };
            Point.createByUint32 = function (uint32) {
                var point = new Point();
                point.uint32 = uint32 >>> 0;
                point._loadRGBA();
                point._loadQuadruplet();
                //point._loadLab();
                return point;
            };
            Point.prototype.from = function (point) {
                this.r = point.r;
                this.g = point.g;
                this.b = point.b;
                this.a = point.a;
                this.uint32 = point.uint32;
                this.rgba[0] = point.r;
                this.rgba[1] = point.g;
                this.rgba[2] = point.b;
                this.rgba[3] = point.a;
                /*
                            this.Lab.L = point.Lab.L;
                            this.Lab.a = point.Lab.a;
                            this.Lab.b = point.Lab.b;
                */
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
                this.uint32 = (this.a << 24 | this.b << 16 | this.g << 8 | this.r) >>> 0;
            };
            Point.prototype._loadRGBA = function () {
                this.r = this.uint32 & 0xff;
                this.g = (this.uint32 >>> 8) & 0xff;
                this.b = (this.uint32 >>> 16) & 0xff;
                this.a = (this.uint32 >>> 24) & 0xff;
            };
            Point.prototype._loadQuadruplet = function () {
                this.rgba[0] = this.r;
                this.rgba[1] = this.g;
                this.rgba[2] = this.b;
                this.rgba[3] = this.a;
                /*
                            var xyz = rgb2xyz(this.r, this.g, this.b);
                            var lab = xyz2lab(xyz.x, xyz.y, xyz.z);
                            this.lab.l = lab.l;
                            this.lab.a = lab.a;
                            this.lab.b = lab.b;
                */
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
        function max3(a, b, c) {
            var m = a;
            (m < b) && (m = b);
            (m < c) && (m = c);
            return m;
        }
        Utils.max3 = max3;
        function min3(a, b, c) {
            var m = a;
            (m > b) && (m = b);
            (m > c) && (m = c);
            return m;
        }
        Utils.min3 = min3;
        function intInRange(value, low, high) {
            (value > high) && (value = high);
            (value < low) && (value = low);
            return value | 0;
        }
        Utils.intInRange = intInRange;
        // http://rgb2hsl.nichabi.com/javascript-function.php
        function rgb2hsl(r, g, b) {
            var max, min, h, s, l, d;
            r /= 255;
            g /= 255;
            b /= 255;
            max = max3(r, g, b);
            min = min3(r, g, b);
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
        /*
            export function setMaxColorDistances(rd, gd, bd, ad) {
                maxEuclideanDistance = Math.sqrt(Pr * rd * rd + Pg * gd * gd + Pb * bd * bd + Pa * ad * ad);
            }
        */
        var maxEuclideanDistance = (Pr * rd + Pg * gd + Pb * bd + Pa * ad);
        // perceptual Euclidean color distance
        function distEuclidean(colorA, colorB) {
            var rd = Math.abs(colorB.r - colorA.r), gd = Math.abs(colorB.g - colorA.g), bd = Math.abs(colorB.b - colorA.b), ad = Math.abs(colorB.a - colorA.a);
            return (Pr * rd + Pg * gd + Pb * bd + Pa * ad) / maxEuclideanDistance;
        }
        Utils.distEuclidean = distEuclidean;
        /*
            var maxEuclideanDistance = Math.sqrt(Pr * rd * rd + Pg * gd * gd + Pb * bd * bd + Pa * ad * ad);
        
            // perceptual Euclidean color distance
            export function distEuclidean(colorA : Point, colorB : Point) {
                var rd = colorB.r - colorA.r,
                    gd = colorB.g - colorA.g,
                    bd = colorB.b - colorA.b,
                    ad = colorB.a - colorA.a;
        
                return Math.sqrt(Pr * rd * rd + Pg * gd * gd + Pb * bd * bd + Pa * ad * ad) / maxEuclideanDistance;
            }
        */
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
                    var effc = Math.round((box.w * box.h) / area) * ColorHistogram._boxPixels, histL = {}, col;
                    if (effc < 2)
                        effc = 2;
                    this._iterateBox(box, width, function (i) {
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
            ColorHistogram.prototype._iterateBox = function (bbox, wid, fn) {
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
            Palette.prototype.getNearestColor = function (colorDistanceCalculator, color) {
                return this._pointArray[this.getNearestIndex(colorDistanceCalculator, color) | 0];
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
            Palette.prototype.getNearestIndex = function (colorDistanceCalculator, point) {
                var idx = this._nearestPointFromCache("" + point.uint32);
                if (idx >= 0)
                    return idx;
                var minimalDistance = Number.MAX_VALUE;
                for (var idx = 0, i = 0, l = this._pointArray.length; i < l; i++) {
                    var p = this._pointArray[i], distance = colorDistanceCalculator.calculateRaw(point.r, point.g, point.b, point.a, p.r, p.g, p.b, p.a);
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
                    var hslA = Utils.rgb2hsl(a.r, a.g, a.b), hslB = Utils.rgb2hsl(b.r, b.g, b.b);
                    // sort all grays + whites together
                    var hueA = (a.r === a.g && a.g === a.b) ? 0 : 1 + Utils.hueGroup(hslA.h, hueGroups);
                    var hueB = (b.r === b.g && b.g === b.b) ? 0 : 1 + Utils.hueGroup(hslB.h, hueGroups);
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
                    //var satDiff = Utils.satGroup(+hslB.s.toFixed(2)) - Utils.satGroup(+hslA.s.toFixed(2));
                    var satDiff = ((hslB.s * 100) | 0) - ((hslA.s * 100) | 0);
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
            PointContainer.prototype.toUint32Array = function () {
                var l = this._pointArray.length, uint32Array = new Uint32Array(l);
                for (var i = 0; i < l; i++) {
                    uint32Array[i] = this._pointArray[i].uint32;
                }
                return uint32Array;
            };
            PointContainer.prototype.toUint8Array = function () {
                return new Uint8Array(this.toUint32Array().buffer);
            };
            PointContainer.fromHTMLImageElement = function (img) {
                var width = img.naturalWidth, height = img.naturalHeight;
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height, 0, 0, width, height);
                return PointContainer.fromHTMLCanvasElement(canvas);
            };
            PointContainer.fromHTMLCanvasElement = function (canvas) {
                var width = canvas.width, height = canvas.height;
                var ctx = canvas.getContext("2d"), imgData = ctx.getImageData(0, 0, width, height);
                return PointContainer.fromImageData(imgData);
            };
            PointContainer.fromNodeCanvas = function (canvas) {
                return PointContainer.fromHTMLCanvasElement(canvas);
            };
            PointContainer.fromImageData = function (imageData) {
                var width = imageData.width, height = imageData.height;
                return PointContainer.fromCanvasPixelArray(imageData.data, width, height);
                /*
                 var buf8;
                 if (Utils.typeOf(imageData.data) == "CanvasPixelArray")
                 buf8 = new Uint8Array(imageData.data);
                 else
                 buf8 = imageData.data;
    
                 this.fromUint32Array(new Uint32Array(buf8.buffer), width, height);
                 */
            };
            PointContainer.fromArray = function (data, width, height) {
                var uint8array = new Uint8Array(data);
                return PointContainer.fromUint32Array(new Uint32Array(uint8array.buffer), width, height);
            };
            PointContainer.fromCanvasPixelArray = function (data, width, height) {
                return PointContainer.fromArray(data, width, height);
            };
            PointContainer.fromUint32Array = function (uint32array, width, height) {
                var container = new PointContainer();
                container._width = width;
                container._height = height;
                container._pointArray = []; //new Array(uint32array.length);
                for (var i = 0, l = uint32array.length; i < l; i++) {
                    container._pointArray[i] = Utils.Point.createByUint32(uint32array[i] | 0); // "| 0" is added for v8 optimization
                }
                return container;
            };
            return PointContainer;
        })();
        Utils.PointContainer = PointContainer;
    })(Utils = IQ.Utils || (IQ.Utils = {}));
})(IQ || (IQ = {}));
/// <reference path='common.ts' />
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
            function ErrorDiffusionDithering(colorDistanceCalculator, kernel, serpentine, minimumColorDistanceToDither, calculateErrorLikeGIMP) {
                if (serpentine === void 0) { serpentine = true; }
                if (minimumColorDistanceToDither === void 0) { minimumColorDistanceToDither = 0; }
                if (calculateErrorLikeGIMP === void 0) { calculateErrorLikeGIMP = true; }
                this._setKernel(kernel);
                this._distance = colorDistanceCalculator;
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
                    var kernelErrorLines = this._kernel[i][2] + 1;
                    (maxErrorLines < kernelErrorLines) && (maxErrorLines = kernelErrorLines);
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
                        var correctedPoint = IQ.Utils.Point.createByRGBA(IQ.Utils.intInRange(point.r + error[0], 0, 255), IQ.Utils.intInRange(point.g + error[1], 0, 255), IQ.Utils.intInRange(point.b + error[2], 0, 255), IQ.Utils.intInRange(point.a + error[3], 0, 255));
                        // Reduced pixel
                        var palettePoint = palette.getNearestColor(this._distance, correctedPoint);
                        point.from(palettePoint);
                        // dithering strength
                        if (this._minColorDistance) {
                            var dist = this._distance.calculateNormalized(point, palettePoint);
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
/// <reference path='common.ts' />
var IQ;
(function (IQ) {
    var Image;
    (function (Image) {
        var NearestNeighbour = (function () {
            function NearestNeighbour(colorDistanceCalculator) {
                this._distance = colorDistanceCalculator;
            }
            NearestNeighbour.prototype.quantize = function (pointBuffer, palette) {
                var pointArray = pointBuffer.getPointArray(), width = pointBuffer.getWidth(), height = pointBuffer.getHeight();
                for (var y = 0; y < height; y++) {
                    for (var x = 0, idx = y * width; x < width; x++, idx++) {
                        // Image pixel
                        var point = pointArray[idx];
                        // Reduced pixel
                        point.from(palette.getNearestColor(this._distance, point));
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
///<reference path="../common.ts"/>
///<reference path="../../color/common.ts"/>
var IQ;
(function (IQ) {
    var Palette;
    (function (Palette) {
        "use strict";
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
                return IQ.Utils.Point.createByRGBA(this.r | 0, this.g | 0, this.b | 0, this.a | 0);
            };
            return Neuron;
        })();
        var NeuQuant = (function () {
            function NeuQuant(colorDistanceCalculator, colors) {
                if (colors === void 0) { colors = 256; }
                this._distance = colorDistanceCalculator;
                this._pointArray = [];
                this._sampleFactor = 1;
                this._networkSize = colors;
                this._distance.setMaximalColorDeltas(255 << netbiasshift, 255 << netbiasshift, 255 << netbiasshift, 255 << netbiasshift);
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
                this._radPower = [];
                this._network = [];
                for (var i = 0; i < this._networkSize; i++) {
                    this._network[i] = new Neuron((i << (netbiasshift + 8)) / this._networkSize);
                    // 1/this._networkSize
                    this._freq[i] = intbias / this._networkSize;
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
                    this._sampleFactor = 1;
                var alphadec = 30 + ((this._sampleFactor - 1) / 3);
                pix = 0;
                lim = lengthcount;
                samplepixels = lengthcount / (bytesPerPoint * this._sampleFactor);
                delta = (samplepixels / ncycles) | 0;
                alpha = initalpha;
                radius = (this._networkSize >> 3) * radiusbias;
                rad = radius >> radiusbiasshift;
                if (rad <= 1)
                    rad = 0;
                for (i = 0; i < rad; i++)
                    this._radPower[i] = alpha * (((rad * rad - i * i) * radbias) / (rad * rad));
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
                            this._radPower[j] = alpha * (((rad * rad - j * j) * radbias) / (rad * rad));
                    }
                }
            };
            /**
             * Insertion sort of network and building of netindex[0..255] (to do after unbias)
             */
            NeuQuant.prototype._inxbuild = function () {
                var i, j, smallpos, smallval, p, q;
                for (i = 0; i < this._networkSize; i++) {
                    p = this._network[i];
                    smallpos = i;
                    smallval = p.g;
                    /* find smallest in i..this._networkSize-1 */
                    for (j = i + 1; j < this._networkSize; j++) {
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
                for (var j = 0; j < this._networkSize; j++) {
                    palette.add(this._network[j].toPoint());
                }
                palette.sort();
                return palette;
            };
            /**
             * Unbias network to give byte values 0..255 and record position i to prepare for sort
             */
            NeuQuant.prototype._unbiasnet = function () {
                for (var i = 0; i < this._networkSize; i++) {
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
                if (hi > this._networkSize)
                    hi = this._networkSize;
                j = i + 1;
                k = i - 1;
                m = 1;
                while ((j < hi) || (k > lo)) {
                    a = this._radPower[m++];
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
                        p.a -= (a * (p.a - al)) / alpharadbias;
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
            NeuQuant.prototype._contest = function (b, g, r, al) {
                var multiplier = (255 * 4) << netbiasshift, bestd = ~(1 << 31), bestbiasd = bestd, bestpos = -1, bestbiaspos = bestpos;
                for (var i = 0; i < this._networkSize; i++) {
                    var n = this._network[i];
                    var dist = this._distance.calculateNormalized(n, { r: r, g: g, b: b, a: al }) * multiplier;
                    if (dist < bestd) {
                        bestd = dist;
                        bestpos = i;
                    }
                    var biasdist = dist - ((this._bias[i]) >> (intbiasshift - netbiasshift));
                    if (biasdist < bestbiasd) {
                        bestbiasd = biasdist;
                        bestbiaspos = i;
                    }
                    var betafreq = (this._freq[i] >> betashift);
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
/// <reference path='../../utils/utils.ts' />
///<reference path="../../color/common.ts"/>
///<reference path="colorHistogram.ts"/>
var IQ;
(function (IQ) {
    var Palette;
    (function (Palette) {
        var RemovedColor = (function () {
            function RemovedColor(index, color, distance) {
                this.index = index;
                this.color = color;
                this.distance = distance;
            }
            return RemovedColor;
        })();
        // TODO: make input/output image and input/output palettes with instances of class Point only!
        var RgbQuant = (function () {
            function RgbQuant(colorDistanceCalculator, colors, method) {
                if (colors === void 0) { colors = 256; }
                if (method === void 0) { method = 2; }
                this._distance = colorDistanceCalculator;
                // desired final palette size
                this._colors = colors;
                // histogram to accumulate
                this._histogram = new IQ.Utils.ColorHistogram(method, colors);
                this._initialDistance = 0.01;
                this._distanceIncrement = 0.005;
            }
            // gathers histogram info
            RgbQuant.prototype.sample = function (image) {
                /*
                            var pointArray = image.getPointArray(), max = [0, 0, 0, 0], min = [255, 255, 255, 255];
                
                            for (var i = 0, l = pointArray.length; i < l; i++) {
                                var color = pointArray[i];
                                for (var componentIndex = 0; componentIndex < 4; componentIndex++) {
                                    if (max[componentIndex] < color.rgba[componentIndex]) max[componentIndex] = color.rgba[componentIndex];
                                    if (min[componentIndex] > color.rgba[componentIndex]) min[componentIndex] = color.rgba[componentIndex];
                                }
                            }
                            var rd = max[0] - min[0], gd = max[1] - min[1], bd = max[2] - min[2], ad = max[3] - min[3];
                            this._distance.setMaximalColorDeltas(rd, gd, bd, ad);
                
                            this._initialDistance = (Math.sqrt(rd * rd + gd * gd + bd * bd + ad * ad) / Math.sqrt(255 * 255 + 255 * 255 + 255 * 255)) * 0.01;
                */
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
                var palette = new IQ.Utils.Palette(), colorArray = palette.getPointContainer().getPointArray(), usageArray = new Array(idxi32.length);
                for (var i = 0; i < idxi32.length; i++) {
                    colorArray.push(IQ.Utils.Point.createByUint32(idxi32[i]));
                    usageArray[i] = 1;
                }
                var len = colorArray.length, palLen = len, thold = this._initialDistance, memDist = [];
                // palette already at or below desired length
                while (palLen > this._colors) {
                    memDist.length = 0;
                    // iterate palette
                    for (var i = 0; i < len; i++) {
                        if (usageArray[i] === 0)
                            continue;
                        var pxi = colorArray[i];
                        //if (!pxi) continue;
                        for (var j = i + 1; j < len; j++) {
                            if (usageArray[j] === 0)
                                continue;
                            var pxj = colorArray[j];
                            //if (!pxj) continue;
                            var dist = this._distance.calculateNormalized(pxi, pxj);
                            if (dist < thold) {
                                // store index,rgb,dist
                                memDist.push(new RemovedColor(j, pxj, dist));
                                usageArray[j] = 0;
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
                        return b.distance - a.distance;
                    });
                    var k = 0;
                    while (palLen < this._colors && k < memDist.length) {
                        var removedColor = memDist[k];
                        // re-inject rgb into final palette
                        usageArray[removedColor.index] = 1;
                        palLen++;
                        k++;
                    }
                }
                var colors = colorArray.length;
                for (var colorIndex = colors - 1; colorIndex >= 0; colorIndex--) {
                    if (usageArray[colorIndex] === 0) {
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
///<reference path="../../color/common.ts"/>
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
            var a = new Array(dimension1);
            for (var i = 0; i < dimension1; i++) {
                a[i] = new Array(dimension2);
                for (var j = 0; j < dimension2; j++) {
                    a[i][j] = new Array(dimension3);
                    for (var k = 0; k < dimension3; k++) {
                        a[i][j][k] = new Array(dimension4);
                        for (var l = 0; l < dimension4; l++) {
                            a[i][j][k][l] = 0;
                        }
                    }
                }
            }
            return a;
        }
        function createArray3D(dimension1, dimension2, dimension3) {
            var a = new Array(dimension1);
            for (var i = 0; i < dimension1; i++) {
                a[i] = new Array(dimension2);
                for (var j = 0; j < dimension2; j++) {
                    a[i][j] = new Array(dimension3);
                    for (var k = 0; k < dimension3; k++) {
                        a[i][j][k] = 0;
                    }
                }
            }
            return a;
        }
        function fillArray3D(a, dimension1, dimension2, dimension3, value) {
            for (var i = 0; i < dimension1; i++) {
                a[i] = [];
                for (var j = 0; j < dimension2; j++) {
                    a[i][j] = [];
                    for (var k = 0; k < dimension3; k++) {
                        a[i][j][k] = value;
                    }
                }
            }
        }
        function fillArray1D(a, dimension1, value) {
            for (var i = 0; i < dimension1; i++) {
                a[i] = value;
            }
        }
        var WuColorCube = (function () {
            function WuColorCube() {
            }
            return WuColorCube;
        })();
        Palette.WuColorCube = WuColorCube;
        var WuQuant = (function () {
            function WuQuant(colorDistanceCalculator, colors, significantBitsPerChannel) {
                if (colors === void 0) { colors = 256; }
                if (significantBitsPerChannel === void 0) { significantBitsPerChannel = 5; }
                this._distance = colorDistanceCalculator;
                this._setQuality(significantBitsPerChannel);
                this._initialize(colors);
            }
            WuQuant.prototype.sample = function (image) {
                var pointArray = image.getPointArray();
                for (var i = 0, l = pointArray.length; i < l; i++) {
                    this._addColor(pointArray[i]);
                }
                this._pixels = this._pixels.concat(pointArray);
            };
            WuQuant.prototype.quantize = function () {
                this._preparePalette();
                var palette = new IQ.Utils.Palette();
                // generates palette
                for (var paletteIndex = 0; paletteIndex < this._colors; paletteIndex++) {
                    if (this._sums[paletteIndex] > 0) {
                        var sum = this._sums[paletteIndex], r = this._reds[paletteIndex] / sum, g = this._greens[paletteIndex] / sum, b = this._blues[paletteIndex] / sum, a = this._alphas[paletteIndex] / sum;
                        var color = IQ.Utils.Point.createByRGBA(r | 0, g | 0, b | 0, a | 0);
                        palette.add(color);
                    }
                }
                palette.sort();
                return palette;
            };
            WuQuant.prototype._preparePalette = function () {
                var l;
                // preprocess the colors
                this._calculateMoments();
                var next = 0, volumeVariance = createArray1D(this._colors);
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
                    var weight = WuQuant._volume(this._cubes[k], this._weights);
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
                for (var index = 0, l = this._pixels.length; index < l; index++) {
                    var color = this._pixels[index];
                    var match = -1, bestMatch = match, bestDistance = Number.MAX_VALUE;
                    for (var lookup = 0; lookup < this._colors; lookup++) {
                        var foundRed = lookupRed[lookup], foundGreen = lookupGreen[lookup], foundBlue = lookupBlue[lookup], foundAlpha = lookupAlpha[lookup];
                        var distance = this._distance.calculateRaw(foundRed, foundGreen, foundBlue, foundAlpha, color.r, color.g, color.b, color.a);
                        //var distance = this._distance.calculateRaw(Utils.Point.createByRGBA(foundRed, foundGreen, foundBlue, foundAlpha), color);
                        //deltaRed   = color.r - foundRed,
                        //deltaGreen = color.g - foundGreen,
                        //deltaBlue  = color.b - foundBlue,
                        //deltaAlpha = color.a - foundAlpha,
                        //distance   = deltaRed * deltaRed + deltaGreen * deltaGreen + deltaBlue * deltaBlue + deltaAlpha * deltaAlpha;
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
            };
            WuQuant.prototype._addColor = function (color) {
                var bitsToRemove = 8 - this._significantBitsPerChannel, indexRed = (color.r >> bitsToRemove) + 1, indexGreen = (color.g >> bitsToRemove) + 1, indexBlue = (color.b >> bitsToRemove) + 1, indexAlpha = (color.a >> bitsToRemove) + 1;
                //if(color.a > 10) {
                this._weights[indexAlpha][indexRed][indexGreen][indexBlue]++;
                this._momentsRed[indexAlpha][indexRed][indexGreen][indexBlue] += color.r;
                this._momentsGreen[indexAlpha][indexRed][indexGreen][indexBlue] += color.g;
                this._momentsBlue[indexAlpha][indexRed][indexGreen][indexBlue] += color.b;
                this._momentsAlpha[indexAlpha][indexRed][indexGreen][indexBlue] += color.a;
                this._moments[indexAlpha][indexRed][indexGreen][indexBlue] += this._table[color.r] + this._table[color.g] + this._table[color.b] + this._table[color.a];
                //			}
            };
            /**
             * Converts the histogram to a series of _moments.
             */
            WuQuant.prototype._calculateMoments = function () {
                var area = [], areaRed = [], areaGreen = [], areaBlue = [], areaAlpha = [], area2 = [];
                var xarea = createArray3D(this._sideSize, this._sideSize, this._sideSize), xareaRed = createArray3D(this._sideSize, this._sideSize, this._sideSize), xareaGreen = createArray3D(this._sideSize, this._sideSize, this._sideSize), xareaBlue = createArray3D(this._sideSize, this._sideSize, this._sideSize), xareaAlpha = createArray3D(this._sideSize, this._sideSize, this._sideSize), xarea2 = createArray3D(this._sideSize, this._sideSize, this._sideSize);
                for (var alphaIndex = 1; alphaIndex <= this._alphaMaxSideIndex; ++alphaIndex) {
                    fillArray3D(xarea, this._sideSize, this._sideSize, this._sideSize, 0);
                    fillArray3D(xareaRed, this._sideSize, this._sideSize, this._sideSize, 0);
                    fillArray3D(xareaGreen, this._sideSize, this._sideSize, this._sideSize, 0);
                    fillArray3D(xareaBlue, this._sideSize, this._sideSize, this._sideSize, 0);
                    fillArray3D(xareaAlpha, this._sideSize, this._sideSize, this._sideSize, 0);
                    fillArray3D(xarea2, this._sideSize, this._sideSize, this._sideSize, 0);
                    for (var redIndex = 1; redIndex <= this._maxSideIndex; ++redIndex) {
                        fillArray1D(area, this._sideSize, 0);
                        fillArray1D(areaRed, this._sideSize, 0);
                        fillArray1D(areaGreen, this._sideSize, 0);
                        fillArray1D(areaBlue, this._sideSize, 0);
                        fillArray1D(areaAlpha, this._sideSize, 0);
                        fillArray1D(area2, this._sideSize, 0);
                        for (var greenIndex = 1; greenIndex <= this._maxSideIndex; ++greenIndex) {
                            var line = 0, lineRed = 0, lineGreen = 0, lineBlue = 0, lineAlpha = 0, line2 = 0.0;
                            for (var blueIndex = 1; blueIndex <= this._maxSideIndex; ++blueIndex) {
                                line += this._weights[alphaIndex][redIndex][greenIndex][blueIndex];
                                lineRed += this._momentsRed[alphaIndex][redIndex][greenIndex][blueIndex];
                                lineGreen += this._momentsGreen[alphaIndex][redIndex][greenIndex][blueIndex];
                                lineBlue += this._momentsBlue[alphaIndex][redIndex][greenIndex][blueIndex];
                                lineAlpha += this._momentsAlpha[alphaIndex][redIndex][greenIndex][blueIndex];
                                line2 += this._moments[alphaIndex][redIndex][greenIndex][blueIndex];
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
                                this._weights[alphaIndex][redIndex][greenIndex][blueIndex] = this._weights[alphaIndex - 1][redIndex][greenIndex][blueIndex] + xarea[redIndex][greenIndex][blueIndex];
                                this._momentsRed[alphaIndex][redIndex][greenIndex][blueIndex] = this._momentsRed[alphaIndex - 1][redIndex][greenIndex][blueIndex] + xareaRed[redIndex][greenIndex][blueIndex];
                                this._momentsGreen[alphaIndex][redIndex][greenIndex][blueIndex] = this._momentsGreen[alphaIndex - 1][redIndex][greenIndex][blueIndex] + xareaGreen[redIndex][greenIndex][blueIndex];
                                this._momentsBlue[alphaIndex][redIndex][greenIndex][blueIndex] = this._momentsBlue[alphaIndex - 1][redIndex][greenIndex][blueIndex] + xareaBlue[redIndex][greenIndex][blueIndex];
                                this._momentsAlpha[alphaIndex][redIndex][greenIndex][blueIndex] = this._momentsAlpha[alphaIndex - 1][redIndex][greenIndex][blueIndex] + xareaAlpha[redIndex][greenIndex][blueIndex];
                                this._moments[alphaIndex][redIndex][greenIndex][blueIndex] = this._moments[alphaIndex - 1][redIndex][greenIndex][blueIndex] + xarea2[redIndex][greenIndex][blueIndex];
                            }
                        }
                    }
                }
            };
            /**
             * Computes the volume of the cube in a specific moment.
             */
            WuQuant._volumeFloat = function (cube, moment) {
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
             * Computes the volume of the cube in a specific moment.
             */
            WuQuant._volume = function (cube, moment) {
                return WuQuant._volumeFloat(cube, moment) | 0;
            };
            /**
             * Splits the cube in given position][and color direction.
             */
            WuQuant._top = function (cube, direction, position, moment) {
                var result;
                switch (direction) {
                    case WuQuant.alpha:
                        result = (moment[position][cube.redMaximum][cube.greenMaximum][cube.blueMaximum] -
                            moment[position][cube.redMaximum][cube.greenMinimum][cube.blueMaximum] -
                            moment[position][cube.redMinimum][cube.greenMaximum][cube.blueMaximum] +
                            moment[position][cube.redMinimum][cube.greenMinimum][cube.blueMaximum]) -
                            (moment[position][cube.redMaximum][cube.greenMaximum][cube.blueMinimum] -
                                moment[position][cube.redMaximum][cube.greenMinimum][cube.blueMinimum] -
                                moment[position][cube.redMinimum][cube.greenMaximum][cube.blueMinimum] +
                                moment[position][cube.redMinimum][cube.greenMinimum][cube.blueMinimum]);
                        break;
                    case WuQuant.red:
                        result = (moment[cube.alphaMaximum][position][cube.greenMaximum][cube.blueMaximum] -
                            moment[cube.alphaMaximum][position][cube.greenMinimum][cube.blueMaximum] -
                            moment[cube.alphaMinimum][position][cube.greenMaximum][cube.blueMaximum] +
                            moment[cube.alphaMinimum][position][cube.greenMinimum][cube.blueMaximum]) -
                            (moment[cube.alphaMaximum][position][cube.greenMaximum][cube.blueMinimum] -
                                moment[cube.alphaMaximum][position][cube.greenMinimum][cube.blueMinimum] -
                                moment[cube.alphaMinimum][position][cube.greenMaximum][cube.blueMinimum] +
                                moment[cube.alphaMinimum][position][cube.greenMinimum][cube.blueMinimum]);
                        break;
                    case WuQuant.green:
                        result = (moment[cube.alphaMaximum][cube.redMaximum][position][cube.blueMaximum] -
                            moment[cube.alphaMaximum][cube.redMinimum][position][cube.blueMaximum] -
                            moment[cube.alphaMinimum][cube.redMaximum][position][cube.blueMaximum] +
                            moment[cube.alphaMinimum][cube.redMinimum][position][cube.blueMaximum]) -
                            (moment[cube.alphaMaximum][cube.redMaximum][position][cube.blueMinimum] -
                                moment[cube.alphaMaximum][cube.redMinimum][position][cube.blueMinimum] -
                                moment[cube.alphaMinimum][cube.redMaximum][position][cube.blueMinimum] +
                                moment[cube.alphaMinimum][cube.redMinimum][position][cube.blueMinimum]);
                        break;
                    case WuQuant.blue:
                        result = (moment[cube.alphaMaximum][cube.redMaximum][cube.greenMaximum][position] -
                            moment[cube.alphaMaximum][cube.redMaximum][cube.greenMinimum][position] -
                            moment[cube.alphaMaximum][cube.redMinimum][cube.greenMaximum][position] +
                            moment[cube.alphaMaximum][cube.redMinimum][cube.greenMinimum][position]) -
                            (moment[cube.alphaMinimum][cube.redMaximum][cube.greenMaximum][position] -
                                moment[cube.alphaMinimum][cube.redMaximum][cube.greenMinimum][position] -
                                moment[cube.alphaMinimum][cube.redMinimum][cube.greenMaximum][position] +
                                moment[cube.alphaMinimum][cube.redMinimum][cube.greenMinimum][position]);
                        break;
                }
                return result | 0;
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
                var volumeRed = WuQuant._volume(cube, this._momentsRed), volumeGreen = WuQuant._volume(cube, this._momentsGreen), volumeBlue = WuQuant._volume(cube, this._momentsBlue), volumeAlpha = WuQuant._volume(cube, this._momentsAlpha), volumeMoment = WuQuant._volumeFloat(cube, this._moments), volumeWeight = WuQuant._volume(cube, this._weights), distance = volumeRed * volumeRed + volumeGreen * volumeGreen + volumeBlue * volumeBlue + volumeAlpha * volumeAlpha;
                return volumeMoment - (distance / volumeWeight);
            };
            /**
             * Finds the optimal (maximal) position for the cut.
             */
            WuQuant.prototype._maximize = function (cube, direction, first, last, wholeRed, wholeGreen, wholeBlue, wholeAlpha, wholeWeight) {
                var bottomRed = WuQuant._bottom(cube, direction, this._momentsRed) | 0, bottomGreen = WuQuant._bottom(cube, direction, this._momentsGreen) | 0, bottomBlue = WuQuant._bottom(cube, direction, this._momentsBlue) | 0, bottomAlpha = WuQuant._bottom(cube, direction, this._momentsAlpha) | 0, bottomWeight = WuQuant._bottom(cube, direction, this._weights) | 0, result = 0.0, cutPosition = -1;
                for (var position = first; position < last; ++position) {
                    // determines the cube cut at a certain position
                    var halfRed = bottomRed + WuQuant._top(cube, direction, position, this._momentsRed), halfGreen = bottomGreen + WuQuant._top(cube, direction, position, this._momentsGreen), halfBlue = bottomBlue + WuQuant._top(cube, direction, position, this._momentsBlue), halfAlpha = bottomAlpha + WuQuant._top(cube, direction, position, this._momentsAlpha), halfWeight = bottomWeight + WuQuant._top(cube, direction, position, this._weights);
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
                                cutPosition = position;
                            }
                        }
                    }
                }
                return { max: result, position: cutPosition };
            };
            // Cuts a cube with another one.
            WuQuant.prototype._cut = function (first, second) {
                var direction, wholeRed = WuQuant._volume(first, this._momentsRed), wholeGreen = WuQuant._volume(first, this._momentsGreen), wholeBlue = WuQuant._volume(first, this._momentsBlue), wholeAlpha = WuQuant._volume(first, this._momentsAlpha), wholeWeight = WuQuant._volume(first, this._weights), red = this._maximize(first, WuQuant.red, first.redMinimum + 1, first.redMaximum, wholeRed, wholeGreen, wholeBlue, wholeAlpha, wholeWeight), green = this._maximize(first, WuQuant.green, first.greenMinimum + 1, first.greenMaximum, wholeRed, wholeGreen, wholeBlue, wholeAlpha, wholeWeight), blue = this._maximize(first, WuQuant.blue, first.blueMinimum + 1, first.blueMaximum, wholeRed, wholeGreen, wholeBlue, wholeAlpha, wholeWeight), alpha = this._maximize(first, WuQuant.alpha, first.alphaMinimum + 1, first.alphaMaximum, wholeRed, wholeGreen, wholeBlue, wholeAlpha, wholeWeight);
                if (alpha.max >= red.max && alpha.max >= green.max && alpha.max >= blue.max) {
                    direction = WuQuant.alpha;
                    // cannot split empty cube
                    if (alpha.position < 0)
                        return false;
                }
                else {
                    if (red.max >= alpha.max && red.max >= green.max && red.max >= blue.max) {
                        direction = WuQuant.red;
                    }
                    else if (green.max >= alpha.max && green.max >= red.max && green.max >= blue.max) {
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
                        second.redMinimum = first.redMaximum = red.position;
                        second.greenMinimum = first.greenMinimum;
                        second.blueMinimum = first.blueMinimum;
                        second.alphaMinimum = first.alphaMinimum;
                        break;
                    case WuQuant.green:
                        second.greenMinimum = first.greenMaximum = green.position;
                        second.redMinimum = first.redMinimum;
                        second.blueMinimum = first.blueMinimum;
                        second.alphaMinimum = first.alphaMinimum;
                        break;
                    case WuQuant.blue:
                        second.blueMinimum = first.blueMaximum = blue.position;
                        second.redMinimum = first.redMinimum;
                        second.greenMinimum = first.greenMinimum;
                        second.alphaMinimum = first.alphaMinimum;
                        break;
                    case WuQuant.alpha:
                        second.alphaMinimum = first.alphaMaximum = alpha.position;
                        second.blueMinimum = first.blueMinimum;
                        second.redMinimum = first.redMinimum;
                        second.greenMinimum = first.greenMinimum;
                        break;
                }
                // determines the volumes after cut
                first.volume = (first.redMaximum - first.redMinimum) * (first.greenMaximum - first.greenMinimum) * (first.blueMaximum - first.blueMinimum) * (first.alphaMaximum - first.alphaMinimum);
                second.volume = (second.redMaximum - second.redMinimum) * (second.greenMaximum - second.greenMinimum) * (second.blueMaximum - second.blueMinimum) * (second.alphaMaximum - second.alphaMinimum);
                // the cut was successful
                return true;
            };
            WuQuant.prototype._initialize = function (colors) {
                this._colors = colors;
                // creates all the _cubes
                this._cubes = [];
                // initializes all the _cubes
                for (var cubeIndex = 0; cubeIndex < colors; cubeIndex++) {
                    this._cubes[cubeIndex] = new WuColorCube();
                }
                // resets the reference minimums
                this._cubes[0].redMinimum = 0;
                this._cubes[0].greenMinimum = 0;
                this._cubes[0].blueMinimum = 0;
                this._cubes[0].alphaMinimum = 0;
                // resets the reference maximums
                this._cubes[0].redMaximum = this._maxSideIndex;
                this._cubes[0].greenMaximum = this._maxSideIndex;
                this._cubes[0].blueMaximum = this._maxSideIndex;
                this._cubes[0].alphaMaximum = this._alphaMaxSideIndex;
                this._weights = createArray4D(this._alphaSideSize, this._sideSize, this._sideSize, this._sideSize);
                this._momentsRed = createArray4D(this._alphaSideSize, this._sideSize, this._sideSize, this._sideSize);
                this._momentsGreen = createArray4D(this._alphaSideSize, this._sideSize, this._sideSize, this._sideSize);
                this._momentsBlue = createArray4D(this._alphaSideSize, this._sideSize, this._sideSize, this._sideSize);
                this._momentsAlpha = createArray4D(this._alphaSideSize, this._sideSize, this._sideSize, this._sideSize);
                this._moments = createArray4D(this._alphaSideSize, this._sideSize, this._sideSize, this._sideSize);
                this._table = [];
                for (var tableIndex = 0; tableIndex < 256; ++tableIndex) {
                    this._table[tableIndex] = tableIndex * tableIndex;
                }
                this._pixels = [];
            };
            WuQuant.prototype._setQuality = function (significantBitsPerChannel) {
                if (significantBitsPerChannel === void 0) { significantBitsPerChannel = 5; }
                this._significantBitsPerChannel = significantBitsPerChannel;
                this._maxSideIndex = 1 << this._significantBitsPerChannel;
                this._alphaMaxSideIndex = this._maxSideIndex;
                this._sideSize = this._maxSideIndex + 1;
                this._alphaSideSize = this._alphaMaxSideIndex + 1;
            };
            WuQuant.alpha = 3;
            WuQuant.red = 2;
            WuQuant.green = 1;
            WuQuant.blue = 0;
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
 * iq.ts - part of Image Quantization Library
 */
/// <reference path='color/common.ts' />
/// <reference path='color/constants.ts' />
/// <reference path='color/conversion.ts' />
/// <reference path='color/distance.ts' />
/// <reference path='utils/point.ts' />
/// <reference path='utils/palette.ts' />
/// <reference path='utils/pointContainer.ts' />
/// <reference path='utils/hueStatistics.ts' />
/// <reference path='image/common.ts' />
/// <reference path='image/errorDiffusionDithering.ts' />
/// <reference path='image/nearest.ts' />
/// <reference path="palette/common.ts"/>
/// <reference path="palette/neuquant/neuquant.ts"/>
/// <reference path="palette/rgbquant/rgbquant.ts"/>
/// <reference path="palette/wu/wuQuant.ts"/>
/// <reference path="quality/ssim.ts"/>
/// <reference path='utils/utils.ts' />
//# sourceMappingURL=iq.js.map