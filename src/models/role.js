import {
  addRole,
  modifyRole,
  getV2RoleFunctionList,
  getV2RoleOwnFunctionList,
} from '../services/role';

function dataFormat(json) {
  let gData = [];
  let sonData = [];
  let secondTree = [];
  let thirdTree = [];

  for (let i = 0; i < json.length; i++) {
    if (json[i].type == 1) {
      gData.push({ functionList: [], id: json[i].id, name: json[i].name })
    } else if (json[i].type == 2) {
      secondTree.push(json[i]);
    } else if (json[i].type == 3) {
      sonData.push({ functionId: json[i].parentId, list: [] })
      thirdTree.push(json[i]);
    }
  }
  for (let j = 0; j < secondTree.length; j++) {
    for (let k = 0; k < gData.length; k++) {
      if (secondTree[j].parentId == gData[k].id) {
        gData[k].functionList.push({ id: secondTree[j].id, groupId: secondTree[j].parentId, name: secondTree[j].name })
      }
    }
  }
  for (let j = 0; j < thirdTree.length; j++) {
    for (let k = 0; k < sonData.length; k++) {
      if (thirdTree[j].parentId == sonData[k].functionId) {
        sonData[k].list.push({ name: thirdTree[j].name, id: thirdTree[j].id })
      }
    }
  }

  return {
    gData: gData,
    sonData: sonData
  }
}

function setOwn(json, gData) {
  // 如果是带过来id认为是编辑
  // if (this.props.post.id) {
  // HttpTool.get(APILXF.v2_role_ownFunctionList,
  //     (code, msg, json, option) => {
  //         if (code == 200) {
  let expandedKeys = []
  let selectedKeys = []
  let toRemember = {}
  // 关联2级和3级  // 勾选2级
  json.map((v, k) => {
    if (toRemember[v.parentId]) {
      toRemember[v.parentId].push(v.id)
    } else {
      toRemember[v.parentId] = [v.id]
    }
    if (selectedKeys.indexOf(v.parentId) == -1) { selectedKeys.push(v.parentId) }
  })
  //   寻找默认打开的key
  gData.map((v, k) => {
    v.functionList.map((_v, _k) => {
      // 如果2级已勾选找到一级  并且防止重复
      if (selectedKeys.indexOf(_v.id) > -1 && expandedKeys.indexOf('parent-' + _v.groupId) == -1) {
        expandedKeys.push('parent-' + _v.groupId)
      }
    })
  })
  return {
    checkedKeys: selectedKeys,
    oldselectedKeys: selectedKeys,
    selectedKeys: [],
    expandedKeys: expandedKeys,
    rememberSelected: toRemember
  }

  //         } else {
  //             message.warning(msg);
  //         }

  //     },
  //     (code, msg, option) => {
  //         message.warning(msg);
  //     }
  //     , { roleId: this.props.post.id }
  // )
  // }
}
export default {
  namespace: "role",
  state: {
    gData: [],
    sonData: [],
    checkedKeys: [],
    oldselectedKeys: [],
    selectedKeys: [],
    expandedKeys: [],
    rememberSelected: {},
    post: {
      accountId: "00000000000000000000000000000000",
      applicationId: "2ef8d902c12f454f9acdbb0484f8c05a",
      builtin: false,
      createdTime: "2017-10-26 11:28:25",
      creatorUserId: "00000000000000000000000000000000",
      functions: null,
      id: "1cdfd6a033704ceb8d104de0cb0cddba",
      members: null,
      name: "系统管理员",
      remark: null,
      title: "编辑角色",
    }
  },
  effects: {
    *fetchV2RoleFunctionList(_, { call, put }) {
      const res = yield call(getV2RoleFunctionList);
      if (res.code == 200) {
        yield put({
          type: 'saveFunc',
          payload: res.data,
        });
      }
      const res2 = yield call(getV2RoleOwnFunctionList, {
        roleId: "1cdfd6a033704ceb8d104de0cb0cddba"
      });
      if (res2.code == 200) {
        yield put({
          type: 'saveOwnFunc',
          payload: res2.data
        })
      }
    },
    *edit({ param }, { call, put }) {
      const res = yield call(modifyRole,param)
    },
    *add({ param }, { call, put }) {
      const res = yield call(addRole,param)
    },
  },
  reducers: {
    saveFunc(state, { payload }) {
      const data = dataFormat(payload)
      return {
        ...state,
        ...data
      }
    },
    saveOwnFunc(state, { payload }) {
      const data = setOwn(payload, state.gData)
      return {
        ...state,
        ...data
      }
    },
  },
};

