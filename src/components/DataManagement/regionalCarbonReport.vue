<template>
    <div class="template">
        <div class="crumbs">
            <div class="crumbsLeft fl">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>数据管理</el-breadcrumb-item>
                    <el-breadcrumb-item>区域碳报表</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="crumbsRight fr">
                <el-button type="primary" @click="doSearch">查询</el-button>
                <el-button type="success" @click="doReset">重置</el-button>
                <el-button type="warning" @click="importPrinting">导出Excel</el-button>
            </div>
        </div>
        <div class="container">
            <div class="containerDiv">
                <div class="handle-box">
                    <label style="margin-right: 10px" class="fl">
                        <el-input v-model="select_word" placeholder="智能检索数据" style="width: 250px"></el-input>
                    </label>
                    <label style="margin-right: 5px;margin-left: 5px" class="fl">
                        <span>时间范围</span>
                        <span>:</span>
                        <el-date-picker
                            :picker-options="pickerOptions"
                            style="width: 250px"
                            v-model="examineTime"
                            type="monthrange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM">
                        </el-date-picker>
                    </label>
                    <label style="margin-right: 5px;margin-left: 5px" class="fl">
                        <span class="textColor">区域范围</span>
                        <span>:</span>
                        <el-select
                            style="width: 250px"
                            v-model="region"
                            clearable
                            filterable
                            allow-create
                            multiple
                            collapse-tags
                            default-first-option
                            placeholder="请选择区域">
                            <el-option
                                v-for="item in regionOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </label>
                </div>
                <div class="handle-table">
                    <el-table class="tb-edit"
                              :data="tables"
                              :header-cell-style="{background:'#f0f0f0'}"
                              :cell-style="{fontSize:'12px'}"
                              border
                              :height="this.tableHeight"
                              id="rebateSetTable"
                              ref="moviesTable"
                              highlight-current-row
                              :row-class-name="tableRowClassName"
                              style="width: 98%;margin: auto">
                        <template v-for="(col ,index) in cols" >
                            <el-table-column  align="center"  v-if="col.prop==='region'" :label="col.label" :prop="col.prop">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.region==='01'">济南市</span>
                                    <span v-if="scope.row.region==='02'">青岛市</span>
                                    <span v-if="scope.row.region==='03'">淄博市</span>
                                    <span v-if="scope.row.region==='04'">枣庄市</span>
                                    <span v-if="scope.row.region==='05'">东营市</span>
                                    <span v-if="scope.row.region==='06'">烟台市</span>
                                    <span v-if="scope.row.region==='07'">潍坊市</span>
                                    <span v-if="scope.row.region==='08'">济宁市</span>
                                    <span v-if="scope.row.region==='09'">泰安市</span>
                                    <span v-if="scope.row.region==='10'">威海市</span>
                                    <span v-if="scope.row.region==='11'">日照市</span>
                                    <span v-if="scope.row.region==='12'">临沂市</span>
                                    <span v-if="scope.row.region==='13'">德州市</span>
                                    <span v-if="scope.row.region==='14'">聊城市</span>
                                    <span v-if="scope.row.region==='15'">滨州市</span>
                                    <span v-if="scope.row.region==='16'">菏泽市</span>
                                </template>
                            </el-table-column>
                            <el-table-column  align="center"  v-if="col.prop!=='region'" :label="col.label" :prop="col.prop">
                            </el-table-column>
                        </template>
                    </el-table>
                </div>
            </div>

        </div>


        <shadinLayer></shadinLayer>
    </div>
</template>
<script type="text/ecmascript-6">
    import shadinLayer from '../../common/shadinLayer'
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    import {regionalCarbonReport} from "../../api/dataManagement";
    import {regionOptions} from "../../utils/options";

    export default {
        name: 'WorkingProcedure',
        data() {
            return {
                message: '',
                HideModal: true,

                tableData: [],
                cols:[],
                tableHeight:0,

                select_word: '',
                examineTime: [],
                region: "",
                regionOptions: regionOptions,
                pickerOptions: {
                    disabledDate(time) {
                        let t = new Date().getDate();
                        // 如果想蕴含本月本月 - 8.64e7 * t 就不须要了，
                        // 如果想之前的不能抉择把 > 换成 <
                        return time.getTime() > Date.now();
                    },
                },

            }
        },
        computed: {
            //模糊检索
            tables: function () {
                var search = this.select_word;
                if (search) {
                    return this.tableData.filter(function (dataNews) {
                        return Object.keys(dataNews).some(function (key) {
                            return String(dataNews[key]).indexOf(search) > -1
                        })
                    })
                }
                return this.tableData
            }
        },
        components: {shadinLayer},
        mounted() {

        },
        created() {
            this.getAdminState()

        },
        methods: {

            //页面加载检查用户是否登陆，没有登陆就加载登陆页面
            getAdminState() {
                this.setTableHeight();
                this.doSearch();

            },

            //根据屏幕设置Table高度
            setTableHeight() {
                if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                    var H = window.screen.height;
                    this.tableHeight = H - 280 + "px";
                } else {
                    var h = document.body.clientHeight;
                    var w = document.body.clientWidth;

                    if (w < 1170) {
                        this.tableHeight = h - 400 + "px";
                    } else {

                        this.tableHeight = h - 280 + "px";
                    }
                }

            },



            //重置
            doReset(){
                this.examineTime=[];
                this.region="";
            },



            //根据头部显示底部
            showDetailsBottom(index) {
                this.detailsBottom = index + 1;
                if(this.detailsBottom===5){
                    setTimeout(()=>{
                        this.drawMap();
                    },1000);
                }

            },


            //查询
            doSearch() {
                let that = this;
                let startTime, endTime;
                if (this.examineTime === null) {
                    startTime = 0;
                    endTime = 0;

                } else if (this.examineTime.length > 0) {

                    startTime = this.examineTime[0];
                    endTime = this.examineTime[1];
                } else {
                    startTime = 0;
                    endTime = 0;
                }
                const getListData = async () => {
                    const result = await regionalCarbonReport({
                        "startTime": startTime,
                        "endTime": endTime,
                        "region":this.region
                    })
                    that.cols = result.data.data.cols;
                    that.tableData = result.data.data.data;
                }
                getListData();
            },


            //根据每行显示不同颜色
            tableRowClassName({row, rowIndex}) {
                if (row.xuhao % 2 === 0) {
                    return '';
                } else {
                    return 'f0';
                }
            },

            //显示数据改变
            handleSizeChange(val) {
                this.mrPage = val;
                this.startIndex = (this.currentPage - 1) * this.mrPage;
                this.doSearch();
            },


            //页面改变
            handleCurrentChange(val) {
                this.startIndex = (val - 1) * this.mrPage;
                this.doSearch();
            },


            //导出打印
            importPrinting() {
                let wb = XLSX.utils.table_to_book(document.querySelector('#rebateSetTable'));
                /* get binary string as output */
                let wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'});
                try {
                    FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), '区域碳报表.xlsx');
                } catch (e) {
                    if (typeof console !== 'undefined')
                        console.log(e, wbout)
                }
            },

        },









    }
</script>
<style scoped lang="less" rel="stylesheet/less">
    @import "../../assets/less/base";

    .template {
        width: 100%;
        height: 100%;
        background-color: @color-white;

        .crumbs {
            width: 100%;
            height: 80px;
            line-height: 80px;

            .crumbsLeft {
                width: 200px;
                height: 30px;
                padding-top: 35px;
                padding-left: 20px;
            }

            .crumbsRight {
                margin-right: 50px;

                .el-button {
                    width: 100px;
                    height: 35px;
                }
            }
        }

        .container {
            display: flex;
            align-items: center;
            justify-items: center;
            background-color: @color-F0;

            .containerDiv {
                /*width: 98%;*/
                /*margin: 20px auto;*/
                width: 100%;
                border-radius: 10px;
                background-color: @color-white;
                overflow: auto;

                .handle-box {
                    width: 100%;
                    height: 80px;
                    line-height: 80px;
                    padding-left: 20px;

                    .el-button {
                        width: 110px;
                        height: 35px;
                    }
                }

                .handle-title {
                    width: 100%;
                    height: 50px;
                    background-color: rgba(230, 242, 254, 1);
                    line-height: 50px;
                    padding-left: 50px;

                    div {
                        margin-right: 40px;
                        font-size: @font-size-small;
                    }

                    div:first-child {
                        margin-right: 10px;
                    }

                    .icon-dengpaolightbulb3 {
                        font-size: 150%;
                        color: @color-bg-red;
                    }
                }

                .handle-table {
                    width: 100%;
                }
            }
        }
    }

    .details {
        width: 100%;

        .detailsTop {
            height: 10%;
            border-bottom: 1px solid @color-F0;

            .detailsTopLeft {
                width: 60%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;

                div {
                    flex: 1;
                    height: 60%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }

            .detailsTopRight {
                width: 40%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;

                .el-button {
                    width: 110px;
                    height: 35px;
                }
            }
        }

        .detailsBottom {
            .handle-box {
                width: 100%;
                height: 80px;
                line-height: 80px;
                padding-left: 20px;

                .el-button {
                    width: 110px;
                    height: 35px;
                }
            }

            .handle-table {
                width: 100%;
            }

            height: 90%;
        }


    }


</style>

