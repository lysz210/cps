import { merge } from 'lodash'
import * as i18nResolvers from './i18n/resolvers'
import * as questuraResolvers from './questura/resolvers'

export default merge(i18nResolvers, questuraResolvers)
