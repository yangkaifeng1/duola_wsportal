/**
 * Created on 2017/3/17.
 * @fileoverview 请填写简要的文件说明.
 * @author joc (Chen Wen)
 */
import {Meteor} from 'meteor/meteor';
import {WebApp} from 'meteor/webapp';
import _ from 'lodash';
import registerCORS from 'meteor/leaf4monkey:cors';

let {cors = {}} = Meteor.settings;
let devCORS = cors.development;
cors = _.omit(cors, 'development');
if (!_.isEmpty(devCORS) && !Meteor.isProduction) {
    _.each(devCORS, (urls, prop) => {
        urls && urls.length && (cors[prop] = (cors[prop] || []).concat(urls));
    });
}

WebApp.connectHandlers.use(registerCORS(cors));