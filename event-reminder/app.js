
function formatDate(date) {
    return date.getFullYear() + zeroSlice(date.getMonth() + 1) + zeroSlice(date.getDate()) + "T" +
        zeroSlice(date.getHours()) + zeroSlice(date.getMinutes()) + zeroSlice(date.getSeconds());
}

function zeroSlice(val) {
    return ('0' + val).slice(-2);
}

function getStringFromDate(date) {
    var year_str = date.getFullYear();
    var month_str = 1 + date.getMonth();  //月だけ+1する
    var day_str = date.getDate();
    var hour_str = date.getHours();
    var minute_str = date.getMinutes();
    var format_str = 'YYYY/MM/DD hh:mm';
    format_str = format_str.replace(/YYYY/g, year_str);
    format_str = format_str.replace(/MM/g, month_str);
    format_str = format_str.replace(/DD/g, day_str);
    format_str = format_str.replace(/hh/g, hour_str);
    format_str = format_str.replace(/mm/g, minute_str);
    return format_str;
}

function getStringFromDateForSlack(date) {
    var year_str = date.getFullYear();
    var month_str = 1 + date.getMonth();  //月だけ+1すること
    var day_str = date.getDate();
    var hour_str = date.getHours();
    var minute_str = date.getMinutes();
    var format_str = 'MM/DD/YYYY';
    format_str = format_str.replace(/YYYY/g, year_str);
    format_str = format_str.replace(/MM/g, month_str);
    format_str = format_str.replace(/DD/g, day_str);
    return format_str;
}

exports.lambdaHandler = async (event, context) => {
    let body = decodeURIComponent(event.body);
    let params = {};
    body.split("&").map(arg => {
        let sp = arg.split("="); params[sp[0]] = sp[1]
    });
    args = params.text.split("+");  // white space was replaced with +
    var BASE_URL = "http://www.google.com/calendar/event?";
    var EVENT_URL =
        BASE_URL +
        "action=TEMPLATE" +
        "&text=Systems_Performance読書会" +
        "&dates=" + formatDate(new Date(Date.parse(args[0]))) + "/" + formatDate(new Date(Date.parse(args[1]))) +
        "&location=" + args[2] +
        "&trp=true&trp=undefined&trp=true&sprop=";

    const start_date = new Date(Date.parse(args[0]));
    const message = "次回は、 *" + getStringFromDate(start_date) + "* からです。\n" +
        "リマインダを登録: `/remind me 本日はSystems Performance読書会です! on " + getStringFromDateForSlack(start_date) + " at 9:00am`\n" +
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
