var halyk;
(function (halyk) {
  var isTest = false;
  var testConfig = {
    pageUrL: "https://test-epay.homebank.kz/payform/",
    origin: "https://test-epay.homebank.kz",
    TokenAPIConfig: {
      url: "https://testoauth.homebank.kz/epay2/oauth2/token",
      clientId: "test",
    },
  };
  console.log("isTest", isTest);
  var prodConfig = {
    pageUrL: "https://epay.homebank.kz/payform/",
    origin: "https://epay.homebank.kz",
    TokenAPIConfig: {
      url: "https://epay-oauth.homebank.kz/oauth2/token",
      clientId: "VUNDERKIDS.KZ",
    },
  };
  halyk.Config = function Config() {
    if (isTest) return testConfig;
    else return prodConfig;
  };
  var pageUrl = halyk.Config().pageUrL;
  var paymentPageOrigin = halyk.Config().origin;
  function pay(params) {
    location.href =
      pageUrl +
      "?params=" +
      LZString.compressToEncodedURIComponent(encodeParams(params));
  }
  var paymentWidgedCallBack = undefined;
  var widgetNode = undefined;
  var LZString = (function () {
    function o(o, r) {
      if (!t[o]) {
        t[o] = {};
        for (var n = 0; n < o.length; n++) {
          t[o][o.charAt(n)] = n;
        }
      }
      return t[o][r];
    }
    var r = String.fromCharCode,
      n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",
      t = {},
      i = {
        compressToBase64: function (o) {
          if (null == o) {
            return "";
          }
          var r = i._compress(o, 6, function (o) {
            return n.charAt(o);
          });
          switch (r.length % 4) {
            default:
            case 0:
              return r;
            case 1:
              return r + "===";
            case 2:
              return r + "==";
            case 3:
              return r + "=";
          }
        },
        decompressFromBase64: function (r) {
          return null == r
            ? ""
            : "" == r
            ? null
            : i._decompress(r.length, 32, function (e) {
                return o(n, r.charAt(e));
              });
        },
        compressToUTF16: function (o) {
          return null == o
            ? ""
            : i._compress(o, 15, function (o) {
                return r(o + 32);
              }) + " ";
        },
        decompressFromUTF16: function (o) {
          return null == o
            ? ""
            : "" == o
            ? null
            : i._decompress(o.length, 16384, function (r) {
                return o.charCodeAt(r) - 32;
              });
        },
        compressToUint8Array: function (o) {
          for (
            var r = i.compress(o),
              n = new Uint8Array(2 * r.length),
              e = 0,
              t = r.length;
            t > e;
            e++
          ) {
            var s = r.charCodeAt(e);
            (n[2 * e] = s >>> 8), (n[2 * e + 1] = s % 256);
          }
          return n;
        },
        decompressFromUint8Array: function (o) {
          if (null === o || void 0 === o) {
            return i.decompress(o);
          }
          for (
            var n = new Array(o.length / 2), e = 0, t = n.length;
            t > e;
            e++
          ) {
            n[e] = 256 * o[2 * e] + o[2 * e + 1];
          }
          var s = [];
          return;
          n.forEach(function (o) {
            s.push(r(o));
          }),
            i.decompress(s.join(""));
        },
        compressToEncodedURIComponent: function (o) {
          return null == o
            ? ""
            : i._compress(o, 6, function (o) {
                return e.charAt(o);
              });
        },
        decompressFromEncodedURIComponent: function (r) {
          return null == r
            ? ""
            : "" == r
            ? null
            : ((r = r.replace(/ /g, "+")),
              i._decompress(r.length, 32, function (n) {
                return o(e, r.charAt(n));
              }));
        },
        compress: function (o) {
          return i._compress(o, 16, function (o) {
            return r(o);
          });
        },
        _compress: function (o, r, n) {
          if (null == o) {
            return "";
          }
          var e,
            t,
            i,
            s = {},
            p = {},
            u = "",
            c = "",
            a = "",
            l = 2,
            f = 3,
            h = 2,
            d = [],
            m = 0,
            v = 0;
          for (i = 0; i < o.length; i += 1) {
            if (
              ((u = o.charAt(i)),
              Object.prototype.hasOwnProperty.call(s, u) ||
                ((s[u] = f++), (p[u] = !0)),
              (c = a + u),
              Object.prototype.hasOwnProperty.call(s, c))
            ) {
              a = c;
            } else {
              if (Object.prototype.hasOwnProperty.call(p, a)) {
                if (a.charCodeAt(0) < 256) {
                  for (e = 0; h > e; e++) {
                    (m <<= 1),
                      v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++;
                  }
                  for (t = a.charCodeAt(0), e = 0; 8 > e; e++) {
                    (m = (m << 1) | (1 & t)),
                      v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                      (t >>= 1);
                  }
                } else {
                  for (t = 1, e = 0; h > e; e++) {
                    (m = (m << 1) | t),
                      v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                      (t = 0);
                  }
                  for (t = a.charCodeAt(0), e = 0; 16 > e; e++) {
                    (m = (m << 1) | (1 & t)),
                      v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                      (t >>= 1);
                  }
                }
                l--, 0 == l && ((l = Math.pow(2, h)), h++), delete p[a];
              } else {
                for (t = s[a], e = 0; h > e; e++) {
                  (m = (m << 1) | (1 & t)),
                    v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                    (t >>= 1);
                }
              }
              l--,
                0 == l && ((l = Math.pow(2, h)), h++),
                (s[c] = f++),
                (a = String(u));
            }
          }
          if ("" !== a) {
            if (Object.prototype.hasOwnProperty.call(p, a)) {
              if (a.charCodeAt(0) < 256) {
                for (e = 0; h > e; e++) {
                  (m <<= 1),
                    v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++;
                }
                for (t = a.charCodeAt(0), e = 0; 8 > e; e++) {
                  (m = (m << 1) | (1 & t)),
                    v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                    (t >>= 1);
                }
              } else {
                for (t = 1, e = 0; h > e; e++) {
                  (m = (m << 1) | t),
                    v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                    (t = 0);
                }
                for (t = a.charCodeAt(0), e = 0; 16 > e; e++) {
                  (m = (m << 1) | (1 & t)),
                    v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                    (t >>= 1);
                }
              }
              l--, 0 == l && ((l = Math.pow(2, h)), h++), delete p[a];
            } else {
              for (t = s[a], e = 0; h > e; e++) {
                (m = (m << 1) | (1 & t)),
                  v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                  (t >>= 1);
              }
            }
            l--, 0 == l && ((l = Math.pow(2, h)), h++);
          }
          for (t = 2, e = 0; h > e; e++) {
            (m = (m << 1) | (1 & t)),
              v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
              (t >>= 1);
          }
          for (;;) {
            if (((m <<= 1), v == r - 1)) {
              d.push(n(m));
              break;
            }
            v++;
          }
          return d.join("");
        },
        decompress: function (o) {
          return null == o
            ? ""
            : "" == o
            ? null
            : i._decompress(o.length, 32768, function (r) {
                return o.charCodeAt(r);
              });
        },
        _decompress: function (o, n, e) {
          var t,
            i,
            s,
            p,
            u,
            c,
            a,
            l,
            f = [],
            h = 4,
            d = 4,
            m = 3,
            v = "",
            w = [],
            A = { val: e(0), position: n, index: 1 };
          for (i = 0; 3 > i; i += 1) {
            f[i] = i;
          }
          for (p = 0, c = Math.pow(2, 2), a = 1; a != c; ) {
            (u = A.val & A.position),
              (A.position >>= 1),
              0 == A.position && ((A.position = n), (A.val = e(A.index++))),
              (p |= (u > 0 ? 1 : 0) * a),
              (a <<= 1);
          }
          switch ((t = p)) {
            case 0:
              for (p = 0, c = Math.pow(2, 8), a = 1; a != c; ) {
                (u = A.val & A.position),
                  (A.position >>= 1),
                  0 == A.position && ((A.position = n), (A.val = e(A.index++))),
                  (p |= (u > 0 ? 1 : 0) * a),
                  (a <<= 1);
              }
              l = r(p);
              break;
            case 1:
              for (p = 0, c = Math.pow(2, 16), a = 1; a != c; ) {
                (u = A.val & A.position),
                  (A.position >>= 1),
                  0 == A.position && ((A.position = n), (A.val = e(A.index++))),
                  (p |= (u > 0 ? 1 : 0) * a),
                  (a <<= 1);
              }
              l = r(p);
              break;
            case 2:
              return "";
          }
          for (f[3] = l, s = l, w.push(l); ; ) {
            if (A.index > o) {
              return "";
            }
            for (p = 0, c = Math.pow(2, m), a = 1; a != c; ) {
              (u = A.val & A.position),
                (A.position >>= 1),
                0 == A.position && ((A.position = n), (A.val = e(A.index++))),
                (p |= (u > 0 ? 1 : 0) * a),
                (a <<= 1);
            }
            switch ((l = p)) {
              case 0:
                for (p = 0, c = Math.pow(2, 8), a = 1; a != c; ) {
                  (u = A.val & A.position),
                    (A.position >>= 1),
                    0 == A.position &&
                      ((A.position = n), (A.val = e(A.index++))),
                    (p |= (u > 0 ? 1 : 0) * a),
                    (a <<= 1);
                }
                (f[d++] = r(p)), (l = d - 1), h--;
                break;
              case 1:
                for (p = 0, c = Math.pow(2, 16), a = 1; a != c; ) {
                  (u = A.val & A.position),
                    (A.position >>= 1),
                    0 == A.position &&
                      ((A.position = n), (A.val = e(A.index++))),
                    (p |= (u > 0 ? 1 : 0) * a),
                    (a <<= 1);
                }
                (f[d++] = r(p)), (l = d - 1), h--;
                break;
              case 2:
                return w.join("");
            }
            if ((0 == h && ((h = Math.pow(2, m)), m++), f[l])) {
              v = f[l];
            } else {
              if (l !== d) {
                return null;
              }
              v = s + s.charAt(0);
            }
            w.push(v),
              (f[d++] = s + v.charAt(0)),
              h--,
              (s = v),
              0 == h && ((h = Math.pow(2, m)), m++);
          }
        },
      };
    return i;
  })();
  "function" == typeof define && define.amd
    ? define(function () {
        return LZString;
      })
    : "undefined" != typeof module &&
      null != module &&
      (module.exports = LZString);
  function encodeParams(params) {
    if (params === undefined || params === null) {
      return "";
    }
    if (typeof params !== "object") {
      return "" + params;
    }
    var result = [];
    for (var name in params) {
      if (name) {
        result.push(
          name + "=" + encodeURIComponent(encodeParams(params[name]))
        );
      }
    }
    return result.join("&");
  }
  function addCssClass() {
    var style = document.createElement("style");
    style.type = "text/css";
    var styleClasses =
      ".widgetScreen {position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: 1000; background-color: rgba(5, 5, 5, 0.5); display: flex; justify-content: center; align-items: center;}";
    styleClasses +=
      ".iframeBox{border-radius: 4px; position: relative; width: 400px; z-index: 1010; background-color: #fff; -ms-overflow-style: none; scrollbar-width: none;}";
    styleClasses += `.iframeHolder::-webkit-scrollbar {display: none;}`;
    styleClasses += ".iframeBoxHeader{padding: 0px;}";
    styleClasses +=
      ".iframeBoxHeaderCloseButton{border-radius: 8px; cursor: pointer; width: 15px; height: 15px; content: 'X'; text-align: center; float: right; background-color: #ccc; font-family: Arial;}";
    styleClasses +=
      ".iframeBoxHeaderCloseButtonText{font-size: 10px; font-family: sans-serif; font-weight: bold; color: #fff; padding-top: 2px;}";
    styleClasses +=
      ".iframeBoxHeaderLabel{height:30px; text-align: center; float: left;}";
    styleClasses += ".iframeClass{ width: 100%; height: 90vh; border: none; }";
    //styleClasses += ".iframeHolder{ width: 100%; height: 100%; }";
    style.innerHTML = styleClasses;
    document.getElementsByTagName("head")[0].appendChild(style);
  }

  function onCloseDialog(result) {
    paymentWidgedCallBack({ success: result });
    document.getElementsByTagName("body")[0].removeChild(widgetNode);
    widgetNode = undefined;
  }

  function onCommandRecieved(evnt) {
    if (evnt.origin.indexOf(paymentPageOrigin) === 0) {
      const resultObject = JSON.parse(evnt.data);
      onCloseDialog(resultObject.success === true);
    }
  }

  function showPaymentWidget(params, callBack) {
    paymentWidgedCallBack = callBack;
    if (!widgetNode) {
      addCssClass();
      widgetNode = document.createElement("DIV");
      widgetNode.className = "widgetScreen";
      var iframeBox = document.createElement("DIV");
      //var iframeBoxHeader = document.createElement("DIV");
      //var iframeBoxLabel = document.createElement("DIV");
      //var iframeBoxCloseButton = document.createElement("DIV");
      //iframeBoxLabel.className = "iframeBoxHeaderLabel";
      //iframeBoxCloseButton.className = "iframeBoxHeaderCloseButton";
      //iframeBoxLabel.innerHTML = "";
      //var iframeBoxHeaderCloseButtonText = document.createElement("DIV");
      //iframeBoxHeaderCloseButtonText.innerHTML = "X";
      //iframeBoxHeaderCloseButtonText.className = "iframeBoxHeaderCloseButtonText";
      //iframeBoxCloseButton.appendChild(iframeBoxHeaderCloseButtonText);
      // iframeBoxCloseButton.addEventListener("click", function(){
      //     onCloseDialog(false)
      // });
      //iframeBoxHeader.appendChild(iframeBoxLabel);
      //iframeBoxHeader.appendChild(iframeBoxCloseButton);
      //iframeBoxHeader.className = "iframeBoxHeader";
      iframeBox.className = "iframeBox";
      var iframe = document.createElement("IFRAME");
      var iframeHolder = document.createElement("DIV");
      iframeHolder.className = "iframeHolder";
      iframeHolder.appendChild(iframe);
      //iframeBox.appendChild(iframeBoxHeader);
      iframeBox.appendChild(iframeHolder);
      iframe.src =
        halyk.Config().pageUrL +
        "?params=" +
        LZString.compressToEncodedURIComponent(encodeParams(params)) +
        "&isShortForm=true";
      iframe.className = "iframeClass";
      window.addEventListener("message", onCommandRecieved, false);
      widgetNode.appendChild(iframeBox);
      document.getElementsByTagName("body")[0].appendChild(widgetNode);
    }
  }
  function p2p(params) {
    location.href =
      pageUrl +
      "?params=" +
      LZString.compressToEncodedURIComponent(encodeParams(params)) +
      "&isTransfer=true";
  }
  function aft(params) {
    location.href =
      pageUrl +
      "?params=" +
      LZString.compressToEncodedURIComponent(encodeParams(params)) +
      "&isAFT=true";
  }
  function oct(params) {
    location.href =
      pageUrl +
      "?params=" +
      LZString.compressToEncodedURIComponent(encodeParams(params)) +
      "&isOCT=true";
  }
  halyk.aft = aft;
  halyk.p2p = p2p;
  halyk.oct = oct;
  halyk.pay = pay;
  halyk.showPaymentWidget = showPaymentWidget;
})(halyk || (halyk = {}));

window.halyk = halyk;
