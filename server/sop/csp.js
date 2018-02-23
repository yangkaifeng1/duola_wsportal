/**
 * Created on 2017/3/17.
 * @fileoverview 请填写简要的文件说明.
 * @author joc (Chen Wen)
 */
import {Meteor} from 'meteor/meteor';
import registerCSP from 'meteor/leaf4monkey:csp';
import _ from 'lodash';

let {csp = {}} = Meteor.settings;
let devCSP = csp.development;
csp = _.omit(csp, 'development');
if (!_.isEmpty(devCSP) && !Meteor.isProduction) {
    _.each(devCSP, (urls, method) => {
        urls && urls.length && (csp[method] = (csp[method] || []).concat(urls));
    });
}

registerCSP(csp);