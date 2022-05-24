import {getItem} from "../utils/storage";
import {TOKEN} from "../constant";

const state = {
    city: "城市名",
    token: getItem(TOKEN) || '',
    userInfo: {},
    TMP: {
        request_count: 0, // 当前正在请求数
    },
};


export default state;
