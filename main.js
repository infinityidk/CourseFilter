// ==UserScript==
// @name        Course Filter 
// @match       https://tis.sustech.edu.cn/Xsxk*
// @run-at      document-start
// @version     0.1
// @author      infinityidk
// ==/UserScript==

(function() {
  'use strict';
  
  const keywordSet = new Set([
    "生命科学概论",
    "生物学原理",
    "大学化学",
    "SUSTech English III",
    "EAP",
    "Java程序设计基础",
    "C程序设计基础",
    "Python程序设计基础",
    "Matlab程序设计基础",
    "线性代数",
    "高等数学（上）",
    "普通物理学（上）"
  ]);
  const {open, send} = XMLHttpRequest.prototype;

  XMLHttpRequest.prototype.open = function(method, url) {
    this._url = url;
    return open.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function(data) {
    if (this._url === '/Xsxk/queryKxrw') {
      if (data) {
        const params = new URLSearchParams(data);
        params.set('pageSize', '1000');
        data = params.toString();
      }
      this.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          try {
            const response = JSON.parse(this.response);
            response.kxrwList.list = response.kxrwList.list.filter(course => !(keywordSet.has(course.kcdm) || keywordSet.has(course.kcmc) || keywordSet.has(course.kcmc_en)));
            Object.defineProperties(this, {response: {value: JSON.stringify(response)}, responseText: {value: JSON.stringify(response)}});
          } catch(e) {}
        }
      });
    }
    return send.call(this, data);
  };
})();
