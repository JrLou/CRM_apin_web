/**
 * 新增航信所需的计算方法 on 16/11/4.
 */
import moment from 'moment';

let algorithm = {
    //计算所选日期区间的所有日期
    dateRange(start, end) {
        let selectedDays = []
        let ms = moment(end, "YYYY-MM-DD").format('x') - moment(start, "YYYY-MM-DD").format('x');
        let counts = Math.floor(ms / (24 * 3600 * 1000)) + 1;
        for (var i = 0; i < counts; i++) {
            let currenDayStamp = +moment(start, "YYYY-MM-DD").format('x') + i * (24 * 3600 * 1000);
            // 当前日子在所选区间
            selectedDays.push(
                moment(currenDayStamp).format("YYYY-MM-DD")
            )
        }
        return selectedDays;
    },
    // 计算所选区间包含的星期数组信息
    getPeriodWeek(start, end) {
        let ms = moment(end).format('x') - moment(start).format('x');
        var counts = Math.floor(ms / (24 * 3600 * 1000)) + 1;
        if (counts >= 7) {
            return [0, 1, 2, 3, 4, 5, 6]
        } else {
            let periodWeek = []
            for (var i = 0; i < counts; i++) {
                let startStamp = +moment(start).format('x');
                periodWeek.push(new Date(startStamp + i * (24 * 3600 * 1000)).getDay())
            }
            return periodWeek;
        }
    },
    // 0,1格式星期字符串改成0,1,2格式的数组
    toogleToWeekArr(str) {
        let origin = str.split(',')
        let week = []
        origin.map((v, k) => {
            if (v == 1) {
                week.push(k)
            }
        })
        return week
    },
    //把星期数转换成后台需要的0,1格式
    toogleToWeekStr(arr) {
        let toogleWeek = [0, 0, 0, 0, 0, 0, 0]
        toogleWeek = toogleWeek.map((v, k) => {
            return arr.indexOf(k) == -1 ? 0 : 1
        })
        return toogleWeek.join(',')
    },
    //根据所需要的星期，筛选范围内的日期
    dateFinishing(value, date) {
        let cycleDateadd = [];
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < date.length; j++) {
                if (new Date(date[j]).getDay() == value[i]) {
                    cycleDateadd.push(date[j])
                }
            }
        }
        return cycleDateadd
    },
    // 出行天数算新区间的加的方法 old为moment格式数组
    _caculateNewDatePart(oldPart, days) {
        let addMs = (+days) * (24 * 60 * 60 * 1000)
        let oldMsArr = [+moment(oldPart[0]).format('x') + addMs, +moment(oldPart[1]).format('x')]
        return [moment(oldMsArr[0]).format('YYYY-MM-DD'), moment(oldMsArr[1]).format('YYYY-MM-DD')]
        // return [moment(oldMsArr[0]), moment(oldMsArr[1])]
    },
    // 出行天数算新区间的减得方法 old为moment格式数组
    _caculateNewDateParts(oldPart, days) {
        let addMs = (+days) * (24 * 60 * 60 * 1000)
        let oldMsArr = [+moment(oldPart[0]).format('x') - addMs, +moment(oldPart[1]).format('x')]
        return [moment(oldMsArr[0]).format('YYYY-MM-DD'), moment(oldMsArr[1]).format('YYYY-MM-DD')]
        // return [moment(oldMsArr[0]), moment(oldMsArr[1])]
    },
    // 出行天数算单个日期的得方法 old为moment格式数组
    _caculateNewDatePartb(oldPart, days) {
        let addMs = (+days) * (24 * 60 * 60 * 1000);
        let oldMsArr = moment(oldPart[0]).format('x') - addMs;
        return moment(oldMsArr[0])
        // return [moment(oldMsArr[0]), moment(oldMsArr[1])]
    }
}
module.exports = algorithm;