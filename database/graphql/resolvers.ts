import * as i18nResolvers from './i18n/resolvers'
import * as questuraResolvers from './questura/resolvers'
import { merge } from 'lodash'

export default merge(i18nResolvers, questuraResolvers)
