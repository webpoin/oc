/*!
 * Piwik - free/libre analytics platform
 *
 * JavaScript tracking client
 *
 * @link http://piwik.org
 * @source https://github.com/piwik/piwik/blob/master/js/piwik.js
 * @license http://piwik.org/free-software/bsd/ BSD-3 Clause (also in js/LICENSE.txt)
 * @license magnet:?xt=urn:btih:c80d50af7d3db9be66a4d0a86db0286e4fd33292&dn=bsd-3-clause.txt BSD-3-Clause
 */
if (typeof JSON2 !== "object") {
	JSON2 = {}
}(function() {
	function d(f) {
		return f < 10 ? "0" + f : f
	}

	function l(n, m) {
		var f = Object.prototype.toString.apply(n);
		if (f === "[object Date]") {
			return isFinite(n.valueOf()) ? n.getUTCFullYear() + "-" + d(n.getUTCMonth() + 1) + "-" + d(n.getUTCDate()) + "T" + d(n.getUTCHours()) + ":" + d(n.getUTCMinutes()) + ":" + d(n.getUTCSeconds()) + "Z" : null
		}
		if (f === "[object String]" || f === "[object Number]" || f === "[object Boolean]") {
			return n.valueOf()
		}
		if (f !== "[object Array]" && typeof n.toJSON === "function") {
			return n.toJSON(m)
		}
		return n
	}
	var c = new RegExp("[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]", "g"),
		e = '\\\\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]',
		i = new RegExp("[" + e, "g"),
		j, b, k = {
			"\b": "\\b",
			"\t": "\\t",
			"\n": "\\n",
			"\f": "\\f",
			"\r": "\\r",
			'"': '\\"',
			"\\": "\\\\"
		},
		h;

	function a(f) {
		i.lastIndex = 0;
		return i.test(f) ? '"' + f.replace(i, function(m) {
			var n = k[m];
			return typeof n === "string" ? n : "\\u" + ("0000" + m.charCodeAt(0).toString(16)).slice(-4)
		}) + '"' : '"' + f + '"'
	}

	function g(s, p) {
		var n, m, t, f, q = j,
			o, r = p[s];
		if (r && typeof r === "object") {
			r = l(r, s)
		}
		if (typeof h === "function") {
			r = h.call(p, s, r)
		}
		switch (typeof r) {
			case "string":
				return a(r);
			case "number":
				return isFinite(r) ? String(r) : "null";
			case "boolean":
			case "null":
				return String(r);
			case "object":
				if (!r) {
					return "null"
				}
				j += b;
				o = [];
				if (Object.prototype.toString.apply(r) === "[object Array]") {
					f = r.length;
					for (n = 0; n < f; n += 1) {
						o[n] = g(n, r) || "null"
					}
					t = o.length === 0 ? "[]" : j ? "[\n" + j + o.join(",\n" + j) + "\n" + q + "]" : "[" + o.join(",") + "]";
					j = q;
					return t
				}
				if (h && typeof h === "object") {
					f = h.length;
					for (n = 0; n < f; n += 1) {
						if (typeof h[n] === "string") {
							m = h[n];
							t = g(m, r);
							if (t) {
								o.push(a(m) + (j ? ": " : ":") + t)
							}
						}
					}
				} else {
					for (m in r) {
						if (Object.prototype.hasOwnProperty.call(r, m)) {
							t = g(m, r);
							if (t) {
								o.push(a(m) + (j ? ": " : ":") + t)
							}
						}
					}
				}
				t = o.length === 0 ? "{}" : j ? "{\n" + j + o.join(",\n" + j) + "\n" + q + "}" : "{" + o.join(",") + "}";
				j = q;
				return t
		}
	}
	if (typeof JSON2.stringify !== "function") {
		JSON2.stringify = function(o, m, n) {
			var f;
			j = "";
			b = "";
			if (typeof n === "number") {
				for (f = 0; f < n; f += 1) {
					b += " "
				}
			} else {
				if (typeof n === "string") {
					b = n
				}
			}
			h = m;
			if (m && typeof m !== "function" && (typeof m !== "object" || typeof m.length !== "number")) {
				throw new Error("JSON2.stringify")
			}
			return g("", {
				"": o
			})
		}
	}
	if (typeof JSON2.parse !== "function") {
		JSON2.parse = function(o, f) {
			var n;

			function m(s, r) {
				var q, p, t = s[r];
				if (t && typeof t === "object") {
					for (q in t) {
						if (Object.prototype.hasOwnProperty.call(t, q)) {
							p = m(t, q);
							if (p !== undefined) {
								t[q] = p
							} else {
								delete t[q]
							}
						}
					}
				}
				return f.call(s, r, t)
			}
			o = String(o);
			c.lastIndex = 0;
			if (c.test(o)) {
				o = o.replace(c, function(p) {
					return "\\u" + ("0000" + p.charCodeAt(0).toString(16)).slice(-4)
				})
			}
			if ((new RegExp("^[\\],:{}\\s]*$")).test(o.replace(new RegExp('\\\\(?:["\\\\/bfnrt]|u[0-9a-fA-F]{4})', "g"), "@").replace(new RegExp('"[^"\\\\\n\r]*"|true|false|null|-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?', "g"), "]").replace(new RegExp("(?:^|:|,)(?:\\s*\\[)+", "g"), ""))) {
				n = eval("(" + o + ")");
				return typeof f === "function" ? m({
					"": n
				}, "") : n
			}
			throw new SyntaxError("JSON2.parse")
		}
	}
}());
if (typeof _paq !== "object") {
	_paq = []
}
if (typeof Piwik !== "object") {
	Piwik = (function() {
		var j, a = {},
			u = document,
			e = navigator,
			K = screen,
			G = window,
			f = G.performance || G.mozPerformance || G.msPerformance || G.webkitPerformance,
			p = false,
			E = [],
			l = G.encodeURIComponent,
			F = G.decodeURIComponent,
			h = unescape,
			L, t, c;

		function w(X) {
			var W = typeof X;
			return W !== "undefined"
		}

		function q(W) {
			return typeof W === "function"
		}

		function J(W) {
			return typeof W === "object"
		}

		function n(W) {
			return typeof W === "string" || W instanceof String
		}

		function R() {
			var W, Y, X;
			for (W = 0; W < arguments.length; W += 1) {
				X = arguments[W];
				Y = X.shift();
				if (n(Y)) {
					L[Y].apply(L, X)
				} else {
					Y.apply(L, X)
				}
			}
		}

		function U(Z, Y, X, W) {
			if (Z.addEventListener) {
				Z.addEventListener(Y, X, W);
				return true
			}
			if (Z.attachEvent) {
				return Z.attachEvent("on" + Y, X)
			}
			Z["on" + Y] = X
		}

		function O(X, aa) {
			var W = "",
				Z, Y;
			for (Z in a) {
				if (Object.prototype.hasOwnProperty.call(a, Z)) {
					Y = a[Z][X];
					if (q(Y)) {
						W += Y(aa)
					}
				}
			}
			return W
		}

		function S() {
			var W;
			O("unload");
			if (j) {
				do {
					W = new Date()
				} while (W.getTimeAlias() < j)
			}
		}

		function P() {
			var W;
			if (!p) {
				p = true;
				O("load");
				for (W = 0; W < E.length; W++) {
					E[W]()
				}
			}
			return true
		}

		function o() {
			var X;
			if (u.addEventListener) {
				U(u, "DOMContentLoaded", function W() {
					u.removeEventListener("DOMContentLoaded", W, false);
					P()
				})
			} else {
				if (u.attachEvent) {
					u.attachEvent("onreadystatechange", function W() {
						if (u.readyState === "complete") {
							u.detachEvent("onreadystatechange", W);
							P()
						}
					});
					if (u.documentElement.doScroll && G === G.top) {
						(function W() {
							if (!p) {
								try {
									u.documentElement.doScroll("left")
								} catch (Y) {
									setTimeout(W, 0);
									return
								}
								P()
							}
						}())
					}
				}
			}
			if ((new RegExp("WebKit")).test(e.userAgent)) {
				X = setInterval(function() {
					if (p || /loaded|complete/.test(u.readyState)) {
						clearInterval(X);
						P()
					}
				}, 10)
			}
			U(G, "load", P, false)
		}

		function i(Y, X) {
			var W = u.createElement("script");
			W.type = "text/javascript";
			W.src = Y;
			if (W.readyState) {
				W.onreadystatechange = function() {
					var Z = this.readyState;
					if (Z === "loaded" || Z === "complete") {
						W.onreadystatechange = null;
						X()
					}
				}
			} else {
				W.onload = X
			}
			u.getElementsByTagName("head")[0].appendChild(W)
		}

		function x() {
			var W = "";
			try {
				W = G.top.document.referrer
			} catch (Y) {
				if (G.parent) {
					try {
						W = G.parent.document.referrer
					} catch (X) {
						W = ""
					}
				}
			}
			if (W === "") {
				W = u.referrer
			}
			return W
		}

		function k(W) {
			var Y = new RegExp("^([a-z]+):"),
				X = Y.exec(W);
			return X ? X[1] : null
		}

		function b(W) {
			var Y = new RegExp("^(?:(?:https?|ftp):)/*(?:[^@]+@)?([^:/#]+)"),
				X = Y.exec(W);
			return X ? X[1] : W
		}

		function I(Y, X) {
			var W = "[\\?&#]" + X + "=([^&#]*)";
			var aa = new RegExp(W);
			var Z = aa.exec(Y);
			return Z ? F(Z[1]) : ""
		}

		function s(W) {
			return h(l(W))
		}

		function T(am) {
			var Z = function(ar, W) {
					return (ar << W) | (ar >>> (32 - W))
				},
				an = function(au) {
					var ar = "",
						at, W;
					for (at = 7; at >= 0; at--) {
						W = (au >>> (at * 4)) & 15;
						ar += W.toString(16)
					}
					return ar
				},
				ac, ap, ao, Y = [],
				ag = 1732584193,
				ae = 4023233417,
				ad = 2562383102,
				ab = 271733878,
				aa = 3285377520,
				al, ak, aj, ai, ah, aq, X, af = [];
			am = s(am);
			X = am.length;
			for (ap = 0; ap < X - 3; ap += 4) {
				ao = am.charCodeAt(ap) << 24 | am.charCodeAt(ap + 1) << 16 | am.charCodeAt(ap + 2) << 8 | am.charCodeAt(ap + 3);
				af.push(ao)
			}
			switch (X & 3) {
				case 0:
					ap = 2147483648;
					break;
				case 1:
					ap = am.charCodeAt(X - 1) << 24 | 8388608;
					break;
				case 2:
					ap = am.charCodeAt(X - 2) << 24 | am.charCodeAt(X - 1) << 16 | 32768;
					break;
				case 3:
					ap = am.charCodeAt(X - 3) << 24 | am.charCodeAt(X - 2) << 16 | am.charCodeAt(X - 1) << 8 | 128;
					break
			}
			af.push(ap);
			while ((af.length & 15) !== 14) {
				af.push(0)
			}
			af.push(X >>> 29);
			af.push((X << 3) & 4294967295);
			for (ac = 0; ac < af.length; ac += 16) {
				for (ap = 0; ap < 16; ap++) {
					Y[ap] = af[ac + ap]
				}
				for (ap = 16; ap <= 79; ap++) {
					Y[ap] = Z(Y[ap - 3] ^ Y[ap - 8] ^ Y[ap - 14] ^ Y[ap - 16], 1)
				}
				al = ag;
				ak = ae;
				aj = ad;
				ai = ab;
				ah = aa;
				for (ap = 0; ap <= 19; ap++) {
					aq = (Z(al, 5) + ((ak & aj) | (~ak & ai)) + ah + Y[ap] + 1518500249) & 4294967295;
					ah = ai;
					ai = aj;
					aj = Z(ak, 30);
					ak = al;
					al = aq
				}
				for (ap = 20; ap <= 39; ap++) {
					aq = (Z(al, 5) + (ak ^ aj ^ ai) + ah + Y[ap] + 1859775393) & 4294967295;
					ah = ai;
					ai = aj;
					aj = Z(ak, 30);
					ak = al;
					al = aq
				}
				for (ap = 40; ap <= 59; ap++) {
					aq = (Z(al, 5) + ((ak & aj) | (ak & ai) | (aj & ai)) + ah + Y[ap] + 2400959708) & 4294967295;
					ah = ai;
					ai = aj;
					aj = Z(ak, 30);
					ak = al;
					al = aq
				}
				for (ap = 60; ap <= 79; ap++) {
					aq = (Z(al, 5) + (ak ^ aj ^ ai) + ah + Y[ap] + 3395469782) & 4294967295;
					ah = ai;
					ai = aj;
					aj = Z(ak, 30);
					ak = al;
					al = aq
				}
				ag = (ag + al) & 4294967295;
				ae = (ae + ak) & 4294967295;
				ad = (ad + aj) & 4294967295;
				ab = (ab + ai) & 4294967295;
				aa = (aa + ah) & 4294967295
			}
			aq = an(ag) + an(ae) + an(ad) + an(ab) + an(aa);
			return aq.toLowerCase()
		}

		function N(Y, W, X) {
			if (Y === "translate.googleusercontent.com") {
				if (X === "") {
					X = W
				}
				W = I(W, "u");
				Y = b(W)
			} else {
				if (Y === "cc.bingj.com" || Y === "webcache.googleusercontent.com" || Y.slice(0, 5) === "74.6.") {
					W = u.links[0].href;
					Y = b(W)
				}
			}
			return [Y, W, X]
		}

		function y(X) {
			var W = X.length;
			if (X.charAt(--W) === ".") {
				X = X.slice(0, W)
			}
			if (X.slice(0, 2) === "*.") {
				X = X.slice(1)
			}
			return X
		}

		function V(X) {
			X = X && X.text ? X.text : X;
			if (!n(X)) {
				var W = u.getElementsByTagName("title");
				if (W && w(W[0])) {
					X = W[0].text
				}
			}
			return X
		}

		function C(W) {
			if (!W) {
				return []
			}
			if (!w(W.children) && w(W.childNodes)) {
				return W.children
			}
			if (w(W.children)) {
				return W.children
			}
			return []
		}

		function H(X, W) {
			if (!X || !W) {
				return false
			}
			if (X.contains) {
				return X.contains(W)
			}
			if (X === W) {
				return true
			}
			if (X.compareDocumentPosition) {
				return !!(X.compareDocumentPosition(W) & 16)
			}
			return false
		}

		function z(Y, Z) {
			if (Y && Y.indexOf) {
				return Y.indexOf(Z)
			}
			if (!w(Y) || Y === null) {
				return -1
			}
			if (!Y.length) {
				return -1
			}
			var W = Y.length;
			if (W === 0) {
				return -1
			}
			var X = 0;
			while (X < W) {
				if (Y[X] === Z) {
					return X
				}
				X++
			}
			return -1
		}

		function g(Y) {
			if (!Y) {
				return false
			}

			function W(aa, ab) {
				if (G.getComputedStyle) {
					return u.defaultView.getComputedStyle(aa, null)[ab]
				}
				if (aa.currentStyle) {
					return aa.currentStyle[ab]
				}
			}

			function Z(aa) {
				aa = aa.parentNode;
				while (aa) {
					if (aa === u) {
						return true
					}
					aa = aa.parentNode
				}
				return false
			}

			function X(ac, ai, aa, af, ad, ag, ae) {
				var ab = ac.parentNode,
					ah = 1;
				if (!Z(ac)) {
					return false
				}
				if (9 === ab.nodeType) {
					return true
				}
				if ("0" === W(ac, "opacity") || "none" === W(ac, "display") || "hidden" === W(ac, "visibility")) {
					return false
				}
				if (!w(ai) || !w(aa) || !w(af) || !w(ad) || !w(ag) || !w(ae)) {
					ai = ac.offsetTop;
					ad = ac.offsetLeft;
					af = ai + ac.offsetHeight;
					aa = ad + ac.offsetWidth;
					ag = ac.offsetWidth;
					ae = ac.offsetHeight
				}
				if (Y === ac && (0 === ae || 0 === ag) && "hidden" === W(ac, "overflow")) {
					return false
				}
				if (ab) {
					if (("hidden" === W(ab, "overflow") || "scroll" === W(ab, "overflow"))) {
						if (ad + ah > ab.offsetWidth + ab.scrollLeft || ad + ag - ah < ab.scrollLeft || ai + ah > ab.offsetHeight + ab.scrollTop || ai + ae - ah < ab.scrollTop) {
							return false
						}
					}
					if (ac.offsetParent === ab) {
						ad += ab.offsetLeft;
						ai += ab.offsetTop
					}
					return X(ab, ai, aa, af, ad, ag, ae)
				}
				return true
			}
			return X(Y)
		}
		var Q = {
			htmlCollectionToArray: function(Y) {
				var W = [],
					X;
				if (!Y || !Y.length) {
					return W
				}
				for (X = 0; X < Y.length; X++) {
					W.push(Y[X])
				}
				return W
			},
			find: function(W) {
				if (!document.querySelectorAll || !W) {
					return []
				}
				var X = document.querySelectorAll(W);
				return this.htmlCollectionToArray(X)
			},
			findMultiple: function(Y) {
				if (!Y || !Y.length) {
					return []
				}
				var X, Z;
				var W = [];
				for (X = 0; X < Y.length; X++) {
					Z = this.find(Y[X]);
					W = W.concat(Z)
				}
				W = this.makeNodesUnique(W);
				return W
			},
			findNodesByTagName: function(X, W) {
				if (!X || !W || !X.getElementsByTagName) {
					return []
				}
				var Y = X.getElementsByTagName(W);
				return this.htmlCollectionToArray(Y)
			},
			makeNodesUnique: function(W) {
				var ab = [].concat(W);
				W.sort(function(ad, ac) {
					if (ad === ac) {
						return 0
					}
					var af = z(ab, ad);
					var ae = z(ab, ac);
					if (af === ae) {
						return 0
					}
					return af > ae ? -1 : 1
				});
				if (W.length <= 1) {
					return W
				}
				var X = 0;
				var Z = 0;
				var aa = [];
				var Y;
				Y = W[X++];
				while (Y) {
					if (Y === W[X]) {
						Z = aa.push(X)
					}
					Y = W[X++] || null
				}
				while (Z--) {
					W.splice(aa[Z], 1)
				}
				return W
			},
			getAttributeValueFromNode: function(aa, Y) {
				if (!this.hasNodeAttribute(aa, Y)) {
					return
				}
				if (aa && aa.getAttribute) {
					return aa.getAttribute(Y)
				}
				if (!aa || !aa.attributes) {
					return
				}
				var Z = (typeof aa.attributes[Y]);
				if ("undefined" === Z) {
					return
				}
				if (aa.attributes[Y].value) {
					return aa.attributes[Y].value
				}
				if (aa.attributes[Y].nodeValue) {
					return aa.attributes[Y].nodeValue
				}
				var X;
				var W = aa.attributes;
				if (!W) {
					return
				}
				for (X = 0; X < W.length; X++) {
					if (W[X].nodeName === Y) {
						return W[X].nodeValue
					}
				}
				return null
			},
			hasNodeAttributeWithValue: function(X, W) {
				var Y = this.getAttributeValueFromNode(X, W);
				return !!Y
			},
			hasNodeAttribute: function(Y, W) {
				if (Y && Y.hasAttribute) {
					return Y.hasAttribute(W)
				}
				if (Y && Y.attributes) {
					var X = (typeof Y.attributes[W]);
					return "undefined" !== X
				}
				return false
			},
			hasNodeCssClass: function(Y, X) {
				if (Y && X && Y.className) {
					var W = Y.className.split(" ");
					if (-1 !== z(W, X)) {
						return true
					}
				}
				return false
			},
			findNodesHavingAttribute: function(aa, Y, W) {
				if (!W) {
					W = []
				}
				if (!aa || !Y) {
					return W
				}
				var Z = C(aa);
				if (!Z || !Z.length) {
					return W
				}
				var X, ab;
				for (X = 0; X < Z.length; X++) {
					ab = Z[X];
					if (this.hasNodeAttribute(ab, Y)) {
						W.push(ab)
					}
					W = this.findNodesHavingAttribute(ab, Y, W)
				}
				return W
			},
			findFirstNodeHavingAttribute: function(Y, X) {
				if (!Y || !X) {
					return
				}
				if (this.hasNodeAttribute(Y, X)) {
					return Y
				}
				var W = this.findNodesHavingAttribute(Y, X);
				if (W && W.length) {
					return W[0]
				}
			},
			findFirstNodeHavingAttributeWithValue: function(Z, Y) {
				if (!Z || !Y) {
					return
				}
				if (this.hasNodeAttributeWithValue(Z, Y)) {
					return Z
				}
				var W = this.findNodesHavingAttribute(Z, Y);
				if (!W || !W.length) {
					return
				}
				var X;
				for (X = 0; X < W.length; X++) {
					if (this.getAttributeValueFromNode(W[X], Y)) {
						return W[X]
					}
				}
			},
			findNodesHavingCssClass: function(aa, Z, W) {
				if (!W) {
					W = []
				}
				if (!aa || !Z) {
					return W
				}
				if (aa.getElementsByClassName) {
					var ab = aa.getElementsByClassName(Z);
					return this.htmlCollectionToArray(ab)
				}
				var Y = C(aa);
				if (!Y || !Y.length) {
					return []
				}
				var X, ac;
				for (X = 0; X < Y.length; X++) {
					ac = Y[X];
					if (this.hasNodeCssClass(ac, Z)) {
						W.push(ac)
					}
					W = this.findNodesHavingCssClass(ac, Z, W)
				}
				return W
			},
			findFirstNodeHavingClass: function(Y, X) {
				if (!Y || !X) {
					return
				}
				if (this.hasNodeCssClass(Y, X)) {
					return Y
				}
				var W = this.findNodesHavingCssClass(Y, X);
				if (W && W.length) {
					return W[0]
				}
			},
			isLinkElement: function(X) {
				if (!X) {
					return false
				}
				var W = String(X.nodeName).toLowerCase();
				var Z = ["a", "area"];
				var Y = z(Z, W);
				return Y !== -1
			},
			setAnyAttribute: function(X, W, Y) {
				if (!X || !W) {
					return
				}
				if (X.setAttribute) {
					X.setAttribute(W, Y)
				} else {
					X[W] = Y
				}
			}
		};
		var m = {
			CONTENT_ATTR: "data-track-content",
			CONTENT_CLASS: "piwikTrackContent",
			CONTENT_NAME_ATTR: "data-content-name",
			CONTENT_PIECE_ATTR: "data-content-piece",
			CONTENT_PIECE_CLASS: "piwikContentPiece",
			CONTENT_TARGET_ATTR: "data-content-target",
			CONTENT_TARGET_CLASS: "piwikContentTarget",
			CONTENT_IGNOREINTERACTION_ATTR: "data-content-ignoreinteraction",
			CONTENT_IGNOREINTERACTION_CLASS: "piwikContentIgnoreInteraction",
			location: undefined,
			findContentNodes: function() {
				var X = "." + this.CONTENT_CLASS;
				var W = "[" + this.CONTENT_ATTR + "]";
				var Y = Q.findMultiple([X, W]);
				return Y
			},
			findContentNodesWithinNode: function(Z) {
				if (!Z) {
					return []
				}
				var X = Q.findNodesHavingCssClass(Z, this.CONTENT_CLASS);
				var W = Q.findNodesHavingAttribute(Z, this.CONTENT_ATTR);
				if (W && W.length) {
					var Y;
					for (Y = 0; Y < W.length; Y++) {
						X.push(W[Y])
					}
				}
				if (Q.hasNodeAttribute(Z, this.CONTENT_ATTR)) {
					X.push(Z)
				} else {
					if (Q.hasNodeCssClass(Z, this.CONTENT_CLASS)) {
						X.push(Z)
					}
				}
				X = Q.makeNodesUnique(X);
				return X
			},
			findParentContentNode: function(X) {
				if (!X) {
					return
				}
				var Y = X;
				var W = 0;
				while (Y && Y !== u && Y.parentNode) {
					if (Q.hasNodeAttribute(Y, this.CONTENT_ATTR)) {
						return Y
					}
					if (Q.hasNodeCssClass(Y, this.CONTENT_CLASS)) {
						return Y
					}
					Y = Y.parentNode;
					if (W > 1000) {
						break
					}
					W++
				}
			},
			findPieceNode: function(X) {
				var W;
				W = Q.findFirstNodeHavingAttribute(X, this.CONTENT_PIECE_ATTR);
				if (!W) {
					W = Q.findFirstNodeHavingClass(X, this.CONTENT_PIECE_CLASS)
				}
				if (W) {
					return W
				}
				return X
			},
			findTargetNodeNoDefault: function(W) {
				if (!W) {
					return
				}
				var X = Q.findFirstNodeHavingAttributeWithValue(W, this.CONTENT_TARGET_ATTR);
				if (X) {
					return X
				}
				X = Q.findFirstNodeHavingAttribute(W, this.CONTENT_TARGET_ATTR);
				if (X) {
					return X
				}
				X = Q.findFirstNodeHavingClass(W, this.CONTENT_TARGET_CLASS);
				if (X) {
					return X
				}
			},
			findTargetNode: function(W) {
				var X = this.findTargetNodeNoDefault(W);
				if (X) {
					return X
				}
				return W
			},
			findContentName: function(X) {
				if (!X) {
					return
				}
				var aa = Q.findFirstNodeHavingAttributeWithValue(X, this.CONTENT_NAME_ATTR);
				if (aa) {
					return Q.getAttributeValueFromNode(aa, this.CONTENT_NAME_ATTR)
				}
				var W = this.findContentPiece(X);
				if (W) {
					return this.removeDomainIfIsInLink(W)
				}
				if (Q.hasNodeAttributeWithValue(X, "title")) {
					return Q.getAttributeValueFromNode(X, "title")
				}
				var Y = this.findPieceNode(X);
				if (Q.hasNodeAttributeWithValue(Y, "title")) {
					return Q.getAttributeValueFromNode(Y, "title")
				}
				var Z = this.findTargetNode(X);
				if (Q.hasNodeAttributeWithValue(Z, "title")) {
					return Q.getAttributeValueFromNode(Z, "title")
				}
			},
			findContentPiece: function(X) {
				if (!X) {
					return
				}
				var Z = Q.findFirstNodeHavingAttributeWithValue(X, this.CONTENT_PIECE_ATTR);
				if (Z) {
					return Q.getAttributeValueFromNode(Z, this.CONTENT_PIECE_ATTR)
				}
				var W = this.findPieceNode(X);
				var Y = this.findMediaUrlInNode(W);
				if (Y) {
					return this.toAbsoluteUrl(Y)
				}
			},
			findContentTarget: function(Y) {
				if (!Y) {
					return
				}
				var Z = this.findTargetNode(Y);
				if (Q.hasNodeAttributeWithValue(Z, this.CONTENT_TARGET_ATTR)) {
					return Q.getAttributeValueFromNode(Z, this.CONTENT_TARGET_ATTR)
				}
				var X;
				if (Q.hasNodeAttributeWithValue(Z, "href")) {
					X = Q.getAttributeValueFromNode(Z, "href");
					return this.toAbsoluteUrl(X)
				}
				var W = this.findPieceNode(Y);
				if (Q.hasNodeAttributeWithValue(W, "href")) {
					X = Q.getAttributeValueFromNode(W, "href");
					return this.toAbsoluteUrl(X)
				}
			},
			isSameDomain: function(W) {
				if (!W || !W.indexOf) {
					return false
				}
				if (0 === W.indexOf(this.getLocation().origin)) {
					return true
				}
				var X = W.indexOf(this.getLocation().host);
				if (8 >= X && 0 <= X) {
					return true
				}
				return false
			},
			removeDomainIfIsInLink: function(Y) {
				var X = "^https?://[^/]+";
				var W = "^.*//[^/]+";
				if (Y && Y.search && -1 !== Y.search(new RegExp(X)) && this.isSameDomain(Y)) {
					Y = Y.replace(new RegExp(W), "");
					if (!Y) {
						Y = "/"
					}
				}
				return Y
			},
			findMediaUrlInNode: function(aa) {
				if (!aa) {
					return
				}
				var Y = ["img", "embed", "video", "audio"];
				var W = aa.nodeName.toLowerCase();
				if (-1 !== z(Y, W) && Q.findFirstNodeHavingAttributeWithValue(aa, "src")) {
					var Z = Q.findFirstNodeHavingAttributeWithValue(aa, "src");
					return Q.getAttributeValueFromNode(Z, "src")
				}
				if (W === "object" && Q.hasNodeAttributeWithValue(aa, "data")) {
					return Q.getAttributeValueFromNode(aa, "data")
				}
				if (W === "object") {
					var ab = Q.findNodesByTagName(aa, "param");
					if (ab && ab.length) {
						var X;
						for (X = 0; X < ab.length; X++) {
							if ("movie" === Q.getAttributeValueFromNode(ab[X], "name") && Q.hasNodeAttributeWithValue(ab[X], "value")) {
								return Q.getAttributeValueFromNode(ab[X], "value")
							}
						}
					}
					var ac = Q.findNodesByTagName(aa, "embed");
					if (ac && ac.length) {
						return this.findMediaUrlInNode(ac[0])
					}
				}
			},
			trim: function(W) {
				if (W && String(W) === W) {
					return W.replace(/^\s+|\s+$/g, "")
				}
				return W
			},
			isOrWasNodeInViewport: function(ab) {
				if (!ab || !ab.getBoundingClientRect || ab.nodeType !== 1) {
					return true
				}
				var aa = ab.getBoundingClientRect();
				var Z = u.documentElement || {};
				var Y = aa.top < 0;
				if (Y && ab.offsetTop) {
					Y = (ab.offsetTop + aa.height) > 0
				}
				var X = Z.clientWidth;
				if (G.innerWidth && X > G.innerWidth) {
					X = G.innerWidth
				}
				var W = Z.clientHeight;
				if (G.innerHeight && W > G.innerHeight) {
					W = G.innerHeight
				}
				return ((aa.bottom > 0 || Y) && aa.right > 0 && aa.left < X && ((aa.top < W) || Y))
			},
			isNodeVisible: function(X) {
				var W = g(X);
				var Y = this.isOrWasNodeInViewport(X);
				return W && Y
			},
			buildInteractionRequestParams: function(W, X, Y, Z) {
				var aa = "";
				if (W) {
					aa += "c_i=" + l(W)
				}
				if (X) {
					if (aa) {
						aa += "&"
					}
					aa += "c_n=" + l(X)
				}
				if (Y) {
					if (aa) {
						aa += "&"
					}
					aa += "c_p=" + l(Y)
				}
				if (Z) {
					if (aa) {
						aa += "&"
					}
					aa += "c_t=" + l(Z)
				}
				return aa
			},
			buildImpressionRequestParams: function(W, X, Y) {
				var Z = "c_n=" + l(W) + "&c_p=" + l(X);
				if (Y) {
					Z += "&c_t=" + l(Y)
				}
				return Z
			},
			buildContentBlock: function(Y) {
				if (!Y) {
					return
				}
				var W = this.findContentName(Y);
				var X = this.findContentPiece(Y);
				var Z = this.findContentTarget(Y);
				W = this.trim(W);
				X = this.trim(X);
				Z = this.trim(Z);
				return {
					name: W || "Unknown",
					piece: X || "Unknown",
					target: Z || ""
				}
			},
			collectContent: function(Z) {
				if (!Z || !Z.length) {
					return []
				}
				var Y = [];
				var W, X;
				for (W = 0; W < Z.length; W++) {
					X = this.buildContentBlock(Z[W]);
					if (w(X)) {
						Y.push(X)
					}
				}
				return Y
			},
			setLocation: function(W) {
				this.location = W
			},
			getLocation: function() {
				var W = this.location || G.location;
				if (!W.origin) {
					W.origin = W.protocol + "//" + W.hostname + (W.port ? ":" + W.port : "")
				}
				return W
			},
			toAbsoluteUrl: function(X) {
				if ((!X || String(X) !== X) && X !== "") {
					return X
				}
				if ("" === X) {
					return this.getLocation().href
				}
				if (X.search(/^\/\//) !== -1) {
					return this.getLocation().protocol + X
				}
				if (X.search(/:\/\//) !== -1) {
					return X
				}
				if (0 === X.indexOf("#")) {
					return this.getLocation().origin + this.getLocation().pathname + X
				}
				if (0 === X.indexOf("?")) {
					return this.getLocation().origin + this.getLocation().pathname + X
				}
				if (0 === X.search("^[a-zA-Z]{2,11}:")) {
					return X
				}
				if (X.search(/^\//) !== -1) {
					return this.getLocation().origin + X
				}
				var W = "(.*/)";
				var Y = this.getLocation().origin + this.getLocation().pathname.match(new RegExp(W))[0];
				return Y + X
			},
			isUrlToCurrentDomain: function(X) {
				var Y = this.toAbsoluteUrl(X);
				if (!Y) {
					return false
				}
				var W = this.getLocation().origin;
				if (W === Y) {
					return true
				}
				if (0 === String(Y).indexOf(W)) {
					if (":" === String(Y).substr(W.length, 1)) {
						return false
					}
					return true
				}
				return false
			},
			setHrefAttribute: function(X, W) {
				if (!X || !W) {
					return
				}
				Q.setAnyAttribute(X, "href", W)
			},
			shouldIgnoreInteraction: function(Y) {
				var X = Q.hasNodeAttribute(Y, this.CONTENT_IGNOREINTERACTION_ATTR);
				var W = Q.hasNodeCssClass(Y, this.CONTENT_IGNOREINTERACTION_CLASS);
				return X || W
			}
		};

		function B(W, X) {
			if (X) {
				return X
			}
			if (W.slice(-9) === "piwik.php") {
				W = W.slice(0, W.length - 9)
			}
			return W
		}

		function A(aa) {
			var W = "Piwik_Overlay";
			var ad = new RegExp("index\\.php\\?module=Overlay&action=startOverlaySession&idSite=([0-9]+)&period=([^&]+)&date=([^&]+)$");
			var Y = ad.exec(u.referrer);
			if (Y) {
				var Z = Y[1];
				if (Z !== String(aa)) {
					return false
				}
				var ac = Y[2],
					X = Y[3];
				G.name = W + "###" + ac + "###" + X
			}
			var ab = G.name.split("###");
			return ab.length === 3 && ab[0] === W
		}

		function M(X, ac, Z) {
			var ab = G.name.split("###"),
				aa = ab[1],
				W = ab[2],
				Y = B(X, ac);
			i(Y + "plugins/Overlay/client/client.js?v=1", function() {
				Piwik_Overlay_Client.initialize(Y, Z, aa, W)
			})
		}

		function D(aE, bm) {
			var ad = N(u.domain, G.location.href, x()),
				bM = y(ad[0]),
				b4 = F(ad[1]),
				bu = F(ad[2]),
				b8 = false,
				bq = "GET",
				bs = bq,
				bc = "application/x-www-form-urlencoded; charset=UTF-8",
				aK = bc,
				aa = aE || "",
				ax = "",
				bo = "",
				bS = bm || "",
				aJ = "",
				a2 = "",
				a7, aS = u.title,
				aU = "7z|aac|apk|ar[cj]|as[fx]|avi|azw3|bin|csv|deb|dmg|docx?|epub|exe|flv|gif|gz|gzip|hqx|jar|jpe?g|js|mobi|mp(2|3|4|e?g)|mov(ie)?|ms[ip]|od[bfgpst]|og[gv]|pdf|phps|png|pptx?|qtm?|ra[mr]?|rpm|sea|sit|tar|t?bz2?|tgz|torrent|txt|wav|wm[av]|wpd||xlsx?|xml|z|zip",
				bp = [bM],
				ai = [],
				bf = [],
				aC = [],
				bn = 500,
				aj, aG, ak, an, aY = ["pk_campaign", "piwik_campaign", "utm_campaign", "utm_source", "utm_medium"],
				aP = ["pk_kwd", "piwik_kwd", "utm_term"],
				b2 = "_pk_",
				aq, b3, ao = false,
				bW, a0, a5, aw = 33955200000,
				az = 1800000,
				ba = 15768000000,
				a1 = true,
				aI = 0,
				a6 = false,
				ag = false,
				au, bg = {},
				ab = {},
				bX = 200,
				bF = {},
				bT = {},
				ah = [],
				ay = false,
				a9 = false,
				bz = false,
				bU = false,
				bw = false,
				bt, bj, at, aX = T,
				by;

			function bH(ch, ce, cd, cg, cc, cf) {
				if (ao) {
					return
				}
				var cb;
				if (cd) {
					cb = new Date();
					cb.setTime(cb.getTime() + cd)
				}
				u.cookie = ch + "=" + l(ce) + (cd ? ";expires=" + cb.toGMTString() : "") + ";path=" + (cg || "/") + (cc ? ";domain=" + cc : "") + (cf ? ";secure" : "")
			}

			function av(cd) {
				if (ao) {
					return 0
				}
				var cb = new RegExp("(^|;)[ ]*" + cd + "=([^;]*)"),
					cc = cb.exec(u.cookie);
				return cc ? F(cc[2]) : 0
			}

			function bY(cb) {
				var cc;
				if (ak) {
					cc = new RegExp("#.*");
					return cb.replace(cc, "")
				}
				return cb
			}

			function bL(cd, cb) {
				var ce = k(cb),
					cc;
				if (ce) {
					return cb
				}
				if (cb.slice(0, 1) === "/") {
					return k(cd) + "://" + b(cd) + cb
				}
				cd = bY(cd);
				cc = cd.indexOf("?");
				if (cc >= 0) {
					cd = cd.slice(0, cc)
				}
				cc = cd.lastIndexOf("/");
				if (cc !== cd.length - 1) {
					cd = cd.slice(0, cc + 1)
				}
				return cd + cb
			}

			function br(ce) {
				var cc, cb, cd;
				for (cc = 0; cc < bp.length; cc++) {
					cb = y(bp[cc].toLowerCase());
					if (ce === cb) {
						return true
					}
					if (cb.slice(0, 1) === ".") {
						if (ce === cb.slice(1)) {
							return true
						}
						cd = ce.length - cb.length;
						if ((cd > 0) && (ce.slice(cd) === cb)) {
							return true
						}
					}
				}
				return false
			}

			function ca(cb, cd) {
				var cc = new Image(1, 1);
				cc.onload = function() {
					t = 0;
					if (typeof cd === "function") {
						cd()
					}
				};
				cc.src = aa + (aa.indexOf("?") < 0 ? "?" : "&") + cb
			}

			function bI(cc, cf, cb) {
				if (!w(cb) || null === cb) {
					cb = true
				}
				try {
					var ce = G.XMLHttpRequest ? new G.XMLHttpRequest() : G.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : null;
					ce.open("POST", aa, true);
					ce.onreadystatechange = function() {
						if (this.readyState === 4 && !(this.status >= 200 && this.status < 300) && cb) {
							ca(cc, cf)
						} else {
							if (typeof cf === "function") {
								cf()
							}
						}
					};
					ce.setRequestHeader("Content-Type", aK);
					ce.send(cc)
				} catch (cd) {
					if (cb) {
						ca(cc, cf)
					}
				}
			}

			function bZ(cc) {
				var cb = new Date();
				var cd = cb.getTime() + cc;
				if (!j || cd > j) {
					j = cd
				}
			}

			function aD(cf) {
				var cc = new Date();
				var cb = cc.getTime();
				if (a9 && cb < a9) {
					var cd = a9 - cb;
					setTimeout(cf, cd);
					bZ(cd + 50);
					a9 += 50;
					return
				}
				if (a9 === false) {
					var ce = 800;
					a9 = cb + ce
				}
				cf()
			}

			function aZ(cc, cb, cd) {
				if (!bW && cc) {
					aD(function() {
						if (bs === "POST") {
							bI(cc, cd)
						} else {
							ca(cc, cd)
						}
						bZ(cb)
					})
				}
			}

			function bb(cb) {
				if (bW) {
					return false
				}
				return (cb && cb.length)
			}

			function ap(cd, cb) {
				if (!bb(cd)) {
					return
				}
				var cc = '{"requests":["?' + cd.join('","?') + '"]}';
				aD(function() {
					bI(cc, null, false);
					bZ(cb)
				})
			}

			function bG(cb) {
				return b2 + cb + "." + bS + "." + by
			}

			function ae() {
				if (ao) {
					return "0"
				}
				if (!w(e.cookieEnabled)) {
					var cb = bG("testcookie");
					bH(cb, "1");
					return av(cb) === "1" ? "1" : "0"
				}
				return e.cookieEnabled ? "1" : "0"
			}

			function bk() {
				by = aX((aq || bM) + (b3 || "/")).slice(0, 4)
			}

			function ar() {
				var cc = bG("cvar"),
					cb = av(cc);
				if (cb.length) {
					cb = JSON2.parse(cb);
					if (J(cb)) {
						return cb
					}
				}
				return {}
			}

			function Z() {
				if (ag === false) {
					ag = ar()
				}
			}

			function bR() {
				var cb = new Date();
				bt = cb.getTime()
			}

			function Y() {
				var cd = new Date(),
					cb = Math.round(cd.getTime() / 1000),
					cc = bG("id"),
					cg = av(cc),
					cf, ce;
				if (cg) {
					cf = cg.split(".");
					cf.unshift("0");
					if (a2.length) {
						cf[1] = a2
					}
					return cf
				}
				if (a2.length) {
					ce = a2
				} else {
					ce = aX((e.userAgent || "") + (e.platform || "") + JSON2.stringify(bT) + cd.getTime() + Math.random()).slice(0, 16)
				}
				cf = ["1", ce, cb, 0, cb, "", ""];
				return cf
			}

			function bB() {
				var ci = Y(),
					ce = ci[0],
					cf = ci[1],
					cc = ci[2],
					cb = ci[3],
					cg = ci[4],
					cd = ci[5];
				if (!w(ci[6])) {
					ci[6] = ""
				}
				var ch = ci[6];
				return {
					newVisitor: ce,
					uuid: cf,
					createTs: cc,
					visitCount: cb,
					currentVisitTs: cg,
					lastVisitTs: cd,
					lastEcommerceOrderTs: ch
				}
			}

			function aL() {
				var ce = new Date(),
					cc = ce.getTime(),
					cf = bB().createTs;
				var cb = parseInt(cf, 10);
				var cd = (cb * 1000) + aw - cc;
				return cd
			}

			function am(cb) {
				if (!bS) {
					return
				}
				var cd = new Date(),
					cc = Math.round(cd.getTime() / 1000);
				if (!w(cb)) {
					cb = bB()
				}
				var ce = cb.uuid + "." + cb.createTs + "." + cb.visitCount + "." + cc + "." + cb.lastVisitTs + "." + cb.lastEcommerceOrderTs;
				bH(bG("id"), ce, aL(), b3, aq)
			}

			function X() {
				var cb = av(bG("ref"));
				if (cb.length) {
					try {
						cb = JSON2.parse(cb);
						if (J(cb)) {
							return cb
						}
					} catch (cc) {}
				}
				return ["", "", 0, ""]
			}

			function W() {
				var cb = ao;
				ao = false;
				bH(bG("id"), "", -86400, b3, aq);
				bH(bG("ses"), "", -86400, b3, aq);
				bH(bG("cvar"), "", -86400, b3, aq);
				bH(bG("ref"), "", -86400, b3, aq);
				ao = cb
			}

			function b7(cb) {
				bS = cb;
				am()
			}

			function bQ(cf) {
				if (!cf || !J(cf)) {
					return
				}
				var ce = [];
				var cd;
				for (cd in cf) {
					if (Object.prototype.hasOwnProperty.call(cf, cd)) {
						ce.push(cd)
					}
				}
				var cg = {};
				ce.sort();
				var cb = ce.length;
				var cc;
				for (cc = 0; cc < cb; cc++) {
					cg[ce[cc]] = cf[ce[cc]]
				}
				return cg
			}

			function a4() {
				bH(bG("ses"), "*", az, b3, aq)
			}

			function aT(cd, cw, cx, ce) {
				var cv, cc = new Date(),
					ck = Math.round(cc.getTime() / 1000),
					ch, cu, cf = 1024,
					cB, cl, cs = ag,
					cg = bG("ses"),
					cq = bG("ref"),
					cn = bG("cvar"),
					co = av(cg),
					ct = X(),
					cz = a7 || b4,
					ci, cb;
				if (ao) {
					W()
				}
				if (bW) {
					return ""
				}
				var cp = bB();
				if (!w(ce)) {
					ce = ""
				}
				var cm = u.characterSet || u.charset;
				if (!cm || cm.toLowerCase() === "utf-8") {
					cm = null
				}
				ci = ct[0];
				cb = ct[1];
				ch = ct[2];
				cu = ct[3];
				if (!co) {
					var cy = az / 1000;
					if (!cp.lastVisitTs || (ck - cp.lastVisitTs) > cy) {
						cp.visitCount++;
						cp.lastVisitTs = cp.currentVisitTs
					}
					if (!a5 || !ci.length) {
						for (cv in aY) {
							if (Object.prototype.hasOwnProperty.call(aY, cv)) {
								ci = I(cz, aY[cv]);
								if (ci.length) {
									break
								}
							}
						}
						for (cv in aP) {
							if (Object.prototype.hasOwnProperty.call(aP, cv)) {
								cb = I(cz, aP[cv]);
								if (cb.length) {
									break
								}
							}
						}
					}
					cB = b(bu);
					cl = cu.length ? b(cu) : "";
					if (cB.length && !br(cB) && (!a5 || !cl.length || br(cl))) {
						cu = bu
					}
					if (cu.length || ci.length) {
						ch = ck;
						ct = [ci, cb, ch, bY(cu.slice(0, cf))];
						bH(cq, JSON2.stringify(ct), ba, b3, aq)
					}
				}
				cd += "&idsite=" + bS + "&rec=1&r=" + String(Math.random()).slice(2, 8) + "&h=" + cc.getHours() + "&m=" + cc.getMinutes() + "&s=" + cc.getSeconds() + "&url=" + l(bY(cz)) + (bu.length ? "&urlref=" + l(bY(bu)) : "") + ((aJ && aJ.length) ? "&uid=" + l(aJ) : "") + "&_id=" + cp.uuid + "&_idts=" + cp.createTs + "&_idvc=" + cp.visitCount + "&_idn=" + cp.newVisitor + (ci.length ? "&_rcn=" + l(ci) : "") + (cb.length ? "&_rck=" + l(cb) : "") + "&_refts=" + ch + "&_viewts=" + cp.lastVisitTs + (String(cp.lastEcommerceOrderTs).length ? "&_ects=" + cp.lastEcommerceOrderTs : "") + (String(cu).length ? "&_ref=" + l(bY(cu.slice(0, cf))) : "") + (cm ? "&cs=" + l(cm) : "") + "&send_image=0";
				for (cv in bT) {
					if (Object.prototype.hasOwnProperty.call(bT, cv)) {
						cd += "&" + cv + "=" + bT[cv]
					}
				}
				if (cw) {
					cd += "&data=" + l(JSON2.stringify(cw))
				} else {
					if (an) {
						cd += "&data=" + l(JSON2.stringify(an))
					}
					var parser = new UAParser();
					var result = parser.getResult();
					cd += "&browser="+l(JSON2.stringify(result.browser));
					cd += "&os="+l(JSON2.stringify(result.os));
				}

				function cj(cC, cD) {
					var cE = JSON2.stringify(cC);
					if (cE.length > 2) {
						return "&" + cD + "=" + l(cE)
					}
					return ""
				}
				var cA = bQ(bg);
				var cr = bQ(ab);
				cd += cj(cA, "cvar");
				cd += cj(cr, "e_cvar");
				if (ag) {
					cd += cj(ag, "_cvar");
					for (cv in cs) {
						if (Object.prototype.hasOwnProperty.call(cs, cv)) {
							if (ag[cv][0] === "" || ag[cv][1] === "") {
								delete ag[cv]
							}
						}
					}
					if (a6) {
						bH(cn, JSON2.stringify(ag), az, b3, aq)
					}
				}
				if (a1) {
					if (aI) {
						cd += "&gt_ms=" + aI
					} else {
						if (f && f.timing && f.timing.requestStart && f.timing.responseEnd) {
							cd += "&gt_ms=" + (f.timing.responseEnd - f.timing.requestStart)
						}
					}
				}
				cp.lastEcommerceOrderTs = w(ce) && String(ce).length ? ce : cp.lastEcommerceOrderTs;
				am(cp);
				a4();
				cd += O(cx);
				if (bo.length) {
					cd += "&" + bo
				}
				if (q(au)) {
					cd = au(cd)
				}
				return cd
			}

			function bK(ce, cd, ci, cf, cb, cl) {
				var cg = "idgoal=0",
					ch, cc = new Date(),
					cj = [],
					ck;
				if (String(ce).length) {
					cg += "&ec_id=" + l(ce);
					ch = Math.round(cc.getTime() / 1000)
				}
				cg += "&revenue=" + cd;
				if (String(ci).length) {
					cg += "&ec_st=" + ci
				}
				if (String(cf).length) {
					cg += "&ec_tx=" + cf
				}
				if (String(cb).length) {
					cg += "&ec_sh=" + cb
				}
				if (String(cl).length) {
					cg += "&ec_dt=" + cl
				}
				if (bF) {
					for (ck in bF) {
						if (Object.prototype.hasOwnProperty.call(bF, ck)) {
							if (!w(bF[ck][1])) {
								bF[ck][1] = ""
							}
							if (!w(bF[ck][2])) {
								bF[ck][2] = ""
							}
							if (!w(bF[ck][3]) || String(bF[ck][3]).length === 0) {
								bF[ck][3] = 0
							}
							if (!w(bF[ck][4]) || String(bF[ck][4]).length === 0) {
								bF[ck][4] = 1
							}
							cj.push(bF[ck])
						}
					}
					cg += "&ec_items=" + l(JSON2.stringify(cj))
				}
				cg = aT(cg, an, "ecommerce", ch);
				aZ(cg, bn)
			}

			function bJ(cb, cf, ce, cd, cc, cg) {
				if (String(cb).length && w(cf)) {
					bK(cb, cf, ce, cd, cc, cg)
				}
			}

			function b1(cb) {
				if (w(cb)) {
					bK("", cb, "", "", "", "")
				}
			}

			function be(ce, cf) {
				var cb = new Date(),
					cd = aT("action_name=" + l(V(ce || aS)), cf, "log");
				aZ(cd, bn);
				if (aj && aG && !bw) {
					bw = true;
					U(u, "click", bR);
					U(u, "mouseup", bR);
					U(u, "mousedown", bR);
					U(u, "mousemove", bR);
					U(u, "mousewheel", bR);
					U(G, "DOMMouseScroll", bR);
					U(G, "scroll", bR);
					U(u, "keypress", bR);
					U(u, "keydown", bR);
					U(u, "keyup", bR);
					U(G, "resize", bR);
					U(G, "focus", bR);
					U(G, "blur", bR);
					bt = cb.getTime();
					setTimeout(function cc() {
						var cg;
						cb = new Date();
						if ((bt + aG) > cb.getTime()) {
							if (aj < cb.getTime()) {
								cg = aT("ping=1", cf, "ping");
								aZ(cg, bn)
							}
							setTimeout(cc, aG)
						}
					}, aG)
				}
			}

			function aH(cd, cc) {
				var ce, cb = "(^| )(piwik[_-]" + cc;
				if (cd) {
					for (ce = 0; ce < cd.length; ce++) {
						cb += "|" + cd[ce]
					}
				}
				cb += ")( |$)";
				return new RegExp(cb)
			}

			function bD(cb) {
				return (aa && cb && 0 === String(cb).indexOf(aa))
			}

			function bP(ce, cb, cf) {
				if (bD(cb)) {
					return 0
				}
				var cd = aH(bf, "download"),
					cc = aH(aC, "link"),
					cg = new RegExp("\\.(" + aU + ")([?&#]|$)", "i");
				if (cc.test(ce)) {
					return "link"
				}
				if (cd.test(ce) || cg.test(cb)) {
					return "download"
				}
				if (cf) {
					return 0
				}
				return "link"
			}

			function a8(cc) {
				var cb;
				cb = cc.parentNode;
				while (cb !== null && w(cb)) {
					if (Q.isLinkElement(cc)) {
						break
					}
					cc = cb;
					cb = cc.parentNode
				}
				return cc
			}

			function bi(cf) {
				cf = a8(cf);
				if (!Q.hasNodeAttribute(cf, "href")) {
					return
				}
				if (!w(cf.href)) {
					return
				}
				var ce = Q.getAttributeValueFromNode(cf, "href");
				if (bD(ce)) {
					return
				}
				var cg = cf.hostname || b(cf.href);
				var ch = cg.toLowerCase();
				var cc = cf.href.replace(cg, ch);
				var cd = new RegExp("^(javascript|vbscript|jscript|mocha|livescript|ecmascript|mailto):", "i");
				if (!cd.test(cc)) {
					var cb = bP(cf.className, cc, br(ch));
					if (cb) {
						return {
							type: cb,
							href: cc
						}
					}
				}
			}

			function b6(cb, cc, cd, ce) {
				var cf = m.buildInteractionRequestParams(cb, cc, cd, ce);
				if (!cf) {
					return
				}
				return aT(cf, null, "contentInteraction")
			}

			function b5(cd, ce, ci, cb, cc) {
				if (!w(cd)) {
					return
				}
				if (bD(cd)) {
					return cd
				}
				var cg = m.toAbsoluteUrl(cd);
				var cf = "redirecturl=" + l(cg) + "&";
				cf += b6(ce, ci, cb, (cc || cd));
				var ch = "&";
				if (aa.indexOf("?") < 0) {
					ch = "?"
				}
				return aa + ch + cf
			}

			function a3(cb, cc) {
				if (!cb || !cc) {
					return false
				}
				var cd = m.findTargetNode(cb);
				if (m.shouldIgnoreInteraction(cd)) {
					return false
				}
				cd = m.findTargetNodeNoDefault(cb);
				if (cd && !H(cd, cc)) {
					return false
				}
				return true
			}

			function aR(cd, cc, cf) {
				if (!cd) {
					return
				}
				var cb = m.findParentContentNode(cd);
				if (!cb) {
					return
				}
				if (!a3(cb, cd)) {
					return
				}
				var ce = m.buildContentBlock(cb);
				if (!ce) {
					return
				}
				if (!ce.target && cf) {
					ce.target = cf
				}
				return m.buildInteractionRequestParams(cc, ce.name, ce.piece, ce.target)
			}

			function aO(cc) {
				if (!ah || !ah.length) {
					return false
				}
				var cb, cd;
				for (cb = 0; cb < ah.length; cb++) {
					cd = ah[cb];
					if (cd && cd.name === cc.name && cd.piece === cc.piece && cd.target === cc.target) {
						return true
					}
				}
				return false
			}

			function ac(ce) {
				if (!ce) {
					return false
				}
				var ch = m.findTargetNode(ce);
				if (!ch || m.shouldIgnoreInteraction(ch)) {
					return false
				}
				var ci = bi(ch);
				if (bU && ci && ci.type) {
					return false
				}
				if (Q.isLinkElement(ch) && Q.hasNodeAttributeWithValue(ch, "href")) {
					var cb = String(Q.getAttributeValueFromNode(ch, "href"));
					if (0 === cb.indexOf("#")) {
						return false
					}
					if (bD(cb)) {
						return true
					}
					if (!m.isUrlToCurrentDomain(cb)) {
						return false
					}
					var cf = m.buildContentBlock(ce);
					if (!cf) {
						return
					}
					var cd = cf.name;
					var cj = cf.piece;
					var cg = cf.target;
					if (!Q.hasNodeAttributeWithValue(ch, m.CONTENT_TARGET_ATTR) || ch.wasContentTargetAttrReplaced) {
						ch.wasContentTargetAttrReplaced = true;
						cg = m.toAbsoluteUrl(cb);
						Q.setAnyAttribute(ch, m.CONTENT_TARGET_ATTR, cg)
					}
					var cc = b5(cb, "click", cd, cj, cg);
					m.setHrefAttribute(ch, cc);
					return true
				}
				return false
			}

			function af(cc) {
				if (!cc || !cc.length) {
					return
				}
				var cb;
				for (cb = 0; cb < cc.length; cb++) {
					ac(cc[cb])
				}
			}

			function bh(cb) {
				return function(cc) {
					if (!cb) {
						return
					}
					var cf = m.findParentContentNode(cb);
					var cg;
					if (cc) {
						cg = cc.target || cc.srcElement
					}
					if (!cg) {
						cg = cb
					}
					if (!a3(cf, cg)) {
						return
					}
					bZ(bn);
					if (Q.isLinkElement(cb) && Q.hasNodeAttributeWithValue(cb, "href") && Q.hasNodeAttributeWithValue(cb, m.CONTENT_TARGET_ATTR)) {
						var cd = Q.getAttributeValueFromNode(cb, "href");
						if (!bD(cd) && cb.wasContentTargetAttrReplaced) {
							Q.setAnyAttribute(cb, m.CONTENT_TARGET_ATTR, "")
						}
					}
					var ck = bi(cb);
					if (bz && ck && ck.type) {
						return ck.type
					}
					if (ac(cf)) {
						return "href"
					}
					var ch = m.buildContentBlock(cf);
					if (!ch) {
						return
					}
					var ce = ch.name;
					var cl = ch.piece;
					var cj = ch.target;
					var ci = b6("click", ce, cl, cj);
					aZ(ci, bn);
					return ci
				}
			}

			function aF(cd) {
				if (!cd || !cd.length) {
					return
				}
				var cb, cc;
				for (cb = 0; cb < cd.length; cb++) {
					cc = m.findTargetNode(cd[cb]);
					if (cc && !cc.contentInteractionTrackingSetupDone) {
						cc.contentInteractionTrackingSetupDone = true;
						U(cc, "click", bh(cc))
					}
				}
			}

			function aB(cd, ce) {
				if (!cd || !cd.length) {
					return []
				}
				var cb, cc;
				for (cb = 0; cb < cd.length; cb++) {
					if (aO(cd[cb])) {
						cd.splice(cb, 1);
						cb--
					} else {
						ah.push(cd[cb])
					}
				}
				if (!cd || !cd.length) {
					return []
				}
				af(ce);
				aF(ce);
				var cf = [];
				for (cb = 0; cb < cd.length; cb++) {
					cc = aT(m.buildImpressionRequestParams(cd[cb].name, cd[cb].piece, cd[cb].target), undefined, "contentImpressions");
					cf.push(cc)
				}
				return cf
			}

			function aW(cc) {
				var cb = m.collectContent(cc);
				return aB(cb, cc)
			}

			function bC(cc) {
				if (!cc || !cc.length) {
					return []
				}
				var cb;
				for (cb = 0; cb < cc.length; cb++) {
					if (!m.isNodeVisible(cc[cb])) {
						cc.splice(cb, 1);
						cb--
					}
				}
				if (!cc || !cc.length) {
					return []
				}
				return aW(cc)
			}

			function bN(cd, cb, cc) {
				var ce = m.buildImpressionRequestParams(cd, cb, cc);
				return aT(ce, null, "contentImpression")
			}

			function aV(ce, cc) {
				if (!ce) {
					return
				}
				var cb = m.findParentContentNode(ce);
				var cd = m.buildContentBlock(cb);
				if (!cd) {
					return
				}
				if (!cc) {
					cc = "Unknown"
				}
				return b6(cc, cd.name, cd.piece, cd.target)
			}

			function bx(cc, ce, cb, cd) {
				return "e_c=" + l(cc) + "&e_a=" + l(ce) + (w(cb) ? "&e_n=" + l(cb) : "") + (w(cd) ? "&e_v=" + l(cd) : "")
			}

			function al(cd, cf, cb, ce, cg) {
				if (String(cd).length === 0 || String(cf).length === 0) {
					return false
				}
				var cc = aT(bx(cd, cf, cb, ce), cg, "event");
				aZ(cc, bn)
			}

			function aN(cb, ce, cc, cf) {
				var cd = aT("search=" + l(cb) + (ce ? "&search_cat=" + l(ce) : "") + (w(cc) ? "&search_count=" + cc : ""), cf, "sitesearch");
				aZ(cd, bn)
			}

			function bl(cb, ce, cd) {
				var cc = aT("idgoal=" + cb + (ce ? "&revenue=" + ce : ""), cd, "goal");
				aZ(cc, bn)
			}

			function bO(ce, cb, ci, ch, cd) {
				var cg = cb + "=" + l(bY(ce));
				var cc = aR(cd, "click", ce);
				if (cc) {
					cg += "&" + cc
				}
				var cf = aT(cg, ci, "link");
				aZ(cf, (ch ? 0 : bn), ch)
			}

			function bV(cc, cb) {
				if (cc !== "") {
					return cc + cb.charAt(0).toUpperCase() + cb.slice(1)
				}
				return cb
			}

			function aM(cg) {
				var cf, cb, ce = ["", "webkit", "ms", "moz"],
					cd;
				if (!a0) {
					for (cb = 0; cb < ce.length; cb++) {
						cd = ce[cb];
						if (Object.prototype.hasOwnProperty.call(u, bV(cd, "hidden"))) {
							if (u[bV(cd, "visibilityState")] === "prerender") {
								cf = true
							}
							break
						}
					}
				}
				if (cf) {
					U(u, cd + "visibilitychange", function cc() {
						u.removeEventListener(cd + "visibilitychange", cc, false);
						cg()
					});
					return
				}
				cg()
			}

			function aQ(cb) {
				if (u.readyState === "complete") {
					cb()
				} else {
					if (G.addEventListener) {
						G.addEventListener("load", cb)
					} else {
						if (G.attachEvent) {
							G.attachEvent("onLoad", cb)
						}
					}
				}
			}

			function aA(cc) {
				var cb = false;
				if (u.attachEvent) {
					cb = u.readyState === "complete"
				} else {
					cb = u.readyState !== "loading"
				}
				if (cb) {
					cc()
				} else {
					if (u.addEventListener) {
						u.addEventListener("DOMContentLoaded", cc)
					} else {
						if (u.attachEvent) {
							u.attachEvent("onreadystatechange", cc)
						}
					}
				}
			}

			function bE(cb) {
				var cc = bi(cb);
				if (cc && cc.type) {
					cc.href = h(cc.href);
					bO(cc.href, cc.type, undefined, null, cb)
				}
			}

			function b9(cb) {
				var cc, cd;
				cb = cb || G.event;
				cc = cb.which || cb.button;
				cd = cb.target || cb.srcElement;
				if (cb.type === "click") {
					if (cd) {
						bE(cd)
					}
				} else {
					if (cb.type === "mousedown") {
						if ((cc === 1 || cc === 2) && cd) {
							bj = cc;
							at = cd
						} else {
							bj = at = null
						}
					} else {
						if (cb.type === "mouseup") {
							if (cc === bj && cd === at) {
								bE(cd)
							}
							bj = at = null
						}
					}
				}
			}

			function bA(cc, cb) {
				if (cb) {
					U(cc, "mouseup", b9, false);
					U(cc, "mousedown", b9, false)
				} else {
					U(cc, "click", b9, false)
				}
			}

			function bd(cc) {
				if (!bz) {
					bz = true;
					var cd, cb = aH(ai, "ignore"),
						ce = u.links;
					if (ce) {
						for (cd = 0; cd < ce.length; cd++) {
							if (!cb.test(ce[cd].className)) {
								bA(ce[cd], cc)
							}
						}
					}
				}
			}

			function bv(cd, cf, cg) {
				if (ay) {
					return true
				}
				ay = true;
				var ch = false;
				var ce, cc;

				function cb() {
					ch = true
				}
				aQ(function() {
					function ci(ck) {
						setTimeout(function() {
							if (!ay) {
								return
							}
							ch = false;
							cg.trackVisibleContentImpressions();
							ci(ck)
						}, ck)
					}

					function cj(ck) {
						setTimeout(function() {
							if (!ay) {
								return
							}
							if (ch) {
								ch = false;
								cg.trackVisibleContentImpressions()
							}
							cj(ck)
						}, ck)
					}
					if (cd) {
						ce = ["scroll", "resize"];
						for (cc = 0; cc < ce.length; cc++) {
							if (u.addEventListener) {
								u.addEventListener(ce[cc], cb)
							} else {
								G.attachEvent("on" + ce[cc], cb)
							}
						}
						cj(100)
					}
					if (cf && cf > 0) {
						cf = parseInt(cf, 10);
						ci(cf)
					}
				})
			}

			function b0() {
				var cc, cd, ce = {
						pdf: "application/pdf",
						qt: "video/quicktime",
						realp: "audio/x-pn-realaudio-plugin",
						wma: "application/x-mplayer2",
						dir: "application/x-director",
						fla: "application/x-shockwave-flash",
						java: "application/x-java-vm",
						gears: "application/x-googlegears",
						ag: "application/x-silverlight"
					},
					cb = (new RegExp("Mac OS X.*Safari/")).test(e.userAgent) ? G.devicePixelRatio || 1 : 1;
				if (!((new RegExp("MSIE")).test(e.userAgent))) {
					if (e.mimeTypes && e.mimeTypes.length) {
						for (cc in ce) {
							if (Object.prototype.hasOwnProperty.call(ce, cc)) {
								cd = e.mimeTypes[ce[cc]];
								bT[cc] = (cd && cd.enabledPlugin) ? "1" : "0"
							}
						}
					}
					if (typeof navigator.javaEnabled !== "unknown" && w(e.javaEnabled) && e.javaEnabled()) {
						bT.java = "1"
					}
					if (q(G.GearsFactory)) {
						bT.gears = "1"
					}
					bT.cookie = ae()
				}
				bT.res = K.width * cb + "x" + K.height * cb
			}
			b0();
			bk();
			am();
			return {
				getVisitorId: function() {
					return bB().uuid
				},
				getVisitorInfo: function() {
					return Y()
				},
				getAttributionInfo: function() {
					return X()
				},
				getAttributionCampaignName: function() {
					return X()[0]
				},
				getAttributionCampaignKeyword: function() {
					return X()[1]
				},
				getAttributionReferrerTimestamp: function() {
					return X()[2]
				},
				getAttributionReferrerUrl: function() {
					return X()[3]
				},
				setTrackerUrl: function(cb) {
					aa = cb
				},
				getTrackerUrl: function() {
					return aa
				},
				getSiteId: function() {
					return bS
				},
				setSiteId: function(cb) {
					b7(cb)
				},
				setUserId: function(cb) {
					if (!w(cb) || !cb.length) {
						return
					}
					aJ = cb;
					a2 = aX(aJ).substr(0, 16)
				},
				getUserId: function() {
					return aJ
				},
				setCustomData: function(cb, cc) {
					if (J(cb)) {
						an = cb
					} else {
						if (!an) {
							an = {}
						}
						an[cb] = cc
					}
				},
				getCustomData: function() {
					return an
				},
				setCustomRequestProcessing: function(cb) {
					au = cb
				},
				appendToTrackingUrl: function(cb) {
					bo = cb
				},
				getRequest: function(cb) {
					return aT(cb)
				},
				addPlugin: function(cb, cc) {
					a[cb] = cc
				},
				setCustomVariable: function(cc, cb, cf, cd) {
					var ce;
					if (!w(cd)) {
						cd = "visit"
					}
					if (!w(cb)) {
						return
					}
					if (!w(cf)) {
						cf = ""
					}
					if (cc > 0) {
						cb = !n(cb) ? String(cb) : cb;
						cf = !n(cf) ? String(cf) : cf;
						ce = [cb.slice(0, bX), cf.slice(0, bX)];
						if (cd === "visit" || cd === 2) {
							Z();
							ag[cc] = ce
						} else {
							if (cd === "page" || cd === 3) {
								bg[cc] = ce
							} else {
								if (cd === "event") {
									ab[cc] = ce
								}
							}
						}
					}
				},
				getCustomVariable: function(cc, cd) {
					var cb;
					if (!w(cd)) {
						cd = "visit"
					}
					if (cd === "page" || cd === 3) {
						cb = bg[cc]
					} else {
						if (cd === "event") {
							cb = ab[cc]
						} else {
							if (cd === "visit" || cd === 2) {
								Z();
								cb = ag[cc]
							}
						}
					}
					if (!w(cb) || (cb && cb[0] === "")) {
						return false
					}
					return cb
				},
				deleteCustomVariable: function(cb, cc) {
					if (this.getCustomVariable(cb, cc)) {
						this.setCustomVariable(cb, "", "", cc)
					}
				},
				storeCustomVariablesInCookie: function() {
					a6 = true
				},
				setLinkTrackingTimer: function(cb) {
					bn = cb
				},
				setDownloadExtensions: function(cb) {
					aU = cb
				},
				addDownloadExtensions: function(cb) {
					aU += "|" + cb
				},
				setDomains: function(cb) {
					bp = n(cb) ? [cb] : cb;
					bp.push(bM)
				},
				setIgnoreClasses: function(cb) {
					ai = n(cb) ? [cb] : cb
				},
				setRequestMethod: function(cb) {
					bs = cb || bq
				},
				setRequestContentType: function(cb) {
					aK = cb || bc
				},
				setReferrerUrl: function(cb) {
					bu = cb
				},
				setCustomUrl: function(cb) {
					a7 = bL(b4, cb)
				},
				setDocumentTitle: function(cb) {
					aS = cb
				},
				setAPIUrl: function(cb) {
					ax = cb
				},
				setDownloadClasses: function(cb) {
					bf = n(cb) ? [cb] : cb
				},
				setLinkClasses: function(cb) {
					aC = n(cb) ? [cb] : cb
				},
				setCampaignNameKey: function(cb) {
					aY = n(cb) ? [cb] : cb
				},
				setCampaignKeywordKey: function(cb) {
					aP = n(cb) ? [cb] : cb
				},
				discardHashTag: function(cb) {
					ak = cb
				},
				setCookieNamePrefix: function(cb) {
					b2 = cb;
					ag = ar()
				},
				setCookieDomain: function(cb) {
					aq = y(cb);
					bk()
				},
				setCookiePath: function(cb) {
					b3 = cb;
					bk()
				},
				setVisitorCookieTimeout: function(cb) {
					aw = cb * 1000
				},
				setSessionCookieTimeout: function(cb) {
					az = cb * 1000
				},
				setReferralCookieTimeout: function(cb) {
					ba = cb * 1000
				},
				setConversionAttributionFirstReferrer: function(cb) {
					a5 = cb
				},
				disableCookies: function() {
					ao = true;
					bT.cookie = "0"
				},
				deleteCookies: function() {
					W()
				},
				setDoNotTrack: function(cc) {
					var cb = e.doNotTrack || e.msDoNotTrack;
					bW = cc && (cb === "yes" || cb === "1");
					if (bW) {
						this.disableCookies()
					}
				},
				addListener: function(cc, cb) {
					bA(cc, cb)
				},
				enableLinkTracking: function(cb) {
					bU = true;
					if (p) {
						bd(cb)
					} else {
						E.push(function() {
							bd(cb)
						})
					}
				},
				enableJSErrorTracking: function() {
					if (b8) {
						return
					}
					b8 = true;
					var cb = G.onerror;
					G.onerror = function(cg, ce, cd, cf, cc) {
						aM(function() {
							var ch = "JavaScript Errors";
							var ci = ce + ":" + cd;
							if (cf) {
								ci += ":" + cf
							}
							al(ch, ci, cg)
						});
						if (cb) {
							return cb(cg, ce, cd, cf, cc)
						}
						return false
					}
				},
				disablePerformanceTracking: function() {
					a1 = false
				},
				setGenerationTimeMs: function(cb) {
					aI = parseInt(cb, 10)
				},
				setHeartBeatTimer: function(cd, cc) {
					var cb = new Date();
					aj = cb.getTime() + cd * 1000;
					aG = cc * 1000
				},
				killFrame: function() {
					if (G.location !== G.top.location) {
						G.top.location = G.location
					}
				},
				redirectFile: function(cb) {
					if (G.location.protocol === "file:") {
						G.location = cb
					}
				},
				setCountPreRendered: function(cb) {
					a0 = cb
				},
				trackGoal: function(cb, cd, cc) {
					aM(function() {
						bl(cb, cd, cc)
					})
				},
				trackLink: function(cc, cb, ce, cd) {
					aM(function() {
						bO(cc, cb, ce, cd)
					})
				},
				trackPageView: function(cb, cc) {
					ah = [];
					if (A(bS)) {
						aM(function() {
							M(aa, ax, bS)
						})
					} else {
						aM(function() {
							be(cb, cc)
						})
					}
				},
				trackAllContentImpressions: function() {
					if (A(bS)) {
						return
					}
					aM(function() {
						aA(function() {
							var cb = m.findContentNodes();
							var cc = aW(cb);
							ap(cc, bn)
						})
					})
				},
				trackVisibleContentImpressions: function(cb, cc) {
					if (A(bS)) {
						return
					}
					if (!w(cb)) {
						cb = true
					}
					if (!w(cc)) {
						cc = 750
					}
					bv(cb, cc, this);
					aM(function() {
						aQ(function() {
							var cd = m.findContentNodes();
							var ce = bC(cd);
							ap(ce, bn)
						})
					})
				},
				trackContentImpression: function(cd, cb, cc) {
					if (A(bS)) {
						return
					}
					if (!cd) {
						return
					}
					cb = cb || "Unknown";
					aM(function() {
						var ce = bN(cd, cb, cc);
						aZ(ce, bn)
					})
				},
				trackContentImpressionsWithinNode: function(cb) {
					if (A(bS) || !cb) {
						return
					}
					aM(function() {
						if (ay) {
							aQ(function() {
								var cc = m.findContentNodesWithinNode(cb);
								var cd = bC(cc);
								ap(cd, bn)
							})
						} else {
							aA(function() {
								var cc = m.findContentNodesWithinNode(cb);
								var cd = aW(cc);
								ap(cd, bn)
							})
						}
					})
				},
				trackContentInteraction: function(cd, ce, cb, cc) {
					if (A(bS)) {
						return
					}
					if (!cd || !ce) {
						return
					}
					cb = cb || "Unknown";
					aM(function() {
						var cf = b6(cd, ce, cb, cc);
						aZ(cf, bn)
					})
				},
				trackContentInteractionNode: function(cc, cb) {
					if (A(bS) || !cc) {
						return
					}
					aM(function() {
						var cd = aV(cc, cb);
						aZ(cd, bn)
					})
				},
				trackEvent: function(cc, ce, cb, cd) {
					aM(function() {
						al(cc, ce, cb, cd)
					})
				},
				trackSiteSearch: function(cb, cd, cc) {
					aM(function() {
						aN(cb, cd, cc)
					})
				},
				setEcommerceView: function(ce, cb, cd, cc) {
					if (!w(cd) || !cd.length) {
						cd = ""
					} else {
						if (cd instanceof Array) {
							cd = JSON2.stringify(cd)
						}
					}
					bg[5] = ["_pkc", cd];
					if (w(cc) && String(cc).length) {
						bg[2] = ["_pkp", cc]
					}
					if ((!w(ce) || !ce.length) && (!w(cb) || !cb.length)) {
						return
					}
					if (w(ce) && ce.length) {
						bg[3] = ["_pks", ce]
					}
					if (!w(cb) || !cb.length) {
						cb = ""
					}
					bg[4] = ["_pkn", cb]
				},
				addEcommerceItem: function(cf, cb, cd, cc, ce) {
					if (cf.length) {
						bF[cf] = [cf, cb, cd, cc, ce]
					}
				},
				trackEcommerceOrder: function(cb, cf, ce, cd, cc, cg) {
					bJ(cb, cf, ce, cd, cc, cg)
				},
				trackEcommerceCartUpdate: function(cb) {
					b1(cb)
				}
			}
		}

		function v() {
			return {
				push: R
			}
		}
		U(G, "beforeunload", S, false);
		o();
		Date.prototype.getTimeAlias = Date.prototype.getTime;
		L = new D();
		var r = {
			setTrackerUrl: 1,
			setAPIUrl: 1,
			setUserId: 1,
			setSiteId: 1,
			disableCookies: 1,
			enableLinkTracking: 1
		};
		var d;
		for (t = 0; t < _paq.length; t++) {
			d = _paq[t][0];
			if (r[d]) {
				R(_paq[t]);
				delete _paq[t];
				if (r[d] > 1) {
					if (console !== undefined && console && console.error) {
						console.error("The method " + d + ' is registered more than once in "_paq" variable. Only the last call has an effect. Please have a look at the multiple Piwik trackers documentation: http://developer.piwik.org/guides/tracking-javascript-guide#multiple-piwik-trackers')
					}
				}
				r[d] ++
			}
		}
		for (t = 0; t < _paq.length; t++) {
			if (_paq[t]) {
				R(_paq[t])
			}
		}
		_paq = new v();
		c = {
			addPlugin: function(W, X) {
				a[W] = X
			},
			getTracker: function(W, X) {
				if (!w(X)) {
					X = this.getAsyncTracker().getSiteId()
				}
				if (!w(W)) {
					W = this.getAsyncTracker().getTrackerUrl()
				}
				return new D(W, X)
			},
			getAsyncTracker: function() {
				return L
			}
		};
		if (typeof define === "function" && define.amd) {
			define("piwik", [], function() {
				return c
			})
		}
		return c
	}())
}
if (window && window.piwikAsyncInit) {
	window.piwikAsyncInit()
}(function() {
	var a = (typeof AnalyticsTracker);
	if (a === "undefined") {
		AnalyticsTracker = Piwik
	}
}());
if (typeof piwik_log !== "function") {
	piwik_log = function(b, f, d, g) {
		function a(h) {
			try {
				return eval("piwik_" + h)
			} catch (i) {}
			return
		}
		var c, e = Piwik.getTracker(d, f);
		e.setDocumentTitle(b);
		e.setCustomData(g);
		c = a("tracker_pause");
		if (c) {
			e.setLinkTrackingTimer(c)
		}
		c = a("download_extensions");
		if (c) {
			e.setDownloadExtensions(c)
		}
		c = a("hosts_alias");
		if (c) {
			e.setDomains(c)
		}
		c = a("ignore_classes");
		if (c) {
			e.setIgnoreClasses(c)
		}
		e.trackPageView();
		if (a("install_tracker")) {
			piwik_track = function(i, k, j, h) {
				e.setSiteId(k);
				e.setTrackerUrl(j);
				e.trackLink(i, h)
			};
			e.enableLinkTracking()
		}
	};
	/*! @license-end */
};