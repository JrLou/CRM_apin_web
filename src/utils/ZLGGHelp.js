/**
 * Created by zhilingege on 2018/01/09.
 */
import React from 'react';
let ZLGGHelp = {
    /**
     * 图片地址改成 七牛
     * @param url
     * @param width
     * @return {string}
     */
    changeImgUrl(url,width) {
        if (!url) {
            return '';
        }
        let w = width ? width : 150;
        let newUrl = `${url}?imageView2/0/w/${w}/interlace/1/q/75`;
        return newUrl;
    },

    /**
     * 通过form submit,实现下载资源，可以跳过浏览器弹窗的安全限制
     * @param url
     */
    downLoadHelp(url){
        if(!url){
            return;
        }
        let f = document.createElement("form");
        document.body.appendChild(f);
        let i = document.createElement("input");
        i.type = "hidden";
        f.appendChild(i);
        i.value = "5";
        i.name = "price";
        f.action = url;
        f.submit();
    }

};
export default ZLGGHelp;
