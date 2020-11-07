console.log('start test dataproxy');

import { rejects } from 'assert';
import { SSL_OP_NO_COMPRESSION } from 'constants';
import { resolve } from 'path';
import dataProxy from '../dataProxy/dataProxy';
import tableMetaMgr from '../dataProxy/tableMetaMgr';

tableMetaMgr.mustLoadConfig('../../tableMetaConfig.json');

// dataProxy.get("test", {"id": 18})
// dataProxy.get("test2", {"id": 1, "userId": 1})
// dataProxy.get("test2", {"id": 2, "userId": 1})

dataProxy
    .getOne('test', 1812)
    .then((result) => {
        console.log('log outside');
        console.log(result);
    })
    .catch((err) => {
        console.log('catch outside');
        console.log(typeof err);
        console.log(err);
    });
// dataProxy.select(["*"], "test", {"id": 18}).then((result: any) => {
//     console.log(result)
// })

console.log('end test dataproxy');
