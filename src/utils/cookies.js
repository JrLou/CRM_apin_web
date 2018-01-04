/**
 * Created by lixifeng on 16/11/4.
 */

let CookieHelp = {
    clearFlag:'none',
    //获取用户信息
    //获取用户信息

    getUserInfo() {
        if (!this.first) {
            this.getUserInfoMERO();
        }
        this.first = true;
        return this.userinfo;
    },
    getUserInfoMERO(userinfo) {
        if(!userinfo){
            var value = this.getCookieInfo(this.getUserKey());
            if (this.clearFlag === value||!value) {
                this.userinfo = null;
            } else {
                this.userinfo = JSON.parse(value);
            }
        }else{
            this.userinfo = userinfo !== this.clearFlag ? userinfo : null;
        }
    },
    saveUserInfo(userinfo,save) {

        this.saveCookieInfo(this.getUserKey(),save? userinfo:this.clearFlag)
        this.getUserInfoMERO(userinfo);
    },
    clearUserInfo() {
        this.saveUserInfo(this.clearFlag);
    },
    //设置

    //获取某个cookie的值
    getCookieInfo(cookiename) {
        // alert(cookiename);
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(cookiename + "=");
            if (c_start != -1) {
                var cookieStr = document.cookie;
                cookieStr = cookieStr.substring(c_start, cookieStr.length);
                var c_end = cookieStr.indexOf(';');
                c_start = cookiename.length + 1;
                if (c_end == -1) {
                    c_end = cookieStr.length;
                }
                var uinfo = cookieStr.substring(c_start, c_end);
                return decodeURI(uinfo);
            }
        }
        return null;
    },
    getUserKey() {
        return "USERINFOADMIN_CRM";
    },

    saveCookieInfo(key, value, isRemember) {
        // var value = key+'='+encodeURI(JSON.stringify(value))+';path=/';
        // document.cookie = value;
        //
        // userinfo="adsadas;userid=""";ex
        var v = '';
        if(typeof value == "string"){
            v = value;
        }else{
            v= JSON.stringify(value)
        }
        var Days = 365;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = key + "="+ encodeURI(v) + ";expires=" + exp.toGMTString()+";path=/";
    },

    //退出登录，清楚cookie
    clearCookie() {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;) {
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
            }
        }
    },

    //获取userId或者accountId
    getAccountId() {
        return JSON.parse(decodeURIComponent(this.getUserInfo().accessToken)).accountId;
    }
}
module.exports = CookieHelp;
