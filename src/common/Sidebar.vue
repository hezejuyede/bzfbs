<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#20313B"
                 text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../assets/js/bus';

    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'iconfont icon-shouye',
                        index: '/',
                        title: '平台首页'
                    },
                    {
                        icon: 'iconfont el-icon-s-marketing',
                        index: '2',
                        title: '数据管理',
                        subs: [
                            {
                                index: 'carbonEmissionAnalysis',
                                title: '碳排放分析'
                            },
                            {
                                index: 'regionalCarbonReport',
                                title: '区域碳报表'
                            },
                            {
                                index: 'industryCarbonReport',
                                title: '行业碳报表'
                            },
                            {
                                index: 'enterpriseOverDischargeWarningReport',
                                title: '企业超排预警'
                            },
                        ]
                    },
                    {
                        icon: 'iconfont el-icon-s-platform',
                        index: '/LargeDataScreen',
                        title: '数据大屏'
                    },

                    {
                        icon: 'iconfont el-icon-s-marketing',
                        index: '4',
                        title: '数据可信监控',
                        subs: [
                            {
                                index: 'SourceDataRangeStatistics',
                                title: '源数据范围统计'
                            },
                            {
                                index: '',
                                title: '数据可信监管'
                            },
                            {
                                index: '',
                                title: '数据可信验证'
                            }
                        ]
                    },
                ]
            }
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            });
        },
        methods: {}
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
    @import "../assets/less/base";

    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        line-height: 70px;
        bottom: 0;
        overflow-y: scroll;
        background-color: #20313B;

        ul {
            height: 100%;
            background-color: #20313B;
        }

        i {

            font-size: 150%;
            margin-right: 10px;
        }

        span {
            font-size: @font-size-medium-x;
        }

    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 200px;
    }

</style>
