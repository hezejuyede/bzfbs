import Vue from 'vue';
import Router from 'vue-router';
import {getItem} from '../utils/storage'

//主页相关路由
import Index from '../components/index/index'


//数据管理
import carbonEmissionAnalysis from '../components/DataManagement/carbonEmissionAnalysis'
import regionalCarbonReport from '../components/DataManagement/regionalCarbonReport'
import industryCarbonReport from '../components/DataManagement/industryCarbonReport'
import enterpriseOverDischargeWarningReport from '../components/DataManagement/enterpriseOverDischargeWarningReport'


//数据大屏
import LargeDataScreen from '../components/LargeDataScreen/index'




//数据大屏
import SourceDataRangeStatistics from '../components/DataTrustworthinessSupervision/SourceDataRangeStatistics'
Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/Index'
        },
        {
            path: '/',
            component: resolve => require(['../common/Home.vue'], resolve),
            meta: {title: '自述文件'},
            children: [
                {
                    path: '/Index',
                    component: Index,
                    meta: {title: '系统首页'}
                },

                {
                    path: '/SourceDataRangeStatistics',
                    component: SourceDataRangeStatistics,
                    meta: {title: '源数据范围统计'}
                },
















                {
                    path: '/carbonEmissionAnalysis',
                    component: carbonEmissionAnalysis,
                    meta: {title: '碳排放分析'}
                },
                {
                    path: '/regionalCarbonReport',
                    component: regionalCarbonReport,
                    meta: {title: '区域碳报表'}
                },
                {
                    path: '/industryCarbonReport',
                    component: industryCarbonReport,
                    meta: {title: '行业碳报表'}
                },
                {
                    path: '/enterpriseOverDischargeWarningReport',
                    component: enterpriseOverDischargeWarningReport,
                    meta: {title: '企业超排预警'}
                },

                {
                    path: '/404',
                    component: resolve => require(['../components/errPage/404.vue'], resolve),
                    meta: {title: '404'}
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/errPage/403.vue'], resolve),
                    meta: {title: '403'}
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/indexLogin/Login.vue'], resolve)
        },
        {
            path: '/LargeDataScreen',
            component: LargeDataScreen
        },
        {
            path: '*',
            redirect: '/404'
        }
    ],


})


