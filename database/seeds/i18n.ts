import * as Knex from "knex";
import cookies from '../../i18n/it/cookies'
import cps from '../../i18n/it/cps'
import createObjectPaths from '../../my-lib/create-object-paths'
import { Translation } from '../models/Translation'

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    console.log(await Translation.query(knex).delete());
    // console.log(createObjectPaths(cookies), createObjectPaths(cps))
};
