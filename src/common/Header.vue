<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <img src="../assets/img/logo.png" alt="" style="margin-top: 8px">
        </div>
        <div class="logo">
            <span>绿电资产全过程聚合管理系统</span>
        </div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen fl" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <div class="btn-bell fl">
                    <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
                        <router-link to="/Message">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator fl">
                    <img src="static/img/img.jpg" v-if="!avatar">
                    <img v-if="avatar" :src="avatar">
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided command="changePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item divided command="changeInfo">修改信息</el-dropdown-item>
                        <el-dropdown-item divided command="loginOut">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>


        <!-- 修改密码-->
        <el-dialog title="修改密码" :visible.sync="lookForPasswordVisible" width="25%" :center="true"
                   :close-on-click-modal="false" :closeOnPressEscape="false" :close-on-press-escape="false"
                   :show-close="false">
            <div class="" style="height: 300px;margin-top: 10px;padding: 20px">
                <el-form ref="formM" :model="ruleFormM" :rules="rulesM">
                    <el-form-item prop="password1" style="height: 45px">
                        <el-input type="password" placeholder="旧密码" v-model="ruleFormM.password1">
                            <el-button slot="prepend" icon="el-icon-lx-lock"
                                       style="line-height: 40px;padding-top: 3px;font-size: 25px"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password2" style="height: 45px">
                        <el-input type="password" placeholder="新密码" v-model="ruleFormM.password2">
                            <el-button slot="prepend" icon="el-icon-lx-lock"
                                       style="line-height: 40px;padding-top: 3px;font-size: 25px"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password3" style="height: 45px">
                        <el-input type="password" placeholder="确认新密码" v-model="ruleFormM.password3">
                            <el-button slot="prepend" icon="el-icon-lx-lock"
                                       style="line-height: 40px;padding-top: 3px;font-size:25px"></el-button>
                        </el-input>
                    </el-form-item>
                </el-form>
                <div class="lookForBtn"
                     style="display: flex;align-items: center;justify-content: center;flex-direction: column">
                    <el-button @click="changePassword" type="primary" style="width: 200px;height: 40px">修改密码
                    </el-button>
                    <span @click="lookForPasswordVisible = false"
                          style="cursor: pointer;margin-top: 10px;font-size: 16px">取消</span>
                </div>
            </div>
        </el-dialog>


        <!--新增弹出框 -->
        <el-dialog title="个人信息修改" :visible.sync="infoVisible" width="40%" :center="true" :close-on-click-modal="false"
                   :show-close="false">
            <div class="" style="height: 400px;overflow: auto">
                <el-form ref="form" label-width="150px" :model="ruleForm" :rules="rules">
                    <el-form-item label="昵称" prop="nickname">
                        <el-input v-model="ruleForm.nickname" style="width: 80%" placeholder="昵称"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="ruleForm.email" style="width: 80%" placeholder="邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-radio v-model="ruleForm.sex" :label="1" style="margin-left: 5px">男</el-radio>
                        <el-radio v-model="ruleForm.sex" :label="2" style="margin-left: 20px">女</el-radio>
                    </el-form-item>
                    <el-form-item label="头像">
                        <el-upload
                            :action="uploadUrl"
                            list-type="picture-card"
                            :headers='headers'
                            :auto-upload="false"
                            ref="upload"
                            :limit="1"
                            :data="uploadData"
                            :class="{hide:hideUpload}"
                            :on-remove="handleRemove"
                            :on-change="handleEditChange"
                            :on-success="uploadSuccess"
                            :before-upload="beforeAvatarUpload"
                            :on-error="uploadFailure">
                            <i class="el-icon-plus"></i>
                            <div class="el-upload__tip" slot="tip">只能上传jpeg/jpg/png文件，且不超过20M</div>
                        </el-upload>

                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer" style="margin-bottom: 50px">
                <el-button @click="qxUploadVisible" style="height:30px;width:120px">取 消</el-button>
                <el-button type="primary" @click="doUpload" style="height:30px;width:120px">确 定</el-button>
                </span>
        </el-dialog>

    </div>
</template>
<script type="text/ecmascript-6">
    import bus from '../assets/js/bus';
    import upload from '../assets/js/upload'
    import url from '../assets/js/URL'
    import {mapActions} from 'vuex'

    export default {
        data() {
            return {
                collapse: false,
                fullscreen: false,
                name: '',
                message: 2,
                avatar: "",

                lookForPasswordVisible: false,
                infoVisible: false,
                headers: {},

                ruleFormM: {
                    password1: "",
                    password2: "",
                    password3: ""
                },

                rulesM: {
                    password1: [
                        {required: true, message: '请输入旧密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '长度在 6 到 20 个字符'},
                        {pattern: /^(\w){6,20}$/, message: '只能输入6-20个字母、数字、下划线'}
                    ],
                    password2: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '长度在 6 到 20 个字符'},
                        {pattern: /^(\w){6,20}$/, message: '只能输入6-20个字母、数字、下划线'}
                    ],
                    password3: [
                        {required: true, message: '请输入确认新密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '长度在 6 到 20 个字符'},
                        {pattern: /^(\w){6,20}$/, message: '只能输入6-20个字母、数字、下划线'}
                    ]
                },

                ruleForm: {
                    nickname: "",
                    sex: "1",
                    email: "",
                    head_path: ""
                },

                rules: {},


                uploadUrl: " " + upload + " ",
                uploadData: {},
                hideUpload: false,
            }
        },
        computed: {
            username() {


            }
        },
        created() {
            this.getAdminState();
        },
        methods: {
            //页面加载检查用户是否登陆，没有登陆就加载登陆页面
            getAdminState() {


            },

            //打开全局遮罩层
            openFullScreen() {
                this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: '#fff'
                });
            },

            //关闭全局遮罩层
            closeFullScreen() {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                });
                loading.close();
            },


            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if (command === 'loginOut') {
                    this.$confirm('是否确认退出', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.logout();
                        this.$router.push('/login');
                    }).catch(() => {

                    });
                } else if (command === 'changePassword') {
                    this.lookForPasswordVisible = true;
                    this.ruleFormM = {
                        password1: "",
                        password2: "",
                        password3: ""
                    };

                } else if (command === 'changeInfo') {
                    this.infoVisible = true;
                    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
                    this.ruleForm = {
                        nickname: userInfo.nickName,
                        sex: parseInt(userInfo.sex),
                        email: userInfo.email,
                        head_path: ""
                    };
                }
            },

            // 侧边栏折叠
            collapseChage() {
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },

            // 全屏事件
            handleFullScreen() {
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },


            //显示修改密码
            changePassword() {
                this.$refs.formM.validate((valid) => {
                    if (valid) {
                        if (this.ruleFormM.password2 === this.ruleFormM.password3) {
                            this.openFullScreen();
                            this.$post("  " + url + "/user/updatePass", {
                                "oldPass": this.ruleFormM.password1,
                                "password": this.ruleFormM.password2,
                            })
                                .then((res) => {
                                    if (res.code === 200) {
                                        setTimeout(() => {
                                            this.closeFullScreen();
                                        }, 500);
                                        setTimeout(() => {
                                            this.$message.success(res.msg);
                                            this.lookForPasswordVisible = false;
                                        }, 1000)

                                    } else {
                                        this.closeFullScreen();
                                        this.$message.warning(res.data.msg);
                                    }
                                })
                                .catch((err) => {
                                    this.closeFullScreen();
                                    console.log(err)
                                });
                        } else {
                            this.$message.warning("两次新密码不一样");
                        }
                    } else {
                        return this.$message.warning("手机号不正确");
                        return false
                    }
                });


            },


            //封装的修改信息
            updateInfo(data1, data2, data3, data4) {
                this.openFullScreen();
                this.$post(" " + url + "/user/updateInfo",
                    {
                        "head_path": data1,
                        "nickname": data2,
                        "sex": data3,
                        "email": data4
                    }
                )
                    .then((res) => {
                        if (res.code === 200) {
                            this.hideUpload = false;
                            this.$refs.upload.clearFiles();
                            this.infoVisible = false;
                            if (res.data.headPath) {
                                this.avatar = res.data.headPath;
                                let userInfo = JSON.parse(localStorage.getItem("userInfo"));
                                userInfo.headPath = res.data.headPath;
                                userInfo.nickName = res.data.nickName;
                                userInfo.email = res.data.email;
                                userInfo.sex = res.data.sex;
                                localStorage.setItem("userInfo", JSON.stringify(userInfo));
                            }

                            setTimeout(() => {
                                this.closeFullScreen();
                            }, 500);
                            setTimeout(() => {
                                this.$message.success(res.msg);
                            }, 1000);
                        } else {
                            this.closeFullScreen();
                            this.$message.warning(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.closeFullScreen();
                        this.hideUpload = false;
                        this.$refs.upload.clearFiles();
                    })
            },


            //取消上传
            qxUploadVisible() {

                this.infoVisible = false;
                this.hideUpload = false;
                this.$refs.upload.clearFiles();

            },


            //进行上传
            doUpload() {
                let file = this.$refs.upload.uploadFiles;
                if (file.length > 0) {
                    this.$refs.form.validate((valid) => {
                        if (valid) {
                            this.$refs.upload.submit((data) => {
                                console.log(data)
                            });

                        } else {
                            return this.$message.warning("信息填写不正确");
                            return false
                        }
                    });
                } else {
                    this.updateInfo("", this.ruleForm.nickname, this.ruleForm.sex, this.ruleForm.email)
                }


            },


            //上传照片前的校验
            beforeAvatarUpload(file) {
                var testmsg = /^image\/(jpeg|png|jpg)$/.test(file.type);
                const isLt4M = file.size / 1024 / 1024 <= 20;
                if (!testmsg) {
                    this.$message.error('上传图片格式不对!');
                    return false
                }
                if (!isLt4M) {
                    this.$message.error('上传图片大小不能超过 20M!');
                    return false
                }
            },


            //图片上传成功后调用
            uploadSuccess(response, file, fileList) {
                if (response.code === 200) {
                    this.updateInfo(response.path, this.ruleForm.nickname, this.ruleForm.sex, this.ruleForm.email)
                } else {
                    this.$message.warning("上传失败");
                }
            },


            //上传失败
            uploadFailure(err, file, fileList) {
                this.hideUpload = false;
                this.$refs.upload.clearFiles();
                this.$message.warning(err);
            },


            //上传超过设定值
            handleEditChange(file, fileList) {
                this.hideUpload = fileList.length >= 1;
            },

            //删除上传照片后
            handleRemove(file, fileList) {
                this.hideUpload = fileList.length >= 1
            },

            ...mapActions([
                'logout',
            ]),


        },

        mounted() {
            if (document.body.clientWidth < 1500) {
                this.collapseChage();
            }
        }
    }
</script>
<style scoped lang="less" rel="stylesheet/less">
    @import "../assets/less/base";

    .el-button {
        height: 30px;
        width: 120px;
    }

    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
        background-color:#088B86;

        .collapse-btn {
            float: left;
            padding: 0 10px;
            cursor: pointer;
            line-height: 70px;
        }

        .logo {
            float: left;
            width: 350px;
            line-height: 70px;
        }

        .header-right {
            float: right;
            padding-right: 50px;

            .header-user-con {
                display: flex;
                height: 70px;
                align-items: center;

                .btn-fullscreen {
                    transform: rotate(45deg);
                    margin-right: 5px;
                    font-size: 24px;
                }

                .btn-bell, .btn-fullscreen {
                    position: relative;
                    width: 30px;
                    height: 30px;
                    text-align: center;
                    border-radius: 15px;
                    cursor: pointer;
                }

                .btn-bell-badge {
                    position: absolute;
                    right: 0;
                    top: -2px;
                    width: 8px;
                    height: 8px;
                    border-radius: 4px;
                    background: #f56c6c;
                    color: #fff;
                }

                .btn-bell .el-icon-bell {
                    color: #fff;
                }

                .user-name {
                    margin-left: 10px;
                }

                .user-avator {
                    margin-left: 20px;
                }

                .user-avator img {
                    display: block;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }

                .el-dropdown-link {
                    color: #fff;
                    cursor: pointer;
                }
            }
        }

    }

    @media only screen and (max-width: 1024px) {
        .header {
            width: 1024px;
            color: #fff;
            background-color: rgba(56, 65, 87, 1);
        }

    }
</style>
<style>
    .hide .el-upload--picture-card {
        display: none;
    }

    .el-message-box .el-message-box__btns .el-button {
        width: 100px;
        height: 40px;
    }
</style>

