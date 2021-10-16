'use strict';

const app = require('../../app.js');
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
var event, context;

describe('Tests index', function () {
    it('verifies successful response', async () => {
        const event = JSON.parse(fs.readFileSync('../events/event.json', 'utf8'));
        const result = await app.lambdaHandler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');
        expect(result.body).to.be.equal(JSON.stringify(
            {
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: '次回は、 *2021/7/29(木) 18:30* からです。\n' +
                                'リマインダを登録: `/remind me 本日はSystems Performance読書会です! on 7/29/2021 at 9:00am`\n' +
                                '<http://www.google.com/calendar/event?action=TEMPLATE&text=Systems_Performance読書会&dates=20210729T183000/20210729T210000&location=リモート開催&trp=true&trp=undefined&trp=true&sprop=|Google Calendarへ追加>'
                        }
                    }
                ],
                response_type: "in_channel"
            }
        ));

        let body = JSON.parse(result.body);

        expect(body).to.be.an('object');
    });

    it('checks an output msg when a location is not given', async () => {
        const event = JSON.parse(fs.readFileSync('../events/event_without_location.json', 'utf8'));
        const result = await app.lambdaHandler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');
        expect(result.body).to.be.equal(JSON.stringify(
            {
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: '次回は、 *2021/7/29(木) 18:30* からです。\n' +
                                'リマインダを登録: `/remind me 本日はSystems Performance読書会です! on 7/29/2021 at 9:00am`\n' +
                                '<http://www.google.com/calendar/event?action=TEMPLATE&text=Systems_Performance読書会&dates=20210729T183000/20210729T210000&trp=true&trp=undefined&trp=true&sprop=|Google Calendarへ追加>'
                        }
                    }
                ],
                response_type: "in_channel"
            }
        ));

        let body = JSON.parse(result.body);

        expect(body).to.be.an('object');

    });
});
