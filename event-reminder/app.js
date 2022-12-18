'use strict';

function formatDate(date) {
    return date.getFullYear() + zeroSlice(date.getMonth() + 1) + zeroSlice(date.getDate()) + "T" +
        zeroSlice(date.getHours()) + zeroSlice(date.getMinutes()) + zeroSlice(date.getSeconds());
}

function zeroSlice(val) {
    return ('0' + val).slice(-2);
}

function getStringFromDate(date) {
    const year_str = date.getFullYear();
    const month_str = 1 + date.getMonth();  //月だけ+1する
    const day_str = date.getDate();
    const hour_str = date.getHours();
    const minute_str = date.getMinutes();
    const day_of_week = ["日", "月", "火", "水", "木", "金", "土" ][date.getDay()];
    let format_str = 'YYYY/MM/DD(WW) hh:mm';
    format_str = format_str.replace(/YYYY/g, year_str);
    format_str = format_str.replace(/MM/g, month_str);
    format_str = format_str.replace(/DD/g, day_str);
    format_str = format_str.replace(/hh/g, hour_str);
    format_str = format_str.replace(/mm/g, minute_str);
    format_str = format_str.replace(/WW/g, day_of_week);
    return format_str;
}

function getStringFromDateForSlack(date) {
    const year_str = date.getFullYear();
    const month_str = 1 + date.getMonth();  //月だけ+1すること
    const day_str = date.getDate();
    let format_str = 'MM/DD/YYYY';
    format_str = format_str.replace(/YYYY/g, year_str);
    format_str = format_str.replace(/MM/g, month_str);
    format_str = format_str.replace(/DD/g, day_str);
    return format_str;
}

exports.lambdaHandler = async (event, context) => {
    const body = decodeURIComponent(event.body);
    let params = {};
    body.split("&").map(arg => {
        let sp = arg.split("="); params[sp[0]] = sp[1]
    });
    const args = params.text.split("+");  // white space was replaced with +
    let location_param = "";
    if(3 <= args.length) {
        location_param = "&location=" + args[2];
    }
    const BASE_URL = "http://www.google.com/calendar/event?";
    const EVENT_URL =
        BASE_URL +
        "action=TEMPLATE" +
        "&text=サイトリライアビリティワークブック読書会" +
        "&dates=" + formatDate(new Date(Date.parse(args[0]))) + "/" + formatDate(new Date(Date.parse(args[1]))) +
        location_param +
        "&trp=true&trp=undefined&trp=true&sprop=";

    const start_date = new Date(Date.parse(args[0]));
    const message = "次回は、 *" + getStringFromDate(start_date) + "* からです。\n" +
        "リマインダを登録: `/remind me 本日はサイトリライアビリティワークブック読書会です! on " + getStringFromDateForSlack(start_date) + " at 9:00am`\n" +
        "<"+ EVENT_URL + "|Google Calendarへ追加>";

    const response_body = {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: message
                }
            }
        ],
        response_type: "in_channel"
    };
    return {
        body: JSON.stringify(response_body),
        statusCode: 200
    };
};
