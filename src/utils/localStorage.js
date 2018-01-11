export const SetItem = (key,value) => {
  if (window.localStorage) {
    const storage=window.localStorage;
    storage.setItem(key,value);
  }
};// 设置
export const GetItem = (key) => {
  if (window.localStorage) {
    const storage=window.localStorage;
    return storage.getItem(key);

  }
}; // 得到
export const Clear = ()=> {
  if (window.localStorage) {
    const storage=window.localStorage;
    storage.getItem();
  }
} // 清空所有
export const RemoveItem = (key)=> {
  if (window.localStorage) {
    const storage=window.localStorage;
    storage.removeItem(key);
  }
} // 删除某一个
